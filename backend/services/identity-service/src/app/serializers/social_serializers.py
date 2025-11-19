from rest_framework import serializers

class SocialAuthSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=["google", "facebook", "apple"])
    access_token = serializers.CharField()
