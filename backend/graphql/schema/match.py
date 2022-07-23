import strawberry
from strawberry.types import Info
from typing import List, Optional
from backend.models import TournamentMatch as MatchModel
from backend.models import tournament_match as matchModel
from datetime import datetime
from .team import Team
from .tournament import Tournament
from .types import MatchCreateInput, MatchEditInput, Match


async def create_match(self, info: Info, match: MatchCreateInput) -> Match:
    db = info.context["db"]
    new_match = MatchModel(tournament_id=match.tournament_id,\
        team1_id=match.team_one_id, team2_id=match.team_two_id,\
        table_id=match.table_id)
    new_match.tournament = Tournament.from_instance(match.tournament_id)
    new_match.team1 = Team.from_instance(match.team_one_id)
    new_match.team2 = Team.from_instance(match.team_two_id)
    new_match.table = Table.from_instance(match.table_id)
    db.add(new_match)
    db.commit()
    return Match.from_instance(new_match)


async def get_matches(self, info: Info) -> List[Match]:
    db = info.context["db"]
    matches = db.query(MatchModel).all()
    return [Match.from_instance(match) for match in matches]


async def get_matches_by_tournament(self, info: Info, tournament_id: int):
    db = info.context["db"]
    matches = db.query(MatchModel).\
        filter(MatchModel.tournament_id == tournament_id).\
        all()
    return [Match.from_instance(match) for match in matches]


async def get_ongoing_matches(self, info: Info):
    db = info.context["db"]
    matches = db.query(MatchModel).\
        filter(MatchModel.start_time).\
        filter(not MatchModel.end_time).\
        all()
    return [Match.from_instance(match) for match in matches]

async def edit_match(self, info: Info, match_id: int, match: MatchEditInput):
    db = info.context["db"]
    edit_match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if match.team1_cups:
        edit_match.team1_cups = match.team1_cups
    if match.team2_cups:
        edit_match.team2_cups = match.team2_cups
    if match.ot_count:
        edit_match.ot_count = match.ot_count
    if match.end_time:
        edit_match.end_time = match.end_time
    db.commit()
    return Match.from_instance(edit_match)
