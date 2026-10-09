import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Zenphoria API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    @property
    def DATABASE_URL(self) -> str:
        raw_url = os.getenv(
            "DATABASE_URL", 
            "postgresql://neondb_owner:npg_96vtRMsDypBH@ep-still-mouse-ay5uy44z-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
        ).strip().strip('"').strip("'")
        if raw_url.startswith("postgres://"):
            raw_url = raw_url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif raw_url.startswith("postgresql://") and not raw_url.startswith("postgresql+"):
            raw_url = raw_url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return raw_url
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "zenphoria_admin")
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "zenphoria-clinical-admin-secret-token-key-2025")
    
    # Google Calendar & Service Account Configuration
    GOOGLE_TOKEN_JSON: str = os.getenv("GOOGLE_TOKEN_JSON", "")
    GOOGLE_SERVICE_ACCOUNT_FILE: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "")
    GOOGLE_SERVICE_ACCOUNT_JSON: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "zenphoria88@gmail.com")
    ADMIN_CALENDAR_ID: str = os.getenv("ADMIN_CALENDAR_ID", "primary")
    CALENDAR_TIMEZONE: str = os.getenv("CALENDAR_TIMEZONE", "Asia/Kolkata")

    # Gemini AI Configuration for Psychology & Clinical Research Synthesis
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("GOOGLE_API_KEY", "").strip()

    # Tavily Web Search API (Fallback for clinical psychology web literature)
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "").strip()


    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

settings = Settings()

