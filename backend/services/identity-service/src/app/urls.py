from django.urls import path
from app.views.auth_views import RegisterView, LoginView, LogoutView
from app.views.social_views import SocialLoginView
from app.views.email_views import (
    EmailVerificationRequestView,
    VerifyEmailView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)
from app.views.health_views import HealthCheckView, MetricsView

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("social/login/", SocialLoginView.as_view(), name="social-login"),

    # Email verification
    path("verify/request/", EmailVerificationRequestView.as_view(), name="email-verify-request"),
    path("verify/confirm/", VerifyEmailView.as_view(), name="email-verify-confirm"),

    # Password reset
    path("password/reset/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("password/reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

    # Health & Metrics
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("metrics/", MetricsView.as_view(), name="metrics"),
]
