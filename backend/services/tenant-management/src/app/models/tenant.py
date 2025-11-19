from django.db import models
import uuid

class Tenant(models.Model):
    TENANT_TYPES = [
        ("LMDSP", "Last Mile Delivery Service Provider"),
        ("DCSD", "Delivery Chain Service Distributor"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    type = models.CharField(max_length=10, choices=TENANT_TYPES)
    brand_logo = models.URLField(blank=True, null=True)
    domain = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenants"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
