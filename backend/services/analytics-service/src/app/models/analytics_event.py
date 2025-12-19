from django.db import models
from django.utils import timezone
import uuid

class AnalyticsEvent(models.Model):
    """Raw event ingestion model from external services."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_type = models.CharField(max_length=255)
    tenant_id = models.UUIDField()
    service_source = models.CharField(max_length=100)
    payload = models.JSONField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "analytics_events"
        indexes = [models.Index(fields=["event_type", "tenant_id", "created_at"])]

    def __str__(self):
        return f"{self.event_type} | {self.service_source}"
