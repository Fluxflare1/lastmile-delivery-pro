from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
import uuid

from apps.core.models import TenantBaseModel, AuditModel, SoftDeleteModel


class WalletAccount(TenantBaseModel, AuditModel, SoftDeleteModel):
    """
    Represents a digital wallet account for all user types.
    Supports Paystack DVA integration.
    """

    class AccountType(models.TextChoices):
        CUSTOMER = 'CUSTOMER', _('Customer')
        COURIER = 'COURIER', _('Courier')
        LMDSP = 'LMDSP', _('LMDSP Partner')
        DCSD = 'DCSD', _('DCSD Account')
        CLIENT = 'CLIENT', _('Corporate Client')
        FLEET_PARTNER = 'FLEET_PARTNER', _('Fleet Partner')
        PLATFORM = 'PLATFORM', _('Platform Account')

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallet_account",
        null=True,
        blank=True
    )
    account_number = models.CharField(max_length=20, unique=True, editable=False)
    account_type = models.CharField(max_length=50, choices=AccountType.choices)
    owner_name = models.CharField(max_length=255)
    currency = models.CharField(max_length=5, default="NGN")
    balance = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0.00"))
    paystack_dva_id = models.CharField(max_length=100, blank=True, null=True)
    paystack_account_name = models.CharField(max_length=255, blank=True, null=True)
    paystack_bank_name = models.CharField(max_length=255, blank=True, null=True)
    paystack_bank_code = models.CharField(max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = str(uuid.uuid4().int)[:10]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.owner_name} ({self.account_type})"


class WalletTransaction(TenantBaseModel, AuditModel, SoftDeleteModel):
    """
    Represents all wallet transactions (debits and credits).
    Immutable ledger entries.
    """

    class TransactionType(models.TextChoices):
        CREDIT = 'CREDIT', _('Credit')
        DEBIT = 'DEBIT', _('Debit')

    class TransactionStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        SUCCESS = 'SUCCESS', _('Success')
        FAILED = 'FAILED', _('Failed')

    wallet = models.ForeignKey(
        WalletAccount,
        on_delete=models.CASCADE,
        related_name="transactions"
    )
    transaction_type = models.CharField(max_length=10, choices=TransactionType.choices)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    reference = models.CharField(max_length=100, unique=True)
    narration = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=TransactionStatus.choices, default=TransactionStatus.PENDING)
    balance_before = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0.00"))
    balance_after = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0.00"))
    source_account = models.ForeignKey(
        WalletAccount,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="outgoing_transactions"
    )
    destination_account = models.ForeignKey(
        WalletAccount,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="incoming_transactions"
    )

    def __str__(self):
        return f"{self.wallet.owner_name} - {self.transaction_type} - {self.amount}"


class WalletEscrow(TenantBaseModel, AuditModel, SoftDeleteModel):
    """
    Handles funds held in escrow between sender and recipient.
    """

    sender_wallet = models.ForeignKey(
        WalletAccount,
        on_delete=models.CASCADE,
        related_name="escrow_sent"
    )
    receiver_wallet = models.ForeignKey(
        WalletAccount,
        on_delete=models.CASCADE,
        related_name="escrow_received"
    )
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    is_released = models.BooleanField(default=False)
    released_at = models.DateTimeField(blank=True, null=True)
    reference = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"Escrow: {self.reference}"
