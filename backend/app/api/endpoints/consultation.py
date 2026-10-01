from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
from app.db.session import get_db
from app.models.db_models import BookingDB
from app.models.schemas import BookingCreate, BookingResponse
from app.core.email import send_booking_confirmation_email

router = APIRouter(prefix="/consultations", tags=["Consultations"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def submit_consultation_preference(
    payload: BookingCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Save consultation assessment preferences into Neon bookings table and trigger email."""
    booking_id = f"c_{uuid.uuid4().hex[:8]}"
    cadence = payload.cadence or "Bi-Weekly Modular Cadence"
    client_name = payload.name or "Consultation Client"

    from app.services.reminder_service import parse_datetime_from_notes, extract_meet_link

    scheduled_dt = parse_datetime_from_notes(payload.notes or "")

    entry = BookingDB(
        id=booking_id,
        name=client_name,
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
        name=client_name,
        focus_area=payload.focus_area,
        cadence=cadence,
        booking_id=booking_id,
        meet_link=entry.meet_link,
        scheduled_time_str=time_display
    )

    return entry


from app.api.endpoints.admin import verify_admin_auth


@router.get("", response_model=List[BookingResponse])
async def get_consultations(
    authenticated: bool = Depends(verify_admin_auth),
    db: Session = Depends(get_db)
):
    """Retrieve consultation bookings from Neon bookings table (Admin authorized only)."""
    entries = db.query(BookingDB).order_by(BookingDB.created_at.desc()).all()
    return entries
