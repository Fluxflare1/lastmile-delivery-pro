from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models.notification import Notification
from app.tasks.send_notification import send_message

class AlertView(APIView):
    """Simplified webhook endpoint for internal service alerts."""

    def post(self, request):
        title = request.data.get("title")
        message = request.data.get("message")
        severity = request.data.get("severity", "info")
        recipients = request.data.get("recipients", [])

        for recipient in recipients:
            notif = Notification.objects.create(
                tenant_id=request.data.get("tenant_id"),
                recipient=recipient,
                channel="email",
                title=title,
                message=message,
                severity=severity,
            )
            send_message.delay(str(notif.id))
        return Response({"message": "Alerts queued"}, status=status.HTTP_202_ACCEPTED)
