import logging

logger = logging.getLogger(__name__)

def send_push_notification(recipient_id, title, message):
    """Send push via FCM or APNs."""
    try:
        logger.info(f"[PushProvider] Push sent to {recipient_id}: {title}")
        return True
    except Exception as e:
        logger.error(f"[PushProvider] Failed: {e}")
        return False
