from rest_framework import permissions

class IsAdminOrSelf(permissions.BasePermission):
    """
    Allow users to view or edit their own profiles.
    Admins have full access.
    """
    def has_object_permission(self, request, view, obj):
        return bool(
            request.user and (
                request.user.is_staff or obj == request.user
            )
        )
