import requests
import math
from celery import shared_task
from django.utils import timezone
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.conf import settings
from app.models.tracking import Courier, OrderRoute, SLAEvent

NOTIFICATION_URL = f"{settings.NOTIFICATION_SERVICE_URL}/api/v1/notify/sla/"
SERVICE_TOKEN = settings.SERVICE_TOKENS.get("notification-service")


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points (km)."""
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


@shared_task(name="tracking.check_sla_compliance")
def check_sla_compliance(courier_id):
    """Check SLA compliance for all active orders of a courier."""
    try:
        courier = Courier.objects.get(id=courier_id)
        routes = OrderRoute.objects.filter(courier=courier, status="in_progress")
        now = timezone.now()

        for route in routes:
            if route.started_at:
                elapsed = (now - route.started_at).total_seconds() / 60
                sla_minutes = route.expected_sla_minutes or 60
                if elapsed > sla_minutes:
                    event = SLAEvent.objects.create(
                        route=route,
                        event_type="SLA_BREACH",
                        notes=f"Exceeded SLA: {elapsed:.1f} minutes",
                    )
                    send_sla_alert(event)
                    route.status = "delayed"
                    route.save(update_fields=["status"])

    except Courier.DoesNotExist:
        pass
    except Exception as e:
        print(f"[SLA_CHECK_ERROR] {e}")


@shared_task(name="tracking.detect_route_deviation")
def detect_route_deviation(courier_id):
    """Detect route deviation using geospatial distance checks."""
    try:
        courier = Courier.objects.get(id=courier_id)
        route = OrderRoute.objects.filter(courier=courier, status="in_progress").first()
        if not route or not route.current_point or not route.end_point:
            return

        # Distance from expected path
        current = route.current_point
        end = route.end_point
        deviation_distance = current.distance(end) * 100  # in meters

        if deviation_distance > 300:  # 300m deviation threshold
            event = SLAEvent.objects.create(
                route=route,
                event_type="ROUTE_DEVIATION",
                deviation_distance=deviation_distance,
                notes=f"Courier deviated {deviation_distance:.2f}m from path",
            )
            send_sla_alert(event)

    except Exception as e:
        print(f"[ROUTE_DEVIATION_ERROR] {e}")


def send_sla_alert(event):
    """Notify Notification Service about SLA event."""
    payload = {
        "route_id": str(event.route.id),
        "event_type": event.event_type,
        "notes": event.notes,
        "timestamp": str(event.event_time),
    }

    headers = {
        "Content-Type": "application/json",
        "X-Service-Token": SERVICE_TOKEN,
    }

    try:
        response = requests.post(NOTIFICATION_URL, json=payload, headers=headers, timeout=5)
        response.raise_for_status()
        print(f"[SLA_ALERT_SENT] {payload}")
    except requests.RequestException as e:
        print(f"[SLA_ALERT_FAILED] {e}")
