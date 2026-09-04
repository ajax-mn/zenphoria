from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
from app.db.session import get_db
from app.models.db_models import BookingDB
from app.models.schemas import BookingCreate, BookingResponse

router = APIRouter(prefix="/consultations", tags=["Consultations"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def submit_consultation_preference(payload: BookingCreate, db: Session = Depends(get_db)):
    """Save consultation assessment preferences into Neon bookings table."""
    entry = BookingDB(
        id=f"c_{uuid.uuid4().hex[:8]}",
        name=payload.name or "Consultation Client",
        email=payload.email,
        focus_area=payload.focus_area,
        cadence=payload.cadence or "Bi-Weekly Modular Cadence",
        notes=payload.notes or "",
        status="confirmed",
        created_at=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("", response_model=List[BookingResponse])
async def get_consultations(db: Session = Depends(get_db)):
    """Retrieve consultation bookings from Neon bookings table."""
    entries = db.query(BookingDB).order_by(BookingDB.created_at.desc()).all()
    return entries
