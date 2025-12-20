import uuid
from django.contrib.gis.db import models
from django.utils import timezone

class CourierLoad(models.Model):
    """Tracks courier workload, performance, and geo-state."""

    STATUS_CHOICES = [
        ("available", "Available"),
        ("busy", "Busy"),
        ("offline", "Offline"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    courier_id = models.UUIDField(unique=True)
    active_assignments = models.PositiveIntegerField(default=0)
    performance_score = models.FloatField(default=100.0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="available")
    last_location = models.PointField(geography=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "courier_loads"
        indexes = [
            models.Index(fields=["tenant_id"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Courier {self.courier_id} ({self.status})"
