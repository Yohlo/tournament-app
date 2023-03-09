import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Tournament as TournamentModel
from backend.models import tournament as tournamentModel
from backend.models import team as teamModel
from datetime import datetime
from .types import Tournament, TournamentInput


async def create_tournament(self, info: Info, tournament: TournamentInput) -> Tournament:
    db = info.context["db"]
    new_tournament = tournamentModel.create_tournament(db,\
        tournament.name, tournament.type, tournament.location, tournament.desc,\
        tournament.logo_url, tournament.team_size, tournament.enroll_time, tournament.start_time, tournament.end_time)
    return Tournament.from_instance(new_tournament)


async def get_tournaments(self, info: Info) -> List[Tournament]:
    db = info.context["db"]
    tournaments = tournamentModel.get_tournaments(db)
    return [Tournament.from_instance(tournament) for tournament in tournaments]


async def team_entry(self, info: Info, tournament_id: strawberry.ID, team_id: strawberry.ID) -> bool:
    db = info.context["db"]
    tournament = tournamentModel.get_tournament(db, tournament_id)
    team = teamModel.get_team(db, team_id)
    if not tournament or not team:
        return False
    if team_id in [t.id for t in tournament.teams]:
        return False
    tournament.teams += [team]
    db.commit()
    return True
