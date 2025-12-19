import os, requests

PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")

class PaystackClient:
    BASE_URL = "https://api.paystack.co"

    @staticmethod
    def initialize_transaction(email, amount, reference):
        url = f"{PaystackClient.BASE_URL}/transaction/initialize"
        headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
        payload = {"email": email, "amount": int(amount * 100), "reference": reference}
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def verify_transaction(reference):
        url = f"{PaystackClient.BASE_URL}/transaction/verify/{reference}"
        headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
