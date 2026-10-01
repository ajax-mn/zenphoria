from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
from app.db.session import get_db
from app.models.db_models import BookingDB
from app.models.schemas import BookingCreate, BookingResponse
from app.core.email import send_booking_confirmation_email

router = APIRouter(tags=["Bookings"])

@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
@router.post("/waiting-list", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    payload: BookingCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new booking entry in Neon database and trigger email confirmation."""
    booking_id = f"bk_{uuid.uuid4().hex[:8]}"
    cadence = payload.cadence or "Bi-Weekly Modular Cadence"

    from app.services.reminder_service import parse_datetime_from_notes, extract_meet_link

    scheduled_dt = parse_datetime_from_notes(payload.notes or "")
    
    entry = BookingDB(
        id=booking_id,
        name=payload.name,
        email=payload.email,
        focus_area=payload.focus_area,
        cadence=cadence,
        notes=payload.notes or "",
        status="confirmed",
        scheduled_at=scheduled_dt,
        reminder_sent=False,
        created_at=datetime.utcnow()
    )
    entry.meet_link = extract_meet_link(entry)

    db.add(entry)
    db.commit()
    db.refresh(entry)

    time_display = scheduled_dt.strftime("%b %d, %Y at %I:%M %p IST") if scheduled_dt else ""

    # Trigger async email confirmation sending in background
    background_tasks.add_task(
        send_booking_confirmation_email,
        to_email=payload.email,
        name=payload.name,
        focus_area=payload.focus_area,
        cadence=cadence,
        booking_id=booking_id,
        meet_link=entry.meet_link,
        scheduled_time_str=time_display
    )

    return entry

from app.api.endpoints.admin import verify_admin_auth


@router.get("/bookings", response_model=List[BookingResponse])
@router.get("/waiting-list", response_model=List[BookingResponse])
async def list_bookings(
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Retrieve all bookings from Neon database (Admin authorized only)."""
    entries = db.query(BookingDB).order_by(BookingDB.created_at.desc()).all()
    return entries
