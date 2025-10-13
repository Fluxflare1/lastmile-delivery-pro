from rest_framework import permissions

class IsCustomerOwner(permissions.BasePermission):
    """Allows access only to the owner of the profile or their addresses."""
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'customer'):
            return obj.customer.user == request.user
        return False
