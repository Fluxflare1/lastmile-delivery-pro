from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "full_name", "role", "channel", "is_active", "created_at")
    search_fields = ("email", "full_name", "role")
    list_filter = ("channel", "role", "is_active")
