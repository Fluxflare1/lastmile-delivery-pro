"""
Core Middleware for Last Mile Delivery Services Pro (LMDSP)
-----------------------------------------------------------
Implements:
  • Multi-tenant context injection
  • Request correlation ID logging
  • Secure media access (tenant isolation)
  • Request performance tracking

Author: LMDSP Engineering Team
Date: 2025
"""

import time
import uuid
import logging
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse, HttpResponseForbidden
from django.conf import settings
from django.db import connection
from django.utils.functional import SimpleLazyObject
from django.contrib.auth import get_user_model

from apps.accounts.models import Tenant  # used for tenant mapping

logger = logging.getLogger("core.middleware")


# =====================================================
# Tenant Context Middleware
# =====================================================

class TenantMiddleware(MiddlewareMixin):
    """
    Resolves tenant context based on the request domain or header.
    - Expected header: `X-Tenant-ID` or domain subdomain.
    - Sets request.tenant for ORM-level access filtering.
    """

    def process_request(self, request):
        tenant_id = request.headers.get("X-Tenant-ID")

        if not tenant_id and hasattr(request, "get_host"):
            domain = request.get_host().split(":")[0]
            tenant_id = domain.split(".")[0] if "." in domain else None

        try:
            request.tenant = Tenant.objects.get(uuid=tenant_id) if tenant_id else None
        except Tenant.DoesNotExist:
            request.tenant = None

        # Attach to connection for ORM hooks
        connection.tenant = request.tenant


# =====================================================
# Correlation ID Middleware
# =====================================================

class CorrelationIdMiddleware(MiddlewareMixin):
    """
    Injects a unique correlation ID into every request/response cycle
    for distributed tracing and log tracking.
    """

    def process_request(self, request):
        correlation_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        request.correlation_id = correlation_id
        logger.debug(f"[{correlation_id}] Incoming request: {request.path}")

    def process_response(self, request, response):
        if hasattr(request, "correlation_id"):
            response["X-Correlation-ID"] = request.correlation_id
        return response


# =====================================================
# Request Logging Middleware
# =====================================================

class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Logs each API request with method, path, user, tenant, and duration.
    This helps with monitoring performance and debugging.
    """

    def process_request(self, request):
        request._start_time = time.time()

    def process_response(self, request, response):
        duration = round(time.time() - getattr(request, "_start_time", time.time()), 3)
        user = getattr(request, "user", None)
        user_repr = f"{user.email}" if user and user.is_authenticated else "Anonymous"
        tenant_repr = getattr(getattr(request, "tenant", None), "name", "GLOBAL")

        logger.info(
            f"[{getattr(request, 'correlation_id', 'N/A')}] "
            f"{request.method} {request.path} "
            f"({response.status_code}) "
            f"user={user_repr} tenant={tenant_repr} duration={duration}s"
        )

        response["X-Request-Duration"] = f"{duration}s"
        return response


# =====================================================
# Secure Media Middleware
# =====================================================

class SecureMediaMiddleware(MiddlewareMixin):
    """
    Restricts access to media files based on tenant and authentication.
    - Blocks media access if tenant mismatch or user unauthorized.
    """

    def process_request(self, request):
        if request.path.startswith(settings.MEDIA_URL):
            if not request.user.is_authenticated:
                return HttpResponseForbidden("Unauthorized media access.")
            # Optional tenant-level enforcement
            if hasattr(request, "tenant") and request.tenant:
                tenant_segment = request.path.split("/")[2]
                if str(request.tenant.uuid) != tenant_segment:
                    return HttpResponseForbidden("Cross-tenant media access denied.")
        return None


# =====================================================
# Attach current user for audit models (lazy object)
# =====================================================

def get_current_user(request):
    """Returns authenticated user or None."""
    if hasattr(request, "user") and request.user.is_authenticated:
        return request.user
    return None


class CurrentUserMiddleware(MiddlewareMixin):
    """
    Provides thread-safe current user context across the request.
    Useful for auto-setting created_by / updated_by in model saves.
    """

    def process_request(self, request):
        request.current_user = SimpleLazyObject(lambda: get_current_user(request))
