from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from app.models.payout import Payout
from app.serializers.payout_serializer import PayoutSerializer
from app.tasks.process_payouts import process_payout_task
import uuid

class PayoutViewSet(viewsets.ModelViewSet):
    queryset = Payout.objects.all().order_by("-created_at")
    serializer_class = PayoutSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="initiate")
    def initiate_payout(self, request):
        """Initiate a payout to a courier"""
        courier_id = request.data.get("courier_id")
        amount = request.data.get("amount")
        tenant_id = request.data.get("tenant_id")

        payout = Payout.objects.create(
            tenant_id=tenant_id,
            courier_id=courier_id,
            total_earnings=amount,
            payout_amount=amount,
            reference=str(uuid.uuid4()),
        )
        process_payout_task.delay(str(payout.id))
        return Response(PayoutSerializer(payout).data, status=status.HTTP_202_ACCEPTED)
