from celery import shared_task
from app.utils.email import send_verification_email, send_password_reset_email
import logging

logger = logging.getLogger(__name__)

@shared_task(name="send_verification_email_task")
def send_verification_email_task(user_id, token, email):
    from app.models.user import User
    try:
        user = User.objects.get(id=user_id, email=email)
        send_verification_email(user, token)
        logger.info(f"Verification email dispatched to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User not found for email verification task - ID: {user_id}")

@shared_task(name="send_password_reset_email_task")
def send_password_reset_email_task(user_id, token, email):
    from app.models.user import User
    try:
        user = User.objects.get(id=user_id, email=email)
        send_password_reset_email(user, token)
        logger.info(f"Password reset email dispatched to {user.email}")
    except User.DoesNotExist:
        logger.error(f"User not found for password reset task - ID: {user_id}")
