import os
import json
import urllib.request
import urllib.error
import logging
from dotenv import load_dotenv

logger = logging.getLogger("zenphoria.email")

def build_confirmation_html(name: str, focus_area: str, cadence: str, booking_id: str, meet_link: str = "", scheduled_time_str: str = "") -> str:
    """Builds a concise, highly-standardized HTML email template designed to fit perfectly on mobile screens."""
    time_row = ""
    if scheduled_time_str:
        time_row = f"""
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #697569;">Time:</td>
                        <td align="right" style="padding: 4px 0; font-size: 12.5px; font-weight: 600; color: #2B362B;">
                          {scheduled_time_str}
                        </td>
                      </tr>"""

    meet_cta = ""
    if meet_link:
        meet_cta = f"""
              <!-- Meet Join CTA -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td align="center">
                    <a href="{meet_link}" target="_blank" style="background-color: #1E5128; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 26px; border-radius: 6px; display: inline-block; letter-spacing: 0.02em;">
                      Join Google Meet &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 12px; color: #697569; text-align: center; margin: 0 0 16px;">
                Video Link: <a href="{meet_link}" style="color: #1E5128; word-break: break-all;">{meet_link}</a>
              </p>"""

    return f"""<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmed - Zenphoria</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #2C352C;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F7F5F0" style="table-layout: fixed; padding: 16px 8px;">
    <tr>
      <td align="center">
        <!-- Compact Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 460px; width: 100%; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2DED4; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#1A221A" style="padding: 22px 16px 18px; background-color: #1A221A;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="padding-bottom: 6px;">
                    <img src="https://raw.githubusercontent.com/ajax-mn/zenphoria/main/frontend/public/emblem-gold.png" alt="Zenphoria" width="34" height="34" style="display: block; border: 0; width: 34px; height: 34px; object-fit: contain;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 600; color: #FAF8F5; letter-spacing: 0.1em; text-transform: uppercase; display: block; line-height: 1.1;">Zenphoria</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 3px;">
                    <span style="font-size: 9.5px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #D4AF37; display: block;">Clinical Wellness</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 20px 20px;">
              
              <!-- Greeting -->
              <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 19px; font-weight: 600; color: #1B241B; margin: 0 0 8px; line-height: 1.3;">
                Consultation Confirmed
              </h2>
              
              <p style="font-size: 14px; line-height: 1.5; color: #4A564A; margin: 0 0 16px;">
                Dear <strong>{name}</strong>, your clinical consultation has been reserved in our system.
              </p>

              <!-- Compact Details Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F9F8F4" style="background-color: #F9F8F4; border: 1px solid #E6E2D8; border-radius: 10px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 12px 14px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      
                      <!-- Booking ID -->
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #697569;">Reference:</td>
                        <td align="right" style="padding: 4px 0;">
                          <span style="font-family: 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 12px; font-weight: 600; color: #2B362B; background-color: #EDE8DC; padding: 2px 7px; border-radius: 4px;">
                            {booking_id}
                          </span>
                        </td>
                      </tr>

                      <!-- Focus Area -->
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #697569;">Focus:</td>
                        <td align="right" style="padding: 4px 0; font-size: 12.5px; font-weight: 600; color: #2B362B;">
                          {focus_area}
                        </td>
                      </tr>

                      <!-- Cadence -->
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #697569;">Cadence:</td>
                        <td align="right" style="padding: 4px 0; font-size: 12.5px; font-weight: 600; color: #2B362B;">
                          {cadence}
                        </td>
                      </tr>
{time_row}
                      <!-- Status -->
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #697569;">Status:</td>
                        <td align="right" style="padding: 4px 0;">
                          <span style="background-color: #DCEADC; color: #215421; padding: 2px 8px; border-radius: 10px; font-size: 11.5px; font-weight: 700;">
                            &#10003; Confirmed
                          </span>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

{meet_cta}

              <!-- Next Step Notice -->
              <p style="font-size: 13px; line-height: 1.5; color: #556255; margin: 0 0 18px;">
                A calendar invitation with joining details has also been scheduled. You will receive an automated reminder 10-15 minutes prior to your session.
              </p>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td align="center">
                    <a href="https://www.thezenphoria.com" target="_blank" style="background-color: #2F3D2F; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 22px; border-radius: 6px; display: inline-block;">
                      Open Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="font-size: 12.5px; color: #6E7B6E; margin: 0; line-height: 1.4;">
                Warm regards,<br/>
                <strong style="color: #263326;">The Zenphoria Clinical Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#F2EFE8" style="background-color: #F2EFE8; padding: 14px 16px; border-top: 1px solid #E4DFD5; font-size: 11px; color: #828F82;">
              &copy; 2026 Zenphoria &bull; <a href="https://www.thezenphoria.com" style="color: #586B58; text-decoration: none;">thezenphoria.com</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

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


def send_booking_confirmation_email(to_email: str, name: str, focus_area: str, cadence: str, booking_id: str, meet_link: str = "", scheduled_time_str: str = "") -> bool:
    """Sends HTML email confirmation using Resend API first (HTTPS/Port 443, optimal for Render/cloud deployments), falling back to SMTP if needed."""
    load_dotenv(override=True)
    
    subject = f"Zenphoria Booking Confirmed [{booking_id}]"
    html_content = build_confirmation_html(name, focus_area, cadence, booking_id, meet_link, scheduled_time_str)

    # 1. Primary: Try Resend HTTPS API first
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


def build_session_reminder_html(name: str, focus_area: str, scheduled_time_str: str, meet_link: str, booking_id: str) -> str:
    """Builds a high-priority, mobile-optimized HTML reminder email with Google Meet joining link."""
    return f"""<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Zenphoria Consultation is Starting Now</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #2C352C;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F7F5F0" style="table-layout: fixed; padding: 16px 8px;">
    <tr>
      <td align="center">
        <!-- Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 480px; width: 100%; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2DED4; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#1A221A" style="padding: 22px 16px 18px; background-color: #1A221A;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="padding-bottom: 6px;">
                    <img src="https://raw.githubusercontent.com/ajax-mn/zenphoria/main/frontend/public/emblem-gold.png" alt="Zenphoria" width="34" height="34" style="display: block; border: 0; width: 34px; height: 34px; object-fit: contain;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 600; color: #FAF8F5; letter-spacing: 0.1em; text-transform: uppercase; display: block; line-height: 1.1;">Zenphoria</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 3px;">
                    <span style="font-size: 9.5px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #D4AF37; display: block;">Clinical Wellness</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- High Priority Banner -->
          <tr>
            <td align="center" bgcolor="#E8F4E8" style="background-color: #E8F4E8; padding: 10px 16px; border-bottom: 1px solid #D2E4D2;">
              <span style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #1E5128;">
                &#9654; Consultation Starting Soon
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 22px 20px;">
              
              <!-- Greeting -->
              <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 600; color: #1B241B; margin: 0 0 10px; line-height: 1.3;">
                Your Consultation is Starting
              </h2>
              
              <p style="font-size: 14.5px; line-height: 1.5; color: #4A564A; margin: 0 0 18px;">
                Dear <strong>{name}</strong>, your Zenphoria clinical wellness consultation for <strong>{focus_area}</strong> is scheduled for now ({scheduled_time_str}).
              </p>

              <!-- Prominent Join Video Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="{meet_link}" target="_blank" style="background-color: #2D6A4F; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(45, 106, 79, 0.35);">
                      🎥 Join Google Meet Session &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Direct Link Fallback -->
              <div style="background-color: #F9F8F4; border: 1px solid #E6E2D8; border-radius: 8px; padding: 12px 14px; margin-bottom: 18px; word-break: break-all;">
                <span style="font-size: 11.5px; color: #738073; display: block; margin-bottom: 4px; font-weight: 600;">Direct Meeting Link:</span>
                <a href="{meet_link}" target="_blank" style="font-size: 13px; color: #2D6A4F; font-weight: 600; text-decoration: underline;">
                  {meet_link}
                </a>
              </div>

              <!-- Session Checklist -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td style="font-size: 12.5px; line-height: 1.6; color: #5C6A5C;">
                    &bull; <strong>Quiet Space</strong>: Ensure a comfortable, private environment.<br/>
                    &bull; <strong>Audio & Video</strong>: Please test your microphone and camera before entering the room.<br/>
                    &bull; <strong>Reference ID</strong>: <code style="background-color: #EFEBE2; padding: 1px 5px; border-radius: 3px;">{booking_id}</code>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="font-size: 12.5px; color: #6E7B6E; margin: 0; line-height: 1.4; border-top: 1px solid #ECE7DC; padding-top: 14px;">
                We look forward to speaking with you,<br/>
                <strong style="color: #263326;">The Zenphoria Clinical Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#F2EFE8" style="background-color: #F2EFE8; padding: 14px 16px; border-top: 1px solid #E4DFD5; font-size: 11px; color: #828F82;">
              &copy; 2026 Zenphoria &bull; <a href="https://www.thezenphoria.com" style="color: #586B58; text-decoration: none;">thezenphoria.com</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def send_session_reminder_email(
    to_email: str,
    name: str,
    focus_area: str,
    scheduled_time_str: str,
    meet_link: str,
    booking_id: str
) -> bool:
    """Sends high-priority session reminder email with Google Meet video link."""
    load_dotenv(override=True)
    
    subject = f"🚨 Your Zenphoria Consultation is Starting Now [Google Meet Link]"
    html_content = build_session_reminder_html(name, focus_area, scheduled_time_str, meet_link, booking_id)

    # 1. Primary: Try Resend HTTPS API first
    if os.getenv("RESEND_API_KEY"):
        print(f"[REMINDER SERVICE] Attempting reminder delivery via Resend API to {to_email}...")
        if send_via_resend(to_email, subject, html_content):
            return True
        print(f"[REMINDER SERVICE] Resend failed for reminder to {to_email}. Trying SMTP fallback...")

    # 2. Fallback: Try Gmail/Custom SMTP
    if os.getenv("SMTP_USER") and os.getenv("SMTP_PASSWORD"):
        print(f"[REMINDER SERVICE] Attempting reminder delivery via SMTP to {to_email}...")
        if send_via_smtp(to_email, subject, html_content):
            return True

    print(f"[REMINDER SERVICE] Failed to deliver session reminder email to {to_email}.")
    return False


def build_admin_booking_notification_html(
    client_name: str,
    client_email: str,
    focus_area: str,
    scheduled_time_str: str,
    meet_link: str,
    booking_id: str,
    notes: str = ""
) -> str:
    """Builds a mobile-optimized notification email for the Admin with full client details and Google Meet link."""
    notes_row = ""
    if notes and notes.strip():
        notes_row = f"""
                      <tr>
                        <td style="padding: 6px 0; font-size: 12.5px; color: #697569; vertical-align: top;">Notes:</td>
                        <td align="right" style="padding: 6px 0; font-size: 12.5px; color: #2B362B; max-width: 250px;">
                          {notes.strip()}
                        </td>
                      </tr>"""

    return f"""<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Consultation Booked - Zenphoria Admin</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #2C352C;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F7F5F0" style="table-layout: fixed; padding: 16px 8px;">
    <tr>
      <td align="center">
        <!-- Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; width: 100%; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2DED4; box-shadow: 0 4px 18px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#1A221A" style="padding: 22px 16px 18px; background-color: #1A221A;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="padding-bottom: 6px;">
                    <img src="https://raw.githubusercontent.com/ajax-mn/zenphoria/main/frontend/public/emblem-gold.png" alt="Zenphoria" width="34" height="34" style="display: block; border: 0; width: 34px; height: 34px; object-fit: contain;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 600; color: #FAF8F5; letter-spacing: 0.1em; text-transform: uppercase; display: block; line-height: 1.1;">Zenphoria</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 3px;">
                    <span style="font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #D4AF37; display: block;">Practitioner Admin Alert</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" bgcolor="#EBF4EE" style="background-color: #EBF4EE; padding: 10px 16px; border-bottom: 1px solid #D5E5D8;">
              <span style="font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #1E5128;">
                &#10003; New Client Consultation Scheduled
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 22px 20px;">
              <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 19px; font-weight: 600; color: #1B241B; margin: 0 0 14px; line-height: 1.3;">
                Consultation Details
              </h2>

              <!-- Details Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F9F8F4" style="background-color: #F9F8F4; border: 1px solid #E6E2D8; border-radius: 10px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 5px 0; font-size: 12.5px; color: #697569;">Client Name:</td>
                        <td align="right" style="padding: 5px 0; font-size: 13px; font-weight: 700; color: #2B362B;">
                          {client_name}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 12.5px; color: #697569;">Client Email:</td>
                        <td align="right" style="padding: 5px 0; font-size: 12.5px; font-weight: 600; color: #2B362B;">
                          <a href="mailto:{client_email}" style="color: #2D6A4F; text-decoration: none;">{client_email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 12.5px; color: #697569;">Scheduled Time:</td>
                        <td align="right" style="padding: 5px 0; font-size: 12.5px; font-weight: 700; color: #1E5128;">
                          {scheduled_time_str}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 12.5px; color: #697569;">Focus Area:</td>
                        <td align="right" style="padding: 5px 0; font-size: 12.5px; font-weight: 600; color: #2B362B;">
                          {focus_area}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 12.5px; color: #697569;">Booking Reference:</td>
                        <td align="right" style="padding: 5px 0;">
                          <span style="font-family: monospace; font-size: 12px; font-weight: 600; color: #2B362B; background-color: #EDE8DC; padding: 2px 7px; border-radius: 4px;">
                            {booking_id}
                          </span>
                        </td>
                      </tr>
{notes_row}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Google Meet Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td align="center">
                    <a href="{meet_link}" target="_blank" style="background-color: #1E5128; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 28px; border-radius: 8px; display: inline-block; letter-spacing: 0.02em;">
                      Start Google Meet Session &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #697569; text-align: center; margin: 0 0 16px;">
                Host Video Link: <a href="{meet_link}" style="color: #1E5128; word-break: break-all;">{meet_link}</a>
              </p>

              <!-- Footer note -->
              <p style="font-size: 12px; color: #828F82; margin: 0; line-height: 1.4; border-top: 1px solid #ECE7DC; padding-top: 14px;">
                This event has been placed on your Google Calendar. You will also receive an automated reminder 10–15 minutes before the session starts.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#F2EFE8" style="background-color: #F2EFE8; padding: 14px 16px; border-top: 1px solid #E4DFD5; font-size: 11px; color: #828F82;">
              Zenphoria Clinical Management System &bull; <a href="https://www.thezenphoria.com" style="color: #586B58; text-decoration: none;">thezenphoria.com</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def send_admin_booking_notification_email(
    admin_email: str,
    client_name: str,
    client_email: str,
    focus_area: str,
    scheduled_time_str: str,
    meet_link: str,
    booking_id: str,
    notes: str = ""
) -> bool:
    """Dispatches a notification email directly to the Admin with new booking details and the Google Meet host link."""
    load_dotenv(override=True)
    target_email = admin_email.strip()
    if not target_email or "@" not in target_email:
        target_email = os.getenv("ADMIN_EMAIL", "ajaxmillenian@gmail.com").strip()

    subject = f"📅 New Consultation Booked: {client_name} [{scheduled_time_str}]"
    html_content = build_admin_booking_notification_html(
        client_name=client_name,
        client_email=client_email,
        focus_area=focus_area,
        scheduled_time_str=scheduled_time_str,
        meet_link=meet_link,
        booking_id=booking_id,
        notes=notes
    )

    # 1. Primary: Try Resend HTTPS API
    if os.getenv("RESEND_API_KEY"):
        print(f"[ADMIN EMAIL] Attempting admin notification via Resend to {target_email}...")
        if send_via_resend(target_email, subject, html_content):
            return True
        print(f"[ADMIN EMAIL] Resend failed for {target_email}. Trying SMTP fallback...")

    # 2. Fallback: Try Gmail/Custom SMTP
    if os.getenv("SMTP_USER") and os.getenv("SMTP_PASSWORD"):
        print(f"[ADMIN EMAIL] Attempting admin notification via SMTP to {target_email}...")
        if send_via_smtp(target_email, subject, html_content):
            return True

    print(f"[ADMIN EMAIL] Failed to deliver admin notification email to {target_email}.")
    return False

