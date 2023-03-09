import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import Player as PlayerModel
from backend.models import Tournament as TournamentModel
from datetime import datetime
from backend.database import SessionLocal

@strawberry.type
class Record:
    wins: int
    losses: int

@strawberry.type
class PlayerStats:
    id: strawberry.ID

    @strawberry.field
    def record(self, info: Info, tournament_id: Optional[strawberry.ID] = None) -> Record:
        if "db" in info.context:
            db =  info.context["db"]
            close = False
        else:
            db = SessionLocal()
            close = True

        w, l = 0, 0
        player = db.query(PlayerModel).get(self.id)
        tournaments = db.query(TournamentModel).all() if not tournament_id else [db.query.get(tournament_id)]
        for tournament in tournaments:
            for match in tournament.matches:
                if player in match.team1.players or player in match.team2.players:
                    p_cups = match.team1_cups if player in match.team1.players else match.team2_cups
                    o_cups = match.team2_cups if player in match.team1.players else match.team1_cups
                    if p_cups is None or o_cups is None:
                        continue
                    if p_cups > o_cups:
                        w += 1
                    else:
                        l += 1
        if close: db.close()
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