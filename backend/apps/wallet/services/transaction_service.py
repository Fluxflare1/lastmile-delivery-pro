from django.db import transaction
from .models import WalletTransaction


class WalletTransactionService:
    @staticmethod
    @transaction.atomic
    def credit_wallet(wallet, amount, narration="", external_reference=None, created_by=None):
        balance_before = wallet.balance
        balance_after = balance_before + float(amount)

        WalletTransaction.objects.create(
            tenant=wallet.tenant,
            wallet=wallet,
            transaction_type=WalletTransaction.TransactionType.CREDIT,
            amount=amount,
            balance_before=balance_before,
            balance_after=balance_after,
            narration=narration,
            status=WalletTransaction.TransactionStatus.SUCCESS,
            external_reference=external_reference,
            created_by=created_by,
        )

        wallet.balance = balance_after
        wallet.save(update_fields=["balance"])
        return wallet

    @staticmethod
    @transaction.atomic
    def debit_wallet(wallet, amount, narration="", external_reference=None, created_by=None):
        if wallet.balance < float(amount):
            raise ValueError("Insufficient balance")

        balance_before = wallet.balance
        balance_after = balance_before - float(amount)

        WalletTransaction.objects.create(
            tenant=wallet.tenant,
            wallet=wallet,
            transaction_type=WalletTransaction.TransactionType.DEBIT,
            amount=amount,
            balance_before=balance_before,
            balance_after=balance_after,
            narration=narration,
            status=WalletTransaction.TransactionStatus.SUCCESS,
            external_reference=external_reference,
            created_by=created_by,
        )

        wallet.balance = balance_after
        wallet.save(update_fields=["balance"])
        return wallet
