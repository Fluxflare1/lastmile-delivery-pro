from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models.pricing_rule import PricingRule
from app.models.pricing_mode import PricingMode
from app.utils.pricing_engine import calculate_price

class PriceEstimateView(APIView):
    def post(self, request):
        try:
            tenant_id = request.data.get("tenant_id")
            mode = request.data.get("mode", "DYNAMIC")
            service_type = request.data.get("service_type", "Standard")
            distance_km = float(request.data.get("distance_km", 0))
            weight = float(request.data.get("weight", 0))
            customer_offer = request.data.get("customer_offer")

            rule = PricingRule.objects.filter(tenant_id=tenant_id, service_type=service_type).first()
            if not rule:
                return Response({"error": "Pricing rule not found"}, status=status.HTTP_404_NOT_FOUND)

            mock_order = type("Order", (), {"distance_km": distance_km, "weight": weight, "service_type": service_type})
            total_price = calculate_price(mock_order, rule, mode, customer_offer)
            return Response({"total_price": total_price, "mode": mode}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
