import strawberry
from strawberry.types import Info
from datetime import datetime
from typing import List, Optional, AsyncGenerator
from backend.middleware.auth import twilio
from backend.middleware.auth.token_db import token_db
from backend.models import User as UserModel
from backend.models import create_user, get_users, get_user, \
    get_user_by_number, user_updated_event, set_user_player
from backend.models import create_token, delete_token, create_player
from backend.database import SessionLocal
from backend.settings import settings
from .player import Player
from datetime import timedelta
from jose import jwt
from .types import User, LoginResult


async def get_me(self, info: Info) -> Optional[User]:
    request = info.context["request"]
    db = info.context["db"]
    user_id = request.user.current_user_id
    user = get_user(db, user_id)
    return User.from_instance(user)


async def user_start_verify(self, info: Info, number: str) -> bool:
    request = info.context["request"]
    db = info.context["db"]
    vsid = twilio.send_verification_token(number)

    ## just return whether or not a verification code was made.
    ## if sending the code fails a lot we can try to make this 
    ## part more robust with capturing an error
    return vsid is not None


async def user_check_verify(self, info: Info, number: str, code: str) -> LoginResult:
    request = info.context["request"]
    db = info.context["db"]

    ## First verify the code against the number
    verified = True # twilio.check_verification_token(number, code)
    if not verified:
        return LoginError(message="Verification code provided is incorrect.")

    ## Check if a user already exists
    user = get_user_by_number(db, number)
    if not user:
        ## no user found, need to create one
        user = create_user(db, number)
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

    if user.player_id is not None:
        return LoginSuccessWithPlayer(user=User.from_instance(user))
    return LoginSuccessWithoutPlayer(user=User.from_instance(user))


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


async def update_user_player(self, info: Info, user_id: strawberry.ID, player_id: strawberry.ID) -> Optional[User]:
    db = info.context["db"]
    user = set_user_player(db, user_id, player_id)
    if not user:
        return None
    return User.from_instance(user)


async def new_player_for_user(self, info: Info, user_id: strawberry.ID, first_name: str, last_name: str) -> Optional[User]:
    db = info.context["db"]
    player = create_player(db, first_name, last_name)
    user = set_user_player(db, user_id, player.id)
    if not user:
        return None
    return User.from_instance(user)


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
