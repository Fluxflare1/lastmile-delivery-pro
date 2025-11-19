from django.db import models
from django.conf import settings
import uuid

class SocialAccount(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="social_accounts")
    provider = models.CharField(max_length=50)  # google, facebook, apple
    provider_id = models.CharField(max_length=255)
    email = models.EmailField()
    extra_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("provider", "provider_id")

    def __str__(self):
        return f"{self.provider} account for {self.email}"
