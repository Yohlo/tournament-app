import strawberry
import enum


@strawberry.enum
class TournamentType(enum.Enum):
    MAIN = "MAIN"
    REGIONAL = "REGIONAL"
    SPINOFF = "SPINOFF"
    
    def __str__(self):
        if self == TournamentType.MAIN:
            return "MAIN"
        elif self == TournamentType.REGIONAL:
            return "REGIONAL"
        elif self == TournamentType.SPINOFF:
            return "SPINOFF"


@strawberry.enum
class TableType(enum.Enum):
    BLACK = "BLACK"
    WHITE = "WHITE"
    
    def __str__(self):
        if self == TableType.BLACK:
            return "BLACK"
        elif self == TableType.WHITE:
            return "WHITE"
