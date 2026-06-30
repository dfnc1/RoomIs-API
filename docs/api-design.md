# API DESIGN

## Auth

- ### Register

Endpoint : POST /api/auth

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

Endpoint : POST /api/auth/login

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

## Asset

- ### Get All Assets

Endpoint : GET /api/assets

Authentication : Bearer JWT

response (200 OK):

```json
[
  {
    "id": "uuid",
    "name": "Lab Computer A",
    "description": "Air-conditioned room, capacity 40 people",
    "category": "ROOM"
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
  "category": "ROOM"
}
```

Response (404 Not Found):

```json
{
  "message": "Asset not found"
}
```

### Create Asset

Endpoint : POST /api/assets

Authentication : Bearer JWT

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
  "category": "ITEM"
}
```

### Update Asset

Endpoint : PUT /api/assets/:id

Authentication : Bearer JWT

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
  "category": "ITEM"
}
```

Response (404 Not Found):

```json
{
  "message": "Asset not found"
}
```

### Delete Asset

Endpoint : DELETE /api/assets/:id

Authentication : Bearer JWT

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

## Booking

### Create Booking
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
"status": "PENDING"
}
```

Response (400 Bad Request):
```json
{
"message": "Schedule conflicts with an already approved booking"
}
```


### Get Booking History

Endpoint : GET /api/bookings/history

Authentication : Bearer JWT

Response (200 OK):
```json
[
{
"id": "uuid",
"assetId": "uuid",
"startTime": "2026-07-01T08:00:00Z",
"endTime": "2026-07-01T10:00:00Z",
"status": "APPROVED"
}
]
```

### Get Booking Calendar

Endpoint : GET /api/bookings/calendar

Authentication : Bearer JWT

Response (200 OK):
```json
[
{
"id": "uuid",
"assetId": "uuid",
"startTime": "2026-07-01T08:00:00Z",
"endTime": "2026-07-01T10:00:00Z",
"status": "APPROVED"
}
]
```


### Get Pending Bookings

Endpoint : GET /api/bookings/pending

Authentication : Bearer JWT

Response (200 OK):
```json
[
{
"id": "uuid",
"userId": "uuid",
"assetId": "uuid",
"startTime": "2026-07-01T08:00:00Z",
"endTime": "2026-07-01T10:00:00Z",
"status": "PENDING"
}
]
```


### Update Booking Status
Endpoint : GET /api/bookings/:id/status

Authentication : Bearer JWT

Request:
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

Response (200 OK):
```json
{
"id": "uuid",
"status": "APPROVED",
"rejectionReason": null
}
```

Response (404 Unauthorized):
```json
{
"message": "Booking not found"
}
```