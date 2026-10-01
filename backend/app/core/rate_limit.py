"""
Lightweight In-Memory Rate Limiting and Bot Protection Middleware/Dependency.
Protects sensitive endpoints (admin login, booking registration) from brute force and automated spam.
"""

import time
from collections import defaultdict
from typing import Dict, List
from fastapi import HTTPException, Request, status

# In-memory request timestamp tracking: { (identifier, action): [timestamps] }
_REQUEST_HISTORY: Dict[str, List[float]] = defaultdict(list)


def check_rate_limit(
    request: Request,
    max_requests: int = 5,
    window_seconds: int = 60,
    action: str = "default"
) -> bool:
    """
    Checks if client IP has exceeded max_requests within window_seconds.
    Raises HTTPException(429) if limit exceeded.
    """
    # Extract client IP (handle proxy headers like X-Forwarded-For if behind reverse proxy/Render)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"

    key = f"{client_ip}:{action}"
    now = time.time()
    cutoff = now - window_seconds

    # Filter timestamps to current window
    history = [t for t in _REQUEST_HISTORY[key] if t > cutoff]
    
    if len(history) >= max_requests:
        retry_after = int(window_seconds - (now - history[0])) + 1
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded for {action}. Please wait {retry_after} seconds before trying again.",
            headers={"Retry-After": str(max(1, retry_after))}
        )

    # Record current attempt
    history.append(now)
    _REQUEST_HISTORY[key] = history
    return True
