from django.db import models
from app.models.tenant import Tenant

class Subscription(models.Model):
    PLAN_CHOICES = [
        ("FREE", "Free Plan"),
        ("STANDARD", "Standard Plan"),
        ("PREMIUM", "Premium Plan"),
        ("ENTERPRISE", "Enterprise Plan"),
    ]

    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name="subscription")
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default="FREE")
    active_until = models.DateField(null=True, blank=True)
    max_users = models.PositiveIntegerField(default=10)
    max_orders = models.PositiveIntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "subscriptions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.tenant.name} - {self.plan}"
