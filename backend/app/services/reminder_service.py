"""
Background Reminder Service for Zenphoria Consultations.

Periodically monitors upcoming bookings and automatically emails the Google Meet
video link to clients 10-15 minutes before their scheduled session.
"""

import asyncio
import logging
import re
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import or_, not_
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.db_models import BookingDB
from app.core.email import send_session_reminder_email
from app.core.config import settings

logger = logging.getLogger("zenphoria.reminder_service")

# Global flag to control background task lifecycle
_SCHEDULER_RUNNING = False


def get_current_ist_time() -> datetime:
    """Returns the current local datetime in Asia/Kolkata (IST = UTC+5:30) as a naive datetime."""
    try:
        import zoneinfo
        kolkata_tz = zoneinfo.ZoneInfo(settings.CALENDAR_TIMEZONE or "Asia/Kolkata")
        return datetime.now(kolkata_tz).replace(tzinfo=None)
    except Exception:
        return datetime.utcnow() + timedelta(hours=5, minutes=30)


def extract_meet_link(booking: BookingDB) -> str:
    """Extracts or recovers a Google Meet link from the booking record or notes."""
    if booking.meet_link and booking.meet_link.strip():
        return booking.meet_link.strip()

    # Attempt to extract Google Meet link from formatted notes
    if booking.notes:
        match = re.search(r"https?://meet\.google\.com/[a-z0-9\-]+", booking.notes, re.IGNORECASE)
        if match:
            return match.group(0)

    # Generate a fallback Google Meet link if none exists
    fallback = f"https://meet.google.com/{uuid.uuid4().hex[:3]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:3]}"
    return fallback


def check_and_dispatch_reminders() -> int:
    """
    Scans the database for consultations scheduled within the 10-15 minute trigger window
    (with grace window for recovering after server idle sleep) and delivers the Google Meet
    joining link via email.

    Returns:
        Number of reminder emails successfully dispatched.
    """
    dispatched_count = 0
    now = get_current_ist_time()

    # Lookahead window: 16 minutes ahead (to ensure 15m mark is captured cleanly)
    # Grace window: 45 minutes past start (to recover any missed reminders if server was sleeping on free-tier hosting)
    lookahead_window = now + timedelta(minutes=16)
    grace_window = now - timedelta(minutes=45)

    db: Session = SessionLocal()
    try:
        # Excluded cancelled statuses
        cancelled_statuses = ["cancelled", "canceled", "refunded"]

        # Find bookings with scheduled_at within window and reminder not yet sent
        query = db.query(BookingDB).filter(
            or_(BookingDB.reminder_sent == False, BookingDB.reminder_sent.is_(None)),
            BookingDB.scheduled_at.isnot(None),
            BookingDB.scheduled_at >= grace_window,
            BookingDB.scheduled_at <= lookahead_window,
        )

        # Filter out cancelled bookings
        for st in cancelled_statuses:
            query = query.filter(~BookingDB.status.ilike(st))

        upcoming_bookings = query.all()

        if upcoming_bookings:
            logger.info(
                "[REMINDER SERVICE] Found %d upcoming booking(s) in reminder window (IST: %s)",
                len(upcoming_bookings),
                now.strftime("%Y-%m-%d %H:%M:%S")
            )

        for booking in upcoming_bookings:
            try:
                # Ensure meet link is populated
                meet_url = extract_meet_link(booking)
                if not booking.meet_link or not booking.meet_link.strip():
                    booking.meet_link = meet_url

                # Format human readable time with accurate IST timezone indicator
                time_str = booking.scheduled_at.strftime("%b %d, %Y at %I:%M %p IST")
                logger.info(
                    "Dispatching 15m session reminder to %s for booking %s (Meet: %s, Scheduled: %s)",
                    booking.email,
                    booking.id,
                    meet_url,
                    time_str
                )

                success = send_session_reminder_email(
                    to_email=booking.email,
                    name=booking.name,
                    focus_area=booking.focus_area or "Clinical Wellness",
                    scheduled_time_str=time_str,
                    meet_link=meet_url,
                    booking_id=booking.id
                )

                if success:
                    booking.reminder_sent = True
                    db.commit()
                    dispatched_count += 1
                    logger.info("Successfully delivered 15m reminder to %s [%s]", booking.email, booking.id)

                    # Also notify Admin 10-15 min prior if different email
                    try:
                        admin_email = (settings.ADMIN_EMAIL or "").strip()
                        if admin_email and admin_email.lower() != booking.email.lower():
                            send_session_reminder_email(
                                to_email=admin_email,
                                name=f"Practitioner (Session with {booking.name})",
                                focus_area=booking.focus_area or "Clinical Wellness",
                                scheduled_time_str=time_str,
                                meet_link=meet_url,
                                booking_id=booking.id
                            )
                    except Exception as admin_mail_err:
                        logger.warning("Admin reminder notification copy failed (non-critical): %s", admin_mail_err)
                else:
                    logger.warning("Failed to deliver reminder email to %s [%s]", booking.email, booking.id)

            except Exception as item_err:
                logger.error("Error processing reminder for booking %s: %s", booking.id, item_err)
                db.rollback()

    except Exception as exc:
        logger.error("Error checking upcoming consultation reminders: %s", exc)
    finally:
        db.close()

    return dispatched_count


def dispatch_single_reminder(booking_id: str, db: Session, force: bool = False) -> Tuple[bool, str]:
    """
    Manually dispatches a session reminder email for a specific booking ID.
    Used by admin controls or testing tools.
    """
    booking = db.query(BookingDB).filter(BookingDB.id == booking_id).first()
    if not booking:
        return False, f"Booking with ID '{booking_id}' not found."

    if booking.reminder_sent and not force:
        return False, f"Reminder already marked as sent for booking '{booking_id}'. Use force=True to resend."

    meet_url = extract_meet_link(booking)
    if not booking.meet_link:
        booking.meet_link = meet_url

    scheduled_dt = booking.scheduled_at or get_current_ist_time()
    time_str = scheduled_dt.strftime("%b %d, %Y at %I:%M %p IST")

    success = send_session_reminder_email(
        to_email=booking.email,
        name=booking.name,
        focus_area=booking.focus_area or "Clinical Wellness",
        scheduled_time_str=time_str,
        meet_link=meet_url,
        booking_id=booking.id
    )

    if success:
        booking.reminder_sent = True
        db.commit()
        return True, f"Reminder email successfully dispatched to {booking.email}."
    else:
        return False, f"Failed to deliver reminder email to {booking.email} via Resend/SMTP."


def get_reminder_queue_status(db: Session) -> Dict[str, Any]:
    """Returns overview diagnostics on upcoming sessions and reminder readiness."""
    now = get_current_ist_time()
    next_24h = now + timedelta(hours=24)
    next_15m = now + timedelta(minutes=16)

    upcoming_24h = db.query(BookingDB).filter(
        BookingDB.scheduled_at.isnot(None),
        BookingDB.scheduled_at >= now,
        BookingDB.scheduled_at <= next_24h,
        ~BookingDB.status.ilike("cancelled")
    ).count()

    due_now = db.query(BookingDB).filter(
        or_(BookingDB.reminder_sent == False, BookingDB.reminder_sent.is_(None)),
        BookingDB.scheduled_at.isnot(None),
        BookingDB.scheduled_at >= now - timedelta(minutes=45),
        BookingDB.scheduled_at <= next_15m,
        ~BookingDB.status.ilike("cancelled")
    ).count()

    return {
        "server_time_ist": now.strftime("%Y-%m-%d %H:%M:%S IST"),
        "scheduler_running": _SCHEDULER_RUNNING,
        "due_reminders_count": due_now,
        "upcoming_24h_count": upcoming_24h,
        "timezone": settings.CALENDAR_TIMEZONE or "Asia/Kolkata"
    }


async def reminder_worker_loop(interval_seconds: int = 60):
    """
    Continuous background loop that checks for upcoming consultation reminders
    every interval_seconds (default 60 seconds).
    """
    global _SCHEDULER_RUNNING
    _SCHEDULER_RUNNING = True
    logger.info("[REMINDER SCHEDULER] Automated session reminder worker started (Interval: %ds)", interval_seconds)

    while _SCHEDULER_RUNNING:
        try:
            # Run sync DB check in thread pool so it does not block the async event loop
            dispatched = await asyncio.to_thread(check_and_dispatch_reminders)
            if dispatched > 0:
                logger.info("[REMINDER SCHEDULER] Dispatched %d automated session reminder(s).", dispatched)
        except Exception as loop_err:
            logger.error("[REMINDER SCHEDULER] Loop execution error: %s", loop_err)

        # Wait before next scan
        await asyncio.sleep(interval_seconds)


def stop_reminder_scheduler():
    """Stops the reminder background scheduler."""
    global _SCHEDULER_RUNNING
    _SCHEDULER_RUNNING = False
    logger.info("[REMINDER SCHEDULER] Worker stopped.")

