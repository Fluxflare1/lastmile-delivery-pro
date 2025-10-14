from django.db import models
from django.conf import settings
from apps.core.models import TenantBaseModel, AuditModel, SoftDeleteModel

def customer_profile_upload_path(instance, filename):
    return f"media/{instance.tenant.uuid}/customers/{instance.user.id}/profile/{filename}"

def address_upload_path(instance, filename):
    return f"media/{instance.tenant.uuid}/customers/{instance.customer.user.id}/address/{filename}"

class CustomerProfile(TenantBaseModel, AuditModel, SoftDeleteModel):
    """Represents individual customer (sender/receiver) under a tenant (LMDSP)."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='customer_profile'
    )
    phone = models.CharField(max_length=20)
    profile_picture = models.ImageField(
        upload_to=customer_profile_upload_path, 
        null=True, 
        blank=True
    )
    default_address = models.ForeignKey(
        'CustomerAddress', 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL, 
        related_name='default_for_customer'
    )

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.tenant.name})"

    def save(self, *args, **kwargs):
        """Ensure default_address is synchronized with CustomerAddress.is_default."""
        # If this customer has a default address set via the address model, 
        # ensure the default_address field points to it
        if hasattr(self, 'addresses'):
            default_address = self.addresses.filter(is_default=True).first()
            if default_address and self.default_address != default_address:
                self.default_address = default_address
        super().save(*args, **kwargs)


class CustomerAddress(TenantBaseModel, AuditModel, SoftDeleteModel):
    """Stores multiple addresses for a customer."""
    customer = models.ForeignKey(
        CustomerProfile, 
        on_delete=models.CASCADE, 
        related_name='addresses'
    )
    label = models.CharField(max_length=50, help_text="e.g. Home, Office, Pickup Point")
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_default = models.BooleanField(default=False)
    proof_image = models.ImageField(
        upload_to=address_upload_path, 
        null=True, 
        blank=True
    )

    def __str__(self):
        return f"{self.label} - {self.street}, {self.city}"

    def save(self, *args, **kwargs):
        """
        Ensure only one default address per customer.
        Also synchronize with CustomerProfile.default_address.
        """
        if self.is_default:
            # Set all other addresses for this customer to non-default
            CustomerAddress.objects.filter(
                customer=self.customer, 
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
            
            # Update the customer's default_address field
            self.customer.default_address = self
            self.customer.save(update_fields=['default_address'])
        
        super().save(*args, **kwargs)
        
        # If this is the only address and no default exists, make it default
        if not self.is_default and not self.customer.addresses.filter(is_default=True).exists():
            self.is_default = True
            self.save(update_fields=['is_default'])

    class Meta:
        verbose_name_plural = "Customer Addresses"
        ordering = ['-is_default', '-created_at']
        constraints = [
            models.UniqueConstraint(
                condition=models.Q(is_default=True),
                fields=['customer'],
                name='unique_default_address_per_customer'
            )
        ]
