import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Zenphoria API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://neondb_owner:npg_96vtRMsDypBH@ep-still-mouse-ay5uy44z-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    )
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

settings = Settings()
