from django.db import models
import uuid

class TenantChannelConfig(models.Model):
    """Per-tenant configuration for notification channels."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(unique=True)
    email_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=False)
    push_enabled = models.BooleanField(default=True)
    email_provider_api_key = models.CharField(max_length=255, blank=True, null=True)
    sms_provider_api_key = models.CharField(max_length=255, blank=True, null=True)
    push_provider_key = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "tenant_channel_configs"

    def __str__(self):
        return f"Tenant Config ({self.tenant_id})"
