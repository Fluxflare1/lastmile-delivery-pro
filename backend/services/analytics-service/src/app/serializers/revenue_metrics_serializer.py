from rest_framework import serializers
from app.models.revenue_metrics import RevenueMetrics

class RevenueMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueMetrics
        fields = "__all__"
