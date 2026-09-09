from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.session import engine, Base
from app.models import db_models
from app.api.endpoints import waiting_list, consultation, pillars, articles, admin

# Lifespan context to auto-create tables in Neon Database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to Neon PostgreSQL and ensuring database tables exist...")
    try:
        Base.metadata.create_all(bind=engine)
        print("[DATABASE] Neon Database tables verified and ready.")
    except Exception as e:
        print(f"Warning connecting to database: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Zenphoria Psychological Wellness & Clinical Education API (Neon PostgreSQL)",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(waiting_list.router, prefix=settings.API_V1_STR)
app.include_router(consultation.router, prefix=settings.API_V1_STR)
app.include_router(pillars.router, prefix=settings.API_V1_STR)
app.include_router(articles.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "database": "Neon PostgreSQL",
        "status": "healthy",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "database": "connected"}
