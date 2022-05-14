import strawberry
from strawberry.types import Info
from typing import List
from backend.models import Player as PlayerModel
from backend.models.player import get_players


@strawberry.type
class Player:
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


async def all_players(self, info: Info) -> List[Player]:
    db = info.context["db"]
    players = get_players(db)
    return [Player.from_instance(player) for player in players]
