Perfect ✅

Here’s the production-grade backend/apps/core/README.md — a comprehensive developer document that explains the purpose, architecture, and integration pattern of the Core module, which acts as the “foundation layer” for all other Django apps in Last Mile Delivery Services Pro (LMDSP).


---

📘 backend/apps/core/README.md

# Core Module – Shared Foundation Layer

## 📦 Overview

The **Core Module** is the **foundation of the entire backend system** for the Last Mile Delivery Services Pro (LMDSP) platform.  

It defines **shared models, utilities, middleware, mixins, and base logic** that power all other modules — ensuring consistency, scalability, and reusability across multi-tenant contexts (LMDSP and DCSD ecosystems).

All Django apps such as `accounts`, `orders`, `couriers`, `billing`, etc. **inherit from `core` base classes** for standard behavior like timestamps, soft deletion, audit tracking, tenant ownership, and common utilities.

---

## 🏗️ Directory Structure

backend/apps/core/ │ ├── init.py ├── apps.py ├── models.py             # Base models, mixins, and utilities ├── middleware.py         # Tenant-aware request processing, logging ├── utils.py              # Helper utilities, common functions ├── exceptions.py         # Custom error handlers ├── permissions.py        # Global permission mixins ├── management/ │   └── commands/ │       └── seed_roles.py # Example for initializing roles or tenants ├── tests/ │   └── test_core_models.py └── README.md

---

## ⚙️ Core Responsibilities

- Define **base model mixins** (`TimeStampedModel`, `SoftDeleteModel`, `TenantAwareModel`)
- Implement **multi-tenant request middleware**
- Manage **media handling** and shared storage utilities
- Define **audit trails** (created_by, updated_by)
- Provide **global error handlers**
- Enforce **unified permission structure**
- Offer **utility methods** for common backend logic

---

## 🧩 Key Components

### 1. Base Models

#### `TimeStampedModel`
Every model that inherits from this automatically gets:
- `created_at`
- `updated_at`
- Automatic ordering by `-created_at`

```python
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']

SoftDeleteModel

Adds soft deletion support (mark as deleted without removing data).

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save()

    class Meta:
        abstract = True

TenantAwareModel

Provides multi-tenant awareness for models under LMDSP and DCSD contexts.

class TenantAwareModel(models.Model):
    tenant = models.ForeignKey('accounts.Tenant', on_delete=models.CASCADE, related_name='%(class)s_tenant')
    
    class Meta:
        abstract = True

Used by modules such as:

orders (Order belongs to tenant)

couriers (Courier belongs to tenant)

billing (Invoices scoped to tenant)



---

2. Middleware

TenantMiddleware

Determines tenant context for every request.

Responsibilities:

Read subdomain or header (X-Tenant-ID)

Set request.tenant context

Enforce tenant isolation for all queries


class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tenant_header = request.headers.get('X-Tenant-ID')
        if tenant_header:
            from apps.accounts.models import Tenant
            try:
                request.tenant = Tenant.objects.get(uuid=tenant_header)
            except Tenant.DoesNotExist:
                request.tenant = None
        response = self.get_response(request)
        return response


---

3. Utilities (utils.py)

Shared helper functions used across modules.

Function	Purpose

generate_unique_code(prefix)	Generate tracking codes, invoice numbers
send_async_email(subject, message, to)	Async email via Celery
upload_to(instance, filename)	Standardized media upload path
get_client_ip(request)	Extract client IP for audit/logs
paginate_queryset(queryset, request)	Shared pagination logic for DRF views



---

4. Permissions (permissions.py)

Defines reusable permission mixins.

from rest_framework.permissions import BasePermission

class IsTenantAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['LMDSP_ADMIN', 'DCSD_ADMIN']

Used across:

orders.views

billing.views

couriers.views



---

5. Exception Handling (exceptions.py)

Provides standardized error responses across all APIs.

from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data['status_code'] = response.status_code
        response.data['error'] = str(exc)
    return response

Integrated via:

REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'apps.core.exceptions.custom_exception_handler',
}


---

🧱 Integration with Other Modules

Module	Dependency	How It Integrates

Accounts	Inherits TimeStampedModel, TenantAwareModel	For User, Profile, Tenant
Orders	Uses all core mixins	Tracks tenant, timestamps, and soft deletion
Billing	Extends TenantAwareModel	Invoices and transactions scoped per tenant
Couriers	Uses SoftDeleteModel, TenantAwareModel	Maintains courier data consistency
Notifications	Uses utilities	Email, SMS, and logging helpers
Analytics	Uses base models for unified data timestamps	Consistent metric aggregation



---

🧩 Frontend Integration Context

While the Core app doesn’t directly expose API endpoints to the frontend, it defines the global behaviors that affect frontend interaction consistency:

Feature	Frontend Impact

Tenant middleware	Ensures correct data isolation per organization in API calls
Soft delete model	Enables frontend to show “archived” instead of permanently deleted items
Standard timestamps	Used by dashboards to display "Created at" and "Updated at" info
Consistent error responses	Allows frontend to display standard toast notifications or modals
Pagination utility	All API list endpoints return uniform pagination format



---

🌐 Example Usage in Other Modules

In accounts.models

from apps.core.models import TimeStampedModel, TenantAwareModel

class User(AbstractBaseUser, TimeStampedModel, TenantAwareModel):
    ...

In orders.models

from apps.core.models import SoftDeleteModel

class Order(SoftDeleteModel):
    tracking_number = models.CharField(max_length=100)
    ...


---

⚡ Multi-Channel & Multi-Tenant Support

Tenant Handling

Each API request includes a header:

X-Tenant-ID: <tenant_uuid>

Automatically bound to every created record via TenantAwareModel.


Media Handling

Media files (like courier photos, proof of delivery, etc.) stored under:

/media/<tenant_uuid>/<model_name>/<filename>



---

🧠 Design Principles

1. DRY Architecture: All shared behaviors defined here, not repeated elsewhere.


2. Scalability: Each tenant and module remains independent but interoperable.


3. Consistency: Unified timestamping, deletion logic, and error patterns.


4. Security: Enforces strict tenant isolation for all database operations.




---

🧰 Developer Setup

1. Add Middleware in settings.py

MIDDLEWARE = [
    ...,
    'apps.core.middleware.TenantMiddleware',
]

2. Add Exception Handler

REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'apps.core.exceptions.custom_exception_handler',
}

3. Import in Models

All new models should extend from one or more base classes:

from apps.core.models import TimeStampedModel, TenantAwareModel


---

🧪 Testing

Run tests for shared models and utilities:

pytest apps/core/tests/

Includes:

Timestamp integrity tests

Tenant isolation

Soft delete validation

Custom exception handler checks



---

🔄 Future Enhancements

Add AuditTrailModel for logging user activity

Implement RequestIDMiddleware for traceability

Introduce EventLogger for Celery task monitoring

Add unified caching layer for frequently accessed data



---

📬 Developer Notes

Do not modify this module casually.
It underpins all system-wide functionality.

When introducing new base models or utilities, ensure backward compatibility.

Any frontend or API inconsistency should be reviewed here first.



---

© 2025 Last Mile Delivery Services Pro – Core Infrastructure Module

---

Would you like me to proceed next with generating the **backend/apps/core/models.py** (full production code implementing all base classes and mixins described in this README)?

