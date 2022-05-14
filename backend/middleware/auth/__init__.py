from jose import jwt
import uuid
import datetime
from starlette.authentication import (
    AuthenticationBackend, AuthCredentials, BaseUser
)
from .token_db import token_db
from backend.models import find_by_user_id
from backend.models.user import get_user
from backend.database import SessionLocal
from strawberry.permission import BasePermission
from strawberry.types import Info
from sqlalchemy.orm import Session
from starlette.requests import Request
from starlette.websockets import WebSocket
import typing


class IsAuthenticated(BasePermission):
    message = "User is not logged in."

    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        self.request: typing.Union[Request, WebSocket] = info.context["request"]
        if self.request.user.is_authenticated:
            kwargs["current_user_id"] = self.request.user.current_user_id
            return True
        return False


class IsAdmin(IsAuthenticated):
    message = "User does not have admin privileges."

    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        if not super().has_permission(source, info, **kwargs):
            self.message = super().message
            return False
        elif self.request.user.admin:
            return True
        return False


def check_user_in_db(db: Session, user_id: str, received_token: str):
    token_in_db = find_by_user_id(db, user_id)
    if token_in_db and token_in_db.token == received_token:
        return True
    return False


class AuthenticatedUser(BaseUser):
    def __init__(self, user_id: str = None, admin: bool = False, expires: float = 0.0):
        self.current_user_id = user_id
        self.admin = admin
        self.expires = expires
        self.req_id = uuid.uuid4().hex

    @property
    def is_authenticated(self) -> bool:
        return True


class UnAuthenticatedUser(BaseUser):
    def __init__(self):
        self.req_id = uuid.uuid4().hex

    @property
    def is_authenticated(self) -> bool:
        return False


# authenticates each request and provides an unique reuest id to each
class BasicAuthBackend(AuthenticationBackend):
    def __init__(self, secret, algorithm):
        super().__init__()
        self.secret = secret
        self.algorithm = algorithm

    async def authenticate(self, request):
        ret_value = None
        if "Authorization" in request.cookies.keys() \
           and request.cookies["Authorization"]:
            token = request.cookies["Authorization"].encode()
            decoded_token = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            db = SessionLocal()
            match_token = check_user_in_db(db, decoded_token["id"], token.decode())
            now = datetime.datetime.now()
            if match_token and now.timestamp() < decoded_token["expire"]:
                user = get_user(db, decoded_token["id"])
                user.last_activity = now
                db.commit()
                ret_value = AuthenticatedUser(
                    user_id=decoded_token["id"],
                    admin=user.admin,
                    expires=decoded_token["expire"]
                )
                await token_db.set_token(
                    ret_value.req_id,
                    token,
                    decoded_token["expire"]
                )
            else:
                ret_value = UnAuthenticatedUser()
            db.close()
        else:
            ret_value = UnAuthenticatedUser()
        return AuthCredentials(["authenticated"]), ret_value
