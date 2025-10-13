Perfect ✅

Below is the production-grade README.md for

📄 backend/apps/core/README.md

This document explains how the Core module functions as the backbone of the backend,
defines reusable base models and middleware, and describes how every module — backend and frontend — depends on it.


---

📘 backend/apps/core/README.md

# 🧩 Core Module — Last Mile Delivery Services Pro (LMDSP)

**Path:** `backend/apps/core/`

---

## 🎯 Purpose

The **Core module** defines the shared building blocks and global middleware that ensure consistency, traceability, and tenant-aware operations across the entire platform.  
All backend modules (`accounts`, `orders`, `billing`, `notifications`, `couriers`, etc.) depend on this layer.

It acts as the **foundation** for:

- Shared abstract models (`BaseModel`, `TenantBaseModel`, `AuditModel`)
- Global request context and tenant management
- Middleware for logging, correlation IDs, and secure media
- Cross-module utilities and constants

---

## 📁 Directory Structure

backend/apps/core/ ├── init.py ├── models.py ├── middleware.py └── README.md

---

## 🧱 Core Components

### 1️⃣ Base Models (`models.py`)

Defines foundational Django ORM classes used throughout the system.

| Class | Description | Used By |
|-------|--------------|---------|
| `TimeStampedModel` | Adds `created_at`, `updated_at` fields | All models |
| `AuditModel` | Adds `created_by`, `updated_by` user tracking | Accounts, Orders, Billing |
| `TenantBaseModel` | Enforces tenant ownership via `tenant` FK | Multi-tenant modules |
| `SoftDeleteModel` | Implements logical deletion (is_active flag) | Couriers, Clients, etc. |

**Integration Example**
```python
from apps.core.models import TenantBaseModel, AuditModel

class Order(TenantBaseModel, AuditModel):
    tracking_number = models.CharField(max_length=32, unique=True)
    status = models.CharField(max_length=20)

> 💡 When a model inherits from TenantBaseModel, all queries are automatically filtered by the current tenant resolved via middleware.




---

2️⃣ Middleware (middleware.py)

Implements five enterprise-grade middlewares:

Middleware	Function	Frontend Connection

TenantMiddleware	Resolves tenant context (X-Tenant-ID header or subdomain)	Frontend must include tenant header
CorrelationIdMiddleware	Injects a unique X-Correlation-ID for tracing	Included in every request header
RequestLoggingMiddleware	Logs all requests with user and duration	Aids performance monitoring
SecureMediaMiddleware	Enforces media file access control by tenant	Protects profile images and docs
CurrentUserMiddleware	Tracks the authenticated user for audit fields	Enables auto created_by tracking


Frontend Example (Next.js API client):

axios.interceptors.request.use((config) => {
  config.headers['X-Tenant-ID'] = process.env.NEXT_PUBLIC_TENANT_ID;
  config.headers['X-Correlation-ID'] = crypto.randomUUID();
  return config;
});


---

3️⃣ Tenant Context

Each API request carries tenant information from either:

Header → X-Tenant-ID

Subdomain → tenant-name.lmdsp.com


The TenantMiddleware resolves this and attaches:

request.tenant  # <Tenant: DHL Nigeria>
connection.tenant = request.tenant

This ensures:

Automatic ORM filtering per tenant

Isolation of customer data

Correct media routing



---

4️⃣ Audit Trail

Every model inheriting AuditModel automatically captures:

created_by — set from request.current_user

updated_by — updated during save

created_at / updated_at — timestamps


These fields are populated by CurrentUserMiddleware.

Example:

order = Order.objects.create(..., created_by=request.current_user)


---

5️⃣ Secure Media Layer

SecureMediaMiddleware ensures:

Only authenticated users access media URLs

Tenants can only view their own files (/media/<tenant_uuid>/...)

Unauthorized access returns 403 Forbidden


This connects to profile image uploads, proof-of-delivery images, and other sensitive assets.


---

🧩 Cross-Module Dependencies

Consuming Module	Uses from core	Purpose

accounts	AuditModel, TenantBaseModel	User, Tenant, and Role models
orders	TenantBaseModel, AuditModel	Order lifecycle and ownership
billing	AuditModel	Invoice and transaction tracking
couriers	SoftDeleteModel, AuditModel	Courier profile, license management
notifications	Middleware context (tenant, correlation_id)	Tenant-specific alerts
analytics	Models base timestamps	Operational reporting consistency



---

🔌 Frontend Integration

Each frontend app — Customer App, Courier App, DCSD Panel, Client Portal — communicates through the shared API Gateway powered by Django REST Framework and Core middleware.

Frontend App	Required Headers	Purpose

Customer App	X-Tenant-ID, X-Correlation-ID	Tracks tenant (LMDSP branch)
Courier App	X-Tenant-ID	Assigns courier to tenant route
Client Portal	X-Tenant-ID, Authorization	Enforces client-specific data scope
Admin Portal	Authorization	Platform-level access



---

🧰 Setup Notes

1. Enable Middleware in settings.py:

MIDDLEWARE += [
    'apps.core.middleware.CorrelationIdMiddleware',
    'apps.core.middleware.TenantMiddleware',
    'apps.core.middleware.CurrentUserMiddleware',
    'apps.core.middleware.RequestLoggingMiddleware',
    'apps.core.middleware.SecureMediaMiddleware',
]


2. Media Folder in Docker Volume:

Mounted at /media

Isolated by tenant UUID

Example: /media/<tenant_uuid>/profile_pics/...



3. Audit Auto-Tracking:

Relies on request.current_user from middleware

Works automatically for all DRF serializers inheriting from AuditModel





---

🧩 Summary

Layer	Responsibility	Used By

Base Models	Standardizes fields, timestamps, ownership	All data models
Middleware	Context injection, logging, security	All requests
Tenant Context	Multi-tenant data separation	Every app
Audit Trail	Tracks who/when data changes	Compliance, analytics
Secure Media	Protects file access	Profiles, PODs, Documents



---

📡 Backend ↔ Frontend Data Flow

Frontend (Next.js Apps)
  │
  ├─ sends →  X-Tenant-ID, X-Correlation-ID, JWT
  │
  ▼
Backend (Django + DRF + Core Middleware)
  │
  ├─ TenantMiddleware → identifies tenant
  ├─ CurrentUserMiddleware → tracks user
  ├─ RequestLoggingMiddleware → logs activity
  └─ SecureMediaMiddleware → controls access
  │
  ▼
Database (PostgreSQL + Tenant Schema Isolation)


---

🏁 Key Takeaways

The Core module is mandatory for all features.

It guarantees multi-tenant security, auditable data, and traceable operations.

All modules, serializers, and APIs must import models from core.models for consistency.

All frontend requests must include tenant and correlation headers for correct routing and observability.



---

Next Step:
Proceed to implement the Customer App Backend Layer, which will consume the core base models and middleware for user context, tenant ownership, and audit trail management.

---

Would you like me to now generate the **production-ready backend code** for the **Customer App Backend Layer** (Phase 2) — including models, serializers, views, and endpoints using this Core foundation?

