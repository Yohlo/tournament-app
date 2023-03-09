import strawberry
from strawberry.types import Info
from typing import List, Optional, TYPE_CHECKING
from backend.models import get_player, get_players, get_unassociated_players, create_player, set_user_player, get_free_agents
from .types import Player


async def all_players(self, info: Info) -> List[Player]:
    db = info.context["db"]
    players = get_players(db)
    return [Player.from_instance(player) for player in players]


async def unassociated_players(self, info: Info) -> List[Player]:
    db = info.context["db"]
    players = get_unassociated_players(db)
    return [Player.from_instance(player) for player in players]

async def free_agents(self, info: Info, tournament_id: strawberry.ID) -> List[Player]:
    db = info.context["db"]
    players = get_free_agents(db, tournament_id)
    return [Player.from_instance(player) for player in players]

async def new_player(self, info: Info, first_name: str, last_name: str) -> Player:
    db = info.context["db"]
    player = create_player(db, first_name, last_name)
    return Player.from_instance(player)

async def change_player_name(self, info: Info, id: strawberry.ID, first_name: str, last_name: str) -> Player:
    db = info.context["db"]
    player = get_player(db, id)
    player.first_name = first_name
    player.last_name = last_name
    db.commit()
    return Player.from_instance(player)