# backend/apps/shipments/permissions.py

from rest_framework import permissions

class IsShipmentOwnerOrAdmin(permissions.BasePermission):
    """
    Allows access to shipment owners (senders) or admins.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.is_staff:
            return True
        return obj.sender_profile.user == request.user


class IsCourierAssignedOrReadOnly(permissions.BasePermission):
    """
    Couriers can only view shipments assigned to them.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.assigned_courier == request.user
