import strawberry
from typing import List, Optional
from strawberry.extensions import Extension
from backend.database import SessionLocal
from .schema.user import user_start_verify, user_check_verify, user_logout, all_users, get_user_by_id, \
    get_me, LoginResult, all_users_subscription, update_user_player, new_player_for_user, make_admin
from .schema.player import all_players, unassociated_players, new_player, free_agents, change_player_name
from .schema.team import get_teams, get_team, create_team, set_team
from .schema.tournament import get_tournaments, create_tournament, team_entry
from .schema.match import * # noqa
from .schema.stats import * # noqa
from .schema.table import get_tables, get_tables_subscription, new_table
from .schema.types import Team, Player, User, Tournament, Table
from backend.middleware.auth import IsAuthenticated, IsAdmin


class SQLAlchemySession(Extension):
    def on_request_start(self):
        self.execution_context.context["db"] = SessionLocal()

    def on_request_end(self):
        self.execution_context.context["db"].close()


@strawberry.type
class Query:
    me: Optional[User] = strawberry.field(resolver=get_me)
    users: List[User] = strawberry.field(permission_classes=[IsAdmin],
                                            resolver=all_users)
    user: Optional[User] = strawberry.field(permission_classes=[IsAdmin],
                                            resolver=get_user_by_id)
    players: List[Player] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=all_players)
    unassociated_players: List[Player] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=unassociated_players)
    free_agents: List[Player] = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=free_agents)
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
    tables: Table = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=get_tables)
    player_stats: PlayerStats = strawberry.field(permission_classes=[IsAuthenticated],
                                             resolver=player_stats)


@strawberry.type
class Mutation:
    start_verify: bool = strawberry.mutation(resolver=user_start_verify)
    check_verify: LoginResult = strawberry.mutation(resolver=user_check_verify)
    make_admin: User = strawberry.field(permission_classes=[IsAuthenticated],
                                              resolver=make_admin)
    logout: LoginResult = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=user_logout)
    new_player_for_user: Optional[User] = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=new_player_for_user)
    create_player: Player = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=new_player)
    change_player_name: Player = strawberry.mutation(permission_classes=[IsAdmin],
                                              resolver=change_player_name)
    update_user_player: Optional[User] = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=update_user_player)
    create_team: Team = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=create_team)
    edit_team: Team = strawberry.mutation(permission_classes=[IsAuthenticated],
                                              resolver=set_team)
    create_tournament: Tournament = strawberry.mutation(permission_classes=[IsAdmin],
                                              resolver=create_tournament)
    create_match: Match = strawberry.mutation(permission_classes=[IsAdmin],
                                              resolver=create_match)
    end_match: Match = strawberry.mutation(permission_classes=[IsAdmin],
                                              resolver=end_match)
    team_entry: bool = strawberry.mutation(permission_classes=[IsAuthenticated],
                                                resolver=team_entry)
    create_table: Table = strawberry.mutation(permission_classes=[IsAdmin],
                                                resolver=new_table)
    


@strawberry.type
class Subscription:
    tables: List[Table] = strawberry.subscription(permission_classes=[IsAdmin],
                                                resolver=get_tables_subscription)
    tournament_matches: List[Match] = strawberry.subscription(permission_classes=[IsAdmin],
                                                resolver=get_matches_subscription)


schema = strawberry.Schema(query=Query,
                           mutation=Mutation,
                           subscription=Subscription,
                           extensions=[SQLAlchemySession])
