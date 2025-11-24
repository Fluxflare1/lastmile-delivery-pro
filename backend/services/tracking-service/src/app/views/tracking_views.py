from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.gis.geos import Point
from django.utils import timezone
from app.models.tracking import Courier, CourierLocation, OrderRoute, SLAEvent
from app.serializers.tracking_serializers import (
    CourierSerializer,
    CourierLocationSerializer,
    OrderRouteSerializer,
    SLAEventSerializer,
)
from app.utils.auth import ServiceTokenAuthentication
from app.tasks.tracking_tasks import check_sla_compliance, detect_route_deviation


class IsTenantOrService(permissions.BasePermission):
    """Restrict access to tenant-bound users or authorized service tokens."""

    def has_permission(self, request, view):
        if isinstance(request.successful_authenticator, ServiceTokenAuthentication):
            return True
        return bool(request.user and request.user.is_authenticated)


class CourierViewSet(viewsets.ModelViewSet):
    queryset = Courier.objects.all()
    serializer_class = CourierSerializer
    authentication_classes = [JWTAuthentication, ServiceTokenAuthentication]
    permission_classes = [IsTenantOrService]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "tenant_id"):
            return Courier.objects.filter(tenant_id=user.tenant_id)
        return Courier.objects.all()


class CourierLocationViewSet(viewsets.ModelViewSet):
    queryset = CourierLocation.objects.select_related("courier").all()
    serializer_class = CourierLocationSerializer
    authentication_classes = [JWTAuthentication, ServiceTokenAuthentication]
    permission_classes = [IsTenantOrService]

    def perform_create(self, serializer):
        location_data = serializer.validated_data["location"]
        courier = serializer.validated_data["courier"]
        serializer.save()
        courier.last_reported = timezone.now()
        courier.save(update_fields=["last_reported"])
        # Trigger Celery SLA check
        check_sla_compliance.delay(str(courier.id))
        detect_route_deviation.delay(str(courier.id))
        return serializer


class OrderRouteViewSet(viewsets.ModelViewSet):
    queryset = OrderRoute.objects.select_related("courier").all()
    serializer_class = OrderRouteSerializer
    authentication_classes = [JWTAuthentication, ServiceTokenAuthentication]
    permission_classes = [IsTenantOrService]

    @action(detail=True, methods=["post"], url_path="update-location")
    def update_location(self, request, pk=None):
        """Updates current point for a route and triggers SLA validation"""
        route = self.get_object()
        try:
            lat = float(request.data.get("latitude"))
            lon = float(request.data.get("longitude"))
            route.current_point = Point(lon, lat)
            route.save(update_fields=["current_point"])
            check_sla_compliance.delay(str(route.courier.id))
            detect_route_deviation.delay(str(route.courier.id))
            return Response({"detail": "Location updated"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SLAEventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SLAEvent.objects.select_related("route").all()
    serializer_class = SLAEventSerializer
    authentication_classes = [JWTAuthentication, ServiceTokenAuthentication]
    permission_classes = [IsTenantOrService]
