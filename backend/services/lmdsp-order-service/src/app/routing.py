from django.urls import re_path
from app.consumers.order_consumer import OrderStatusConsumer
from app.consumers.tracking_consumer import TrackingConsumer

websocket_urlpatterns = [
    re_path(r"ws/orders/(?P<tenant_id>[0-9a-f-]+)/$", OrderStatusConsumer.as_asgi()),
    re_path(r"ws/tracking/(?P<courier_id>[0-9a-f-]+)/$", TrackingConsumer.as_asgi()),
]
