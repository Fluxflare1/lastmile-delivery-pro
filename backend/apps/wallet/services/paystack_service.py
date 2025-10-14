import requests
from django.conf import settings


class PaystackService:
    BASE_URL = "https://api.paystack.co"
    HEADERS = {"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"}

    @classmethod
    def create_dva(cls, user):
        """Create a Paystack Dedicated Virtual Account (DVA) for the user."""
        data = {
            "customer": user.email,
            "preferred_bank": "wema-bank",
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": getattr(user, "phone_number", ""),
        }
        url = f"{cls.BASE_URL}/dedicated_account/assign"
        resp = requests.post(url, json=data, headers=cls.HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.json()["data"]

    @classmethod
    def verify_transaction(cls, reference):
        url = f"{cls.BASE_URL}/transaction/verify/{reference}"
        resp = requests.get(url, headers=cls.HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.json()["data"]
