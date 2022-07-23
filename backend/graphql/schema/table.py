import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Table as TableModel
from backend.models import get_tables
from .match import Match


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


async def all_players(self, info: Info) -> List[Player]:
    db = info.context["db"]
    players = get_players(db)
    return [Table.from_instance(player) for player in players]


async def unassociated_players(self, info: Info) -> List[Player]:
    db = info.context["db"]
    players = get_unassociated_players(db)
    return [Table.from_instance(player) for player in players]
