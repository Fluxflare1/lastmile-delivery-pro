import uuid

class RequestTrackingMiddleware:
    """Adds a correlation ID and tracks client IP address for each request."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        correlation_id = str(uuid.uuid4())
        request.correlation_id = correlation_id
        request.client_ip = self._get_ip(request)
        response = self.get_response(request)
        response["X-Correlation-ID"] = correlation_id
        return response

    def _get_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        return x_forwarded_for.split(",")[0] if x_forwarded_for else request.META.get("REMOTE_ADDR")
