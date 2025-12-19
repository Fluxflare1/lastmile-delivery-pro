from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views.transaction_view import TransactionViewSet
from app.views.payout_view import PayoutViewSet
from app.views.webhook_view import payment_webhook

router = DefaultRouter()
router.register("transactions", TransactionViewSet, basename="transactions")
router.register("payouts", PayoutViewSet, basename="payouts")

urlpatterns = [
    path("", include(router.urls)),
    path("webhook/<str:gateway>/", payment_webhook),
]
