from sqlalchemy import Column, String, Text, DateTime, Boolean
from datetime import datetime
from app.db.session import Base

class BookingDB(Base):
    __tablename__ = "bookings"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    focus_area = Column(String(100), nullable=False, default="Stress & Anxiety")
    cadence = Column(String(100), nullable=True, default="biweekly")
    notes = Column(Text, nullable=True, default="")
    status = Column(String(50), nullable=False, default="confirmed")
    scheduled_at = Column(DateTime, nullable=True, index=True)
    meet_link = Column(String(500), nullable=True)
    reminder_sent = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

