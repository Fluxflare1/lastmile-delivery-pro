import requests
import os
from datetime import datetime

def trigger_webhook(event_type, data):
    """
    Generic webhook trigger for order events.
    """
    webhook_url = os.getenv("ORDER_WEBHOOK_URL")
    if not webhook_url:
        return False

    payload = {
        "event": event_type,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }

    try:
        requests.post(webhook_url, json=payload, timeout=10)
        return True
    except Exception as e:
        print(f"Webhook trigger failed: {e}")
        return False
