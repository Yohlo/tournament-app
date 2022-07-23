"""
    File for main database models live here. This example simply
    stores user accounts with minimal information.
    For more information on schema, see [1]. For information about
    the datatypes available in sqlalchemy, see [2].
    [1]: https://docs.sqlalchemy.org/en/13/orm/tutorial.html#create-a-schema
    [2]: https://docs.sqlalchemy.org/en/13/core/type_basics.html
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, event
from sqlalchemy.orm import Session, relationship
from backend.database import Base
from .shared import get_db_item_by_id, get_db_items
from .enums import TournamentType
from .team_membership import team_membership
from .tournament_entry import tournament_entry
from datetime import datetime
import enum

class Tournament(Base):
    __tablename__ = 'tournaments'

    id: int = Column(Integer, primary_key=True, index=True, nullable=False)
    name: str = Column(String, nullable=False)
    type: TournamentType = Column(Enum(TournamentType))
    location: str = Column(String)
    desc: str = Column(String)
    logo_url: str = Column(String)
    team_size: int = Column(Integer, default=2)
    enroll_time: datetime = Column(DateTime)
    start_time: datetime = Column(DateTime)
    end_time: datetime = Column(DateTime)

    teams = relationship("Team", secondary=tournament_entry, back_populates="tournaments")


def create_tournament(db: Session, name, type, location, desc, logo_url, team_size, enroll_time, start_time, end_time):
    tournament = Tournament(\
        name=name, type=type, location=location, desc=desc, logo_url=logo_url,\
        team_size=team_size, enroll_time=enroll_time, start_time=start_time, end_time=end_time\
    )
    db.add(tournament)
    db.commit()
    return tournament


def get_tournaments(db: Session):
    return get_db_items(db, Tournament)


def get_tournament(db: Session, id: int):
    return get_db_item_by_id(db, Tournament, id)


def edit_tournament(db: Session, id: int, tournament_attributes: dict):
    tournament = edit_db_item_by_id(db, Tournament, id, tournament_attributes)
    if not tournament:
        return tournament
    db.commit()
    return tournament
