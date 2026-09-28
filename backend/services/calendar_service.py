"""
Alias to app.services.calendar_service for convenient root import.
"""
from app.services.calendar_service import (
    create_consultation_event,
    get_calendar_service,
    GoogleCalendarError,
    GoogleCalendarConfigError
)

__all__ = [
    "create_consultation_event",
    "get_calendar_service",
    "GoogleCalendarError",
    "GoogleCalendarConfigError"
]
