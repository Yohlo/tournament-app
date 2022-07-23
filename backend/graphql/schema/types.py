import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Player as PlayerModel
from backend.models import User as UserModel
from backend.models import Team as TeamModel
from backend.models import Tournament as TournamentModel
from backend.models import TournamentMatch as MatchModel
from backend.models import Table as TableModel
from backend.models.enums import TournamentType, TableType
from datetime import datetime

@strawberry.type
class PlayerShort:
    id: int
    last_name: str
    first_name: str

    @classmethod
    def from_instance(cls, instance: PlayerModel):
        return cls(
            id=instance.id,
            last_name=instance.last_name,
            first_name=instance.first_name
        )


@strawberry.input
class SongInput:
    id: str
    start: str
    name: str
    artist: str
    duration: str
    image: str


@strawberry.type
class Song(SongInput):


    @classmethod
    def from_instance(cls, instance: TeamModel):
        return cls(
            id=instance.song_id,
            start=instance.song_start,
            name=instance.song_name,
            artist=instance.song_artist,
            duration=instance.song_duration,
            image=instance.song_image
        )


@strawberry.input
class TeamInput:
    name: str
    song: SongInput
    players: List[str]


@strawberry.type
class Team:
    id: int
    name: str
    song: Song
    players: List[PlayerShort]


    @classmethod
    def from_instance(cls, instance: TeamModel):
        return cls(
            id=instance.id,
            name=instance.name,
            song=Song.from_instance(instance),
            players=instance.players
        )


@strawberry.type
class Player:
    id: int
    last_name: str
    first_name: str
    teams: List[Team]

    @classmethod
    def from_instance(cls, instance: PlayerModel):
        return cls(
            id=instance.id,
            last_name=instance.last_name,
            first_name=instance.first_name,
            teams=instance.teams
        )


@strawberry.input
class MatchCreateInput:
    tournament_id: int
    team_one_id: int
    team_two_id: int
    table_id: int


@strawberry.input
class MatchEditInput:
    team1_cups: Optional[int]
    team2_cups: Optional[int]
    ot_count: Optional[int]
    end_time: Optional[datetime]


@strawberry.type
class Match:
    id: int
    team1_cups: int
    team2_cups: int
    ot_count: int
    start_time: datetime
    end_time: datetime
    team1: Team
    team2: Team

    @classmethod
    def from_instance(cls, instance: MatchModel):
        return cls(
            id=instance.id,
            team1_cups=instance.team1_cups,
            team2_cups=instance.team1_cups,
            ot_count=instance.ot_count,
            start_time=instance.start_time,
            end_time=instance.end_time,
            team1=instance.team1,
            team2=instance.team2
        )


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
    matches: List[Match]

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


@strawberry.type
class Table:
    id: int
    name: str
    type: TableType
    matches: List[Match]

    @classmethod
    def from_instance(cls, instance: PlayerModel):
        return cls(
            id=instance.id,
            last_name=instance.last_name,
            first_name=instance.first_name
        )


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
class LoginSuccessWithPlayer:
    user: User

@strawberry.type
class LoginSuccessWithoutPlayer:
    user: User


@strawberry.type
class LoginError:
    message: str


LoginResult = strawberry.union("LoginResult", (LoginSuccessWithPlayer, LoginSuccessWithoutPlayer, LoginError))
