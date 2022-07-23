from strawberry.types import Info
from typing import List, Optional, TYPE_CHECKING
from backend.models import get_players, get_unassociated_players, create_player, set_user_player
from .types import Player


async def all_players(self, info: Info) -> List[Player]:
    db = info.context["db"]
    players = get_players(db)
    return [Player.from_instance(player) for player in players]


async def unassociated_players(self, info: Info) -> List[Player]:
    db = info.context["db"]
    players = get_unassociated_players(db)
    return [Player.from_instance(player) for player in players]
