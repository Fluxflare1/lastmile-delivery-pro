# Customer Profile Module

This module handles user profile management including picture upload.

## Features
- View and update user profile
- Upload and change profile picture
- Real-time form validation with Zod
- JWT-secured API calls

## API Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/v1/profile/` | Retrieve logged-in user profile |
| PUT | `/api/v1/profile/` | Update profile details or picture |

## Backend Connection
Ensure backend `MEDIA_URL` and `MEDIA_ROOT` are configured:
