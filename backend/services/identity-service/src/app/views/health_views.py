from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from django.db import connection
import logging

logger = logging.getLogger(__name__)

class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            connection.ensure_connection()
            return Response({"status": "healthy"}, status=200)
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return Response({"status": "unhealthy", "error": str(e)}, status=500)


class MetricsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = Response(generate_latest(), content_type=CONTENT_TYPE_LATEST)
        response.status_code = 200
        return response
