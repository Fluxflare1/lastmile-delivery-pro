# 🏦 Digital Wallet Module (Lastmile-delivery-pro)

## Overview
The Wallet app serves as the **financial backbone** of the Lastmile-delivery-pro ecosystem — powering multi-user, multi-tenant digital wallet services with Paystack DVA integration.

---

## Key Components
- **WalletAccount**: One-to-one per user. Auto-created at registration.  
- **WalletTransaction**: Immutable ledger of all debits/credits.  
- **WalletTransfer**: Atomic wallet-to-wallet transactions.  
- **WalletEscrow**: Escrow mechanism for deliveries until confirmation.  

---

## Multi-Tenancy & Security
- All models inherit from `TenantBaseModel`, `AuditModel`, and `SoftDeleteModel`.  
- All queries are tenant-filtered and soft-delete protected.  
- All balance updates use `@transaction.atomic`.  

---

## Paystack Integration
- Uses **Dedicated Virtual Accounts (DVA)** for funding.  
- Managed via `services/paystack_service.py`.  
- Each user receives a DVA automatically upon registration (`signals.py`).  

---

## API Endpoints
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/wallet/account/` | GET | Retrieve current user wallet |
| `/wallet/transactions/` | GET | List all wallet transactions |
| `/wallet/transfer/` | POST | Transfer to another wallet |
| `/wallet/deposit/` | POST | Deposit funds manually or via Paystack |

---

## Frontend Integration
Frontend calls these endpoints under `/api/wallet/...`.  
- Wallet balance displayed in Dashboard.  
- Wallet funding via Paystack inline widget or bank transfer (DVA).  
- Transaction history shown using `WalletTransactionSerializer`.

---

## Signals
Auto-creates a wallet when a new user registers, integrates Paystack DVA creation.

---

## Task Queue
Celery task (`tasks.py`) releases escrow when deliveries are confirmed.

---

## File Paths


backend/apps/wallet/ ├── models.py ├── serializers.py ├── permissions.py ├── views.py ├── urls.py ├── services/ │   ├── paystack_service.py │   └── transaction_service.py ├── signals.py ├── admin.py ├── tasks.py └── README.md
