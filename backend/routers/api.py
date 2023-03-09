from fastapi import APIRouter
from backend.database import SessionLocal
from backend.models import make_all_matches

api = APIRouter()

db = SessionLocal()

@api.get("/")
def hello_world():
    return {"hello": "world"}
