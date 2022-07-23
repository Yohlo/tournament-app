"""
    File for main database models live here. This example simply
    stores user accounts with minimal information.
    For more information on schema, see [1]. For information about
    the datatypes available in sqlalchemy, see [2].
    [1]: https://docs.sqlalchemy.org/en/13/orm/tutorial.html#create-a-schema
    [2]: https://docs.sqlalchemy.org/en/13/core/type_basics.html
"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Session, relationship
from backend.database import Base
from .shared import get_db_item_by_id, get_db_items
from .team_membership import team_membership


class Player(Base):
    __tablename__ = 'players'

    id: int = Column(Integer, primary_key=True, index=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=False)

    user = relationship("User", back_populates="player", uselist=False)
    teams = relationship("Team", secondary=team_membership, back_populates="players")


def create_player(db: Session, first_name: str, last_name: str):
    player = Player(first_name=first_name, last_name=last_name)
    db.add(player)
    db.commit()
    return player


def get_players(db: Session):
    return get_db_items(db, Player)


def get_player(db: Session, id: int):
    return get_db_item_by_id(db, Player, id)


def get_unassociated_players(db: Session):
    from backend.models import User
    complete_users = db.query(User).\
        filter(User.player_id.is_not(None)).all()
    player_ids = [user.player_id for user in complete_users]
    players = db.query(Player).\
        filter(Player.id.not_in(player_ids))
    return players.all()


def get_player_by_name(db: Session, first_name: str, last_name: str):
    player = db.query(Player).\
        filter(Player.last_name == last_name).\
        filter(Player.first_name == first_name).first()
    if not player:
        return False
    return player
