from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from app.models.transaction import Transaction
from app.serializers.transaction_serializer import TransactionSerializer
from app.integrations.paystack_client import PaystackClient
from app.integrations.flutterwave_client import FlutterwaveClient
from app.integrations.stripe_client import StripeClient
from django.conf import settings
from django.utils import timezone
import uuid, logging

logger = logging.getLogger(__name__)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by("-created_at")
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(customer_id=user.id)

    @action(detail=False, methods=["post"], url_path="initialize")
    def initialize_payment(self, request):
        """Initialize transaction with selected payment gateway"""
        gateway = request.data.get("gateway", "paystack")
        amount = request.data.get("amount")
        email = request.data.get("email")
        reference = str(uuid.uuid4())

        if gateway not in settings.PAYMENT_GATEWAYS:
            return Response({"error": "Unsupported gateway"}, status=400)

        txn = Transaction.objects.create(
            tenant_id=request.data.get("tenant_id"),
            customer_id=request.user.id,
            reference=reference,
            amount=amount,
            provider=gateway,
        )

        try:
            if gateway == "paystack":
                response = PaystackClient.initialize_transaction(email, amount, reference)
            elif gateway == "flutterwave":
                response = FlutterwaveClient.initialize_transaction(email, amount, reference)
            elif gateway == "stripe":
                response = StripeClient.create_payment_intent(amount, reference)

            return Response({"payment_url": response.get("data", {}).get("authorization_url"), "reference": reference})
        except Exception as e:
            logger.error(f"Error initializing transaction: {e}")
            txn.status = "failed"
            txn.save()
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=["post"], url_path="verify")
    def verify_payment(self, request):
        reference = request.data.get("reference")
        gateway = request.data.get("gateway", "paystack")

        try:
            if gateway == "paystack":
                response = PaystackClient.verify_transaction(reference)
            elif gateway == "flutterwave":
                response = FlutterwaveClient.verify_transaction(reference)
            elif gateway == "stripe":
                response = StripeClient.verify_payment_intent(reference)
            else:
                return Response({"error": "Invalid gateway"}, status=400)

            txn = Transaction.objects.get(reference=reference)
            txn.status = "successful" if response["data"]["status"] == "success" else "failed"
            txn.updated_at = timezone.now()
            txn.save()
            return Response(TransactionSerializer(txn).data)
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)
        except Exception as e:
            logger.error(f"Verification error: {e}")
            return Response({"error": str(e)}, status=500)
