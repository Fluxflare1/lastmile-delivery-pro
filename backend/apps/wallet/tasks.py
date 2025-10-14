from celery import shared_task
from django.utils import timezone
from .models import WalletEscrow


@shared_task
def release_escrow(order_reference):
    """Releases funds from escrow when delivery confirmed."""
    try:
        escrow = WalletEscrow.objects.get(order_reference=order_reference, is_released=False)
        escrow.is_released = True
        escrow.released_at = timezone.now()
        escrow.save(update_fields=["is_released", "released_at"])
    except WalletEscrow.DoesNotExist:
        pass
