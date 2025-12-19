from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from app.models.transaction import Transaction
from app.integrations.paystack_client import PaystackClient
from app.integrations.flutterwave_client import FlutterwaveClient
from app.integrations.stripe_client import StripeClient
import logging

logger = logging.getLogger(__name__)

@api_view(["POST"])
@permission_classes([AllowAny])
def payment_webhook(request, gateway):
    """Handles webhook callbacks from Paystack, Flutterwave, or Stripe."""
    data = request.data
    reference = data.get("reference") or data.get("data", {}).get("reference")

    if not reference:
        return Response({"error": "Missing reference"}, status=400)

    try:
        txn = Transaction.objects.get(reference=reference)
        txn.status = "successful"
        txn.save()
        logger.info(f"Webhook confirmed for {gateway} - {reference}")
        return Response({"message": "success"})
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=404)
    except Exception as e:
        logger.error(f"Webhook processing failed: {e}")
        return Response({"error": str(e)}, status=500)
