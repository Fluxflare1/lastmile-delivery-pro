from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from app.serializers.analytics_event_serializer import AnalyticsEventSerializer
from app.models.analytics_event import AnalyticsEvent
import logging

logger = logging.getLogger(__name__)

class AnalyticsIngestView(APIView):
    """Endpoint for microservices to post events."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AnalyticsEventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(service_source=request.headers.get("X-Service-Name", "unknown"))
            logger.info(f"[AnalyticsIngest] Event received: {serializer.validated_data['event_type']}")
            return Response({"message": "Event recorded"}, status=status.HTTP_201_CREATED)
        logger.error(f"[AnalyticsIngest] Invalid event: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
