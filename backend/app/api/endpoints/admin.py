from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from typing import List, Optional
from collections import Counter
import secrets

from app.core.config import settings
from app.db.session import get_db
from app.models.db_models import BookingDB
from app.models.schemas import (
    AdminLoginRequest,
    AdminLoginResponse,
    BookingResponse,
    AdminClientUpdate,
    AdminStatsResponse
)

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

# In-memory token storage (also verified against secret key fallback)
ACTIVE_ADMIN_TOKENS = set()

def verify_admin_auth(authorization: Optional[str] = Header(None)):
    """Simple and secure token authentication for admin endpoints."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin authorization token is required."
        )
    
    token = authorization.replace("Bearer ", "").strip()
    if token in ACTIVE_ADMIN_TOKENS or token == settings.ADMIN_SECRET_KEY:
        return True
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired admin session token."
    )

import hashlib
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from app.core.rate_limit import check_rate_limit


def verify_password(provided: str, stored: str) -> bool:
    """Verifies password using constant-time comparison, supporting both direct and SHA-256 hashed values."""
    provided_clean = provided.strip()
    stored_clean = stored.strip()
    if secrets.compare_digest(provided_clean, stored_clean):
        return True
    # Also support SHA-256 hashed values for enhanced security
    provided_hash = hashlib.sha256(provided_clean.encode()).hexdigest()
    if secrets.compare_digest(provided_hash, stored_clean):
        return True
    return False


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest, request: Request):
    """Authenticate admin credentials with rate limiting and constant-time password verification."""
    # 1. Enforce rate limiting: max 5 login attempts per 60 seconds per IP
    check_rate_limit(request, max_requests=5, window_seconds=60, action="admin_login")

    # 2. Constant-time comparison for security
    user_match = secrets.compare_digest(payload.username.strip(), settings.ADMIN_USERNAME.strip())
    pass_match = verify_password(payload.password, settings.ADMIN_PASSWORD)

    if not (user_match and pass_match):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator username or password."
        )

    # Generate cryptographically secure session token
    session_token = f"adm_sec_{secrets.token_hex(24)}"
    ACTIVE_ADMIN_TOKENS.add(session_token)

    return AdminLoginResponse(
        success=True,
        token=session_token,
        username=settings.ADMIN_USERNAME,
        message="Admin authentication successful."
    )

@router.get("/verify")
async def verify_admin_session(authenticated: bool = Depends(verify_admin_auth)):
    """Lightweight endpoint to verify whether active admin session token is still valid."""
    return {"valid": True, "status": "authenticated"}

@router.get("/clients", response_model=List[BookingResponse])
async def get_all_registered_clients(
    search: Optional[str] = None,
    status: Optional[str] = None,
    focus_area: Optional[str] = None,
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Retrieve registered clients from the database with filtering."""
    query = db.query(BookingDB)

    if status and status.lower() != "all":
        query = query.filter(BookingDB.status.ilike(status))

    if focus_area and focus_area.lower() != "all":
        query = query.filter(BookingDB.focus_area.ilike(f"%{focus_area}%"))

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (BookingDB.name.ilike(search_pattern)) |
            (BookingDB.email.ilike(search_pattern)) |
            (BookingDB.focus_area.ilike(search_pattern)) |
            (BookingDB.notes.ilike(search_pattern))
        )

    entries = query.order_by(BookingDB.created_at.desc()).all()
    return entries

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_dashboard_stats(
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Retrieve statistical summary of registered clients."""
    all_clients = db.query(BookingDB).all()
    total = len(all_clients)
    confirmed = sum(1 for c in all_clients if c.status.lower() in ["confirmed", "active"])
    pending = total - confirmed

    focus_counts = Counter(c.focus_area for c in all_clients if c.focus_area)

    return AdminStatsResponse(
        total_clients=total,
        confirmed_clients=confirmed,
        pending_clients=pending,
        focus_distribution=dict(focus_counts)
    )

@router.patch("/clients/{client_id}", response_model=BookingResponse)
async def update_registered_client(
    client_id: str,
    payload: AdminClientUpdate,
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Update a client's status or notes."""
    entry = db.query(BookingDB).filter(BookingDB.id == client_id).first()
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client record with ID '{client_id}' not found."
        )

    if payload.status is not None:
        entry.status = payload.status
    if payload.notes is not None:
        entry.notes = payload.notes
    if payload.cadence is not None:
        entry.cadence = payload.cadence
    if payload.focus_area is not None:
        entry.focus_area = payload.focus_area

    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/clients", status_code=status.HTTP_200_OK)
@router.delete("/clients/all", status_code=status.HTTP_200_OK)
async def delete_all_registered_clients(
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Purge all client registrations from the database."""
    count = db.query(BookingDB).delete()
    db.commit()
    return {
        "success": True, 
        "message": f"Successfully deleted all {count} client record(s).",
        "deleted_count": count
    }

@router.delete("/clients/{client_id}", status_code=status.HTTP_200_OK)
async def delete_registered_client(
    client_id: str,
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Remove a client registration from the database."""
    entry = db.query(BookingDB).filter(BookingDB.id == client_id).first()
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client record with ID '{client_id}' not found."
        )

    db.delete(entry)
    db.commit()
    return {"success": True, "message": f"Client record '{client_id}' deleted successfully."}

@router.post("/test-email")
async def test_email_diagnostic(
    to_email: str = "zenphoria88@gmail.com",
    authenticated: bool = Depends(verify_admin_auth)
):
    """Diagnostic endpoint to test live SMTP delivery on deployed environment."""
    from app.core.email import send_booking_confirmation_email
    import traceback
    try:
        success = send_booking_confirmation_email(
            to_email=to_email,
            name="Diagnostic Admin",
            focus_area="Stress & Anxiety",
            cadence="Weekly Modular",
            booking_id="diag_test"
        )
        return {"success": success, "recipient": to_email, "message": "Email delivery attempted"}
    except Exception as e:
        return {"success": False, "error": str(e), "traceback": traceback.format_exc()}


@router.post("/reminders/trigger")
async def trigger_reminders_manually(
    authenticated: bool = Depends(verify_admin_auth)
):
    """Manually triggers the 15-minute reminder scanner loop and immediately delivers due emails."""
    from app.services.reminder_service import check_and_dispatch_reminders, get_current_ist_time, _SCHEDULER_RUNNING
    dispatched = check_and_dispatch_reminders()
    now = get_current_ist_time()
    return {
        "success": True,
        "dispatched_count": dispatched,
        "server_time_ist": now.strftime("%Y-%m-%d %H:%M:%S IST"),
        "scheduler_running": _SCHEDULER_RUNNING,
        "message": f"Successfully processed reminder scan. {dispatched} reminder(s) dispatched."
    }


@router.get("/reminders/status")
async def get_reminders_status(
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Returns queue status of upcoming bookings and pending 15-minute reminders."""
    from app.services.reminder_service import get_reminder_queue_status
    return get_reminder_queue_status(db)


@router.post("/clients/{client_id}/send-reminder")
async def send_client_reminder_on_demand(
    client_id: str,
    force: bool = True,
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Dispatches a 15-minute consultation reminder email with Google Meet link to a specific client on demand."""
    from app.services.reminder_service import dispatch_single_reminder
    success, msg = dispatch_single_reminder(booking_id=client_id, db=db, force=force)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=msg
        )
    return {"success": True, "message": msg}



