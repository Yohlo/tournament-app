from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, event, ForeignKey
from sqlalchemy.orm import Session, relationship
from backend.database import Base
from .shared import get_db_item_by_id, get_db_items
from .enums import TournamentType
from .team_membership import team_membership
from .tournament_entry import tournament_entry
from datetime import datetime
import enum

class TournamentMatch(Base):
    __tablename__ = 'tournamentmatches'

    id: int = Column(Integer, nullable=False, primary_key=True)
    team1_cups: int = Column(Integer)
    team2_cups: int = Column(Integer)
    ot_count: int = Column(Integer)
    start_time: datetime = Column(DateTime)
    end_time: datetime = Column(DateTime)

    tournament_id: int = Column(Integer, ForeignKey("tournaments.id"))
    table_id: int = Column(Integer, ForeignKey("tables.id"))
    team1_id: int = Column(Integer, ForeignKey("teams.id"))
    team2_id: int = Column(Integer, ForeignKey("teams.id"))
    tournament = relationship("Tournament", back_populates="matches", uselist=False)
    table = relationship("Table", back_populates="matches", uselist=False)
    team1 = relationship("Team", back_populates="matches", primaryjoin="TournamentMatch.team1_id == Team.id", uselist=False)
    team2 = relationship("Team", back_populates="matches", primaryjoin="TournamentMatch.team2_id == Team.id", uselist=False)
