from django.utils.deprecation import MiddlewareMixin

class MultiChannelMiddleware(MiddlewareMixin):
    """
    Middleware to detect channel from headers or subdomain
    (e.g., X-Channel: LMDSP / DCSD / ADMIN)
    """

    def process_request(self, request):
        request.channel = request.headers.get("X-Channel", "LMDSP")
