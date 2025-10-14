# 🚚 Customer App Backend Layer

**Path:** `backend/apps/customer/`

---

## 🎯 Purpose

Implements the backend logic for the **Customer App (B2C)** — allowing individual users to:
- Manage their profiles and delivery addresses
- Upload profile and proof images securely
- Integrate seamlessly with frontend via REST endpoints

This module is directly connected to the **Customer App (Next.js)** frontend, consuming these endpoints via authenticated REST calls.

---

## 🧩 Module Dependencies

| Dependency | Description |
|-------------|--------------|
| `apps.core` | Base models, audit trail, tenant isolation |
| `apps.accounts` | User authentication and tenant ownership |
| `DRF` | API endpoints and serialization |
| `Django Media` | Secure file upload and retrieval |

---

## 🧱 Endpoints

| Method | Endpoint | Description | Auth |
|--------|-----------|--------------|------|
| `GET` | `/api/customer/profile/` | Retrieve logged-in customer profile | ✅ |
| `PATCH` | `/api/customer/profile/` | Update phone or profile picture | ✅ |
| `GET` | `/api/customer/addresses/` | List all customer addresses | ✅ |
| `POST` | `/api/customer/addresses/` | Create new address | ✅ |
| `GET` | `/api/customer/addresses/<id>/` | Retrieve specific address | ✅ |
| `PUT/PATCH` | `/api/customer/addresses/<id>/` | Update address | ✅ |
| `DELETE` | `/api/customer/addresses/<id>/` | Soft-delete address | ✅ |

---

## 🖼️ Media & Uploads

| Field | Path | Example |
|--------|------|----------|
| `profile_picture` | `/media/<tenant_uuid>/customers/<user_id>/profile/` | Profile images |
| `proof_image` | `/media/<tenant_uuid>/customers/<user_id>/address/` | Address verification |

These are securely served via the `SecureMediaMiddleware` in `apps.core.middleware`.

---

## 🔗 Frontend Integration

The **Customer App (Next.js)** will connect using standard REST calls through Axios:

Headers:
```js
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "X-Tenant-ID": "<tenant_uuid>",
  "Content-Type": "multipart/form-data"
}




# Customer App (LMDSP)

## Overview
This module manages **customer data** for the Last-Mile Delivery Service Provider (LMDSP) flow, focusing on address management for pickup/delivery.

## Features
- CRUD for saved addresses
- Default address logic (one per user)
- Geo-coded locations
- Integrated with authentication (`accounts`)
- Extensible for delivery creation

## Dependencies
- `apps.accounts` for user data
- `apps.core` for BaseModel
- Future link to order & shipment modules

## API Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/customers/addresses/` | List user addresses |
| POST | `/api/customers/addresses/` | Add new address |
| PUT/PATCH | `/api/customers/addresses/{id}/` | Update address |
| DELETE | `/api/customers/addresses/{id}/` | Delete address |

## Frontend Integration
Frontend (`Next.js`) will consume these endpoints through:
`frontend/src/features/customer-app/services/addressService.ts`

## Next Backend Phase
Shipment & Booking Layer (links addresses + user + LMDSP provider)
