from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction

from .models import WalletAccount, WalletTransaction, WalletTransfer, WalletEscrow
from .serializers import (
    WalletAccountSerializer,
    WalletTransactionSerializer,
    WalletTransferSerializer,
    WalletEscrowSerializer,
)
from .permissions import IsWalletOwner
from .services.transaction_service import WalletTransactionService


class WalletAccountView(generics.RetrieveAPIView):
    """Retrieve the authenticated user's wallet."""
    serializer_class = WalletAccountSerializer
    permission_classes = [permissions.IsAuthenticated, IsWalletOwner]

    def get_object(self):
        return WalletAccount.objects.get(user=self.request.user, tenant=self.request.tenant, is_active=True)


class WalletTransactionListView(generics.ListAPIView):
    """List all transactions for the authenticated user wallet."""
    serializer_class = WalletTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        wallet = WalletAccount.objects.get(user=self.request.user, tenant=self.request.tenant, is_active=True)
        return wallet.transactions.filter(tenant=self.request.tenant, is_active=True)


class WalletTransferView(generics.CreateAPIView):
    """Initiate wallet-to-wallet transfer."""
    serializer_class = WalletTransferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        source_wallet = WalletAccount.objects.get(user=self.request.user, tenant=self.request.tenant)
        serializer.save(tenant=self.request.tenant, source_wallet=source_wallet, created_by=self.request.user)


class WalletDepositView(APIView):
    """Handle Paystack DVA or manual wallet funding."""
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        amount = request.data.get("amount")
        if not amount or float(amount) <= 0:
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        wallet = WalletAccount.objects.get(user=request.user, tenant=request.tenant)
        WalletTransactionService.credit_wallet(wallet, amount, narration="Manual Deposit")
        return Response({"message": "Deposit successful"}, status=status.HTTP_200_OK)
