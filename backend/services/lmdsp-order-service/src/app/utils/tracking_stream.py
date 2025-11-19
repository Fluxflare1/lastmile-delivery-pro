from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast_order_update(tenant_id, event_type, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"tenant_{tenant_id}_orders",
        {"type": "order_update", "event": event_type, "data": data},
    )

def broadcast_courier_update(courier_id, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"courier_{courier_id}_tracking",
        {"type": "tracking_update", "data": data},
    )
