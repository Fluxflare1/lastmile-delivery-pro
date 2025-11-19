from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models.negotiation_history import NegotiationHistory
from app.models.order import Order
from app.models.pricing_rule import PricingRule
from app.utils.pricing_engine import calculate_price

class NegotiationOfferView(APIView):
    def post(self, request):
        try:
            order_id = request.data.get("order_id")
            tenant_id = request.data.get("tenant_id")
            customer_id = request.data.get("customer_id")
            customer_offer = float(request.data.get("customer_offer"))

            order = Order.objects.get(id=order_id)
            rule = PricingRule.objects.filter(tenant_id=tenant_id, service_type=order.service_type).first()

            final_price = calculate_price(order, rule, "NEGOTIATED", customer_offer)

            NegotiationHistory.objects.create(
                order_id=order_id,
                tenant_id=tenant_id,
                customer_id=customer_id,
                customer_offer=customer_offer,
                final_price=final_price,
                accepted=False,
            )

            return Response({"status": "offer_submitted", "final_price": final_price}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class NegotiationResponseView(APIView):
    def patch(self, request):
        try:
            order_id = request.data.get("order_id")
            accepted = request.data.get("accepted")
            final_price = request.data.get("final_price")

            negotiation = NegotiationHistory.objects.filter(order_id=order_id).latest("created_at")
            negotiation.accepted = accepted
            negotiation.final_price = final_price
            negotiation.save()

            if accepted:
                order = Order.objects.get(id=order_id)
                order.final_price = final_price
                order.status = "PENDING"
                order.save()

            return Response({"status": "negotiation_updated"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
