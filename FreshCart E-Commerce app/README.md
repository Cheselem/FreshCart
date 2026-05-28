# FreshCart — Groceries E-Commerce Platform

> Capstone project for BIT3208 *Advanced Web Design and Development*.
> Full-stack grocery storefront with same-day delivery slots, weighted-item
> pricing, and multi-method authentication.

| Layer        | Stack                                             |
| ------------ | ------------------------------------------------- |
| Frontend     | Next.js 14 (App Router) · TypeScript · Tailwind   |
| Backend      | FastAPI · SQLAlchemy 2 · Alembic                  |
| Database     | PostgreSQL 16+                                    |
| Auth         | OAuth2 password grant · JWT (HS256, 30 min)       |
| Payments     | Stripe / PayPal / M-Pesa *(next sprint)*          |

## Repository layout

```
.
├── frontend/                 Next.js client (web UI)
├── backend/                  FastAPI service (internal services)
├── FreshCart-Wireframes.pdf  Low-fi screen wireframes
└── FreshCart-Logbook.docx    BIT3208 practical logbook
```

## Quickstart

### 1 · Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

By default `NEXT_PUBLIC_USE_MOCKS=true`, so every screen is clickable without
the backend running.

### 2 · Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # PowerShell on Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
cp .env.example .env
# Make sure Postgres is up and DATABASE_URL in .env points at it
python -m app.seed              # creates tables + 16 sample products
uvicorn app.main:app --reload   # http://localhost:8000
```

OpenAPI / Swagger docs are auto-generated at `http://localhost:8000/docs`.

### 3 · Wire frontend to live backend

In `frontend/.env.local`, flip:

```
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The Next.js `rewrites()` config proxies `/api/v1/*` to FastAPI, keeping the
JWT cookie first-party in development.

## Endpoints

| Method | Path                          | Purpose                                  |
| ------ | ----------------------------- | ---------------------------------------- |
| POST   | `/api/v1/auth/register`       | Create a user (bcrypt-hashed password)   |
| POST   | `/api/v1/auth/login`          | OAuth2 password grant → JWT              |
| GET    | `/api/v1/products/`           | Paginated catalog                        |
| GET    | `/api/v1/products/search`     | Keyword + category facets                |
| POST   | `/api/v1/orders/checkout`     | Atomic inventory deduction + order row   |
| GET    | `/api/v1/orders/{id}`         | Fetch order + items (JWT-protected)      |
| GET    | `/health`                     | Liveness probe                           |

## Sprint scope

The current sprint delivers everything internal: schema, auth, catalog,
cart, checkout, and the order state machine.
External payment-gateway wiring (Stripe / PayPal / M-Pesa) and the matching
webhook handler are deliberately deferred to the next sprint — the checkout
endpoint already returns the contract-shaped `{order_id, payment_gateway_url}`
response and currently resolves the URL to an internal stub.

---

Prepared by **Leshan Nkoitoi** · BSCCS/2024/73223 · Sem 2 / Year 4
