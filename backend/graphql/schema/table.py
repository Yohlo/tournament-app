import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Table as TableModel
from backend.models import match_updated_event, create_table
from backend.models import get_tables as get_db_tables
from backend.models import TournamentMatch
from backend.models.enums import TableType
from .types import Table, TableType
from typing import AsyncGenerator
from backend.database import SessionLocal
from sqlalchemy import desc

async def get_tables(self, info: Info) -> List[Table]:
    db = info.context["db"]
    tables = get_db_tables(db)
    return [Table.from_instance(table) for table in tables]

async def get_tables_subscription(self, info: Info) -> AsyncGenerator[List[Table], None]:
    db = SessionLocal()
    try:
        while 1:
            tables = get_db_tables(db)
            for t in tables:
                match = db.query(TournamentMatch).\
                    filter(TournamentMatch.table_id == t.id).\
                    order_by(desc(TournamentMatch.start_time)).\
                    first()
                t.active_match = match
            yield [Table.from_instance(table) for table in tables]
            await match_updated_event.wait()
            match_updated_event.clear()
    finally:
        db.close()

async def new_table(self, info: Info, name: str, type: TableType) -> Table:
    db = info.context["db"]
    table = create_table(db, name, type)
    return Table.from_instance(table)
