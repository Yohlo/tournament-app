import strawberry
from strawberry.types import Info
from typing import List, Optional, TYPE_CHECKING
from backend.models import Team as TeamModel
from backend.models import team as teamModel
from backend.models import player as playerModel
from .types import Team, TeamInput, Song, SongInput


async def create_team(self, info: Info, team: TeamInput) -> Team:
    db = info.context["db"]
    new_team = teamModel.create_team(db, team.name, team.song_id, team.song_start, team.song_name, team.song_artist, team.song_duration, team.song_image)
    for player_id in team.players:
        player = playerModel.get_player(db, player_id)
        new_team.players += [player]
    db.commit()
    return Team.from_instance(new_team)


async def get_teams(self, info: Info) -> List[Team]:
    db = info.context["db"]
    teams = teamModel.get_teams(db)
    return [Team.from_instance(team) for team in teams]


async def get_team(self, info: Info, id: int) -> Team:
    db = info.context["db"]
    team = teamModel.get_team(db)
    return Team.from_instance(team)


async def set_team(self, info: Info, id: int, team: TeamInput) -> Team:
    db = info.context["db"]
    item = get_team(db, id)
    item.name = team.name
    item.song_id = team.song.id
    item.song_name = team.song.name
    item.song_image = team.song.image
    item.song_start = team.song.start
    item.song_artist = team.song.artist
    item.song_duration = team.song.duration
    db.commit()
