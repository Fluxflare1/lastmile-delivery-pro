from django.db import models
import uuid

class SLARule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    priority = models.CharField(max_length=20)
    response_time_minutes = models.IntegerField()
    resolution_time_minutes = models.IntegerField()

    class Meta:
        db_table = "sla_rules"
        unique_together = ("tenant_id", "priority")
