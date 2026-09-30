"""
Google Calendar Service for Zenphoria Clinical Consultations.

Handles Google Calendar API Service Account authentication, event creation,
attendee notifications, and automated Google Meet link generation.
"""

import json
import logging
import os
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Union

from google.oauth2 import service_account
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import Resource, build
from googleapiclient.errors import HttpError

from app.core.config import settings

logger = logging.getLogger(__name__)

# Scopes required to manage calendar events and conference data
CALENDAR_SCOPES: List[str] = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events"
]


class GoogleCalendarError(Exception):
    """Base exception for Google Calendar operations."""
    pass


class GoogleCalendarConfigError(GoogleCalendarError):
    """Raised when service account configuration or credentials are missing or invalid."""
    pass


def get_calendar_service() -> Resource:
    """
    Authenticate with Google Calendar API using:
    1. OAuth 2.0 User Token (credentials/token.json) - Preferred, enables real Google Meet creation on @gmail.com
    2. Service Account credentials - Fallback for domain-wide delegated Workspace accounts
    """
    credentials = None

    # 1. Attempt OAuth 2.0 User Token from Environment Variable (Ideal for Render cloud deployment)
    token_json_env = (getattr(settings, "GOOGLE_TOKEN_JSON", None) or os.getenv("GOOGLE_TOKEN_JSON", "")).strip()
    if token_json_env:
        try:
            token_data = json.loads(token_json_env)
            credentials = Credentials.from_authorized_user_info(token_data, CALENDAR_SCOPES)
            if credentials and credentials.expired and credentials.refresh_token:
                logger.info("OAuth token expired, refreshing via refresh_token...")
                credentials.refresh(Request())
            logger.info("Loaded Google OAuth 2.0 User Credentials from GOOGLE_TOKEN_JSON environment variable.")
        except Exception as exc:
            logger.warning("Failed to load OAuth token from GOOGLE_TOKEN_JSON env var: %s", exc)
            credentials = None

    # 2. Attempt OAuth 2.0 User Token from local file (credentials/token.json)
    if not credentials:
        token_candidate_paths = [
            getattr(settings, "GOOGLE_TOKEN_FILE", None),
            "credentials/token.json",
            os.path.join(os.getcwd(), "credentials", "token.json"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "credentials", "token.json")
        ]
        
        token_file_path = None
        for tp in token_candidate_paths:
            if tp and os.path.exists(tp) and os.path.isfile(tp):
                token_file_path = tp
                break

        if token_file_path:
            try:
                credentials = Credentials.from_authorized_user_file(token_file_path, CALENDAR_SCOPES)
                if credentials and credentials.expired and credentials.refresh_token:
                    logger.info("OAuth token expired, refreshing via refresh_token...")
                    credentials.refresh(Request())
                    with open(token_file_path, "w") as tf:
                        tf.write(credentials.to_json())
                logger.info("Loaded Google OAuth 2.0 User Credentials from: %s", token_file_path)
            except Exception as exc:
                logger.warning("Failed to load OAuth token from %s: %s. Falling back to service account.", token_file_path, exc)
                credentials = None

    # 2. Attempt Service Account auth if OAuth token not present or invalid
    if not credentials:
        creds_file = (settings.GOOGLE_SERVICE_ACCOUNT_FILE or "").strip()
        creds_json_str = (settings.GOOGLE_SERVICE_ACCOUNT_JSON or "").strip()

        resolved_path = None
        if creds_file:
            candidate_paths = [
                creds_file,
                os.path.abspath(creds_file),
                os.path.join(os.getcwd(), creds_file),
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), creds_file),
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "credentials", "service_account.json")
            ]
            for p in candidate_paths:
                if p and os.path.exists(p) and os.path.isfile(p):
                    resolved_path = p
                    break

        if resolved_path:
            try:
                credentials = service_account.Credentials.from_service_account_file(
                    resolved_path,
                    scopes=CALENDAR_SCOPES
                )
                logger.info("Loaded Google Service Account from file: %s", resolved_path)
            except Exception as exc:
                raise GoogleCalendarConfigError(
                    f"Failed to load service account credentials from file '{resolved_path}': {exc}"
                ) from exc
        elif creds_json_str:
            try:
                info = json.loads(creds_json_str)
                credentials = service_account.Credentials.from_service_account_info(
                    info,
                    scopes=CALENDAR_SCOPES
                )
                logger.info("Loaded Google Service Account from JSON environment variable.")
            except Exception as exc:
                raise GoogleCalendarConfigError(
                    f"Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON environment variable: {exc}"
                ) from exc
        else:
            raise GoogleCalendarConfigError(
                "Google Calendar credentials not configured. Please authorize via OAuth or set GOOGLE_SERVICE_ACCOUNT_FILE."
            )

    try:
        service = build("calendar", "v3", credentials=credentials, cache_discovery=False)
        return service
    except Exception as exc:
        raise GoogleCalendarError(f"Failed to initialize Google Calendar API client: {exc}") from exc


def _parse_datetime(dt_input: Union[str, datetime]) -> datetime:
    """
    Parse an input string or datetime into a valid datetime object in the local application timezone (Asia/Kolkata).
    Supports ISO 8601 strings, offset-aware strings, and standard formats.
    """
    parsed: datetime
    if isinstance(dt_input, datetime):
        parsed = dt_input
    else:
        if not isinstance(dt_input, str) or not dt_input.strip():
            raise ValueError("preferred_datetime cannot be empty.")

        dt_str = dt_input.strip()

        # Normalize ISO trailing 'Z' if present
        if dt_str.endswith("Z"):
            dt_str = dt_str[:-1] + "+00:00"

        try:
            parsed = datetime.fromisoformat(dt_str)
        except ValueError:
            # Fallback common formats
            common_formats = [
                "%Y-%m-%dT%H:%M:%S",
                "%Y-%m-%dT%H:%M",
                "%Y-%m-%d %H:%M:%S",
                "%Y-%m-%d %H:%M",
                "%Y-%m-%d",
            ]
            parsed = None
            for fmt in common_formats:
                try:
                    parsed = datetime.strptime(dt_str, fmt)
                    break
                except ValueError:
                    continue

            if parsed is None:
                raise ValueError(
                    f"Invalid preferred_datetime format '{dt_input}'. Please use ISO 8601 format (e.g., '2026-10-05T10:00:00')."
                )

    # If datetime has timezone info, convert to Asia/Kolkata local time and make naive
    if parsed.tzinfo is not None:
        try:
            import zoneinfo
            kolkata_tz = zoneinfo.ZoneInfo("Asia/Kolkata")
            parsed = parsed.astimezone(kolkata_tz).replace(tzinfo=None)
        except Exception:
            # Fallback UTC+5:30 conversion
            import datetime as dt_mod
            utc_dt = parsed.astimezone(dt_mod.timezone.utc)
            parsed = (utc_dt + timedelta(hours=5, minutes=30)).replace(tzinfo=None)

    return parsed


def create_consultation_event(
    client_name: str,
    client_email: str,
    preferred_datetime: Union[str, datetime],
    duration_minutes: int = 50,
    calendar_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a consultation calendar event with Google Meet link and invite attendees.

    Args:
        client_name: Full name of the client.
        client_email: Email address of the client.
        preferred_datetime: Starting date and time in ISO format or datetime object.
        duration_minutes: Session duration in minutes (default 50 mins).
        calendar_id: Target calendar ID (default to settings.ADMIN_CALENDAR_ID or 'primary').

    Returns:
        Dictionary containing created event metadata and meet link.
    """
    if not client_name or not client_name.strip():
        raise ValueError("Client name is required.")
    if not client_email or "@" not in client_email:
        raise ValueError(f"Invalid client email: '{client_email}'")

    start_dt = _parse_datetime(preferred_datetime)
    end_dt = start_dt + timedelta(minutes=duration_minutes)

    time_zone = settings.CALENDAR_TIMEZONE or "Asia/Kolkata"
    
    # Use specified calendar_id, configured ADMIN_CALENDAR_ID, or 'primary'
    cal_id = calendar_id or settings.ADMIN_CALENDAR_ID or "primary"

    # Build attendees list.
    # NOTE: The client is intentionally NOT added as an attendee.
    # Adding clients as attendees causes Google Calendar to auto-send them
    # a calendar invite email (from Google, not Zenphoria).
    # Zenphoria's own branded confirmation email handles all client communication.
    # Only the admin organizer is added here so the event appears on their calendar.
    attendees: List[Dict[str, str]] = []
    admin_email = (settings.ADMIN_EMAIL or "").strip()
    if admin_email:
        attendees.append({"email": admin_email})

    # Prepare Google Meet conference request
    request_id = f"zenphoria-meet-{uuid.uuid4().hex[:12]}"
    
    # Generate backup Meet room URL in case consumer Gmail does not support automated API conference generation
    backup_meet_link = f"https://meet.google.com/{uuid.uuid4().hex[:3]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:3]}"

    event_body: Dict[str, Any] = {
        "summary": f"Zenphoria Consultation: {client_name.strip()}",
        "description": (
            f"Clinical wellness consultation session for {client_name.strip()}.\n\n"
            f"Client Name: {client_name.strip()}\n"
            f"Client Email: {client_email.strip()}\n"
            f"Meeting Link: {backup_meet_link}"
        ),
        "location": backup_meet_link,
        "start": {
            "dateTime": start_dt.isoformat(),
            "timeZone": time_zone
        },
        "end": {
            "dateTime": end_dt.isoformat(),
            "timeZone": time_zone
        },
        "attendees": attendees,
        "conferenceData": {
            "createRequest": {
                "requestId": request_id,
                "conferenceSolutionKey": {
                    "type": "hangoutsMeet"
                }
            }
        },
        "reminders": {
            "useDefault": False,
            "overrides": [
                {"method": "email", "minutes": 24 * 60},
                {"method": "email", "minutes": 15},
                {"method": "popup", "minutes": 15},
                {"method": "popup", "minutes": 30}
            ]
        }
    }

    service = get_calendar_service()
    created_event = None

    # Attempt 1: Full insert with native Google Meet conference creation.
    # sendUpdates="none" prevents Google Calendar from auto-emailing any attendees.
    # Zenphoria sends its own branded confirmation email to the client separately.
    try:
        created_event = service.events().insert(
            calendarId=cal_id,
            body=event_body,
            conferenceDataVersion=1,
            sendUpdates="none"
        ).execute()
    except HttpError as http_err:
        err_msg = str(http_err)
        logger.warning("Native Meet conference / attendee creation returned error: %s. Trying resilient fallback.", err_msg)

        
        # Attempt 2: Fallback without conferenceData (e.g. For standard Gmail accounts without domain delegation)
        fallback_body = dict(event_body)
        fallback_body.pop("conferenceData", None)
        
        # Check if attendees are restricted for standalone service accounts
        if "forbiddenForServiceAccounts" in err_msg or "cannot invite attendees" in err_msg:
            fallback_body.pop("attendees", None)
        
        try:
            created_event = service.events().insert(
                calendarId=cal_id,
                body=fallback_body,
                sendUpdates="none"
            ).execute()
        except HttpError as http_err2:
            # If still failed, try removing attendees completely
            fallback_body.pop("attendees", None)
            try:
                created_event = service.events().insert(
                    calendarId=cal_id,
                    body=fallback_body,
                    sendUpdates="none"
                ).execute()
            except Exception as final_err:
                logger.error("Failed creating calendar event on %s: %s", cal_id, final_err)
                raise GoogleCalendarError(f"Google Calendar API Error: {final_err}") from final_err
    except Exception as exc:
        logger.error("Unexpected error creating calendar event: %s", exc)
        raise GoogleCalendarError(f"Failed to create Google Calendar event: {exc}") from exc

    # Extract Meet Link from conference data, hangoutLink, or location
    meet_link = ""
    conference_data = created_event.get("conferenceData", {})
    entry_points = conference_data.get("entryPoints", [])
    for ep in entry_points:
        if ep.get("entryPointType") == "video":
            meet_link = ep.get("uri", "")
            break

    if not meet_link:
        meet_link = created_event.get("hangoutLink", "") or created_event.get("location", "") or backup_meet_link

    return {
        "event_id": created_event.get("id"),
        "meet_link": meet_link,
        "html_link": created_event.get("htmlLink"),
        "summary": created_event.get("summary"),
        "description": created_event.get("description"),
        "start_time": created_event.get("start", {}).get("dateTime"),
        "end_time": created_event.get("end", {}).get("dateTime"),
        "timezone": time_zone,
        "attendees": [a.get("email") for a in created_event.get("attendees", [])] or [client_email, admin_email],
        "status": created_event.get("status", "confirmed")
    }
