# 📦 Shipments Module (Customer App Backend Layer)

### Path
`backend/apps/shipments/`

---

## Overview
The **Shipments module** manages creation, tracking, and proof of delivery (POD) for customer deliveries under the LMDSP (B2C) ecosystem.  
It is the backbone of the delivery lifecycle, tightly integrated with:
- `CustomerProfile`
- `CustomerAddress`
- `Core` base models and middleware
- Future `Orders` and `Courier` modules

Supports hybrid shipment execution:
- Internal (LMDSP) tracking  
- External (3PL / DCSD) references  

---

## Key Components

### Models
- **Shipment:** Stores shipment lifecycle data.
- **ShipmentStatusHistory:** Logs each state transition and notes.

### Serializers
- Ensure validated, nested data for frontend (React/Next.js) consumption.

### Permissions
- `IsShipmentOwnerOrAdmin` — for sender control.
- `IsCourierAssignedOrReadOnly` — for courier task access.

### Views
- RESTful endpoints via DRF `ModelViewSet`.
- Custom actions:
  - `update_status` — update shipment state.
  - `upload_pod` — upload proof of delivery.

### URLs
`/api/shipments/` — root path for shipment endpoints.

---

## Frontend Integration

| Action | Endpoint | Method | Frontend Module |
|--------|-----------|--------|----------------|
| Create Shipment | `/api/shipments/` | POST | Customer App → Shipment Form |
| View Shipments | `/api/shipments/` | GET | Customer Dashboard |
| Track Shipment | `/api/shipments/:id/` | GET | Customer Tracking Page |
| Update Status | `/api/shipments/:id/update_status/` | POST | Courier App → Delivery Workflow |
| Upload POD | `/api/shipments/:id/upload_pod/` | POST | Courier App → Proof of Delivery |

---

## Dependencies
- `apps.core` for BaseModel and TimestampMixin
- `apps.customer` for profile and address relations
- Django REST Framework (ViewSets, Routers)
- Postgres + S3 (optional for media)

---

## Path Integration
Add this to `backend/config/urls.py`:
```python
path('api/shipments/', include('apps.shipments.urls')),
