from django.db import models, transaction
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
import uuid

from apps.core.models import TenantBaseModel, AuditModel, SoftDeleteModel


class WalletAccount(TenantBaseModel, AuditModel, SoftDeleteModel):
    """
    Represents a unique wallet account per user.
    Created automatically upon user registration.
    """

    class AccountType(models.TextChoices):
        CUSTOMER = "CUSTOMER", _("Customer Account")
        COURIER = "COURIER", _("Courier Account")
        LMDSP = "LMDSP", _("LMDSP Account")
        DCSD = "DCSD", _("DCSD Account")
        CLIENT = "CLIENT", _("Client Account")
        FLEET_PARTNER = "FLEET_PARTNER", _("Fleet Partner Account")
        PLATFORM = "PLATFORM", _("Platform Account")

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="wallet_account",
        unique=True,
    )
    account_type = models.CharField(
        max_length=30,
        choices=AccountType.choices,
        default=AccountType.CUSTOMER,
    )
    account_number = models.CharField(max_length=20, unique=True, editable=False)
    balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
    )
    currency = models.CharField(max_length=5, default="NGN")
    paystack_dva_id = models.CharField(
        max_length=255, blank=True, null=True, help_text="Paystack DVA account ID"
    )

    class Meta:
        db_table = "wallet_accounts"
        verbose_name = "Wallet Account"
        verbose_name_plural = "Wallet Accounts"

    def __str__(self):
        return f"{self.account_number} - {self.owner_name}"

    @property
    def owner_name(self):
        """Return full name for user or organization name for business accounts."""
        if hasattr(self.user, "company_name") and self.user.company_name:
            return self.user.company_name
        return f"{self.user.first_name} {self.user.last_name}".strip()

    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = self.generate_account_number()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_account_number():
        """Generates unique account number with UUID suffix for uniqueness."""
        return str(uuid.uuid4().int)[:12]


class WalletTransaction(TenantBaseModel, AuditModel, SoftDeleteModel):
    """
    Immutable ledger of all wallet transactions.
    """

    class TransactionType(models.TextChoices):
        CREDIT = "CREDIT", _("Credit")
        DEBIT = "DEBIT", _("Debit")

    class TransactionStatus(models.TextChoices):
        PENDING = "PENDING", _("Pending")
        SUCCESS = "SUCCESS", _("Success")
        FAILED = "FAILED", _("Failed")

    reference = models.CharField(max_length=100, unique=True, editable=False)
    wallet = models.ForeignKey(
        WalletAccount, on_delete=models.PROTECT, related_name="transactions"
    )
    transaction_type = models.CharField(max_length=10, choices=TransactionType.choices)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    balance_before = models.DecimalField(max_digits=15, decimal_places=2)
    balance_after = models.DecimalField(max_digits=15, decimal_places=2)
    narration = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
    )
    external_reference = models.CharField(
        max_length=255, blank=True, null=True, help_text="Gateway reference (e.g. Paystack)"
    )

    class Meta:
        db_table = "wallet_transactions"
        verbose_name = "Wallet Transaction"
        verbose_name_plural = "Wallet Transactions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} ({self.reference})"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = str(uuid.uuid4()).replace("-", "").upper()[:20]
        # enforce immutability
        if self.pk:
            raise ValueError("Transactions are immutable and cannot be updated.")
        super().save(*args, **kwargs)


class WalletTransfer(TenantBaseModel, AuditModel, SoftDeleteModel):
    """
    Represents wallet-to-wallet transfers.
    """

    source_wallet = models.ForeignKey(
        WalletAccount,
        on_delete=models.PROTECT,
        related_name="outgoing_transfers",
    )
    destination_wallet = models.ForeignKey(
        WalletAccount,
        on_delete=models.PROTECT,
        related_name="incoming_transfers",
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    reference = models.CharField(max_length=100, unique=True, editable=False)
    narration = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=WalletTransaction.TransactionStatus.choices,
        default=WalletTransaction.TransactionStatus.PENDING,
    )

    class Meta:
        db_table = "wallet_transfers"
        verbose_name = "Wallet Transfer"
        verbose_name_plural = "Wallet Transfers"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = f"TRF-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    @transaction.atomic
    def execute_transfer(self):
        """
        Executes wallet transfer with atomic balance updates.
        """
        if self.source_wallet.balance < self.amount:
            raise ValueError("Insufficient balance.")

        # Debit source wallet
        WalletTransaction.objects.create(
            tenant=self.source_wallet.tenant,
            wallet=self.source_wallet,
            transaction_type=WalletTransaction.TransactionType.DEBIT,
            amount=self.amount,
            balance_before=self.source_wallet.balance,
            balance_after=self.source_wallet.balance - self.amount,
            narration=f"Transfer to {self.destination_wallet.account_number}",
            status=WalletTransaction.TransactionStatus.SUCCESS,
            created_by=self.created_by,
        )

        # Credit destination wallet
        WalletTransaction.objects.create(
            tenant=self.destination_wallet.tenant,
            wallet=self.destination_wallet,
            transaction_type=WalletTransaction.TransactionType.CREDIT,
            amount=self.amount,
            balance_before=self.destination_wallet.balance,
            balance_after=self.destination_wallet.balance + self.amount,
            narration=f"Transfer from {self.source_wallet.account_number}",
            status=WalletTransaction.TransactionStatus.SUCCESS,
            created_by=self.created_by,
        )

        # Update balances atomically
        self.source_wallet.balance -= self.amount
        self.destination_wallet.balance += self.amount
        self.source_wallet.save()
        self.destination_wallet.save()

        self.status = WalletTransaction.TransactionStatus.SUCCESS
        super().save(update_fields=["status"])


class WalletEscrow(TenantBaseModel, AuditModel, SoftDeleteModel):
    """
    Manages escrowed funds between sender and receiver wallets.
    """

    sender_wallet = models.ForeignKey(
        WalletAccount,
        on_delete=models.PROTECT,
        related_name="escrow_sent",
    )
    receiver_wallet = models.ForeignKey(
        WalletAccount,
        on_delete=models.PROTECT,
        related_name="escrow_received",
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    order_reference = models.CharField(max_length=100, unique=True)
    is_released = models.BooleanField(default=False)
    released_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "wallet_escrows"
        verbose_name = "Wallet Escrow"
        verbose_name_plural = "Wallet Escrows"

    def __str__(self):
        return f"Escrow: {self.order_reference} ({self.amount})"
