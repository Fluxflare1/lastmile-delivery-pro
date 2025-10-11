# Customer App Auth Module

## Overview
This module provides **login** and **registration** for customers (sender/receiver/both).

### Backend Endpoints
- **POST** `/api/accounts/register/`
- **POST** `/api/accounts/login/`
- **GET** `/api/accounts/profile/` (after login)

### Environment Variables
Add to `.env.local`:


### Data Flow
1. User submits registration/login form  
2. Request sent to Django backend via `apiRequest()`  
3. JWT tokens stored in localStorage  
4. Future requests include Authorization header  

### Next Step
- After authentication, redirect to `/dashboard`
- Extend `auth.ts` for token refresh and logout
- Integrate `Profile` and `Dashboard` modules
