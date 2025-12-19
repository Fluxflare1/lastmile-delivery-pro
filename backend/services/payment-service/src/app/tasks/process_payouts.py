from celery import shared_task
from app.models.payout import Payout
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task(name="payment.process_payouts")
def process_payout_task(payout_id):
    """Simulates payout disbursement"""
    try:
        payout = Payout.objects.get(id=payout_id)
        payout.status = "processing"
        payout.save()

        # TODO: Integrate real bank transfer API here
        logger.info(f"Processing payout for courier {payout.courier_id} - {payout.payout_amount}")

        payout.status = "completed"
        payout.processed_at = timezone.now()
        payout.save()
        logger.info(f"Payout completed: {payout.reference}")
    except Payout.DoesNotExist:
        logger.error(f"Payout {payout_id} not found")
    except Exception as e:
        logger.error(f"Payout error: {e}")
