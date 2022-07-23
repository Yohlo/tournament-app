from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Session
from backend.database import Base


class Token(Base):
    __tablename__ = 'tokens'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    token = Column(String)


def find_by_user_id(db: Session, id: int):
    token = db.query(Token).\
        filter(Token.user_id == id).first()
    return token


def create_token(db: Session, user_id: int, token: str):
    token = Token(user_id=user_id, token=token)
    db.add(token)
    db.commit()
    return token


def delete_token(db: Session, user_id: int):
    token = find_by_user_id(db, user_id)
    if token:
        db.delete(token)
        db.commit()
        return True
    return False
