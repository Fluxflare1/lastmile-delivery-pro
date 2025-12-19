from rest_framework import serializers
from app.models.payout import Payout

class PayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = "__all__"
        read_only_fields = ("id", "created_at", "processed_at")
