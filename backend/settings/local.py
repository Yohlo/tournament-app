"""
    Settings that are to be used in a local development environment.
"""
from .base import BaseSettings
import os


class Settings(BaseSettings):
    Debug = True
    DatabaseUri = "sqlite:///./db.sqlite3"
    SpotifyClientID = os.environ.get("SPOTIFY_CLIENT_ID")
    SpotifyClientSecret = os.environ.get("SPOTIFY_CLIENT_SECRET")
    FrontEndUrl = "http://localhost:3000"
    BackEndUrl = "http://localhost:8000"
    AuthSecret = 'e9d164adbfb70fd31d33ddd871edc841186bf7031896f4020e61bc6f71b4593c'
    AuthAlgorithm = 'HS256'
    AuthTokenExpireMinutes = 30
    TwilioAccountSid = os.environ.get("TWILIO_ACCOUNT_SID")
    TwilioAuthToken = os.environ.get("TWILIO_AUTH_TOKEN")
    TwilioServiceSid = os.environ.get("TWILIO_SERVICE_SID")


print("THIS IS A DEVELOPMENT ENVIRONMENT! YOU SHOULD NOT SEE THIS MESSAGE IN PRODUCTION")
