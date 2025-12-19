from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from app.models.ticket_comment import TicketComment
from app.serializers.ticket_comment_serializer import TicketCommentSerializer

class TicketCommentViewSet(viewsets.ModelViewSet):
    queryset = TicketComment.objects.all()
    serializer_class = TicketCommentSerializer
    permission_classes = [IsAuthenticated]
