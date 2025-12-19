from celery import shared_task
from app.models.transaction import Transaction
from app.integrations.paystack_client import PaystackClient
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task(name="payment.reconcile_transactions")
def reconcile_transactions():
    """Check payment gateways for pending transactions and update status."""
    pending = Transaction.objects.filter(status="pending")
    for txn in pending:
        try:
            result = PaystackClient.verify_transaction(txn.reference)
            if result["data"]["status"] == "success":
                txn.status = "successful"
                txn.updated_at = timezone.now()
                txn.save()
                logger.info(f"Transaction {txn.reference} marked as successful")
            elif result["data"]["status"] == "failed":
                txn.status = "failed"
                txn.save()
        except Exception as e:
            logger.error(f"Reconciliation error for {txn.reference}: {e}")
