from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import os
from uuid import uuid4


def profile_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid4()}.{ext}"
    return os.path.join('profiles/', filename)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPES = [
        ("sender", "Sender"),
        ("receiver", "Receiver"),
        ("both", "Both"),
    ]

    DEFAULT_ROLE = [
        ("sender", "Sender"),
        ("receiver", "Receiver"),
    ]

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    
    # Add profile management fields here
    full_name = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.ImageField(upload_to=profile_image_upload_path, blank=True, null=True)
    
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default="sender")
    default_role = models.CharField(max_length=10, choices=DEFAULT_ROLE, default="sender")
    profile_complete = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
