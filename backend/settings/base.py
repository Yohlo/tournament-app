"""
    Base class for out settings with typings.
"""


class BaseSettings:
    Debug: bool
    DatabaseUri: str
    BaseDir: str
    SpotifyClientID: str
    SpotifyClientSecret: str
    FrontEndUrl: str
    BackEndUrl: str
    AuthSecret: str
    AuthAlgorithm: str
    AuthTokenExpireMinutes: int
