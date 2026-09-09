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

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest):
    """Authenticate admin credentials with configured username and password."""
    # Constant-time comparison for security
    user_match = secrets.compare_digest(payload.username.strip(), settings.ADMIN_USERNAME.strip())
    pass_match = secrets.compare_digest(payload.password.strip(), settings.ADMIN_PASSWORD.strip())

    if not (user_match and pass_match):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator username or password."
        )

    # Generate session token
    session_token = f"adm_sec_{secrets.token_hex(24)}"
    ACTIVE_ADMIN_TOKENS.add(session_token)

    return AdminLoginResponse(
        success=True,
        token=session_token,
        username=settings.ADMIN_USERNAME,
        message="Admin authentication successful."
    )

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
