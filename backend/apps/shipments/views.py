# backend/apps/shipments/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.shipments.models import Shipment, ShipmentStatusHistory
from apps.shipments.serializers import ShipmentSerializer, ShipmentStatusHistorySerializer
from apps.shipments.permissions import IsShipmentOwnerOrAdmin, IsCourierAssignedOrReadOnly


class ShipmentViewSet(viewsets.ModelViewSet):
    """
    Manage customer shipments — create, view, update status, proof of delivery, etc.
    """
    queryset = Shipment.objects.select_related('sender_profile', 'sender_address', 'receiver_address')
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated, IsShipmentOwnerOrAdmin]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return self.queryset
        return self.queryset.filter(sender_profile__user=user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsCourierAssignedOrReadOnly])
    def update_status(self, request, pk=None):
        shipment = self.get_object()
        status_value = request.data.get('status')
        note = request.data.get('note', '')

        if not status_value:
            return Response({'detail': 'Status is required.'}, status=status.HTTP_400_BAD_REQUEST)

        ShipmentStatusHistory.objects.create(
            shipment=shipment,
            status=status_value,
            updated_by=request.user,
            note=note
        )
        shipment.status = status_value
        shipment.save()

        return Response({'detail': f'Shipment status updated to {status_value}.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsCourierAssignedOrReadOnly])
    def upload_pod(self, request, pk=None):
        shipment = self.get_object()
        pod_signature = request.FILES.get('pod_signature')
        pod_photo = request.FILES.get('pod_photo')

        if not pod_signature and not pod_photo:
            return Response({'detail': 'Proof of delivery files required.'}, status=status.HTTP_400_BAD_REQUEST)

        if pod_signature:
            shipment.pod_signature = pod_signature
        if pod_photo:
            shipment.pod_photo = pod_photo
        shipment.status = 'delivered'
        shipment.save()

        ShipmentStatusHistory.objects.create(
            shipment=shipment,
            status='delivered',
            updated_by=request.user,
            note='Proof of delivery uploaded.'
        )

        return Response({'detail': 'Proof of delivery uploaded successfully.'}, status=status.HTTP_200_OK)
