from rest_framework import generics, permissions
from app.models.courier_metrics import CourierMetrics
from app.models.revenue_metrics import RevenueMetrics
from app.serializers.courier_metrics_serializer import CourierMetricsSerializer
from app.serializers.revenue_metrics_serializer import RevenueMetricsSerializer

class CourierMetricsView(generics.ListAPIView):
    """Provides courier performance analytics to dashboards."""
    queryset = CourierMetrics.objects.all().order_by("-time_period")
    serializer_class = CourierMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]


class RevenueMetricsView(generics.ListAPIView):
    """Provides financial performance metrics."""
    queryset = RevenueMetrics.objects.all().order_by("-time_period")
    serializer_class = RevenueMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]
