from django.db import models
import uuid

class NegotiationHistory(models.Model):
    order_id = models.UUIDField()
    tenant_id = models.UUIDField()
    customer_id = models.UUIDField()
    customer_offer = models.DecimalField(max_digits=10, decimal_places=2)
    accepted = models.BooleanField(default=False)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "negotiation_history"
        ordering = ["-created_at"]
