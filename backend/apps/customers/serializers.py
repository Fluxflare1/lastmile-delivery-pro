from rest_framework import serializers
from apps.customer.models import CustomerProfile, CustomerAddress

class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = [
            'id', 'label', 'street', 'city', 'state', 'country',
            'postal_code', 'latitude', 'longitude', 'is_default', 'proof_image',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        """
        Create address and set it as default if it's the first address
        or if explicitly marked as default.
        """
        request = self.context.get('request')
        
        # Get customer profile from context or user
        customer = validated_data.get('customer')
        if not customer and request and hasattr(request, 'user'):
            try:
                customer = request.user.customer_profile
            except CustomerProfile.DoesNotExist:
                raise serializers.ValidationError("User does not have a customer profile.")
        
        validated_data['customer'] = customer
        
        # If this is the first address, make it default
        if customer and not customer.addresses.exists():
            validated_data['is_default'] = True
        
        instance = super().create(validated_data)
        
        return instance

    def update(self, instance, validated_data):
        """
        Handle address updates, especially when setting as default.
        """
        is_default = validated_data.get('is_default', instance.is_default)
        
        # If setting as default, the model's save method will handle the uniqueness
        if is_default and not instance.is_default:
            validated_data['is_default'] = True
        
        return super().update(instance, validated_data)


class CustomerProfileSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    addresses = CustomerAddressSerializer(many=True, read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    default_address_details = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            'id', 'user', 'user_full_name', 'user_email', 'phone', 'profile_picture',
            'profile_picture_url', 'default_address', 'default_address_details', 
            'addresses', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None

    def get_default_address_details(self, obj):
        """Return serialized details of the default address."""
        if obj.default_address:
            return CustomerAddressSerializer(obj.default_address, context=self.context).data
        return None

    def update(self, instance, validated_data):
        """Handle profile updates with proper validation."""
        # Add any custom validation logic here if needed
        return super().update(instance, validated_data)


class CustomerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['phone', 'profile_picture']
        
    def validate_phone(self, value):
        """Validate phone number format if needed."""
        # Add phone validation logic here
        # Example: validate phone format, length, etc.
        if value and len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value


class CustomerAddressCreateSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for address creation with automatic customer assignment.
    """
    class Meta:
        model = CustomerAddress
        fields = [
            'label', 'street', 'city', 'state', 'country',
            'postal_code', 'latitude', 'longitude', 'is_default', 'proof_image'
        ]

    def create(self, validated_data):
        """
        Automatically assign the customer from the request user's profile.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            try:
                customer_profile = request.user.customer_profile
                validated_data['customer'] = customer_profile
            except CustomerProfile.DoesNotExist:
                raise serializers.ValidationError({
                    "detail": "User does not have a customer profile. Please create a profile first."
                })
        
        return super().create(validated_data)
