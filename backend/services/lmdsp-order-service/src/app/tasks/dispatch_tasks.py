from celery import shared_task
from app.utils.service_clients import update_tracking, send_notification

@shared_task(name="dispatch.assignment")
def handle_dispatch_assignment(order_id, courier_id):
    update_tracking(order_id, "ASSIGNED")
    send_notification(
        recipient_id=courier_id,
        title="New Delivery Assignment",
        message=f"You’ve been assigned order {order_id}. Check your tasks."
    )
    return f"Dispatch assignment for {order_id} sent."
