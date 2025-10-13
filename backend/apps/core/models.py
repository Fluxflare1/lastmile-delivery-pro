from django.db import models
from django.utils import timezone

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    class Meta:
        abstract = True


class ChannelAwareModel(models.Model):
    """
    Base class for channel-specific models (LMDSP / DCSD)
    """
    CHANNEL_CHOICES = [
        ("LMDSP", "Last-Mile Delivery Service Provider"),
        ("DCSD", "Direct Client Service Delivery"),
        ("ADMIN", "Platform Administration"),
    ]

    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES, default="LMDSP")

    class Meta:
        abstract = True
