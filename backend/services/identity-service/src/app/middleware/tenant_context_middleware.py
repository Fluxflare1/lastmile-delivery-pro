from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)

class TenantContextMiddleware(MiddlewareMixin):
    """Extracts tenant_id from headers or user profile for multi-tenancy."""

    def process_request(self, request):
        tenant_id = request.headers.get("X-Tenant-ID")
        user = getattr(request, "user", None)

        if user and getattr(user, "tenant_id", None):
            tenant_id = user.tenant_id

        request.tenant_id = tenant_id
        if tenant_id:
            logger.info(f"Tenant Context: {tenant_id}")
