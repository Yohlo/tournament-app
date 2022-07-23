from sqlalchemy import Column, Integer, String, or_, not_, event, ForeignKey
from sqlalchemy.orm import Session, relationship
from backend.database import Base
from .shared import *
from .player import get_player, get_players
from .team_membership import team_membership
from .tournament_entry import tournament_entry


class Team(Base):
    __tablename__ = 'teams'

    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String)
    song_id: str = Column(String)
    song_start: str = Column(String)
    song_name: str = Column(String)
    song_artist: str = Column(String)
    song_duration: str = Column(String)
    song_image: str = Column(String)

    players = relationship("Player", secondary=team_membership, back_populates="teams")
    tournaments = relationship("Tournament", secondary=tournament_entry, back_populates="teams")
    matches = relationship("TournamentMatch", primaryjoin="Team.id == TournamentMatch.team1_id or Team.id == TournamentMatch.team2_id")


def create_team(db: Session, name: str, song_id: str, song_start: str, song_name: str, song_artist: str, song_duration: str, song_image: str):
    team = Team(\
        name=name, song_id=song_id, song_start=song_start, song_name=song_name,\
        song_artist=song_artist, song_duration=song_duration, song_image=song_image\
    )
    db.add(team)
    db.commit()
    return team


def get_team(db: Session, id: int):
    return get_db_item_by_id(db, Team, id)


def get_teams(db: Session):
    return get_db_items(db, Team)


def delete_team(db: Session, team_id: int):
    team = get_team(db, team_id)
    if team:
        db.delete(team)
        db.commit()
        return True
    return False


@event.listens_for(Team.__table__, 'after_create')
def insert_initial_team(*args, **kwargs):
    pass
