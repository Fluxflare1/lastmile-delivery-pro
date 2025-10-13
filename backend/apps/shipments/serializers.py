# backend/apps/shipments/serializers.py

from rest_framework import serializers
from apps.shipments.models import Shipment, ShipmentStatusHistory
from apps.customer.models import CustomerAddress, CustomerProfile


class ShipmentStatusHistorySerializer(serializers.ModelSerializer):
    updated_by_name = serializers.CharField(source='updated_by.get_full_name', read_only=True)

    class Meta:
        model = ShipmentStatusHistory
        fields = ['id', 'status', 'note', 'updated_by_name', 'created_at']


class ShipmentSerializer(serializers.ModelSerializer):
    sender_profile = serializers.PrimaryKeyRelatedField(queryset=CustomerProfile.objects.all())
    sender_address = serializers.PrimaryKeyRelatedField(queryset=CustomerAddress.objects.all())
    receiver_address = serializers.PrimaryKeyRelatedField(queryset=CustomerAddress.objects.all())
    status_history = ShipmentStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id', 'tracking_number', 'external_tracking_ref',
            'sender_profile', 'sender_address',
            'receiver_name', 'receiver_phone', 'receiver_email', 'receiver_address',
            'service_mode', 'sla_type', 'status',
            'package_description', 'package_weight', 'package_value',
            'pod_signature', 'pod_photo', 'delivery_otp', 'delivered_at',
            'assigned_courier', 'created_by', 'status_history',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['tracking_number', 'created_by', 'status', 'assigned_courier']

    def create(self, validated_data):
        request = self.context.get('request')
        shipment = Shipment.objects.create(
            created_by=request.user,
            **validated_data
        )
        ShipmentStatusHistory.objects.create(
            shipment=shipment,
            status='pending',
            updated_by=request.user,
            note='Shipment created and awaiting pickup.'
        )
        return shipment
