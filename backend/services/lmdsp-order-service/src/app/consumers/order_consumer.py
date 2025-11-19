import json
from channels.generic.websocket import AsyncWebsocketConsumer

class OrderStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.tenant_id = self.scope["url_route"]["kwargs"]["tenant_id"]
        self.group_name = f"tenant_{self.tenant_id}_orders"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(json.dumps({"message": "Connected to Order Stream"}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        payload = json.loads(text_data)
        event_type = payload.get("event", "update")
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "order_update",
                "event": event_type,
                "data": payload,
            },
        )

    async def order_update(self, event):
        await self.send(text_data=json.dumps(event))
