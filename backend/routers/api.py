from fastapi import APIRouter

api = APIRouter()


@api.get("/")
def hello_world():
    return {"hello": "world"}
