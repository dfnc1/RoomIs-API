# RoomIs API

Backend API for managing room and inventory bookings at campus facilities. Built with NestJS, PostgreSQL, and Prisma.

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + Passport
- **Validation:** class-validator
- **Documentation:** Swagger

## Prerequisites

- Node.js 20+
- PostgreSQL
- pnpm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/roomis-api.git
cd roomis-api
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Fill in the values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/roomis"
JWT_SECRET="your-jwt-secret"
```

### 4. Run database migrations

```bash
pnpm prisma migrate deploy
```

### 5. Seed the database (optional)

```bash
pnpm prisma db seed
```

### 6. Start the server

```bash
# development
pnpm start:dev

# production
pnpm start:prod
```

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

## Running Tests

```bash
# unit tests
pnpm test

# e2e tests
pnpm test:e2e
```


## API Endpoints

| Method | Endpoint                 | Description           | Auth        |
|--------|--------------------------|-----------------------|-------------|
| POST   | /api/users/register      | Register new user     | -           |
| POST   | /api/users/login         | Login                 | -           |
| GET    | /api/users/me            | Get own profile       | JWT         |
| PATCH  | /api/users/me            | Update profile        | JWT         |
| DELETE | /api/users/me            | Delete account        | JWT         |
| GET    | /api/assets              | Get all assets        | JWT         |
| GET    | /api/assets/:id          | Get asset by ID       | JWT         |
| POST   | /api/assets              | Create asset          | JWT + Admin |
| PATCH  | /api/assets/:id          | Update asset          | JWT + Admin |
| DELETE | /api/assets/:id          | Delete asset          | JWT + Admin |
| POST   | /api/bookings            | Create booking        | JWT         |
| GET    | /api/bookings/history    | Get booking history   | JWT         |
| GET    | /api/bookings/calendar   | Get booking calendar  | JWT         |
| GET    | /api/bookings/pending    | Get pending bookings  | JWT + Admin |
| PATCH  | /api/bookings/:id/status | Update booking status | JWT + Admin |