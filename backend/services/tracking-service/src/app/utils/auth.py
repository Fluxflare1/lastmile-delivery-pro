from rest_framework import authentication, exceptions
from django.conf import settings


class ServiceTokenAuthentication(authentication.BaseAuthentication):
    """Custom auth for inter-service communication using shared token."""

    def authenticate(self, request):
        service_token = request.headers.get("X-Service-Token")
        if not service_token:
            return None

        valid_tokens = getattr(settings, "SERVICE_TOKENS", {})
        for service, token in valid_tokens.items():
            if service_token == token:
                request.service = service
                return (None, None)

        raise exceptions.AuthenticationFailed("Invalid service token.")
