from celery import shared_task
from app.utils.service_clients import update_tracking, send_notification
from app.utils.tracking_stream import broadcast_courier_update

@shared_task(name="tracking.status_update")
def handle_tracking_update(order_id, new_status, recipient_id):
    update_tracking(order_id, new_status)
    send_notification(
        recipient_id=recipient_id,
        title="Order Update",
        message=f"Your order {order_id} status changed to {new_status}."
    )
    return f"Tracking update for order {order_id} processed."



broadcast_courier_update(recipient_id, {
    "order_id": str(order_id),
    "status": new_status,
})
