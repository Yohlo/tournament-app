"""
    Settings that are to be used in a local development environment.
"""
from .base import BaseSettings
import os


class Settings(BaseSettings):
    Debug = True
    DatabaseUri = "sqlite:////home/kyle/db/dev/db.sqlite3"


print("THIS IS A DEVELOPMENT ENVIRONMENT! YOU SHOULD NOT SEE THIS MESSAGE IN PRODUCTION")
