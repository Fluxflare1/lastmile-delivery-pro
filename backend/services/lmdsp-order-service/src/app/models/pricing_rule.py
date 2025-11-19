from django.db import models
import uuid

class PricingRule(models.Model):
    PRICING_TYPE_CHOICES = [
        ("DYNAMIC", "Dynamic"),
        ("FIXED", "Fixed"),
        ("NEGOTIATED", "Negotiated"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    service_type = models.CharField(max_length=50)
    pricing_type = models.CharField(max_length=15, choices=PRICING_TYPE_CHOICES, default="DYNAMIC")

    base_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    per_km_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    per_kg_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    fixed_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    allow_negotiation = models.BooleanField(default=False)
    negotiation_min_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    negotiation_max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pricing_rules"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.service_type} ({self.pricing_type})"
