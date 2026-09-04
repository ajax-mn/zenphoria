import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

logger = logging.getLogger("zenphoria.email")

def build_confirmation_html(name: str, focus_area: str, cadence: str, booking_id: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9F8F3; color: #4E574E; margin: 0; padding: 20px; }}
        .email-container {{ max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2DFD4; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }}
        .header {{ background-color: #202420; color: #FAF9F6; padding: 28px 24px; text-align: center; }}
        .logo {{ font-family: Georgia, serif; font-size: 28px; font-weight: 500; letter-spacing: 0.05em; }}
        .sub-logo {{ font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #A4AAA4; margin-top: 4px; }}
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
          (c) 2024 Zenphoria. Psychological education for the modern era.
        </div>
      </div>
    </body>
    </html>
    """

def send_booking_confirmation_email(to_email: str, name: str, focus_area: str, cadence: str, booking_id: str):
    """Sends HTML email confirmation to client via SMTP or logs simulation when SMTP is unconfigured."""
    load_dotenv(override=True)
    
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    emails_from_email = os.getenv("EMAILS_FROM_EMAIL", smtp_user or "support@zenphoria.com")
    emails_from_name = os.getenv("EMAILS_FROM_NAME", "Zenphoria Clinical Wellness")

    subject = f"Zenphoria Booking Confirmed [{booking_id}]"
    html_content = build_confirmation_html(name, focus_area, cadence, booking_id)

    if smtp_host and smtp_user and smtp_password:
        try:
            print(f"[EMAIL SERVICE] Connecting to {smtp_host}:{smtp_port} for {to_email}...")
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{emails_from_name} <{emails_from_email}>"
            msg["To"] = to_email

            part = MIMEText(html_content, "html")
            msg.attach(part)

            server = smtplib.SMTP(smtp_host, smtp_port, timeout=15)
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(emails_from_email, [to_email], msg.as_string())
            server.quit()

            print(f"[EMAIL SERVICE] SUCCESS: Live confirmation email sent to {to_email} from {emails_from_email} via SMTP ({smtp_host})!")
            return True
        except Exception as e:
            print(f"[EMAIL SERVICE] ERROR sending live email via SMTP: {e}")
            return False
    else:
        print("==================================================")
        print("[EMAIL SERVICE] CONFIRMATION EMAIL TRIGGERED:")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Booking ID: {booking_id} | Client: {name} | Focus: {focus_area} | Cadence: {cadence}")
        print("==================================================")
        return True
