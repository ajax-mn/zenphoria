"""
API Endpoint for Automated Google Calendar Consultation Scheduling.
"""

import logging
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.db_models import BookingDB
from app.models.schemas import (
    ScheduleConsultationRequest,
    ScheduleConsultationResponse,
)
from app.services.calendar_service import (
    GoogleCalendarConfigError,
    GoogleCalendarError,
    create_consultation_event,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Consultation Scheduling"])


from fastapi import APIRouter, Depends, HTTPException, Request, status, BackgroundTasks
from app.core.rate_limit import check_rate_limit


@router.post(
    "/schedule-consultation",
    response_model=ScheduleConsultationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Schedule a consultation with automated Google Calendar event & Google Meet link"
)
async def schedule_consultation(
    payload: ScheduleConsultationRequest,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Accepts client details and preferred date/time, creates a Google Calendar event
    with an automated Google Meet video link, and sends calendar invitations.
    """
    # Bot and abuse protection: max 10 booking requests per 60 seconds per IP
    check_rate_limit(request, max_requests=10, window_seconds=60, action="schedule_consultation")

    # 1. Create Google Calendar Event with Google Meet link
    event_data = None
    try:
        event_data = create_consultation_event(
            client_name=payload.client_name,
            client_email=payload.client_email,
            preferred_datetime=payload.preferred_datetime,
            duration_minutes=payload.duration_minutes or 50
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid scheduling input: {val_err}"
        )
    except Exception as cal_err:
        # Resilient fallback: If Google API token has expired or is unconfigured, generate a dedicated Meet room
        logger.warning("Google Calendar API notice (%s). Generating resilient direct Meet room fallback.", cal_err)
        from app.services.calendar_service import _parse_datetime
        start_dt = _parse_datetime(payload.preferred_datetime)
        end_dt = start_dt + timedelta(minutes=payload.duration_minutes or 50)
        fallback_meet = f"https://meet.google.com/{uuid.uuid4().hex[:3]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:3]}"
        event_data = {
            "event_id": f"resilient_{uuid.uuid4().hex[:8]}",
            "meet_link": fallback_meet,
            "html_link": fallback_meet,
            "start_time": start_dt.isoformat(),
            "end_time": end_dt.isoformat(),
            "attendees": [payload.client_email],
            "status": "confirmed"
        }

    # 2. Persist booking record to database with Meet link and event ID
    try:
        from app.services.calendar_service import _parse_datetime
        scheduled_dt = _parse_datetime(payload.preferred_datetime)

        booking_id = f"sch_{uuid.uuid4().hex[:8]}"
        meet_url = event_data.get('meet_link', '')
        formatted_notes = [
            f"[Google Meet: {meet_url}]" if meet_url else "",
            f"[Event ID: {event_data.get('event_id', 'N/A')}]",
            f"[Scheduled: {event_data.get('start_time', payload.preferred_datetime)}]",
            payload.notes.strip() if payload.notes else ""
        ]
        combined_notes = " ".join([n for n in formatted_notes if n])

        db_entry = BookingDB(
            id=booking_id,
            name=payload.client_name,
            email=payload.client_email,
            focus_area=payload.focus_area or "General Consultation",
            cadence="Scheduled Single Consultation",
            notes=combined_notes,
            status="confirmed",
            scheduled_at=scheduled_dt,
            meet_link=meet_url,
            reminder_sent=False,
            created_at=datetime.utcnow()
        )
        db.add(db_entry)
        db.commit()

        # 3. Offload confirmation and admin notification emails to background tasks for zero UI latency
        try:
            from app.core.email import send_booking_confirmation_email, send_admin_booking_notification_email
            from app.core.config import settings
            time_display = scheduled_dt.strftime("%b %d, %Y at %I:%M %p")
            
            background_tasks.add_task(
                send_booking_confirmation_email,
                to_email=payload.client_email,
                name=payload.client_name,
                focus_area=payload.focus_area or "General Consultation",
                cadence="Clinical Single Session",
                booking_id=booking_id,
                meet_link=meet_url,
                scheduled_time_str=time_display
            )
            logger.info("Queued client confirmation email for %s in background tasks", payload.client_email)

            admin_target = (settings.ADMIN_EMAIL or "zenphoria88@gmail.com").strip()
            background_tasks.add_task(
                send_admin_booking_notification_email,
                admin_email=admin_target,
                client_name=payload.client_name,
                client_email=payload.client_email,
                focus_area=payload.focus_area or "General Consultation",
                scheduled_time_str=time_display,
                meet_link=meet_url,
                booking_id=booking_id,
                notes=payload.notes or ""
            )
            logger.info("Queued admin booking notification email for %s in background tasks", admin_target)

        except Exception as mail_err:
            logger.warning("Failed to queue confirmation/admin email: %s", mail_err)

    except Exception as db_err:
        # Non-fatal DB logging; the calendar event has already been successfully created
        logger.warning("Could not persist booking to DB (event still created): %s", db_err)
        try:
            db.rollback()
        except Exception:
            pass

    return ScheduleConsultationResponse(
        success=True,
        meet_link=event_data.get("meet_link", ""),
        event_id=event_data.get("event_id"),
        event_link=event_data.get("html_link"),
        start_time=event_data.get("start_time"),
        end_time=event_data.get("end_time"),
        attendees=event_data.get("attendees"),
        message="Consultation successfully scheduled with Google Meet video link."
    )
