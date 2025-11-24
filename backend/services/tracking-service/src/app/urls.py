from rest_framework.routers import DefaultRouter
from django.urls import path, include
from app.views.tracking_views import (
    CourierViewSet,
    CourierLocationViewSet,
    OrderRouteViewSet,
    SLAEventViewSet,
)

router = DefaultRouter()
router.register("couriers", CourierViewSet)
router.register("locations", CourierLocationViewSet)
router.register("routes", OrderRouteViewSet)
router.register("sla-events", SLAEventViewSet)

urlpatterns = [
    path("api/v1/tracking/", include(router.urls)),
]
