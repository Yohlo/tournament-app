from fastapi import Request, APIRouter
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse
from backend.settings import settings

templates = Jinja2Templates(directory=f"{settings.BaseDir}/../frontend/build")
site = APIRouter()


@site.get("/static/{path:path}", response_class=HTMLResponse)
def static(request: Request, path: str):
    return FileResponse(f"{settings.BaseDir}/../frontend/build/static/{path}")


@site.get("/manifest.json")
def manifest():
    return FileResponse(f"{settings.BaseDir}/../frontend/build/manifest.json")


@site.get('/favicon.png')
def favicon():
    return FileResponse(f"{settings.BaseDir}/../frontend/build/favicon.png")


@site.get("/", response_class=HTMLResponse)
@site.get("/{path:path}", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
