from django.db import models
import uuid
from app.models.order import Order

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    weight = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    class Meta:
        db_table = "order_items"
