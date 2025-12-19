from rest_framework import serializers
from app.models.analytics_event import AnalyticsEvent

class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = "__all__"
