import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Tournament as TournamentModel
from backend.models import tournament as tournamentModel
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
