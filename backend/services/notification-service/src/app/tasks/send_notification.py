from celery import shared_task
from app.models.notification import Notification
from app.integrations.email_provider import send_email
from app.integrations.sms_provider import send_sms
from app.integrations.push_provider import send_push_notification
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task(name="notification.send_message")
def send_message(notification_id):
    """Send a notification asynchronously."""
    try:
        notification = Notification.objects.get(id=notification_id)
        success = False

        if notification.channel == "email":
            success = send_email(notification.recipient, notification.title, notification.message)
        elif notification.channel == "sms":
            success = send_sms(notification.recipient, notification.message)
        elif notification.channel == "push":
            success = send_push_notification(notification.recipient, notification.title, notification.message)

        if success:
            notification.status = "sent"
            notification.sent_at = timezone.now()
        else:
            notification.status = "failed"

        notification.save()
        logger.info(f"[NotificationTask] Notification {notification.id} -> {notification.status}")
    except Exception as e:
        logger.error(f"[NotificationTask] Error: {e}")
