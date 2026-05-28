# FreshCart — Backend

FastAPI + SQLAlchemy + Postgres backend for the FreshCart e-commerce platform.

**Scope of this sprint:** internal services only — authentication, catalog
search, order checkout with inventory deduction, order tracking. External
payment-gateway routing (Stripe / PayPal / M-Pesa webhooks) is deliberately
deferred to the next sprint per the project plan. The checkout endpoint
still emits the contract-shaped `{order_id, payment_gateway_url}` response,
with `payment_gateway_url` resolving to an internal stub for now.

## Endpoints

| Method | Path                          | Purpose                                  |
| ------ | ----------------------------- | ---------------------------------------- |
| POST   | `/api/v1/auth/register`       | Create a user (bcrypt-hashed password)   |
| POST   | `/api/v1/auth/login`          | OAuth2 password grant → JWT (30 min)     |
| GET    | `/api/v1/products/`           | Paginated product listing                |
| GET    | `/api/v1/products/search`     | `?q=` keyword + `?category=` facets      |
| POST   | `/api/v1/orders/checkout`     | Validate stock, create order, return URL |
| GET    | `/api/v1/orders/{id}`         | Fetch order + line items                 |
| GET    | `/health`                     | Liveness probe                           |

OpenAPI / Swagger docs auto-generated at `http://localhost:8000/docs`.

## Quickstart

```bash
cd backend
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Make sure Postgres is running and that DATABASE_URL points at it
python -m app.seed                 # creates tables + sample products
uvicorn app.main:app --reload      # http://localhost:8000
```
