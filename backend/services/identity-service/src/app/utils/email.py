from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_verification_email(user, token):
    verify_url = f"{settings.FRONTEND_BASE_URL}/verify-email?uid={user.id}&token={token}"
    subject = "Verify Your Email - Lastmile Delivery Pro"
    message = f"Hi {user.name},\n\nPlease verify your email address by clicking the link below:\n\n{verify_url}\n\nThank you!"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
    logger.info(f"Verification email sent to {user.email}")

def send_password_reset_email(user, token):
    reset_url = f"{settings.FRONTEND_BASE_URL}/reset-password?uid={user.id}&token={token}"
    subject = "Reset Your Password - Lastmile Delivery Pro"
    message = f"Hi {user.name},\n\nUse the link below to reset your password:\n\n{reset_url}\n\nIf you did not request this, please ignore this email."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
    logger.info(f"Password reset email sent to {user.email}")
