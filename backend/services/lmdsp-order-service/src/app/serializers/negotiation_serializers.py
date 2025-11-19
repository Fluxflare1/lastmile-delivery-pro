from rest_framework import serializers
from app.models.negotiation_history import NegotiationHistory

class NegotiationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NegotiationHistory
        fields = [
            "order_id",
            "tenant_id",
            "customer_id",
            "customer_offer",
            "accepted",
            "final_price",
            "created_at",
        ]
