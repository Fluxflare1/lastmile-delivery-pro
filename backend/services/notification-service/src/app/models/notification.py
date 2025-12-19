from django.db import models
from django.utils import timezone
import uuid

class Notification(models.Model):
    """Stores all notifications for audit and retry tracking."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField()
    recipient = models.EmailField()
    channel = models.CharField(max_length=50, choices=[
        ("email", "Email"),
        ("sms", "SMS"),
        ("push", "Push"),
    ])
    title = models.CharField(max_length=255)
    message = models.TextField()
    severity = models.CharField(max_length=50, default="info")
    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(default=timezone.now)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "notifications"
        indexes = [models.Index(fields=["tenant_id", "status", "created_at"])]

    def __str__(self):
        return f"{self.recipient} - {self.channel} - {self.status}"
