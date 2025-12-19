from django.db import models
from django.utils import timezone
import uuid

class CourierMetrics(models.Model):
    """Aggregated courier performance metrics."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    courier_id = models.UUIDField()
    tenant_id = models.UUIDField()
    deliveries_completed = models.IntegerField(default=0)
    average_delivery_time = models.FloatField(default=0.0)
    sla_compliance = models.FloatField(default=100.0)
    distance_covered_km = models.FloatField(default=0.0)
    rating = models.FloatField(default=0.0)
    time_period = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "courier_metrics"
        indexes = [models.Index(fields=["tenant_id", "courier_id", "time_period"])]

    def __str__(self):
        return f"Courier {self.courier_id} ({self.time_period})"
