from fastapi import APIRouter, Depends, Security, Cookie, HTTPException
from fastapi.responses import RedirectResponse
from backend import app
from typing import Optional
import string
import random
import requests
import secrets
from backend.settings import settings
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
from urllib.parse import urlencode

CLIENT_ID = settings.SpotifyClientID
CLIENT_SECRET = settings.SpotifyClientSecret
REDIRECT_URI = f'{settings.BackEndUrl}/api/music/callback'
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=settings.SpotifyClientID,
                                                           client_secret=settings.SpotifyClientSecret))


music = APIRouter()


@music.get("/auth/login")
def login():
    state = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(16))
    scope = 'user-read-private streaming user-read-email user-read-playback-state'

    payload = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URI,
        'state': state,
        'scope': scope,
    }

    res = RedirectResponse(url=f'{AUTH_URL}/?{urlencode(payload)}')
    res.set_cookie(key='spotify_auth_state', value=state)

    return res  


@music.get('/callback')
def callback(error: str = '', code: str = '', state: str = '', spotify_auth_state: Optional[str] = Cookie(None)):
    try:
        if state is None or state != spotify_auth_state:
            error_msg = 'State mismatch: %s != %s', state, spotify_auth_state
            raise HTTPException(status_code=401, detail=error_msg)
        
        payload = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI
        }

        res = requests.post(TOKEN_URL, auth=(CLIENT_ID, CLIENT_SECRET), data=payload)
        res_data = res.json()

        if res_data.get('error') or res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail='Failed to get token')

        redirect_to_app = RedirectResponse(url=f'{settings.FrontEndUrl}/music/auth/success')
        redirect_to_app.set_cookie(key='access_token', value=res_data.get('access_token'))
        redirect_to_app.set_cookie(key='refresh_token', value=res_data.get('refresh_token'))
        redirect_to_app.set_cookie(key='expires_in', value=res_data.get('expires_in'))

        return redirect_to_app
    except Exception:
        pass 

    

@music.get("/")
def search(search):
    return [results_util(res) for res in sp.search(q=search)["tracks"]["items"]]


@music.get("/track")
def track(id): return results_util(sp.track(id))


def results_util(song):
    return {
        "artist": song["artists"][0]["name"],
        "album": song["album"]["name"],
        "imageUrl": song["album"]["images"][0]["url"],
        "track": song["name"],
        "id": song["id"],
        "lengthMillis": song["duration_ms"]
    }
