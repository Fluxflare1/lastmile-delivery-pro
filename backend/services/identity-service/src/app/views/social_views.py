from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from app.models.user import User
from app.utils.tokens import email_verification_token, password_reset_token
from app.tasks import send_verification_email_task, send_password_reset_email_task
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
import logging

logger = logging.getLogger(__name__)

class EmailVerificationRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            token = email_verification_token.make_token(user)
            send_verification_email_task.delay(str(user.id), token, email)
            logger.info(f"Email verification initiated for {email}")
            return Response({"message": "Verification email sent."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request):
        uid = request.query_params.get("uid")
        token = request.query_params.get("token")
        try:
            user = User.objects.get(id=uid)
            if email_verification_token.check_token(user, token):
                user.is_verified = True
                user.save()
                return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Invalid user ID"}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            token = password_reset_token.make_token(user)
            send_password_reset_email_task.delay(str(user.id), token, email)
            return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("password")
        try:
            user = User.objects.get(id=uid)
            if password_reset_token.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Invalid user ID"}, status=status.HTTP_404_NOT_FOUND)
