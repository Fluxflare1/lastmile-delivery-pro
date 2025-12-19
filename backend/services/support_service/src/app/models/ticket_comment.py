from django.db import models
from django.utils import timezone
import uuid

class TicketComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey("Ticket", on_delete=models.CASCADE, related_name="comments")
    user_id = models.UUIDField()
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "ticket_comments"
        ordering = ["-created_at"]
