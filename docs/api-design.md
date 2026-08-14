# API DESIGN

## User

- ### Register

Endpoint : POST /api/users/register

Request :

```json
{
  "email": "example@gmail.com",
  "password": "12345678",
  "name": "your name"
}
```

Response (201 Created):

```json
{
  "token_type": "Bearer",
  "access_token": "jwt"
}
```

Response (409 Conflict):

```json
{
  "message": "Email already exist"
}
```

- ### Login

Endpoint : POST /api/users/login

Request :

```json
{
  "email": "example@gmail.com",
  "password": "12345678"
}
```

Response (200 OK):

```json
{
  "token_type": "Bearer",
  "access_token": "jwt"
}
```

Response (401 Unauthorized):

```json
{
  "message": "Invalid email or password"
}
```

- ### Get User

Endpoint : GET /api/users/me

Authentication : Bearer JWT

Response (200 OK):

```json
{
  "id": "uuid",
  "email": "example@gmail.com",
  "name": "your name",
  "role": "MAHASISWA",
  "createdAt": "2026-07-01T08:00:00Z",
  "updatedAt": "2026-07-01T09:00:00Z"
}
```

Response (401 Unauthorized):

```json
{
  "message": "Unauthorized"
}
```

- ### Update User

Endpoint : PATCH /api/users/me

Authentication : Bearer JWT

> Note: all fields are optional, send only what needs to be updated.

Request:

```json
{
  "name": "new name",
  "email": "newemail@gmail.com",
  "password": "newpassword"
}
```

Response (200 OK):

```json
{
  "id": "uuid",
  "email": "newemail@gmail.com",
  "name": "new name",
  "role": "MAHASISWA",
  "createdAt": "2026-07-01T08:00:00Z",
  "updatedAt": "2026-07-01T09:00:00Z"
}
```

Response (409 Conflict):

```json
{
  "message": "Email already registered"
}
```

- ### Delete User

Endpoint : DELETE /api/users/me

Authentication : Bearer JWT

Response (200 OK):

```json
{
  "message": "Account deleted successfully"
}
```

---

## Asset

- ### Get All Assets

Endpoint : GET /api/assets

Authentication : Bearer JWT

Response (200 OK):

```json
[
  {
    "id": "uuid",
    "name": "Lab Computer A",
    "description": "Air-conditioned room, capacity 40 people",
    "category": "ROOM",
    "createdAt": "2026-07-01T08:00:00Z",
    "updatedAt": "2026-07-01T09:00:00Z"
  }
]
```

- ### Get Asset by ID

Endpoint : GET /api/assets/:id

Authentication : Bearer JWT

Response (200 OK):

```json
{
  "id": "uuid",
  "name": "Lab Komputer A",
  "description": "Air-conditioned room, capacity 40 people",
  "category": "ROOM",
  "createdAt": "2026-07-01T08:00:00Z",
  "updatedAt": "2026-07-01T09:00:00Z"
}
```

Response (404 Not Found):

```json
{
  "message": "Asset not found"
}
```

- ### Create Asset

Endpoint : POST /api/assets

Authentication : Bearer JWT (ADMIN only)

Request:

```json
{
  "name": "Proyektor Sony",
  "description": "Portable projector",
  "category": "ITEM"
}
```

Response (201 Created):

```json
{
  "id": "uuid",
  "name": "Proyektor Sony",
  "description": "Portable projector",
  "category": "ITEM",
  "createdAt": "2026-07-01T08:00:00Z",
  "updatedAt": "2026-07-01T09:00:00Z"
}
```

- ### Update Asset

Endpoint : PATCH /api/assets/:id

Authentication : Bearer JWT (ADMIN only)

> Note: all fields are optional, send only what needs to be updated.

Request:

```json
{
  "name": "Proyektor Sony Updated",
  "description": "Portable HD projector",
  "category": "ITEM"
}
```

Response (200 OK):

```json
{
  "id": "uuid",
  "name": "Proyektor Sony Updated",
  "description": "Portable HD projector",
  "category": "ITEM",
  "createdAt": "2026-07-01T08:00:00Z",
  "updatedAt": "2026-07-01T09:00:00Z"
}
```

Response (404 Not Found):

```json
{
  "message": "Asset not found"
}
```

- ### Delete Asset

Endpoint : DELETE /api/assets/:id

Authentication : Bearer JWT (ADMIN only)

Response (200 OK):

```json
{
  "message": "Asset deleted successfully"
}
```

Response (404 Not Found):

```json
{
  "message": "Asset not found"
}
```

---

## Booking

- ### Create Booking

Endpoint : POST /api/bookings

Authentication : Bearer JWT

Request:

```json
{
  "assetId": "uuid",
  "startTime": "2026-07-01T08:00:00Z",
  "endTime": "2026-07-01T10:00:00Z"
}
```

Response (201 Created):

```json
{
  "id": "uuid",
  "assetId": "uuid",
  "userId": "uuid",
  "startTime": "2026-07-01T08:00:00Z",
  "endTime": "2026-07-01T10:00:00Z",
  "status": "PENDING",
  "rejectionReason": null,
  "createdAt": "2026-07-01T08:00:00Z",
  "updatedAt": "2026-07-01T09:00:00Z"
}
```

Response (400 Bad Request):

```json
{
  "message": "Schedule conflicts with an already approved booking"
}
```

Response (404 Not Found):

```json
{
  "message": "Asset not found"
}
```

- ### Get Booking History

Endpoint : GET /api/bookings/history

Authentication : Bearer JWT

Response (200 OK):

```json
[
  {
    "id": "uuid",
    "assetId": "uuid",
    "userId": "uuid",
    "startTime": "2026-07-01T08:00:00Z",
    "endTime": "2026-07-01T10:00:00Z",
    "status": "APPROVED",
    "rejectionReason": null,
    "createdAt": "2026-07-01T08:00:00Z",
    "updatedAt": "2026-07-01T09:00:00Z"
  }
]
```

- ### Get Booking Calendar

Endpoint : GET /api/bookings/calendar

Authentication : Bearer JWT

Response (200 OK):

```json
[
  {
    "id": "uuid",
    "assetId": "uuid",
    "userId": "uuid",
    "startTime": "2026-07-01T08:00:00Z",
    "endTime": "2026-07-01T10:00:00Z",
    "status": "APPROVED",
    "rejectionReason": null,
    "createdAt": "2026-07-01T08:00:00Z",
    "updatedAt": "2026-07-01T09:00:00Z"
  }
]
```

- ### Get Pending Bookings

Endpoint : GET /api/bookings/pending

Authentication : Bearer JWT (ADMIN only)

Response (200 OK):

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "assetId": "uuid",
    "startTime": "2026-07-01T08:00:00Z",
    "endTime": "2026-07-01T10:00:00Z",
    "status": "PENDING",
    "rejectionReason": null,
    "createdAt": "2026-07-01T08:00:00Z",
    "updatedAt": "2026-07-01T09:00:00Z"
  }
]
```

- ### Update Booking Status

Endpoint : PATCH /api/bookings/:id/status

Authentication : Bearer JWT (ADMIN only)

Request (approve):

```json
{
  "status": "APPROVED"
}
```

Request (reject):

```json
{
  "status": "REJECTED",
  "rejectionReason": "Room under maintenance"
}
```

> Note: rejectionReason is required when status is REJECTED.

Response (200 OK):

```json
{
  "id": "uuid",
  "userId": "uuid",
  "assetId": "uuid",
  "startTime": "2026-07-01T08:00:00Z",
  "endTime": "2026-07-01T10:00:00Z",
  "status": "APPROVED",
  "rejectionReason": null,
  "createdAt": "2026-07-01T08:00:00Z",
  "updatedAt": "2026-07-01T09:00:00Z"
}
```

Response (400 Bad Request):

```json
{
  "message": "Rejection reason is required"
}
```

Response (404 Not Found):

```json
{
  "message": "Booking not found"
}
```