import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Tournament as TournamentModel
from backend.models import tournament as tournamentModel
from datetime import datetime
from .team import Team
from backend.models.enums import TournamentType

@strawberry.input
class TournamentInput:
    name: str
    type: TournamentType
    location: str
    desc: str
    logo_url: str
    enroll_time: datetime
    start_time: datetime
    end_time: Optional[datetime]
    team_size: int = strawberry.field(default=2)


@strawberry.type
class Tournament:
    id: int
    name: str
    type: TournamentType
    location: str
    desc: str
    logo_url: str
    team_size: int
    enroll_time: datetime
    start_time: datetime
    end_time: datetime
    teams: List[Team]

    @classmethod
    def from_instance(cls, instance: TournamentModel):
        return cls(
            id=instance.id,
            name=instance.name,
            type=instance.type,
            location=instance.location,
            desc=instance.desc,
            logo_url=instance.logo_url,
            team_size=instance.team_size,
            enroll_time=instance.enroll_time,
            start_time=instance.start_time,
            end_time=instance.end_time,
            teams=instance.teams
        )


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

