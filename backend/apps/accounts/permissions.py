from rest_framework import permissions

# KEEP EXISTING - very useful generic permission
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

# ADD NEW ROLE-BASED PERMISSIONS
class IsPlatformAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"

class IsLMDSPAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "LMDSP_ADMIN"

class IsDCSDAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "DCSD_ADMIN"
