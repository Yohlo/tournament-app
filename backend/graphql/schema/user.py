import strawberry
from strawberry.types import Info
from datetime import datetime
from typing import List, Optional, AsyncGenerator
from backend.middleware.auth.token_db import token_db
from backend.models import User as UserModel
from backend.models.user import get_users, get_user, \
    get_user_by_number, user_updated_event
from backend.models.token import create_token, delete_token
from backend.database import SessionLocal
from backend.settings import settings
from .player import Player
from datetime import timedelta
from jose import jwt


@strawberry.type
class User:
    id: int
    admin: bool
    number: str
    registration_date: datetime
    last_activity: datetime

    instance: strawberry.Private[UserModel]

    @strawberry.field
    def player(self) -> Optional[Player]:
        return Player.from_instance(self.instance.player)

    @classmethod
    def from_instance(cls, instance: UserModel):
        return cls(
            instance=instance,
            id=instance.id,
            number=instance.number,
            admin=instance.admin,
            registration_date=instance.registration_date,
            last_activity=instance.last_activity,
        )


@strawberry.type
class LoginSuccess:
    user: User


@strawberry.type
class LoginError:
    message: str


LoginResult = strawberry.union("LoginResult", (LoginSuccess, LoginError))


async def get_me(self, info: Info) -> Optional[User]:
    request = info.context["request"]
    db = info.context["db"]
    user_id = request.user.current_user_id
    user = get_user(db, user_id)
    return User.from_instance(user)


async def user_login(self, info: Info, number: str) -> LoginResult:
    request = info.context["request"]
    db = info.context["db"]
    user = get_user_by_number(db, number)
    if user:
        now = datetime.now()
        expires = now + timedelta(days=3)
        payload = {
            "id": user.id,
            "expire": expires.timestamp()
        }
        secret, algorithm = settings.AuthSecret, settings.AuthAlgorithm
        access_token = jwt.encode(payload, secret, algorithm=algorithm)
        delete_token(db, user.id)
        create_token(db, user.id, access_token)
        expires_in_seconds = expires.timestamp() - now.timestamp()
        await token_db.set_token(
            request.user.req_id,
            access_token,
            expires_in_seconds
        )
        return LoginSuccess(user=User.from_instance(user))
    return LoginError(message="Could not log in.")


async def user_logout(self, info: Info) -> bool:
    request = info.context["request"]
    db = info.context["db"]
    if request.user.is_authenticated and request.user.current_user_id:
        deleted = delete_token(db, request.user.current_user_id)
        if deleted:
            await token_db.invalidate_token(request.user.req_id)
            return True
    return False


async def all_users(self, info: Info) -> List[User]:
    db = info.context["db"]
    users = get_users(db)
    return [User.from_instance(user) for user in users]


async def get_user_by_id(self, info: Info, uid: strawberry.ID) -> Optional[User]:
    db = info.context["db"]
    user = get_user(db, uid)
    if user:
        return User.from_instance(user)
    return None


async def all_users_subscription(self, info: Info) -> AsyncGenerator[List[User], None]:
    db = SessionLocal()
    try:
        while 1:
            users = get_users(db)
            users = [User.from_instance(user) for user in users]
            yield users
            await user_updated_event.wait()
            user_updated_event.clear()
    finally:
        db.close()
