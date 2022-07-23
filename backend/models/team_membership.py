from sqlalchemy import Table, ForeignKey, Column
from backend.database import Base


team_membership = Table(
    "team_membership",
    Base.metadata,
    Column("team_id", ForeignKey("teams.id")),
    Column("player_id", ForeignKey("players.id")),
)
