from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from apps.customer.models import CustomerProfile, CustomerAddress
from apps.customer.serializers import (
    CustomerProfileSerializer, 
    CustomerProfileUpdateSerializer, 
    CustomerAddressSerializer,
    CustomerAddressCreateSerializer
)
from apps.customer.permissions import IsCustomerOwner, IsAddressOwner, HasCustomerProfile

class CustomerProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update the authenticated user's customer profile.
    """
    queryset = CustomerProfile.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated, IsCustomerOwner]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        """Get the customer profile for the authenticated user."""
        return get_object_or_404(CustomerProfile, user=self.request.user, is_active=True)

    def get_serializer_class(self):
        """Use update serializer for PUT/PATCH, detail serializer for GET."""
        if self.request.method in ['PUT', 'PATCH']:
            return CustomerProfileUpdateSerializer
        return CustomerProfileSerializer

    def update(self, request, *args, **kwargs):
        """Handle profile updates with proper response."""
        response = super().update(request, *args, **kwargs)
        
        # Return full profile data after update, not just updated fields
        if response.status_code == status.HTTP_200_OK:
            profile = self.get_object()
            serializer = CustomerProfileSerializer(profile, context=self.get_serializer_context())
            response.data = serializer.data
            
        return response


class CustomerAddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing customer addresses with full CRUD operations.
    Combines list, create, retrieve, update, and delete functionality.
    """
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated, HasCustomerProfile]
    
    def get_queryset(self):
        """Return only active addresses for the authenticated user."""
        return CustomerAddress.objects.filter(
            customer__user=self.request.user, 
            is_active=True
        ).select_related('customer', 'customer__user')

    def get_serializer_class(self):
        """Use different serializers for different actions."""
        if self.action == 'create':
            return CustomerAddressCreateSerializer
        return CustomerAddressSerializer

    def get_serializer_context(self):
        """Add request context to serializer."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        """Automatically set customer, tenant, and created_by when creating address."""
        profile = get_object_or_404(CustomerProfile, user=self.request.user, is_active=True)
        serializer.save(
            customer=profile, 
            tenant=self.request.tenant, 
            created_by=self.request.user
        )

    def perform_update(self, serializer):
        """Update address with modified_by user."""
        serializer.save(modified_by=self.request.user)

    def perform_destroy(self, instance):
        """Soft delete the address by setting is_active=False."""
        instance.is_active = False
        instance.modified_by = self.request.user
        instance.save()

    def destroy(self, request, *args, **kwargs):
        """Override destroy to return appropriate response for soft delete."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Address deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def set_default(self, request, pk=None):
        """Set an address as the default address for the customer."""
        address = self.get_object()
        
        # Set this address as default
        address.is_default = True
        address.save()
        
        # The save method in the model will handle setting other addresses to non-default
        
        return Response(
            {"detail": "Address set as default successfully."},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def default(self, request):
        """Get the default address for the current user."""
        queryset = self.get_queryset()
        default_address = queryset.filter(is_default=True).first()
        
        if not default_address:
            return Response(
                {"detail": "No default address found."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        serializer = self.get_serializer(default_address)
        return Response(serializer.data)


# Legacy views for backward compatibility (if needed)
class CustomerAddressListCreateView(generics.ListCreateAPIView):
    """
    Legacy view for listing and creating addresses.
    Consider using the ViewSet above for new development.
    """
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated, HasCustomerProfile]

    def get_queryset(self):
        return CustomerAddress.objects.filter(
            customer__user=self.request.user, 
            is_active=True
        )

    def perform_create(self, serializer):
        profile = get_object_or_404(CustomerProfile, user=self.request.user)
        serializer.save(
            customer=profile, 
            tenant=self.request.tenant, 
            created_by=self.request.user
        )


class CustomerAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Legacy view for address detail operations.
    Consider using the ViewSet above for new development.
    """
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOwner]

    def get_queryset(self):
        return CustomerAddress.objects.filter(
            customer__user=self.request.user, 
            is_active=True
        )

    def perform_destroy(self, instance):
        """Soft delete the address."""
        instance.is_active = False
        instance.modified_by = self.request.user
        instance.save()
