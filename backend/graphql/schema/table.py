import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Table as TableModel
from backend.models import get_tables
from .types import Table, TableType

async def get_tables(self, info: Info) -> List[Table]:
    db = info.context["db"]
    tables = get_tables(db)
    return [Table.from_instance(table) for table in tables]

