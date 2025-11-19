from rest_framework import serializers
from app.models.pricing_rule import PricingRule
from app.models.pricing_mode import PricingMode

class PricingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRule
        fields = "__all__"

class PricingModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingMode
        fields = "__all__"
