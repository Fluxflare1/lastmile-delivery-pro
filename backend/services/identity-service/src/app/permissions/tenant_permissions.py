from rest_framework.permissions import BasePermission

class IsTenantAdmin(BasePermission):
    """Allows access only to users who are tenant administrators."""
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.user_type in ["admin", "manager"]
