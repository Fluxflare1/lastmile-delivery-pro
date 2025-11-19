from celery import shared_task
from app.models.order import Order
from app.utils.service_clients import notify_dispatch_service, update_tracking, send_notification

@shared_task(name="order.created")
def process_new_order(order_id):
    try:
        order = Order.objects.get(id=order_id)
        order.status = "PENDING"
        order.save()

        # Notify Dispatch Service
        notify_dispatch_service(order.id, order.tenant_id)

        # Notify Tracking Service
        update_tracking(order.id, "Order Created")

        # Notify Customer
        send_notification(
            recipient_id=order.customer_id,
            title="Order Created",
            message=f"Your order {order.id} has been created successfully."
        )

        return f"Order {order_id} processed successfully."

    except Exception as e:
        return f"Error processing order {order_id}: {str(e)}"
