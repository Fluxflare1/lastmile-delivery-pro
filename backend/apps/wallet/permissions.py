from rest_framework import permissions


class IsWalletOwner(permissions.BasePermission):
    """Ensures only the wallet owner can access wallet resources."""

    def has_object_permission(self, request, view, obj):
        return hasattr(obj, "user") and obj.user == request.user


class IsFinancialAdmin(permissions.BasePermission):
    """Allows access to platform-level financial management."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff
