from rest_framework import permissions

class IsCustomerOwner(permissions.BasePermission):
    """
    Allows access only to the owner of the customer profile or their addresses.
    Works with CustomerProfile and CustomerAddress models.
    """
    def has_object_permission(self, request, view, obj):
        # For CustomerProfile objects
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # For CustomerAddress objects (through customer profile)
        if hasattr(obj, 'customer'):
            return obj.customer.user == request.user
        
        # For direct user relationships (if any future models)
        if hasattr(obj, 'user'):
            return obj.user == request.user
            
        return False


class IsAddressOwner(permissions.BasePermission):
    """
    Specific permission for address ownership.
    Restricts address access to owners only.
    More explicit version for address-specific views.
    """
    def has_object_permission(self, request, view, obj):
        # Handle CustomerAddress model (your existing structure)
        if hasattr(obj, 'customer'):
            return obj.customer.user == request.user
        
        # Handle direct user relationship (alternative structure)
        if hasattr(obj, 'user'):
            return obj.user == request.user
            
        return False


class IsCustomerOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows read access to any authenticated user, but write access only to the owner.
    Useful for public profile viewing but private editing.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner.
        return IsCustomerOwner().has_object_permission(request, view, obj)


class IsCustomerProfileOwner(permissions.BasePermission):
    """
    Specific permission for CustomerProfile objects only.
    """
    def has_object_permission(self, request, view, obj):
        return hasattr(obj, 'user') and obj.user == request.user


class HasCustomerProfile(permissions.BasePermission):
    """
    Permission to check if the user has a customer profile.
    Useful for creation operations where user must have a profile.
    """
    def has_permission(self, request, view):
        return (request.user and 
                request.user.is_authenticated and 
                hasattr(request.user, 'customer_profile'))
