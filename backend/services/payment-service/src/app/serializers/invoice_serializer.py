from rest_framework import serializers
from app.models.invoice import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"
        read_only_fields = ("id", "issued_at", "paid_at")
