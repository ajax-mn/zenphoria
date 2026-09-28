"""
One-Time Google OAuth 2.0 Authorization Script for Zenphoria Admin.

Generates `credentials/token.json` with an offline refresh token so the backend can 
create real Google Meet sessions permanently without re-prompting.
"""

import os
import sys
from google_auth_oauthlib.flow import InstalledAppFlow

# Force unbuffered stdout
sys.stdout.reconfigure(line_buffering=True)

SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events"
]

def main():
    print("=" * 70, flush=True)
    print("Zenphoria Google OAuth 2.0 Authorization", flush=True)
    print("=" * 70, flush=True)

    credentials_dir = os.path.join(os.path.dirname(__file__), "credentials")
    os.makedirs(credentials_dir, exist_ok=True)

    client_secrets_path = os.path.join(credentials_dir, "client_secret.json")
    token_path = os.path.join(credentials_dir, "token.json")

    if not os.path.exists(client_secrets_path):
        print(f"[!] Error: Client secrets file not found at {client_secrets_path}", flush=True)
        sys.exit(1)

    print(f"[+] Loaded client credentials from: {client_secrets_path}", flush=True)

    flow = InstalledAppFlow.from_client_secrets_file(
        client_secrets_path,
        scopes=SCOPES
    )

    print("\n[+] Waiting for authorization in your browser on port 8085...", flush=True)
    creds = flow.run_local_server(
        port=8085,
        access_type="offline",
        prompt="consent",
        open_browser=True
    )

    with open(token_path, "w") as token_file:
        token_file.write(creds.to_json())

    print("\n" + "=" * 70, flush=True)
    print(f"SUCCESS! Authorized credentials with refresh token saved to:\n{token_path}", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    main()
