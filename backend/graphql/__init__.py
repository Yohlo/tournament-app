import strawberry
from typing import List, Optional
from strawberry.extensions import Extension
from backend.database import SessionLocal
from .schema.user import User, user_start_verify, user_check_verify, user_logout, all_users, get_user_by_id, \
    get_me, LoginResult, all_users_subscription, update_user_player, new_player_for_user
from .schema.player import Player, all_players, unassociated_players
from .schema.team import Team, get_teams, get_team, create_team, set_team
from .schema.tournament import Tournament, get_tournaments, create_tournament
from .schema.match import * # noqa
from .schema.table import get_tables, Table
from backend.middleware.auth import IsAuthenticated, IsAdmin


class SQLAlchemySession(Extension):
    def on_request_start(self):
        self.execution_context.context["db"] = SessionLocal()

    def on_request_end(self):
        self.execution_context.context["db"].close()


@strawberry.type
class Query:
    me: User = strawberry.field(permission_classes=[IsAuthenticated],
                                            resolver=get_me)
    users: List[User] = strawberry.field(permission_classes=[IsAdmin],
                                            resolver=all_users)
    user: Optional[User] = strawberry.field(permission_classes=[IsAdmin],
                                            resolver=get_user_by_id)
    players: List[Player] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=all_players)
    unassociated_players: List[Player] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=unassociated_players)
    teams: List[Team] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=get_teams)
    team: Team = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=get_team)
    tournaments: List[Tournament] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=get_tournaments)
    matches: List[Match] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=get_matches)
    tournamentMatches: List[Match] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=get_matches_by_tournament)
    ongoingMatches: List[Match] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=get_ongoing_matches)
    tables: Table = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=get_tables)


@strawberry.type
class Mutation:
    start_verify: bool = strawberry.mutation(resolver=user_start_verify)
    check_verify: LoginResult = strawberry.mutation(resolver=user_check_verify)
    logout: LoginResult = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=user_logout)
    new_player_for_user: Optional[User] = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=new_player_for_user)
    update_user_player: Optional[User] = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=update_user_player)
    create_team: Team = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=create_team)
    edit_team: Team = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=set_team)
    create_tournament: Tournament = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=create_tournament)
    create_match: Match = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=create_match)
    edit_match: Match = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=edit_match)
    


@strawberry.type
class Subscription:
    users: List[User] = strawberry.subscription(permission_classes=[IsAdmin],
                                                resolver=all_users_subscription)


schema = strawberry.Schema(query=Query,
                           mutation=Mutation,
                           subscription=Subscription,
                           extensions=[SQLAlchemySession])
