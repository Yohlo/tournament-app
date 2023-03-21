import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Player as PlayerModel
from backend.models import Tournament as TournamentModel
from datetime import datetime
from backend.database import SessionLocal
from backend.middleware.statistics import statistics

@strawberry.type
class Record:
    wins: int
    losses: int

@strawberry.type
class PlayerStats:
    id: strawberry.ID

    @strawberry.field
    def record(self, info: Info, tournament_id: Optional[strawberry.ID] = None) -> Record:
        if self.id not in statistics.records:
            statistics.records[self.id] = ''
        records = statistics.records[self.id]
        key_to_use = tournament_id if tournament_id else 'overall'
        w = records[key_to_use].count('W')
        l = records[key_to_use].count('L')
        return Record(wins=w, losses=l)
    
    @strawberry.field
    def participation(self, info: Info) -> int:
        db =  info.context["db"]
        player = db.query(PlayerModel).get(self.id)
        tournaments = db.query(TournamentModel).filter(TournamentModel.start_time < datetime.now()).all()
        attended = 0
        for tournament in tournaments:
            for t in player.teams:
                if t in tournament.teams:
                    attended += 1
                    break
        return attended

async def player_stats(self, id: strawberry.ID) -> PlayerStats:
    return PlayerStats(id)