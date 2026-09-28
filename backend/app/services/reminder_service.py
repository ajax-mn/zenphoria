"""
Background Reminder Service for Zenphoria Consultations.

Periodically monitors upcoming bookings and automatically emails the Google Meet
video link to clients 10-15 minutes before their scheduled session.
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.db_models import BookingDB
from app.core.email import send_session_reminder_email

logger = logging.getLogger("zenphoria.reminder_service")

# Global flag to control background task lifecycle
_SCHEDULER_RUNNING = False


def check_and_dispatch_reminders() -> int:
    """
    Scans the database for consultations scheduled within the next 15 minutes
    and delivers the Google Meet joining link via email.

    Returns:
        Number of reminder emails successfully dispatched.
    """
    dispatched_count = 0
    # scheduled_at stores IST-local datetimes (Asia/Kolkata = UTC+5:30)
    # so comparison must also use IST-local time
    utc_now = datetime.utcnow()
    now = utc_now + timedelta(hours=5, minutes=30)  # Convert to IST
    # Trigger window: Starts within the next 15 minutes or up to 10 minutes past start
    lookahead_window = now + timedelta(minutes=15)
    grace_window = now - timedelta(minutes=10)

    db: Session = SessionLocal()
    try:
        # Find bookings with scheduled_at within window and reminder not yet sent
        upcoming_bookings = db.query(BookingDB).filter(
            BookingDB.reminder_sent == False,
            BookingDB.meet_link.isnot(None),
            BookingDB.meet_link != "",
            BookingDB.scheduled_at.isnot(None),
            BookingDB.scheduled_at >= grace_window,
            BookingDB.scheduled_at <= lookahead_window,
            BookingDB.status.ilike("confirmed")
        ).all()

        for booking in upcoming_bookings:
            try:
                # Format readable time
                time_str = booking.scheduled_at.strftime("%b %d, %Y at %I:%M %p UTC")
                logger.info(
                    "Dispatching session reminder to %s for booking %s (Meet: %s)",
                    booking.email,
                    booking.id,
                    booking.meet_link
                )

                success = send_session_reminder_email(
                    to_email=booking.email,
                    name=booking.name,
                    focus_area=booking.focus_area or "Clinical Wellness",
                    scheduled_time_str=time_str,
                    meet_link=booking.meet_link,
                    booking_id=booking.id
                )

                if success:
                    booking.reminder_sent = True
                    db.commit()
                    dispatched_count += 1
                    logger.info("Successfully sent reminder to %s [%s]", booking.email, booking.id)

                    # Also notify Admin 10-15 min prior if different email
                    from app.core.config import settings
                    admin_email = (settings.ADMIN_EMAIL or "").strip()
                    if admin_email and admin_email.lower() != booking.email.lower():
                        send_session_reminder_email(
                            to_email=admin_email,
                            name=f"Practitioner (Session with {booking.name})",
                            focus_area=booking.focus_area or "Clinical Wellness",
                            scheduled_time_str=time_str,
                            meet_link=booking.meet_link,
                            booking_id=booking.id
                        )
                else:
                    logger.warning("Failed to send reminder email to %s [%s]", booking.email, booking.id)

            except Exception as item_err:
                logger.error("Error processing reminder for booking %s: %s", booking.id, item_err)
                db.rollback()

    except Exception as exc:
        logger.error("Error checking upcoming consultation reminders: %s", exc)
    finally:
        db.close()

    return dispatched_count


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
