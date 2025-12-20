import uuid
from django.contrib.gis.db import models
from django.utils import timezone

class Assignment(models.Model):
    """Tracks courier–order assignments with SLA and routing data."""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("assigned", "Assigned"),
        ("accepted", "Accepted"),
        ("in_transit", "In Transit"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("reassigned", "Reassigned"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    order_id = models.UUIDField()
    courier_id = models.UUIDField(null=True, blank=True)
    dispatcher_id = models.UUIDField(null=True, blank=True)

    pickup_location = models.PointField(geography=True)
    dropoff_location = models.PointField(geography=True)
    distance_km = models.FloatField(default=0)
    estimated_duration_min = models.IntegerField(default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    route_data = models.JSONField(default=dict, blank=True)

    sla_deadline = models.DateTimeField(null=True, blank=True)
    sla_violated = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Assignment {self.id} ({self.status})"

    class Meta:
        db_table = "dispatch_assignments"
        indexes = [
            models.Index(fields=["tenant_id"]),
            models.Index(fields=["courier_id"]),
            models.Index(fields=["order_id"]),
            models.Index(fields=["status"]),
        ]
