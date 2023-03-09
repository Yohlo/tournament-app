import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import TournamentMatch as MatchModel
from backend.models import tournament_match as matchModel
from backend.models import Table as TableModel
from backend.models import Team as TeamModel
from backend.database import SessionLocal
from typing import AsyncGenerator
from datetime import datetime
from .team import Team
from .tournament import Tournament
from .types import MatchCreateInput, MatchEndInput, Match
from backend.models import match_updated_event


async def create_match(self, info: Info, match: MatchCreateInput) -> Match:
    db = info.context["db"]
    table = db.query(TableModel).filter(TableModel.id == match.table_id).first()
    new_match = MatchModel(tournament_id=match.tournament_id,\
        team1_id=match.team_one_id, team2_id=match.team_two_id)
    db.add(new_match)
    table.active_match = new_match
    new_match.start_time = datetime.now()
    new_match.table_id = table.id
    db.commit()
    return Match.from_instance(new_match)


async def get_matches(self, info: Info) -> List[Match]:
    db = info.context["db"]
    matches = db.query(MatchModel).all()
    return [Match.from_instance(match) for match in matches]


async def get_matches_by_tournament(self, info: Info, tournament_id: strawberry.ID):
    db = info.context["db"]
    matches = db.query(MatchModel).\
        filter(MatchModel.tournament_id == tournament_id).\
        all()
    return [Match.from_instance(match) for match in matches]


async def end_match(self, info: Info, match_id: strawberry.ID, match: MatchEndInput):
    db = info.context["db"]
    edit_match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    edit_match.end_time = datetime.now()
    table = db.query(TableModel).filter(TableModel.id == edit_match.table_id).first()
    if table:
        table.active_match = None
    if match.team_one_cups:
        edit_match.team1_cups = match.team_one_cups
    if match.team_two_cups:
        edit_match.team2_cups = match.team_two_cups
    if match.ot_count:
        edit_match.ot_count = match.ot_count
    edit_match.table_id = None
    db.commit()
    return Match.from_instance(edit_match)

async def get_matches_subscription(self, info: Info, tournament_id: strawberry.ID) -> AsyncGenerator[List[Match], None]:
    try:
        while 1:
            db = SessionLocal()
            matches = db.query(MatchModel).\
                filter(MatchModel.tournament_id == tournament_id).\
                all()
            yield [Match.from_instance(match) for match in matches]
            db.close()
            await match_updated_event.wait()
            match_updated_event.clear()
    finally:
        db.close()
