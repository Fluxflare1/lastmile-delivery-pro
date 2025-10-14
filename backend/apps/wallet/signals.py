from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import WalletAccount
from .services.paystack_service import PaystackService


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_wallet_for_new_user(sender, instance, created, **kwargs):
    """Automatically create a wallet account for every new user."""
    if created and not hasattr(instance, "wallet_account"):
        wallet = WalletAccount.objects.create(
            user=instance, tenant=instance.tenant, created_by=instance
        )
        try:
            dva_data = PaystackService.create_dva(instance)
            wallet.paystack_dva_id = dva_data.get("id")
            wallet.save(update_fields=["paystack_dva_id"])
        except Exception:
            pass  # Log error; do not break user creation flow
