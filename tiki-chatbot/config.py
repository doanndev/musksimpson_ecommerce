import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Model settings
GEMINI_MODEL = "gemini-2.0-flash"

# FastAPI settings
APP_HOST = "127.0.0.1"
APP_PORT = 8000
