from django.contrib.gis.db import models
from django.utils import timezone
import uuid


class Courier(models.Model):
    """Represents a courier being tracked in the system."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    user_id = models.UUIDField()
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32)
    vehicle_type = models.CharField(max_length=64, blank=True)
    is_active = models.BooleanField(default=True)
    last_reported = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} ({self.phone})"


class CourierLocation(models.Model):
    """Stores courier's real-time and historical location data."""
    id = models.BigAutoField(primary_key=True)
    courier = models.ForeignKey(Courier, on_delete=models.CASCADE, related_name="locations")
    location = models.PointField(geography=True)
    speed = models.FloatField(null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [
            models.Index(fields=["courier", "timestamp"]),
            models.Index(fields=["timestamp"]),
        ]
        ordering = ["-timestamp"]

    def __str__(self):
        return f"Location of {self.courier_id} at {self.timestamp}"


class OrderRoute(models.Model):
    """Tracks route-level details of an active order."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_id = models.UUIDField()
    courier = models.ForeignKey(Courier, on_delete=models.SET_NULL, null=True)
    start_point = models.PointField(geography=True)
    end_point = models.PointField(geography=True)
    current_point = models.PointField(geography=True, null=True, blank=True)
    distance_covered = models.FloatField(default=0.0)
    total_distance = models.FloatField(default=0.0)
    status = models.CharField(
        max_length=32,
        choices=[
            ("assigned", "Assigned"),
            ("in_transit", "In Transit"),
            ("delivered", "Delivered"),
            ("delayed", "Delayed"),
        ],
        default="assigned",
    )
    started_at = models.DateTimeField(default=timezone.now)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["order_id"]),
            models.Index(fields=["courier"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"OrderRoute for {self.order_id}"


class SLAEvent(models.Model):
    """Tracks SLA performance and breach events."""
    id = models.BigAutoField(primary_key=True)
    route = models.ForeignKey(OrderRoute, on_delete=models.CASCADE, related_name="sla_events")
    event_type = models.CharField(
        max_length=64,
        choices=[
            ("on_time", "On Time"),
            ("delayed", "Delayed"),
            ("breach", "Breach"),
            ("route_deviation", "Route Deviation"),
        ],
    )
    event_time = models.DateTimeField(default=timezone.now)
    deviation_distance = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-event_time"]

    def __str__(self):
        return f"SLA {self.event_type} for {self.route_id}"


class TrackingIntegrationLog(models.Model):
    """Logs notifications and inter-service syncs."""
    id = models.BigAutoField(primary_key=True)
    service = models.CharField(max_length=128)
    event_type = models.CharField(max_length=64)
    payload = models.JSONField()
    status_code = models.IntegerField(null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.service} → {self.event_type} ({self.status_code})"
