"""FastAPI entrypoint — assembles routers and applies CORS."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, orders, products


app = FastAPI(
    title="FreshCart API",
    version="0.1.0",
    description=(
        "Internal services for FreshCart: authentication, catalog search, and order "
        "checkout. External payment-gateway wiring (Stripe / PayPal / M-Pesa) is "
        "deferred to the next sprint per the engineering plan."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "service": "freshcart-api"}


PREFIX = "/api/v1"
app.include_router(auth.router,     prefix=PREFIX)
app.include_router(products.router, prefix=PREFIX)
app.include_router(orders.router,   prefix=PREFIX)
