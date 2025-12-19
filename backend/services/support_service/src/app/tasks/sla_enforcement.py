from celery import shared_task
from django.utils import timezone
from app.models.ticket import Ticket
from app.models.sla_rule import SLARule
import logging, requests, os

logger = logging.getLogger(__name__)
NOTIFICATION_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8000/alert")

@shared_task(name="support.check_sla_compliance")
def check_sla_compliance():
    """Enforce SLA deadlines and send alerts if breached."""
    now = timezone.now()
    overdue_tickets = Ticket.objects.filter(status__in=["open", "in_progress"], sla_due__lt=now)
    for ticket in overdue_tickets:
        ticket.status = "in_progress"
        ticket.save()
        logger.warning(f"SLA breach for ticket {ticket.id}")
        requests.post(
            NOTIFICATION_URL,
            json={
                "tenant_id": str(ticket.tenant_id),
                "title": "SLA Breach",
                "message": f"Ticket {ticket.subject} has exceeded SLA time.",
                "severity": "high",
                "recipients": ["support@lastmile-delivery-pro.com"],
            },
            timeout=5,
        )
