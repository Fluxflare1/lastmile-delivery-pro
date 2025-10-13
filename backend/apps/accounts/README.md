Perfect ✅

Here’s the production-grade backend/apps/accounts/README.md, designed as a developer-facing document that fully defines the Accounts module, including its backend logic and how it connects with the Next.js frontend (Customer App, Admin Panels, Courier App, etc.).


---

📘 backend/apps/accounts/README.md

# Accounts Module – Authentication & User Management

## 📦 Overview

The **Accounts Module** handles all aspects of user authentication, registration, role-based access control (RBAC), and profile management across the **multi-tenant Last Mile Delivery Services Pro (LMDSP)** platform.

It supports all user roles (Platform Manager, LMDSP Admin, DCSD Admin, Courier, Customer, etc.) and connects seamlessly with the frontend via RESTful APIs.

---

## 🧩 Core Responsibilities

- User registration and login (Email / Phone)
- JWT authentication (access & refresh tokens)
- Multi-tenant onboarding logic
- Role-based access control
- Profile and KYC management
- Password reset and verification flows
- Media uploads (profile pictures)
- API integration with frontend modules (Next.js)

---

## 🏗️ Directory Structure

backend/apps/accounts/ │ ├── init.py ├── admin.py ├── apps.py ├── models.py ├── serializers.py ├── permissions.py ├── views.py ├── urls.py ├── tests/ │   └── test_accounts_api.py └── README.md

---

## ⚙️ API Overview

All routes are prefixed with `/api/v1/accounts/`

| Endpoint | Method | Auth | Description | Frontend Integration |
|-----------|---------|------|-------------|-----------------------|
| `/register/` | POST | ❌ | Register new user (email/phone) | `/auth/register` |
| `/verify-email/` | POST | ❌ | Email verification with token | `/auth/verify` |
| `/login/` | POST | ❌ | User login, returns JWT | `/auth/login` |
| `/logout/` | POST | ✅ | Invalidate tokens | `/auth/logout` |
| `/profile/` | GET | ✅ | Retrieve user profile | `/dashboard/profile` |
| `/profile/update/` | PUT | ✅ | Update profile info | `/dashboard/profile/edit` |
| `/profile/upload-photo/` | POST | ✅ | Upload profile picture | `/dashboard/profile/photo` |
| `/change-password/` | POST | ✅ | Change password | `/dashboard/security` |
| `/forgot-password/` | POST | ❌ | Initiate password reset | `/auth/forgot-password` |
| `/reset-password/` | POST | ❌ | Complete password reset | `/auth/reset-password` |

---

## 🔑 Supported User Roles

| Role | Description | Access Level |
|------|--------------|--------------|
| `PLATFORM_ADMIN` | Full access to all tenants | Superuser |
| `LMDSP_ADMIN` | Manages LMDSP branches, couriers, customers | Tenant-level |
| `DCSD_ADMIN` | Manages B2B outsourcing ops and clients | Tenant-level |
| `BUSINESS_CLIENT` | B2B client account (DHL, Jumia, etc.) | Restricted |
| `COURIER` | Delivery staff or agent | Field-level |
| `CUSTOMER` | End-user sender/receiver | Restricted |
| `FINANCE_OFFICER` | Handles billing, payouts | Scoped |
| `DISPATCHER` | Assigns couriers, monitors SLA | Scoped |
| `OPERATIONS_MANAGER` | Analytics and operations oversight | Scoped |

---

## 🧠 Data Models

### `User`
Extends `AbstractBaseUser` with custom fields for role, tenant, and contact details.

| Field | Type | Description |
|--------|------|-------------|
| `email` | EmailField | Unique identifier |
| `phone_number` | CharField | Optional; for OTP login |
| `role` | CharField | User role (`CUSTOMER`, `COURIER`, etc.) |
| `tenant` | ForeignKey | Reference to LMDSP/DCSD tenant |
| `profile_image` | ImageField | Profile photo |
| `is_verified` | Boolean | Email/phone verified |
| `created_at` | DateTime | Account creation time |

### `Profile`
Linked 1:1 with `User`. Holds additional data for display and operational metadata.

| Field | Type | Description |
|--------|------|-------------|
| `user` | OneToOneField | Reference to User |
| `address` | TextField | User address |
| `date_of_birth` | DateField | Optional |
| `bio` | TextField | Short description |
| `kyc_verified` | Boolean | KYC verification flag |

---

## 🔐 Authentication Workflow

1. **Registration**
   - Frontend sends `POST /api/v1/accounts/register/` with `{ email, password, role }`
   - Backend creates a user and sends verification email via SendGrid.

2. **Login**
   - User submits credentials → Backend returns JWT access & refresh tokens.

3. **JWT Tokens**
   - Stored securely in HTTP-only cookies.
   - Used in Authorization header for subsequent API calls:
     ```
     Authorization: Bearer <access_token>
     ```

4. **Profile Management**
   - Authenticated users retrieve and update data via `/profile/` endpoints.

5. **Media Upload**
   - Profile photo upload uses multipart/form-data → stored in `/media/profile_photos/`.

---

## 🌐 Frontend Integration Guide

### 1. API Client (Frontend)
Frontend calls handled via Axios in:

frontend/src/lib/api/accounts.ts

### 2. Example Integration (Next.js)
```typescript
import axios from '@/lib/axios';

export async function loginUser(credentials) {
  const { data } = await axios.post('/api/v1/accounts/login/', credentials);
  localStorage.setItem('access_token', data.access);
  return data;
}

3. Authentication Flow (Frontend)

Login/Register pages in /src/app/auth/

Token stored securely via cookies (httpOnly)

User context managed with React Context API / Zustand

Protected routes guarded by middleware (/src/middleware.ts)


4. Upload Profile Picture (Frontend)

const formData = new FormData();
formData.append('profile_image', file);
await axios.post('/api/v1/accounts/profile/upload-photo/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});


---

🧩 Integration with Other Modules

Module	Integration	Description

core	Inherits base models and tenant mixins	Provides TimeStampedModel and TenantAwareModel
notifications	Sends verification and reset emails	Uses SendGrid/Twilio integration
billing	Associates users with wallets and invoices	Links User → Wallet
orders	Assigns sender/receiver users	Uses User.id and role filters
couriers	Links courier profile to account	Shared authentication
LMDSP/DCSD	Multi-tenant segregation	Each user belongs to a tenant org



---

🧰 Developer Setup

1. Create Superuser

docker-compose exec web python manage.py createsuperuser


2. Seed Roles (Optional)

docker-compose exec web python manage.py loaddata roles.json


3. Access Admin Panel

URL: http://localhost:8000/admin/accounts/user/

Credentials: Superuser login





---

🧪 Testing

pytest apps/accounts/tests/

Test coverage includes:

Registration & Login flows

JWT issuance and refresh

Role-based access checks

Profile update and upload endpoints



---

🔄 Future Enhancements

OAuth (Google, Apple) support

Multi-factor authentication (MFA)

User activity logs and audit trails

SSO for enterprise clients (DCSD)



---

📬 API Reference (Postman)

A shared Postman collection is available under:

docs/api-collections/accounts.postman_collection.json


---

🧭 Maintainer Notes

Use DRF SimpleJWT for token handling

Store uploaded media in MEDIA_ROOT/media/profile_photos/

Follow naming convention: api/v1/accounts/<endpoint>/

Maintain synchronization between backend response structure and frontend api folder



---

© 2025 Last Mile Delivery Services Pro – All Rights Reserved

---

Would you like me to now generate the **Core module README.md** next (`backend/apps/core/README.md`) — covering shared mixins, base models, middleware, and how all modules depend on it?

