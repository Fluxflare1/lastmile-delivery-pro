from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from app.serializers.social_serializers import SocialAuthSerializer
from app.models.user import User
from app.models.social_account import SocialAccount
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import logging

logger = logging.getLogger(__name__)

class SocialLoginView(generics.GenericAPIView):
    serializer_class = SocialAuthSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        provider = serializer.validated_data["provider"]
        access_token = serializer.validated_data["access_token"]

        if provider == "google":
            response = requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            data = response.json()
            email = data.get("email")
            if not email:
                return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({"error": "Unsupported provider"}, status=status.HTTP_400_BAD_REQUEST)

        user, _ = User.objects.get_or_create(email=email, defaults={"name": data.get("name", ""), "is_verified": True})
        SocialAccount.objects.update_or_create(
            user=user,
            provider=provider,
            defaults={"provider_id": data["sub"], "email": email, "extra_data": data},
        )

        refresh = RefreshToken.for_user(user)
        logger.info(f"Social login success: {provider} - {email}")
        return Response(
            {"access_token": str(refresh.access_token), "refresh_token": str(refresh), "user": {"email": user.email, "name": user.name}},
            status=status.HTTP_200_OK,
        )
