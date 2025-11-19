import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class AuditLogMiddleware:
    """Captures all requests, responses, and user context for audit trail."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, "user", None)
        user_info = user.email if user and user.is_authenticated else "Anonymous"

        logger.info(
            f"[AUDIT] {datetime.utcnow().isoformat()} | User: {user_info} | Path: {request.path} | Method: {request.method} | IP: {self._get_ip(request)}"
        )

        response = self.get_response(request)
        return response

    def _get_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        return x_forwarded_for.split(",")[0] if x_forwarded_for else request.META.get("REMOTE_ADDR")
