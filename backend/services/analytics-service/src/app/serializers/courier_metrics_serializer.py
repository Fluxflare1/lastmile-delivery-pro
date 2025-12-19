from rest_framework import serializers
from app.models.courier_metrics import CourierMetrics

class CourierMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourierMetrics
        fields = "__all__"
