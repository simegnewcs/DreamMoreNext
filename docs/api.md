# API Documentation

## Overview
The application exposes server-side API routes in `src/app/api` for data access and operations.

## Authentication Endpoints

### `POST /api/auth/login`
Authenticates a user using email and password.

Request example:
```json
{
  "email": "student@example.com",
  "password": "secret123"
}
```

Response example:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "name": "Student",
    "role": "student"
  },
  "token": "jwt-token"
}
```

### `POST /api/auth/register`
Creates a new user account and sends a verification email.

### `POST /api/auth/forgot-password`
Starts a password reset flow.

### `POST /api/auth/reset-password`
Completes password recovery.

## Course Endpoints
- `GET /api/courses`
- `GET /api/courses/[slug]`
- `POST /api/courses` (admin)
- `PUT /api/courses/[slug]` (admin)
- `DELETE /api/courses/[slug]` (admin)

## Application Endpoints
- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/[id]`
- `GET /api/applications/check`

## Content Endpoints
- `GET /api/blogs`
- `GET /api/team`
- `GET /api/portfolio`
- `GET /api/testimonials`
- `GET /api/trusted-brands`

## Authentication Requirements
- Most admin endpoints require authenticated users with appropriate role permissions.
- Token-based authentication is used for server-side helpers and route-level authentication checks.

## Error Responses
Common error responses include:
- `400 Bad Request` for invalid payloads
- `401 Unauthorized` for missing or invalid credentials
- `404 Not Found` for unknown resources
- `500 Internal Server Error` for unexpected failures
