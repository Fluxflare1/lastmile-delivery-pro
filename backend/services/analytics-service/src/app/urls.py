from django.urls import path
from app.views.analytics_ingest_view import AnalyticsIngestView
from app.views.analytics_dashboard_view import CourierMetricsView, RevenueMetricsView

urlpatterns = [
    path("api/v1/analytics/events/", AnalyticsIngestView.as_view(), name="analytics_ingest"),
    path("api/v1/analytics/couriers/", CourierMetricsView.as_view(), name="courier_metrics"),
    path("api/v1/analytics/revenue/", RevenueMetricsView.as_view(), name="revenue_metrics"),
]
