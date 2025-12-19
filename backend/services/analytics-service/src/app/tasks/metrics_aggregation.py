from celery import shared_task
from django.db.models import Avg, Count, Sum, F
from django.utils import timezone
from app.models.analytics_event import AnalyticsEvent
from app.models.courier_metrics import CourierMetrics
from app.models.revenue_metrics import RevenueMetrics
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

@shared_task(name="analytics.aggregate_courier_metrics")
def aggregate_courier_metrics():
    """Aggregate courier metrics hourly."""
    since = timezone.now() - timedelta(hours=1)
    events = AnalyticsEvent.objects.filter(event_type="courier_location", created_at__gte=since)

    courier_counts = {}
    for event in events:
        cid = event.payload.get("courier_id")
        if not cid:
            continue
        courier_counts[cid] = courier_counts.get(cid, 0) + 1

    for courier_id, count in courier_counts.items():
        CourierMetrics.objects.create(
            courier_id=courier_id,
            tenant_id=uuid.uuid4(),  # placeholder; will come from service event
            deliveries_completed=count,
            average_delivery_time=30.0,  # placeholder until route integration
            sla_compliance=98.5,
            distance_covered_km=count * 0.5,
        )
    logger.info(f"[AnalyticsService] Courier metrics aggregated for {len(courier_counts)} couriers.")


@shared_task(name="analytics.aggregate_revenue_metrics")
def aggregate_revenue_metrics():
    """Aggregate daily revenue metrics."""
    since = timezone.now() - timedelta(days=1)
    events = AnalyticsEvent.objects.filter(event_type="order_completed", created_at__gte=since)

    tenants = {}
    for event in events:
        tenant = event.tenant_id
        amount = event.payload.get("amount", 0)
        tenants.setdefault(tenant, 0)
        tenants[tenant] += float(amount)

    for tenant_id, total in tenants.items():
        RevenueMetrics.objects.create(
            tenant_id=tenant_id,
            total_revenue=total,
            total_cost=total * 0.75,
            profit_margin=(total - total * 0.75) / total * 100,
        )
    logger.info(f"[AnalyticsService] Revenue metrics aggregated for {len(tenants)} tenants.")
