from django.db import models
from django.utils import timezone
import uuid

class Invoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    customer_id = models.UUIDField()
    transaction = models.OneToOneField("Transaction", on_delete=models.CASCADE, related_name="invoice")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, default="unpaid")
    due_date = models.DateTimeField()
    issued_at = models.DateTimeField(default=timezone.now)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "invoices"
        indexes = [models.Index(fields=["tenant_id", "status"])]

    def __str__(self):
        return f"Invoice {self.id} - {self.status}"
