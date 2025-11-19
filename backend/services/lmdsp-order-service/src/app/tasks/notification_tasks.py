from celery import shared_task
from app.utils.service_clients import send_notification

@shared_task(name="notify.generic")
def send_generic_notification(recipient_id, title, message):
    send_notification(recipient_id, title, message)
    return f"Notification sent to {recipient_id}."
