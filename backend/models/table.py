from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, event
from sqlalchemy.orm import Session, relationship
from backend.database import Base
from .shared import get_db_item_by_id, get_db_items
from .enums import TableType
from datetime import datetime
import enum

class Table(Base):
    __tablename__ = 'tables'

    id: int = Column(Integer, primary_key=True, index=True, nullable=False)
    name: str = Column(String, nullable=False)
    type: TableType = Column(Enum(TableType))
    matches = relationship("TournamentMatch", back_populates="table")

def create_table(db: Session, name, type):
    table = Table(\
        name=name, type=type,
    )
    db.add(table)
    db.commit()
    return table


def get_tables(db: Session):
    return get_db_items(db, Table)


def get_table(db: Session, id: int):
    return get_db_item_by_id(db, Table, id)


def edit_table(db: Session, id: int, table_attributes: dict):
    table = edit_db_item_by_id(db, Table, id, table_attributes)
    if not table:
        return table
    db.commit()
    return table
