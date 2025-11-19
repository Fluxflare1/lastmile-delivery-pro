from django.db import models
import uuid

class PricingMode(models.Model):
    MODE_CHOICES = [
        ("DYNAMIC", "System-calculated"),
        ("FIXED", "Predefined static pricing"),
        ("NEGOTIATED", "Negotiated between customer and tenant"),
        ("HYBRID", "Combination based on service type"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    active_mode = models.CharField(max_length=20, choices=MODE_CHOICES, default="DYNAMIC")
    allow_customer_toggle = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pricing_modes"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.tenant_id} - {self.active_mode}"
