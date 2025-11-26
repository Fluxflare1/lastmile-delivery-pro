import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class NotificationClient:
    """Handles posting SLA and route alerts to Notification Service."""

    def __init__(self):
        self.base_url = settings.NOTIFICATION_SERVICE_URL
        self.service_token = settings.SERVICE_TOKENS.get("notification-service")

    def send_alert(self, title, message, severity="info", recipients=None):
        try:
            headers = {
                "Content-Type": "application/json",
                "X-Service-Token": self.service_token,
            }
            payload = {
                "title": title,
                "message": message,
                "severity": severity,
                "recipients": recipients or ["ops@lastmile-delivery-pro.com"],
            }
            url = f"{self.base_url}/api/v1/notify/alerts/"
            res = requests.post(url, json=payload, headers=headers, timeout=5)
            res.raise_for_status()
            logger.info(f"[NotificationClient] Alert sent: {title}")
        except requests.RequestException as e:
            logger.error(f"[NotificationClient] Failed: {e}")
