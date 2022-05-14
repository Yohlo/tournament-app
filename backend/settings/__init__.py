import os
from dotenv import load_dotenv
load_dotenv()

# gets the environment variable ENV from our .env and loads in the appropriate file
# check out the settings app in this starter code for more info
Settings = getattr(__import__(f'backend.settings.{os.environ.get("ENV")}',  # noqa: B009
                              fromlist=["Settings"]), "Settings")
settings = Settings()
