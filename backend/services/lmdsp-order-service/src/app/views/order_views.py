from rest_framework import generics
from app.models.order import Order
from app.serializers.order_serializers import OrderSerializer
from app.tasks.order_tasks import process_new_order


class OrderListCreateView(generics.ListCreateAPIView):
    def perform_create(self, serializer):
    order = serializer.save()
    process_new_order.delay(str(order.id))
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer


class OrderRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = "id"




