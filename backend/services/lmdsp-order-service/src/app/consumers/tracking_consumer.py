import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.courier_id = self.scope["url_route"]["kwargs"]["courier_id"]
        self.group_name = f"courier_{self.courier_id}_tracking"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(json.dumps({"message": "Tracking Stream Connected"}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        payload = json.loads(text_data)
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "tracking_update",
                "data": payload,
            },
        )

    async def tracking_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))
