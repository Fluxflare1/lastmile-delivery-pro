from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from app.models.ticket import Ticket
from app.serializers.ticket_serializer import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()
