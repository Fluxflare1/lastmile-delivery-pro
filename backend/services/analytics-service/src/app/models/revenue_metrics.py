from django.db import models
from django.utils import timezone
import uuid

class RevenueMetrics(models.Model):
    """Aggregated revenue and cost analytics."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    profit_margin = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    time_period = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "revenue_metrics"
        indexes = [models.Index(fields=["tenant_id", "time_period"])]

    def __str__(self):
        return f"Revenue ({self.tenant_id}) - {self.time_period}"
