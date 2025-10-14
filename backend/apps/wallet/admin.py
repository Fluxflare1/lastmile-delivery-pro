from django.contrib import admin
from .models import WalletAccount, WalletTransaction, WalletTransfer, WalletEscrow


@admin.register(WalletAccount)
class WalletAccountAdmin(admin.ModelAdmin):
    list_display = ("account_number", "user", "account_type", "balance", "currency", "tenant")
    search_fields = ("account_number", "user__email")


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ("reference", "wallet", "transaction_type", "amount", "status", "created_at")
    list_filter = ("transaction_type", "status")
    search_fields = ("reference",)


@admin.register(WalletTransfer)
class WalletTransferAdmin(admin.ModelAdmin):
    list_display = ("reference", "source_wallet", "destination_wallet", "amount", "status", "created_at")


@admin.register(WalletEscrow)
class WalletEscrowAdmin(admin.ModelAdmin):
    list_display = ("order_reference", "amount", "is_released", "released_at")
    list_filter = ("is_released",)
