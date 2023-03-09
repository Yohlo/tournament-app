"""
    Settings that are to be used in a local development environment.
"""
from .base import BaseSettings
import os


class Settings(BaseSettings):
    Debug = True
    DatabaseUri = "sqlite:////home/kyle/db/prod/db.sqlite3"
    FrontEndUrl = "https://tournament.yohler.net"
    BackEndUrl = "https://tournament.yohler.net"
