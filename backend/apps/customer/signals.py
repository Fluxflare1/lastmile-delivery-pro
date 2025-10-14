from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.accounts.models import User
from .models import CustomerProfile, CustomerAddress  # Use your actual models

@receiver(post_save, sender=User)
def create_customer_profile(sender, instance, created, **kwargs):
    """Create customer profile when user with customer role is created."""
    if created and instance.role == "customer":
        customer_profile = CustomerProfile.objects.create(
            user=instance,
            phone=instance.phone or ""  # Adjust based on your User model
        )
        # Create default address linked to the customer profile
        CustomerAddress.objects.create(
            customer=customer_profile,
            label="Home",
            street="",
            city="", 
            state="",
            country="",
            is_default=True
        )
