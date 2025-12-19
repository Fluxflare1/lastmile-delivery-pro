import smtplib
from email.mime.text import MIMEText
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_email(recipient, subject, message):
    """Send email using SMTP."""
    try:
        msg = MIMEText(message, "plain")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_SENDER_EMAIL
        msg["To"] = recipient

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)

        logger.info(f"[EmailProvider] Email sent to {recipient}")
        return True
    except Exception as e:
        logger.error(f"[EmailProvider] Failed to send email: {e}")
        return False
