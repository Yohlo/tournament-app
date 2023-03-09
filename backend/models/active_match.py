from sqlalchemy import Table, ForeignKey, Column
from backend.database import Base

active_match = Table(
    "active_match",
    Base.metadata,
    Column("table_id", ForeignKey("tables.id")),
    Column("match_id", ForeignKey("tournamentmatches.id")),
)
