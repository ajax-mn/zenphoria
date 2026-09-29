import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
from app.core.config import settings
from app.db.session import engine, Base
from app.models import db_models
from app.api.endpoints import waiting_list, consultation, pillars, articles, admin, schedule
from app.services.reminder_service import reminder_worker_loop, stop_reminder_scheduler

# Lifespan context to auto-create tables and launch background reminder worker
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to Neon PostgreSQL and ensuring database tables exist...")
    try:
        Base.metadata.create_all(bind=engine)
        
        # Ensure any new columns exist on existing Neon tables safely
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP;"))
            conn.execute(text("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS meet_link VARCHAR(500);"))
            conn.execute(text("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;"))
            conn.commit()
            
        print("[DATABASE] Neon Database tables verified and ready.")
    except Exception as e:
        print(f"Warning connecting to database: {e}")

    # Launch automated background session reminder task (checks every 60s)
    reminder_task = asyncio.create_task(reminder_worker_loop(interval_seconds=60))
    
    yield

    # Clean shutdown
    stop_reminder_scheduler()
    reminder_task.cancel()
    try:
        await reminder_task
    except asyncio.CancelledError:
        pass

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
app.include_router(schedule.router, prefix=settings.API_V1_STR)
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
@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "database": "connected"}


@app.get("/api/cron/reminders", tags=["Automation"])
@app.post("/api/cron/reminders", tags=["Automation"])
async def cron_reminder_sweep():
    """
    Public automation ping endpoint.
    Can be pinged by free cron-job / uptime monitors (e.g. cron-job.org / UptimeRobot every 5-10m)
    to keep cloud instances awake and immediately execute pending 15-minute consultation reminders.
    """
    from app.services.reminder_service import check_and_dispatch_reminders, get_current_ist_time, _SCHEDULER_RUNNING
    dispatched = check_and_dispatch_reminders()
    now = get_current_ist_time()
    return {
        "status": "success",
        "dispatched_count": dispatched,
        "server_time_ist": now.strftime("%Y-%m-%d %H:%M:%S IST"),
        "scheduler_running": _SCHEDULER_RUNNING,
        "message": f"Reminder sweep complete. {dispatched} reminder(s) dispatched."
    }

