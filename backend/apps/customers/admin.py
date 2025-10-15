from django.contrib import admin
from .models import CustomerProfile, CustomerAddress  # Your actual models

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone", "tenant")
    list_filter = ("tenant", "is_active")
    search_fields = ("user__email", "user__full_name", "phone")

@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = ("customer", "label", "city", "state", "is_default")
    list_filter = ("state", "is_default", "tenant")
    search_fields = ("customer__user__email", "city", "state", "label")
