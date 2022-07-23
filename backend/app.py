import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.authentication import AuthenticationMiddleware
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL
from backend.middleware.auth import BasicAuthBackend, token_db
from backend.settings import settings
from backend.models import * # noqa
from starlette.requests import Request
from strawberry.asgi import GraphQL

_basedir = os.path.abspath(os.path.dirname(__file__))
settings.BaseDir = _basedir

app = FastAPI()

origins = ["http://localhost", "https://bakerloo3000.yohler.net"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    AuthenticationMiddleware,
    backend=BasicAuthBackend(secret=settings.AuthSecret,
                             algorithm=settings.AuthAlgorithm)
)


@app.middleware("http")
async def cookie_set(request: Request, call_next):
    response = await call_next(request)
    del_cookie_flag = False
    if request.user.req_id in token_db.db.keys():
        token = token_db.db[request.user.req_id]
        if token["valid"]:
            decoded_access_token = token["access_token"] \
                if isinstance(token["access_token"], str) \
                else token["access_token"].decode('utf-8')
            response.set_cookie(
                key="Authorization",
                value=decoded_access_token,
                expires=int(token["expires"]),
                httponly=True
            )
        else:
            del_cookie_flag = True
    else:
        del_cookie_flag = True

    if del_cookie_flag:
        response.delete_cookie(
            key="Authorization",
            path="/",
            domain=None
        )

    await token_db.remove_token(request.user.req_id)
    return response


from backend.routers.api import api  # noqa
app.include_router(api, prefix="/api/v1")

from backend.graphql import schema  # noqa
graphql = GraphQL(schema, subscription_protocols=[
    GRAPHQL_TRANSPORT_WS_PROTOCOL,
    GRAPHQL_WS_PROTOCOL,
])
app.mount('/graphql', graphql)

from backend.routers.music import music # noqa
app.include_router(music, prefix="/api/music")

from backend.routers.site import site  # noqa
app.include_router(site)
