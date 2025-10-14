from django.urls import path
from . import views

urlpatterns = [
    path("account/", views.WalletAccountView.as_view(), name="wallet-account"),
    path("transactions/", views.WalletTransactionListView.as_view(), name="wallet-transactions"),
    path("transfer/", views.WalletTransferView.as_view(), name="wallet-transfer"),
    path("deposit/", views.WalletDepositView.as_view(), name="wallet-deposit"),
]
