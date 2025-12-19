from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models.notification import Notification
from app.serializers.notification_serializer import NotificationSerializer
from app.tasks.send_notification import send_message
import logging

logger = logging.getLogger(__name__)

class NotifyView(APIView):
    """General endpoint to queue notification sending."""

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            notification = serializer.save()
            send_message.delay(str(notification.id))
            logger.info(f"[NotifyView] Notification queued for {notification.recipient}")
            return Response({"message": "Notification queued"}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
