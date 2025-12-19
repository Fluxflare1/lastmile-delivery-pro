import logging

logger = logging.getLogger(__name__)

def send_sms(recipient, message):
    """Send SMS using an external API provider (stub)."""
    try:
        # Replace with Twilio or other provider integration
        logger.info(f"[SMSProvider] Sending SMS to {recipient}: {message}")
        return True
    except Exception as e:
        logger.error(f"[SMSProvider] Failed: {e}")
        return False
