from rest_framework import serializers
from app.models.tenant_channel_config import TenantChannelConfig

class TenantChannelConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantChannelConfig
        fields = "__all__"
