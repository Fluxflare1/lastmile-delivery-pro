from rest_framework import serializers
from app.models.order import Order
from app.models.order_item import OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "description", "quantity", "weight"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = [
            "id", "tenant_id", "customer_id", "service_type",
            "pickup_address", "delivery_address", "distance_km",
            "weight", "pricing_mode", "final_price", "status", "items",
            "created_at", "updated_at"
        ]
