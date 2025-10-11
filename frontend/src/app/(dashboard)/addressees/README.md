# Customer Address Book Module

This module manages user addresses for both senders and receivers.

## Features
- Add, view, update, delete addresses
- Mark defaults for sending and receiving
- Automatically linked to user profile (JWT required)

## API Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/v1/addresses/` | List addresses |
| POST | `/api/v1/addresses/` | Add address |
| PUT | `/api/v1/addresses/{id}/` | Update address |
| DELETE | `/api/v1/addresses/{id}/` | Remove address |

## Integration
- Uses `useAddresses` hook for API operations
- Requires JWT in `Authorization` header (handled globally)
- Connects directly to `accounts.Address` model on backend
