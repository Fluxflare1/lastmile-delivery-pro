from celery import shared_task
from django.utils import timezone
from app.models.tracking import CourierLocation
from app.integrations.analytics_client import AnalyticsClient

analytics = AnalyticsClient()

@shared_task(name="tracking.sync_hourly_courier_stats")
def sync_hourly_courier_stats():
    """Sync hourly courier performance summary to analytics service."""
    from datetime import timedelta
    since = timezone.now() - timedelta(hours=1)
    recent_locations = CourierLocation.objects.filter(timestamp__gte=since)

    grouped = {}
    for loc in recent_locations:
        courier_id = str(loc.courier.id)
        grouped.setdefault(courier_id, []).append(loc)

    for courier_id, locations in grouped.items():
        payload = {
            "courier_id": courier_id,
            "num_updates": len(locations),
            "active_duration_minutes": len(locations) * 2,  # assuming 2-min GPS interval
        }
        analytics.send_event("hourly_courier_summary", payload)
