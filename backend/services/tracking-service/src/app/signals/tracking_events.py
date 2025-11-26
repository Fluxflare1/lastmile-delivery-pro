from django.db.models.signals import post_save
from django.dispatch import receiver
from app.models.tracking import SLAEvent, CourierLocation
from app.integrations.analytics_client import AnalyticsClient
from app.integrations.notification_client import NotificationClient

analytics = AnalyticsClient()
notify = NotificationClient()


@receiver(post_save, sender=SLAEvent)
def handle_sla_event(sender, instance, created, **kwargs):
    """Handle SLA breaches or route deviations."""
    if not created:
        return

    event_data = {
        "route_id": str(instance.route.id),
        "courier_id": str(instance.route.courier.id),
        "type": instance.event_type,
        "notes": instance.notes,
        "timestamp": str(instance.event_time),
    }

    analytics.send_event("sla_event", event_data)

    if instance.event_type == "SLA_BREACH":
        notify.send_alert(
            title="SLA Breach Detected",
            message=f"Courier {instance.route.courier.name} exceeded SLA limit on route {instance.route.id}.",
            severity="critical",
        )

    elif instance.event_type == "ROUTE_DEVIATION":
        notify.send_alert(
            title="Route Deviation Alert",
            message=f"Courier {instance.route.courier.name} deviated from route by {instance.deviation_distance:.2f}m.",
            severity="warning",
        )


@receiver(post_save, sender=CourierLocation)
def handle_location_update(sender, instance, created, **kwargs):
    """Send courier movement to analytics for performance tracking."""
    if created:
        data = {
            "courier_id": str(instance.courier.id),
            "lat": instance.location.y,
            "lon": instance.location.x,
            "timestamp": str(instance.timestamp),
        }
        analytics.send_event("courier_location", data)
