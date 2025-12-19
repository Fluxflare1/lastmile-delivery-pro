from django.db import models
from django.utils import timezone
import uuid

class Transaction(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("successful", "Successful"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    order_id = models.UUIDField(null=True, blank=True)
    customer_id = models.UUIDField()
    reference = models.CharField(max_length=128, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default="NGN")
    provider = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "transactions"
        indexes = [models.Index(fields=["tenant_id", "status", "provider"])]

    def __str__(self):
        return f"{self.reference} ({self.status})"
