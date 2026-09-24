import os
import json
import urllib.request
import urllib.error
import logging
from dotenv import load_dotenv

logger = logging.getLogger("zenphoria.email")

def build_confirmation_html(name: str, focus_area: str, cadence: str, booking_id: str) -> str:
    """Builds a luxury, highly-standardized HTML email template compatible with all email clients."""
    return f"""<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Zenphoria Consultation Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #3A453A;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F6F4EE" style="table-layout: fixed; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" max-width="580" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E5E0D4; box-shadow: 0 8px 30px rgba(45, 55, 45, 0.06);">
          
          <!-- Top Header Banner -->
          <tr>
            <td align="center" bgcolor="#1D241D" style="padding: 36px 24px 30px; background-color: #1D241D; border-bottom: 2px solid #334033;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <img src="https://raw.githubusercontent.com/ajax-mn/zenphoria/main/frontend/public/emblem-gold.png" alt="Zenphoria Emblem" width="46" height="46" style="display: block; border: 0; width: 46px; height: 46px; object-fit: contain;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; color: #FAF8F5; letter-spacing: 0.12em; text-transform: uppercase; display: block; line-height: 1.2;">Zenphoria</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 6px;">
                    <span style="font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #D4AF37; display: block;">Psychological Education &bull; Clinical Wellness</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px;">
              
              <!-- Status Pill Badge -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td bgcolor="#EAF2EA" style="background-color: #EAF2EA; border: 1px solid #C8DEC8; border-radius: 20px; padding: 6px 14px;">
                    <span style="font-size: 11.5px; font-weight: 700; color: #2D5A2D; letter-spacing: 0.08em; text-transform: uppercase;">&#10003; Session Confirmed</span>
                  </td>
                </tr>
              </table>

              <!-- Salutation and Greeting -->
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 500; color: #1E271E; margin: 0 0 16px; line-height: 1.25;">
                Dear {name},
              </h1>
              
              <p style="font-size: 15px; line-height: 1.65; color: #4A554A; margin: 0 0 28px;">
                Thank you for scheduling your preliminary clinical consultation with Zenphoria. Your session details have been recorded in our secure practitioner registry.
              </p>

              <!-- Reservation Summary Card (Table Based for 100% Email Compatibility) -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FAF8F3" style="background-color: #FAF8F3; border: 1px solid #E6E1D3; border-radius: 12px; margin-bottom: 28px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px 10px; border-bottom: 1px solid #ECE7DA;">
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #788578;">Reservation Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      
                      <!-- Booking Reference -->
                      <tr>
                        <td width="42%" style="padding: 8px 0; font-size: 13.5px; font-weight: 600; color: #2B362B; vertical-align: middle;">
                          Booking Reference
                        </td>
                        <td width="58%" align="right" style="padding: 8px 0; vertical-align: middle;">
                          <span style="background-color: #EDE8DC; color: #3E4B3E; padding: 4px 10px; border-radius: 6px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12.5px; font-weight: 600; border: 1px solid #DCD5C5;">
                            {booking_id}
                          </span>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td colspan="2" style="border-top: 1px solid #EFEAE0; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td>
                      </tr>

                      <!-- Focus Area -->
                      <tr>
                        <td width="42%" style="padding: 8px 0; font-size: 13.5px; font-weight: 600; color: #2B362B; vertical-align: middle;">
                          Focus Area
                        </td>
                        <td width="58%" align="right" style="padding: 8px 0; font-size: 13.5px; color: #435043; font-weight: 500; vertical-align: middle;">
                          {focus_area}
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td colspan="2" style="border-top: 1px solid #EFEAE0; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td>
                      </tr>

                      <!-- Cadence -->
                      <tr>
                        <td width="42%" style="padding: 8px 0; font-size: 13.5px; font-weight: 600; color: #2B362B; vertical-align: middle;">
                          Session Cadence
                        </td>
                        <td width="58%" align="right" style="padding: 8px 0; font-size: 13.5px; color: #435043; font-weight: 500; vertical-align: middle;">
                          {cadence}
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td colspan="2" style="border-top: 1px solid #EFEAE0; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td>
                      </tr>

                      <!-- Status -->
                      <tr>
                        <td width="42%" style="padding: 8px 0; font-size: 13.5px; font-weight: 600; color: #2B362B; vertical-align: middle;">
                          Booking Status
                        </td>
                        <td width="58%" align="right" style="padding: 8px 0; vertical-align: middle;">
                          <span style="background-color: #D9E8D9; color: #245224; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; display: inline-block;">
                            Confirmed
                          </span>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Timeline Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FBF9F5" style="background-color: #FBF9F5; border: 1px solid #EDE8DE; border-radius: 12px; margin-bottom: 28px; padding: 18px 20px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #7B887B;">What Happens Next</span>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 13.5px; line-height: 1.6; color: #485448;">
                    <div style="margin-bottom: 8px;">&bull; <strong>Practitioner Review:</strong> A clinical specialist will review your intake notes to tailor the session framework.</div>
                    <div style="margin-bottom: 8px;">&bull; <strong>Calendar Invitation:</strong> You will receive a direct calendar invitation with the private consultation link.</div>
                    <div>&bull; <strong>Confidentiality:</strong> All interactions adhere to clinical data protection standards.</div>
                  </td>
                </tr>
              </table>

              <!-- Visit Website CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" bgcolor="#324032" style="background-color: #324032; border-radius: 8px;">
                          <a href="https://www.thezenphoria.com" target="_blank" style="font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; padding: 13px 26px; display: inline-block; letter-spacing: 0.03em;">
                            Visit Zenphoria Portal &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 14px; line-height: 1.6; color: #546054;">
                    Warm regards,<br/>
                    <strong style="color: #212C21;">The Zenphoria Clinical Team</strong><br/>
                    <span style="font-size: 12px; color: #8A968A;">zenphoria.clinical@thezenphoria.com</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td align="center" bgcolor="#F4F1EA" style="background-color: #F4F1EA; padding: 24px 20px; border-top: 1px solid #E5E0D5; font-size: 11.5px; line-height: 1.6; color: #7B877B;">
              <div style="margin-bottom: 4px;">&copy; 2026 Zenphoria. All rights reserved.</div>
              <div>Psychological education & clinical wellness for the modern era.</div>
              <div style="margin-top: 6px; font-size: 10.5px; color: #9AA49A;">This message was generated automatically for your registered consultation request.</div>
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

