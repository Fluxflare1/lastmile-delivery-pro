import redis
import time
from django.conf import settings
from rest_framework.exceptions import Throttled

r = redis.StrictRedis.from_url(settings.CELERY_BROKER_URL)

def rate_limit(ip: str, limit: int = 50, period: int = 60):
    """Rate limits requests per IP using Redis sliding window."""
    key = f"rl:{ip}"
    now = time.time()
    pipeline = r.pipeline()
    pipeline.zadd(key, {now: now})
    pipeline.zremrangebyscore(key, 0, now - period)
    pipeline.zcard(key)
    pipeline.expire(key, period)
    count = pipeline.execute()[2]
    if count > limit:
        raise Throttled(detail="Rate limit exceeded. Try again later.")
