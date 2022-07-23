"""
    File for main database models live here. This example simply
    stores user accounts with minimal information.
    For more information on schema, see [1]. For information about
    the datatypes available in sqlalchemy, see [2].
    [1]: https://docs.sqlalchemy.org/en/13/orm/tutorial.html#create-a-schema
    [2]: https://docs.sqlalchemy.org/en/13/core/type_basics.html
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, event, ForeignKey
from sqlalchemy.orm import relationship, Session, joinedload
from backend.database import Base
from datetime import datetime
from asyncio import Event
from .shared import get_db_item_by_id, get_db_items, edit_db_item_by_id
from backend.models import Player
import uuid

user_updated_event = Event()


class User(Base):
    __tablename__ = 'users'

    id: int = Column(Integer, primary_key=True, index=True, nullable=False)
    admin: bool = Column(Boolean, nullable=False)
    number: str = Column(String, nullable=False)
    login_guid: str = Column(String, nullable=False)
    registration_date: datetime = Column(DateTime, nullable=False)
    last_activity: datetime = Column(DateTime, nullable=False)

    player_id: int = Column(Integer, ForeignKey('players.id'), nullable=True)
    player = relationship("Player", back_populates="user")

    def __init__(self, number: str, admin: bool = False, player_id: int = None):
        self.admin = admin
        self.number = number
        self.player_id = player_id
        self.login_guid = uuid.uuid4().hex
        self.registration_date = datetime.now()
        self.last_activity = datetime.now()


def create_user(db: Session, number: str):
    user = User(number=number)
    db.add(user)
    db.commit()
    return user


def get_users(db: Session):
    return get_db_items(db, User, options=joinedload(User.player))


def get_user(db: Session, id: int):
    return get_db_item_by_id(db, User, id, options=joinedload(User.player))


def get_user_by_number(db: Session, number: str):
    user = db.query(User).\
        filter(User.number == number).first()
    return user


def set_user_player(db: Session, user_id: int, player_id: int):
    user = db.query(User).\
        filter(User.id == user_id).first()
    if not user:
        return False
    player = db.query(Player).\
        filter(Player.id == player_id).first()
    if not player:
        return False
    
    user.player_id = player_id
    user.player = player
    user.last_activity = datetime.now()
    db.commit()
    return user


@event.listens_for(User.last_activity, 'set')
def receive_after_commit(*args, **kwargs):
    user_updated_event.set()
