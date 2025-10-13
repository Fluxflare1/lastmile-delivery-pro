from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from apps.customer.models import CustomerProfile, CustomerAddress
from apps.customer.serializers import (
    CustomerProfileSerializer, CustomerProfileUpdateSerializer, CustomerAddressSerializer
)
from apps.customer.permissions import IsCustomerOwner

class CustomerProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomerProfile.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated, IsCustomerOwner]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return CustomerProfile.objects.get(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CustomerProfileUpdateSerializer
        return CustomerProfileSerializer


class CustomerAddressListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOwner]

    def get_queryset(self):
        return CustomerAddress.objects.filter(customer__user=self.request.user, is_active=True)

    def perform_create(self, serializer):
        profile = CustomerProfile.objects.get(user=self.request.user)
        serializer.save(customer=profile, tenant=self.request.tenant, created_by=self.request.user)


class CustomerAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOwner]

    def get_queryset(self):
        return CustomerAddress.objects.filter(customer__user=self.request.user, is_active=True)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
