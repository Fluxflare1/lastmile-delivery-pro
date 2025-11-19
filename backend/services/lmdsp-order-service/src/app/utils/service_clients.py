import requests
import os

IDENTITY_SERVICE_URL = os.getenv("IDENTITY_SERVICE_URL", "http://identity-service:8000")
DISPATCH_SERVICE_URL = os.getenv("DISPATCH_SERVICE_URL", "http://dispatch-service:8003")
TRACKING_SERVICE_URL = os.getenv("TRACKING_SERVICE_URL", "http://tracking-service:8004")
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8005")

def notify_dispatch_service(order_id, tenant_id):
    payload = {"order_id": str(order_id), "tenant_id": str(tenant_id)}
    requests.post(f"{DISPATCH_SERVICE_URL}/api/v1/dispatch/assign/", json=payload, timeout=10)

def update_tracking(order_id, status):
    payload = {"order_id": str(order_id), "status": status}
    requests.post(f"{TRACKING_SERVICE_URL}/api/v1/tracking/update/", json=payload, timeout=10)

def send_notification(recipient_id, title, message):
    payload = {"recipient_id": str(recipient_id), "title": title, "message": message}
    requests.post(f"{NOTIFICATION_SERVICE_URL}/api/v1/notify/", json=payload, timeout=10)
