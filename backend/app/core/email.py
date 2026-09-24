import os
import json
import urllib.request
import urllib.error
import logging
from dotenv import load_dotenv

logger = logging.getLogger("zenphoria.email")

def build_confirmation_html(name: str, focus_area: str, cadence: str, booking_id: str) -> str:
    """Builds the luxury editorial HTML email template for Zenphoria."""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9F8F3; color: #4E574E; margin: 0; padding: 20px; }}
        .email-container {{ max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2DFD4; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }}
        .header {{ background-color: #202420; color: #FAF9F6; padding: 28px 24px; text-align: center; }}
        .header-logo-img {{ width: 48px; height: 48px; object-fit: contain; margin-bottom: 8px; }}
        .logo {{ font-family: Georgia, serif; font-size: 26px; font-weight: 500; letter-spacing: 0.04em; color: #FAF9F6; }}
        .sub-logo {{ font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #D4AF37; margin-top: 4px; }}
        .content {{ padding: 32px 28px; }}
        .greeting {{ font-family: Georgia, serif; font-size: 22px; color: #2B372B; margin-bottom: 12px; }}
        .text {{ font-size: 15px; line-height: 1.6; color: #4E574E; margin-bottom: 24px; }}
        .details-card {{ background-color: #F2EFE8; border-radius: 12px; padding: 20px; border: 1px solid #E2DFD4; margin-bottom: 24px; }}
        .detail-row {{ display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }}
        .detail-label {{ font-weight: 600; color: #2B372B; }}
        .detail-value {{ color: #4E574E; }}
        .badge {{ background-color: #DCE5DC; color: #3A4B3A; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
        .footer {{ background-color: #F9F8F3; padding: 20px 24px; text-align: center; font-size: 12px; color: #788378; border-top: 1px solid #E2DFD4; }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="https://raw.githubusercontent.com/ajax-mn/zenphoria/main/frontend/public/emblem-gold.png" alt="Zenphoria" class="header-logo-img" />
          <div class="logo">Zenphoria</div>
          <div class="sub-logo">Psychological Education & Clinical Wellness</div>
        </div>
        <div class="content">
          <div class="greeting">Booking Confirmed</div>
          <p class="text">
            Dear {name},<br><br>
            Thank you for scheduling your preliminary clinical consultation with Zenphoria. Your session details have been recorded in our clinical database.
          </p>

          <div class="details-card">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #788378; margin-bottom: 14px;">Reservation Summary</div>
            <div class="detail-row">
              <span class="detail-label">Booking Reference:</span>
              <span class="detail-value" style="font-family: monospace;">{booking_id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Focus Area:</span>
              <span class="detail-value">{focus_area}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Cadence:</span>
              <span class="detail-value">{cadence}</span>
            </div>
            <div class="detail-row" style="margin-bottom: 0;">
              <span class="detail-label">Status:</span>
              <span class="badge">Confirmed</span>
            </div>
          </div>

          <p class="text">
            A clinical practitioner will review your pre-session notes and reach out with your calendar invitation link.
          </p>

          <p class="text" style="margin-bottom: 0;">
            Warm regards,<br>
            <strong>The Zenphoria Clinical Team</strong>
          </p>
        </div>

        <div class="footer">
          &copy; 2024 Zenphoria. Psychological education for the modern era.
        </div>
      </div>
    </body>
    </html>
    """

def send_via_smtp(to_email: str, subject: str, html_content: str) -> bool:
    """Sends email via standard SMTP (e.g. Gmail SSL/TLS)."""
    import smtplib
    import ssl
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "465"))
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_pass = os.getenv("SMTP_PASSWORD", "").strip()
    from_name = os.getenv("EMAILS_FROM_NAME", "Zenphoria Clinical Wellness").strip()

    if not (smtp_host and smtp_user and smtp_pass):
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{from_name} <{smtp_user}>"
        msg["To"] = to_email
        msg.attach(MIMEText(html_content, "html"))

        if smtp_port == 465:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=15) as server:
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [to_email], msg.as_string())

        print(f"[EMAIL SERVICE] SUCCESS: Email sent to {to_email} via SMTP ({smtp_host})!")
        return True
    except Exception as e:
        print(f"[EMAIL SERVICE] SMTP error sending to {to_email}: {e}")
        return False


def send_via_resend(to_email: str, subject: str, html_content: str) -> bool:
    """Sends email via Resend HTTPS API with resilient headers and domain validation fallback."""
    resend_api_key = os.getenv("RESEND_API_KEY", "").strip()
    emails_from_name = os.getenv("EMAILS_FROM_NAME", "Zenphoria Clinical Wellness").strip()
    emails_from_email = os.getenv("EMAILS_FROM_EMAIL", "onboarding@resend.dev").strip()

    if not resend_api_key:
        return False

    def _execute_resend_call(sender_addr: str) -> tuple[bool, int, str]:
        url = "https://api.resend.com/emails"
        from_header = f"{emails_from_name} <{sender_addr}>" if sender_addr != "onboarding@resend.dev" else "onboarding@resend.dev"
        payload = {
            "from": from_header,
            "to": [to_email],
            "subject": subject,
            "html": html_content
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                res_body = response.read().decode("utf-8")
                return True, 200, res_body
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8")
            return False, e.code, err_body
        except Exception as e:
            return False, 500, str(e)

    # 1. Attempt with configured domain email (e.g. consultation@thezenphoria.com)
    primary_sender = emails_from_email if ("@" in emails_from_email and not emails_from_email.endswith("@gmail.com")) else "onboarding@resend.dev"
    success, code, msg = _execute_resend_call(primary_sender)

    if success:
        print(f"[EMAIL SERVICE] SUCCESS: Confirmation email sent to {to_email} via Resend ({primary_sender})! {msg}")
        return True

    print(f"[EMAIL SERVICE] Resend delivery with '{primary_sender}' returned code {code}: {msg}")

    # 2. If rejected because domain is unverified (code 403), retry with onboarding@resend.dev
    if primary_sender != "onboarding@resend.dev" and code == 403:
        print("[EMAIL SERVICE] Domain not yet verified in Resend dashboard. Retrying via onboarding@resend.dev...")
        success_fallback, fb_code, fb_msg = _execute_resend_call("onboarding@resend.dev")
        if success_fallback:
            print(f"[EMAIL SERVICE] SUCCESS: Delivered via Resend fallback (onboarding@resend.dev) to {to_email}!")
            return True
        print(f"[EMAIL SERVICE] Resend fallback also failed ({fb_code}): {fb_msg}")

    return False


def send_booking_confirmation_email(to_email: str, name: str, focus_area: str, cadence: str, booking_id: str) -> bool:
    """Sends HTML email confirmation using Resend API first (HTTPS/Port 443, optimal for Render/cloud deployments), falling back to SMTP if needed."""
    load_dotenv(override=True)
    
    subject = f"Zenphoria Booking Confirmed [{booking_id}]"
    html_content = build_confirmation_html(name, focus_area, cadence, booking_id)

    # 1. Primary: Try Resend HTTPS API first (optimal for cloud hosts like Render where outbound SMTP ports may be restricted)
    if os.getenv("RESEND_API_KEY"):
        print(f"[EMAIL SERVICE] Attempting primary delivery via Resend API to {to_email}...")
        if send_via_resend(to_email, subject, html_content):
            return True
        print(f"[EMAIL SERVICE] Resend delivery failed or restricted for {to_email}. Trying SMTP fallback...")

    # 2. Fallback: Try Gmail/Custom SMTP if Resend is unavailable or fails
    if os.getenv("SMTP_USER") and os.getenv("SMTP_PASSWORD"):
        print(f"[EMAIL SERVICE] Attempting fallback delivery via SMTP to {to_email}...")
        if send_via_smtp(to_email, subject, html_content):
            return True

    print("==================================================")
    print(f"[EMAIL SERVICE] Failed to deliver email to {to_email}. Both Resend and SMTP fallback failed.")
    print(f"Booking ID: {booking_id} | Client: {name}")
    print("==================================================")
    return False

