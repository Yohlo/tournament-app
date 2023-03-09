from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, event, ForeignKey
from sqlalchemy.orm import Session, relationship
from backend.database import Base
from .shared import get_db_item_by_id, get_db_items
from .enums import TournamentType
from .team_membership import team_membership
from .tournament_entry import tournament_entry
from .tournament import Tournament
from datetime import datetime, timedelta
import enum
from asyncio import Event

match_updated_event = Event()


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
    team1 = relationship("Team", back_populates="matches", primaryjoin="TournamentMatch.team1_id == Team.id", uselist=False)
    team2 = relationship("Team", back_populates="matches", primaryjoin="TournamentMatch.team2_id == Team.id", uselist=False)

@event.listens_for(TournamentMatch.table_id, 'set')
def table_id_updated(target, value, initiator, rest):
    match_updated_event.set()


def make_all_matches(db: Session):
    # [x, y, a, b, otCount]
    # x plays y, x had a cups, y had b cups
    matches = [{
        "id": 1,
        "matches": [
            [5, 9, 10, 8, 0],
            [7, 2, 10, 9, 0],
            [1, 11, 10, 2, 0],
            [3, 10, 10, 9, 0],
            [8, 5, 0, 1, 1],
            [6, 7, 10, 8, 0],
            [4, 1, 9, 10, 0],
            [10, 2, 5, 10, 0],
            [8, 11, 10, 6, 0],
            [4, 9, 1, 0, 1],
            [2, 8, 10, 9, 0],
            [7, 4, 4, 10, 0],
            [5, 3, 8, 10, 0],
            [6, 1, 5, 10, 0],
            [5, 4, 0, 1, 1],
            [6, 2, 0, 1, 1],
            [4, 2, 9, 10, 0],
            [3, 1, 9, 10, 0],
            [3, 2, 4, 10, 0],
            [1, 2, 10, 9, 0]
        ]
    },
    {
        "id": 2,
        "matches": [
            [12, 19, 10, 5, 0],
            [16, 18, 10, 5, 0],
            [11, 14, 10, 6, 0],
            [17, 13, 9, 10, 0],
            [1, 12, 9, 10, 0],
            [15, 16, 8, 10, 0],
            [14, 18, 10, 9, 0],
            [17, 19, 10, 9, 0],
            [1, 14, 8, 10, 0],
            [15, 17, 10, 7, 0],
            [12, 11, 10, 9, 0],
            [16, 13, 7, 10, 0],
            [11, 15, 6, 10, 0],
            [16, 14, 3, 10, 0],
            [15, 14, 7, 10, 0],
            [12, 13, 10, 8, 0],
            [13, 13, 10, 7, 0],
            [12, 13, 10, 9, 0]
        ]
    },
    {
        "id": 3,
        "matches": [
            [1, 31, 10, 8, 0],
            [25, 21, 9, 10, 0],
            [11, 22, 8, 10, 0],
            [28, 26, 10, 9, 0],
            [20, 32, 10, 8, 0],
            [23, 27, 9, 10, 0],
            [29, 33, 10, 0, 0],
            [30, 24, 7, 10, 0],
            [31, 25, 9, 10, 0],
            [11, 26, 7, 10, 0],
            [32, 23, 8, 10, 0],
            [33, 30, 0, 10, 0],
            [1, 21, 9, 10, 0],
            [22, 28, 10, 3, 0],
            [20, 27, 10, 9, 0],
            [29, 24, 6, 10, 0],
            [1, 30, 10, 4, 0],
            [28, 23, 8, 10, 0],
            [27, 26, 9, 10, 0],
            [29, 25, 6, 10, 0],
            [23, 1, 10, 9, 0],
            [25, 26, 10, 8, 0],
            [21, 22, 10, 9, 0],
            [20, 24, 10, 5, 0],
            [22, 25, 10, 4, 0],
            [24, 23, 7, 10, 0],
            [22, 23, 10, 5, 0],
            [21, 20, 8, 10, 0],
            [21, 22, 10, 9, 0],
            [20, 21, 10, 9, 0]
        ]
    },
    {
        "id": 4,
        "matches": [
            [36, 23, 10, 8, 0],
            [34, 42, 10, 6, 0],
            [14, 39, 10, 5, 0],
            [38, 41, 10, 9, 0],
            [40, 43, 10, 6, 0],
            [11, 37, 7, 10, 0],
            [1, 44, 10, 6, 0],
            [3, 35, 5, 10, 0],
            [23, 42, 1, 0, 1],
            [39, 41, 10, 9, 0],
            [43, 11, 8, 10, 0],
            [44, 3, 8, 10, 0],
            [36, 34, 9, 10, 0],
            [14, 38, 3, 10, 0],
            [40, 37, 7, 10, 0],
            [1, 35, 8, 10, 0],
            [36, 3, 10, 8, 0],
            [14, 11, 8, 10, 0],
            [40, 39, 8, 10, 0],
            [1, 23, 10, 7, 0],
            [11, 36, 9, 10, 0],
            [1, 39, 10, 8, 0],
            [34, 38, 10, 8, 0],
            [37, 35, 9, 10, 0],
            [38, 1, 5, 10, 0],
            [37, 36, 8, 10, 0],
            [1, 36, 10, 9, 0],
            [34, 35, 10, 6, 0],
            [35, 1, 10, 8, 0],
            [34, 35, 10, 9, 0]
        ]
    },
    {
        "id": 5,
        "matches": [
            [61, 51, 9, 10, 0],
            [50, 55, 8, 10, 0],
            [48, 60, 10, 6, 0],
            [58, 56, 0, 10, 0],
            [45, 54, 10, 8, 0],
            [21, 53, 10, 9, 0],
            [25, 59, 10, 7, 0],
            [46, 52, 10, 9, 0],
            [57, 51, 6, 10, 0],
            [49, 55, 10, 9, 0],
            [1, 48, 9, 10, 0],
            [47, 56, 10, 4, 0],
            [54, 58, 10, 0, 0],
            [53, 60, 10, 7, 0],
            [59, 50, 6, 10, 0],
            [52, 61, 10, 6, 0],
            [57, 54, 8, 10, 0],
            [55, 53, 4, 10, 0],
            [1, 50, 0, 1, 2],
            [52, 56, 4, 10, 0],
            [51, 45, 8, 10, 0],
            [49, 21, 10, 6, 0],
            [48, 25, 10, 9, 0],
            [47, 46, 9, 10, 0],
            [51, 50, 9, 10, 0],
            [21, 52, 10, 8, 0],
            [25, 54, 10, 9, 0],
            [47, 53, 10, 7, 0],
            [21, 50, 10, 7, 0],
            [47, 25, 10, 6, 0],
            [45, 49, 10, 9, 0],
            [48, 46, 9, 10, 0],
            [49, 47, 9, 10, 0],
            [48, 21, 9, 10, 0],
            [21, 47, 10, 7, 0],
            [45, 46, 10, 9, 0],
            [46, 21, 8, 10, 0],
            [45, 21, 10, 4, 0]
        ]
    }]

    tournaments = db.query(Tournament).filter(Tournament.id <= 5).all()
    for tournament in tournaments:
        data = next((m for m in matches if m['id'] == tournament.id), None)
        print('-----------')
        print(tournament.name)
        print('-----------')
        i = 1
        for match in data["matches"]:
            aId, bId, aCups, bCups, otCount = match
            print(aId, bId, aCups, bCups, otCount)
            a = next((t for t in tournament.teams if t.id == aId), None)
            b = next((t for t in tournament.teams if t.id == bId), None)
            print(a.name, ':', aCups, 'cups')
            print(b.name, ':', bCups, 'cups')

            start_time = tournament.start_time + timedelta(minutes=i, seconds=i)
            end_time = tournament.start_time + timedelta(minutes=i+1)

            print(start_time, end_time)

            t_match = TournamentMatch(tournament_id=tournament.id, team1_id=a.id, team2_id=b.id, team1_cups=aCups, team2_cups=bCups, ot_count=otCount, start_time=start_time, end_time=end_time)
            db.add(t_match)
            db.commit()

            i+=1