from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token_key):
    try:
        token = AccessToken(token_key)
        user = User.objects.get(id=token["user_id"])
        return user
    except Exception:
        return None


class JWTAuthMiddleware:
    """Middleware for authenticating WebSocket connections using JWT."""

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return JWTAuthMiddlewareInstance(scope, self)


class JWTAuthMiddlewareInstance:
    def __init__(self, scope, middleware):
        self.scope = scope
        self.middleware = middleware

    async def __call__(self, receive, send):
        query_string = self.scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token_key = params.get("token", [None])[0]

        self.scope["user"] = await get_user_from_token(token_key)
        inner = self.middleware.inner(self.scope)
        return await inner(receive, send)
