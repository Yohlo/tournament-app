import strawberry
from typing import List, Optional
from strawberry.extensions import Extension
from backend.database import SessionLocal
from .schema.user import User, user_login, user_logout, all_users, get_user_by_id, \
    get_me, LoginResult, all_users_subscription
from .schema.player import Player, all_players
from backend.middleware.auth import IsAuthenticated, IsAdmin


class SQLAlchemySession(Extension):
    def on_request_start(self):
        self.execution_context.context["db"] = SessionLocal()

    def on_request_end(self):
        self.execution_context.context["db"].close()


@strawberry.type
class Query:
    me: Optional[User] = strawberry.field(permission_classes=[IsAuthenticated],
                                          resolver=get_me)
    users: List[User] = strawberry.field(permission_classes=[IsAdmin],
                                         resolver=all_users)
    user: Optional[User] = strawberry.field(permission_classes=[IsAdmin],
                                            resolver=get_user_by_id)
    players: List[Player] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=all_players)


@strawberry.type
class Mutation:
    login: LoginResult = strawberry.mutation(resolver=user_login)
    logout: LoginResult = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=user_logout)


@strawberry.type
class Subscription:
    users: List[User] = strawberry.subscription(permission_classes=[IsAdmin],
                                                resolver=all_users_subscription)


schema = strawberry.Schema(query=Query,
                           mutation=Mutation,
                           subscription=Subscription,
                           extensions=[SQLAlchemySession])
