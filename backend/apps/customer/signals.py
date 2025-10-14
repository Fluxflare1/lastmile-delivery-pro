from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.accounts.models import User
from .models import Address

@receiver(post_save, sender=User)
def create_default_address(sender, instance, created, **kwargs):
    """Optional: create a placeholder default address for new customers."""
    if created and instance.role == "customer":
        Address.objects.create(
            user=instance,
            label="Home",
            street_address="",
            city="",
            state="",
            is_default=True,
        )
