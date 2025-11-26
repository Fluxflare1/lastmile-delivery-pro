import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class AnalyticsClient:
    """Handles posting courier tracking & SLA metrics to the Analytics Service."""

    def __init__(self):
        self.base_url = settings.ANALYTICS_SERVICE_URL
        self.service_token = settings.SERVICE_TOKENS.get("analytics-service")

    def send_event(self, event_type: str, payload: dict):
        try:
            headers = {
                "Content-Type": "application/json",
                "X-Service-Token": self.service_token,
            }
            url = f"{self.base_url}/api/v1/analytics/events/"
            res = requests.post(url, json={"event_type": event_type, "data": payload}, headers=headers, timeout=5)
            res.raise_for_status()
            logger.info(f"[AnalyticsClient] Event sent: {event_type}")
        except requests.RequestException as e:
            logger.error(f"[AnalyticsClient] Failed: {e}")
