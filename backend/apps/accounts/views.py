from rest_framework import generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UserProfileSerializer
from .models import User

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)
        return Response({"user": UserSerializer(user).data, "tokens": tokens}, status=status.HTTP_200_OK)

class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Combined profile view that handles both:
    - GET: Retrieve user profile
    - PUT/PATCH: Update profile with file upload support
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def get_serializer_class(self):
        # Use UserSerializer for GET, UserProfileSerializer for updates
        if self.request.method == 'GET':
            return UserSerializer
        return UserProfileSerializer

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        """Get user profile data"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        """Update profile with UserProfileSerializer logic"""
        serializer = UserProfileSerializer(
            request.user, 
            data=request.data, 
            partial=True  # Allow partial updates
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        """Partial update profile"""
        return self.put(request, *args, **kwargs)
