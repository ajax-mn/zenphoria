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

    entry = BookingDB(
        id=booking_id,
        name=payload.name,
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
        name=payload.name,
        focus_area=payload.focus_area,
        cadence=cadence,
        booking_id=booking_id
    )

    return entry

@router.get("/bookings", response_model=List[BookingResponse])
@router.get("/waiting-list", response_model=List[BookingResponse])
async def list_bookings(db: Session = Depends(get_db)):
    """Retrieve all bookings from Neon database."""
    entries = db.query(BookingDB).order_by(BookingDB.created_at.desc()).all()
    return entries
