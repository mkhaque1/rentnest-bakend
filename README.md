# RentNest Backend

A RESTful API for a property rental platform built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**. Supports three roles — Tenant, Landlord, and Admin — with JWT authentication and Stripe payment integration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod v4 |
| Payments | Stripe |
| Security | Helmet, bcryptjs |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payment features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/rentnest.git
cd rentnest

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed the database
npx prisma db seed

# 6. Start the development server
npm run dev
```

The API will be available at `http://localhost:8000`.

---

## Environment Variables

```env
PORT=8000
APP_URL="http://localhost:8000"
DATABASE_URL="postgresql://user:password@host:5432/rentnest"

BCRYPT_SALT_ROUNDS=12

JWT_ACCESS_SECRET="your-access-token-secret"
JWT_ACCESS_EXPIRES_IN="1d"

JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_REFRESH_EXPIRES_IN="7d"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRODUCT_PRICE_ID="price_..."
```

---

## Seed Accounts

After running `npx prisma db seed`, the following accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | admin@rentnest.com | admin123 |
| Landlord | landlord@rentnest.com | landlord123 |
| Tenant | tenant@rentnest.com | tenant123 |

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive tokens |
| GET | `/me` | Private | Get current user profile |

### Categories — `/api/categories`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all categories |
| GET | `/:id` | Public | Get a category by ID |
| POST | `/` | Admin | Create a category |
| PATCH | `/:id` | Admin | Update a category |
| DELETE | `/:id` | Admin | Delete a category |

### Properties — `/api/properties`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all properties |
| GET | `/:id` | Public | Get a property by ID |
| GET | `/my/listings` | Landlord | Get current landlord's properties |
| POST | `/` | Landlord | Create a property listing |
| PATCH | `/:id` | Landlord | Update a property listing |
| DELETE | `/:id` | Landlord | Delete a property listing |

### Rentals — `/api/rentals`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Tenant | Submit a rental request |
| GET | `/` | Tenant | Get current tenant's rental requests |
| GET | `/:id` | Private | Get a rental request by ID |
| GET | `/landlord/requests` | Landlord | Get all requests for landlord's properties |
| PATCH | `/:id/status` | Landlord | Approve or reject a rental request |

### Payments — `/api/payments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create` | Tenant | Create a Stripe payment session |
| GET | `/` | Private | Get current user's payment history |
| GET | `/:id` | Private | Get a payment by ID |
| POST | `/webhook` | Stripe | Stripe webhook handler |

### Reviews — `/api/reviews`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Tenant | Submit a review for a property |
| GET | `/property/:propertyId` | Public | Get all reviews for a property |

### Admin — `/api/admin`

All admin routes require the `ADMIN` role.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List all users |
| PATCH | `/users/:id` | Update a user's status (ACTIVE / BANNED) |
| GET | `/properties` | List all properties |
| GET | `/rentals` | List all rental requests |

---

## Project Structure

```
src/
├── config/         # Environment config
├── lib/            # Prisma client instance
├── middlewares/    # Auth, validation, error handling
├── module/         # Feature modules (auth, property, rental, etc.)
│   └── [module]/
│       ├── *.controller.ts
│       ├── *.service.ts
│       ├── *.routes.ts
│       ├── *.validation.ts
│       └── *.interface.ts
├── utils/          # Shared utilities (JWT, AppError, etc.)
├── app.ts          # Express app setup
└── server.ts       # Entry point
prisma/
├── schema/         # Prisma schema files (split by model)
├── migrations/     # Database migrations
└── seed.ts         # Database seeder
```

---

## Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled production build
npx prisma migrate dev    # Run database migrations
npx prisma db seed        # Seed the database
npx prisma studio         # Open Prisma Studio
```

---

