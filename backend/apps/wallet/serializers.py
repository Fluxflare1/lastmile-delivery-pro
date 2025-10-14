from rest_framework import serializers
from django.db import transaction
from .models import WalletAccount, WalletTransaction, WalletTransfer, WalletEscrow


class WalletAccountSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField()
    created_at = serializers.ReadOnlyField()
    updated_at = serializers.ReadOnlyField()

    class Meta:
        model = WalletAccount
        fields = [
            "id", "account_number", "account_type", "currency",
            "balance", "owner_name", "paystack_dva_id",
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "account_number", "owner_name",
            "balance", "paystack_dva_id", "created_at", "updated_at",
        ]


class WalletTransactionSerializer(serializers.ModelSerializer):
    wallet = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = WalletTransaction
        fields = [
            "id", "reference", "transaction_type", "amount",
            "balance_before", "balance_after", "narration",
            "status", "created_at", "wallet",
        ]
        read_only_fields = [
            "id", "reference", "balance_before", "balance_after",
            "status", "created_at", "wallet",
        ]


class WalletTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransfer
        fields = [
            "id", "source_wallet", "destination_wallet",
            "amount", "reference", "narration", "status",
            "created_at",
        ]
        read_only_fields = ["reference", "status", "created_at"]

    def validate(self, attrs):
        if attrs["source_wallet"] == attrs["destination_wallet"]:
            raise serializers.ValidationError("Cannot transfer to same wallet.")
        if attrs["amount"] <= 0:
            raise serializers.ValidationError("Transfer amount must be positive.")
        return attrs

    def create(self, validated_data):
        transfer = WalletTransfer.objects.create(**validated_data)
        transfer.execute_transfer()
        return transfer


class WalletEscrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletEscrow
        fields = [
            "id", "sender_wallet", "receiver_wallet", "amount",
            "order_reference", "is_released", "released_at",
        ]
        read_only_fields = ["is_released", "released_at"]
