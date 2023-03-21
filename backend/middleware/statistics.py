from sqlalchemy.orm import Session
from backend.models import Player as PlayerModel
from backend.models import Tournament as TournamentModel

class Statistics:
    def __init__(self):
        self.records = dict()

    def calculate_records(self, db: Session):
        self.records = {}
        players = db.query(PlayerModel).all()
        for p in players:
            self.records[p.id] = { 'overall': ''}

        tournaments = db.query(TournamentModel).all()

        for tournament in tournaments:
            for pid in self.records:
                self.records[pid][tournament.id] = ''
            for match in tournament.matches:
                if match.team1_cups is None or match.team2_cups is None:
                    continue

                team1_result = 'W' if match.team1_cups > match.team2_cups else 'L'
                team2_result = 'L' if match.team1_cups > match.team2_cups else 'W'
                for player in match.team1.players:
                    self.records[player.id]['overall'] += team1_result
                    self.records[player.id][tournament.id] += team1_result
                for player in match.team2.players:
                    self.records[player.id]['overall'] += team2_result
                    self.records[player.id][tournament.id] += team2_result

statistics = Statistics()
