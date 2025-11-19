from django.urls import path
from app.views.auth_views import RegisterView, LoginView, LogoutView
from app.views.social_views import SocialLoginView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("social/login/", SocialLoginView.as_view(), name="social-login"),
]
