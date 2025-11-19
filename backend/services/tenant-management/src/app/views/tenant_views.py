from rest_framework import generics, status
from rest_framework.response import Response
from app.models.tenant import Tenant
from app.models.subscription import Subscription
from app.serializers.tenant_serializers import TenantSerializer
from rest_framework.permissions import IsAuthenticated
import requests, os

IDENTITY_SERVICE_URL = os.getenv("IDENTITY_SERVICE_URL", "http://identity-service:8000")

class TenantListCreateView(generics.ListCreateAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        tenant = serializer.save()
        Subscription.objects.create(tenant=tenant)
        return tenant


class TenantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]


class TenantUserLinkView(generics.GenericAPIView):
    """Link an existing Identity Service user to a tenant."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        tenant_id = request.data.get("tenant_id")
        user_id = request.data.get("user_id")

        response = requests.post(
            f"{IDENTITY_SERVICE_URL}/api/v1/users/assign-tenant/",
            json={"tenant_id": tenant_id, "user_id": user_id},
            headers={"Authorization": f"Bearer {request.auth}"},
        )

        if response.status_code == 200:
            return Response({"message": "User linked successfully"}, status=200)
        return Response({"error": "Failed to link user"}, status=400)
