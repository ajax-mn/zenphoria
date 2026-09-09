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

    entry = BookingDB(
        id=booking_id,
        name=client_name,
        email=payload.email,
        focus_area=payload.focus_area,
        cadence=cadence,
        notes=payload.notes or "",
        status="confirmed",
        created_at=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # Trigger async email confirmation sending in background
    background_tasks.add_task(
        send_booking_confirmation_email,
        to_email=payload.email,
        name=client_name,
        focus_area=payload.focus_area,
        cadence=cadence,
        booking_id=booking_id
    )

    return entry


@router.get("", response_model=List[BookingResponse])
async def get_consultations(db: Session = Depends(get_db)):
    """Retrieve consultation bookings from Neon bookings table."""
    entries = db.query(BookingDB).order_by(BookingDB.created_at.desc()).all()
    return entries
