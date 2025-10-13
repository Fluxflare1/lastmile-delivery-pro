# backend/apps/shipments/models.py

from django.db import models
from django.conf import settings
from apps.core.models import BaseModel, TimestampMixin
from apps.customer.models import CustomerProfile, CustomerAddress

class Shipment(BaseModel, TimestampMixin):
    """
    Represents a customer shipment, linked to sender and receiver.
    Supports both internal (auto-generated) and external tracking references.
    """
    TRACKING_PREFIX = "LMDSP"

    STATUS_CHOICES = [
        ('pending', 'Pending Pickup'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('failed', 'Failed Delivery'),
    ]

    SERVICE_MODE_CHOICES = [
        ('door_to_door', 'Door to Door'),
        ('door_to_bus_stop', 'Door to Bus Stop'),
        ('door_to_route', 'Door to Route'),
        ('pickup_point', 'Pickup Point'),
    ]

    SLA_CHOICES = [
        ('same_day', 'Same Day'),
        ('next_day', 'Next Day'),
        ('scheduled', 'Scheduled'),
        ('express', 'Express'),
    ]

    sender_profile = models.ForeignKey(
        CustomerProfile,
        on_delete=models.CASCADE,
        related_name='shipments_sent'
    )
    sender_address = models.ForeignKey(
        CustomerAddress,
        on_delete=models.CASCADE,
        related_name='sender_shipments'
    )
    receiver_name = models.CharField(max_length=255)
    receiver_phone = models.CharField(max_length=20)
    receiver_email = models.EmailField(blank=True, null=True)
    receiver_address = models.ForeignKey(
        CustomerAddress,
        on_delete=models.CASCADE,
        related_name='receiver_shipments'
    )

    # Tracking
    tracking_number = models.CharField(max_length=50, unique=True, editable=False)
    external_tracking_ref = models.CharField(max_length=100, blank=True, null=True)

    # Shipment info
    service_mode = models.CharField(max_length=50, choices=SERVICE_MODE_CHOICES)
    sla_type = models.CharField(max_length=50, choices=SLA_CHOICES, default='same_day')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

    package_description = models.TextField(blank=True, null=True)
    package_weight = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    package_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Proof of delivery fields
    pod_signature = models.ImageField(upload_to='media/pod/signatures/', blank=True, null=True)
    pod_photo = models.ImageField(upload_to='media/pod/photos/', blank=True, null=True)
    delivery_otp = models.CharField(max_length=6, blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)

    assigned_courier = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='assigned_shipments'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='created_shipments'
    )

    def save(self, *args, **kwargs):
        """Auto-generate tracking number if not set."""
        if not self.tracking_number:
            self.tracking_number = f"{self.TRACKING_PREFIX}-{self.pk or ''}{self.generate_uuid_suffix()}"
        super().save(*args, **kwargs)

    def generate_uuid_suffix(self):
        import uuid
        return str(uuid.uuid4())[:8].upper()

    def __str__(self):
        return f"{self.tracking_number} - {self.status}"


class ShipmentStatusHistory(TimestampMixin):
    """
    Tracks all status transitions for shipments.
    """
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=50)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.shipment.tracking_number} - {self.status}"
