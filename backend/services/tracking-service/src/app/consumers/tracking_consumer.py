import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.gis.geos import Point
from django.utils import timezone
from app.models.tracking import Courier, CourierLocation
from app.tasks.tracking_tasks import check_sla_compliance, detect_route_deviation


class TrackingConsumer(AsyncWebsocketConsumer):
    """
    Real-time WebSocket consumer for live courier location updates and tracking stream.
    """

    async def connect(self):
        self.courier_id = self.scope["url_route"]["kwargs"].get("courier_id")
        self.room_group_name = f"tracking_{self.courier_id}"

        # Add this connection to Redis group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.send(json.dumps({"message": "Tracking connection established"}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """Handles location updates sent by courier apps"""
        data = json.loads(text_data)
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude and longitude:
            await self.save_location(latitude, longitude)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "broadcast_location",
                    "latitude": latitude,
                    "longitude": longitude,
                    "timestamp": str(timezone.now()),
                },
            )

    async def broadcast_location(self, event):
        """Broadcast courier location to all WebSocket clients"""
        await self.send(
            json.dumps(
                {
                    "event": "courier_location",
                    "latitude": event["latitude"],
                    "longitude": event["longitude"],
                    "timestamp": event["timestamp"],
                }
            )
        )

    @database_sync_to_async
    def save_location(self, lat, lon):
        """Persist courier location in DB"""
        try:
            courier = Courier.objects.get(id=self.courier_id)
            CourierLocation.objects.create(
                courier=courier,
                location=Point(float(lon), float(lat)),
                timestamp=timezone.now(),
            )
            courier.last_reported = timezone.now()
            courier.save(update_fields=["last_reported"])

            # Trigger background SLA checks
            check_sla_compliance.delay(str(courier.id))
            detect_route_deviation.delay(str(courier.id))
        except Courier.DoesNotExist:
            pass
