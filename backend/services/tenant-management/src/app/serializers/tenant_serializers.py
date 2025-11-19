from rest_framework import serializers
from app.models.tenant import Tenant
from app.models.subscription import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"

class TenantSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(read_only=True)

    class Meta:
        model = Tenant
        fields = ["id", "name", "type", "brand_logo", "domain", "is_active", "subscription", "created_at"]
