from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["email", "phone", "user_type", "default_role", "password", "full_name"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return {"user": user}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "email", "phone", "user_type", "default_role", 
            "profile_complete", "created_at", "full_name", "profile_image"
        ]
        read_only_fields = ["id", "email", "created_at"]

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone', 'profile_image',
            'user_type', 'default_role', 'profile_complete'
        ]
        read_only_fields = ['id', 'email']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update profile_complete status
        instance.profile_complete = all([
            instance.full_name,
            instance.phone,  # Note: using 'phone' not 'phone_number'
        ])
        instance.save()
        return instance


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return Address.objects.create(user=user, **validated_data)
