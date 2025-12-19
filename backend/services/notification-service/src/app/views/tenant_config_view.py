from rest_framework import viewsets
from app.models.tenant_channel_config import TenantChannelConfig
from app.serializers.tenant_config_serializer import TenantChannelConfigSerializer

class TenantChannelConfigViewSet(viewsets.ModelViewSet):
    queryset = TenantChannelConfig.objects.all()
    serializer_class = TenantChannelConfigSerializer
