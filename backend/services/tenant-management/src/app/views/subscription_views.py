from rest_framework import generics
from app.models.subscription import Subscription
from app.serializers.tenant_serializers import SubscriptionSerializer
from rest_framework.permissions import IsAuthenticated

class SubscriptionView(generics.RetrieveUpdateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
