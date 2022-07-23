from sqlalchemy import Table, ForeignKey, Column
from backend.database import Base

tournament_entry = Table(
    "tournament_entry",
    Base.metadata,
    Column("team_id", ForeignKey("teams.id")),
    Column("tournament_id", ForeignKey("tournaments.id")),
)
