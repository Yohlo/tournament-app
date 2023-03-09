"""
    Base class for out settings with typings.
"""
import os

class BaseSettings:
    Debug: bool
    DatabaseUri: str
    BaseDir: str
    SpotifyClientID = os.environ.get("SPOTIFY_CLIENT_ID")
    SpotifyClientSecret = os.environ.get("SPOTIFY_CLIENT_SECRET")
    FrontEndUrl = os.environ.get("FRONTEND_URL")
    BackEndUrl = os.environ.get("BACKEND_URL")
    AuthSecret = os.environ.get("AUTH_SECRET")
    AuthAlgorithm = os.environ.get("AUTH_ALGORITHM")
    AuthTokenExpireMinutes = 500
    TwilioAccountSid = os.environ.get("TWILIO_ACCOUNT_SID")
    TwilioAuthToken = os.environ.get("TWILIO_AUTH_TOKEN")
    TwilioServiceSid = os.environ.get("TWILIO_SERVICE_SID")
