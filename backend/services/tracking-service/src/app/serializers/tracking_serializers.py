from rest_framework import serializers
from app.models.tracking import Courier, CourierLocation, OrderRoute, SLAEvent


class CourierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courier
        fields = [
            "id",
            "tenant_id",
            "user_id",
            "name",
            "phone",
            "vehicle_type",
            "is_active",
            "last_reported",
        ]


class CourierLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourierLocation
        fields = ["id", "courier", "location", "speed", "accuracy", "timestamp"]
        read_only_fields = ["timestamp"]


class OrderRouteSerializer(serializers.ModelSerializer):
    courier = CourierSerializer(read_only=True)

    class Meta:
        model = OrderRoute
        fields = [
            "id",
            "order_id",
            "courier",
            "start_point",
            "end_point",
            "current_point",
            "distance_covered",
            "total_distance",
            "status",
            "started_at",
            "delivered_at",
        ]


class SLAEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SLAEvent
        fields = ["id", "route", "event_type", "event_time", "deviation_distance", "notes"]
        read_only_fields = ["event_time"]
