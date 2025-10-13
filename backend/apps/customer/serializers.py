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

class CustomerProfileSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    addresses = CustomerAddressSerializer(many=True, read_only=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            'id', 'user', 'user_full_name', 'phone', 'profile_picture',
            'profile_picture_url', 'default_address', 'addresses',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None

class CustomerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['phone', 'profile_picture']
