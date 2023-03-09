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
from .stats import * # noqa
from datetime import datetime

@strawberry.type
class PlayerShort:
    id: strawberry.ID
    last_name: str
    first_name: str
    
    @strawberry.field
    def stats(self) -> PlayerStats:
        return PlayerStats(self.id)

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
    id: strawberry.ID
    name: str
    song: Song
    players: List[PlayerShort]


    @classmethod
    def from_instance(cls, instance: TeamModel):
        return cls(
            id=instance.id,
            name=instance.name,
            song=Song.from_instance(instance),
            players=[PlayerShort.from_instance(player) for player in instance.players]
        )


@strawberry.type
class Player:
    id: strawberry.ID
    last_name: str
    first_name: str
    teams: List[Team]
    
    @strawberry.field
    def stats(self, info: Info) -> PlayerStats:
        return PlayerStats(self.id)

    @classmethod
    def from_instance(cls, instance: PlayerModel):
        return cls(
            id=instance.id,
            last_name=instance.last_name,
            first_name=instance.first_name,
            teams=[Team.from_instance(team) for team in instance.teams]
        )


@strawberry.input
class MatchCreateInput:
    tournament_id: strawberry.ID
    team_one_id: strawberry.ID
    team_two_id: strawberry.ID
    table_id: strawberry.ID


@strawberry.input
class MatchEndInput:
    team_one_cups: Optional[int]
    team_two_cups: Optional[int]
    ot_count: Optional[int]


@strawberry.type
class Match:
    id: strawberry.ID
    team_one_cups: Optional[int]
    team_two_cups: Optional[int]
    ot_count: Optional[int]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    team1: Team
    team2: Team

    @classmethod
    def from_instance(cls, instance: MatchModel):
        return cls(
            id=instance.id,
            team_one_cups=instance.team1_cups,
            team_two_cups=instance.team2_cups,
            ot_count=instance.ot_count,
            start_time=instance.start_time,
            end_time=instance.end_time,
            team1=Team.from_instance(instance.team1),
            team2=Team.from_instance(instance.team2),
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
    end_time: Optional[datetime] = None
    team_size: int = strawberry.field(default=2)


@strawberry.type
class Tournament:
    id: strawberry.ID
    name: str
    type: TournamentType
    location: str
    desc: str
    logo_url: str
    team_size: int
    enroll_time: datetime
    start_time: datetime
    end_time: Optional[datetime]
    teams: List[Team]
    matches: List[Match]

    @strawberry.field
    def champions(self, info: Info) -> Optional[Team]:
        db = info.context["db"]
        tournament = db.query(TournamentModel).get(self.id)
        if not len(tournament.matches): return None
        matches = sorted(tournament.matches, key = lambda m: m.end_time)[::-1]
        finale = matches[0]
        champions = finale.team1 if finale.team1_cups > finale.team2_cups else finale.team2
        return Team.from_instance(champions)

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
            teams=[Team.from_instance(team) for team in instance.teams],
            matches=[Match.from_instance(match) for match in instance.matches],
        )


@strawberry.type
class Table:
    id: strawberry.ID
    name: str
    type: TableType
    active_match: Optional[Match]

    @classmethod
    def from_instance(cls, instance: TableModel):
        return cls(
            id=instance.id,
            name=instance.name,
            type=instance.type,
            active_match=Match.from_instance(instance.active_match) if instance.active_match else None
        )


@strawberry.type
class User:
    id: strawberry.ID
    admin: bool
    number: str
    registration_date: datetime
    last_activity: datetime

    instance: strawberry.Private[UserModel]

    @strawberry.field
    def player(self) -> Optional[Player]:
        if self.instance.player:
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
