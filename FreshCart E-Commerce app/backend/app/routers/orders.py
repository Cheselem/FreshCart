"""POST /orders/checkout, GET /orders/{id} — TRD §3.

External payment gateway routing is deliberately scoped out for this sprint
(per project requirement: "internal services only, external APIs next sprint").
The endpoint still emits the contract-shaped {order_id, payment_gateway_url}
response — payment_gateway_url currently resolves to an internal stub.
"""
import uuid
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_session
from app.models import Order, OrderItem, OrderStatus, Product, User
from app.schemas import CheckoutRequest, CheckoutResponse, OrderOut
from app.security import current_user


router = APIRouter(prefix="/orders", tags=["orders"])

TAX_RATE     = Decimal("0.085")
DELIVERY_FEE = Decimal("250.00")


def _round2(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"))


@router.post(
    "/checkout",
    response_model=CheckoutResponse,
    status_code=202,
)
def checkout(
    body: CheckoutRequest,
    db:   Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(current_user)],
):
    """
    1. Validate inventory availability for every requested line item.
    2. Compute subtotal, tax, delivery fee, total.
    3. Atomically:
         - decrement product.stock_quantity
         - insert orders row (PENDING_PAYMENT)
         - insert order_items rows
       …or roll back the entire transaction.
    4. Return order_id + a stub payment-gateway URL.
       (External Stripe/PayPal/M-Pesa wiring deferred to next sprint.)
    """
    # ---- pull all referenced products in one query ----
    ids = [i.product_id for i in body.items]
    products: dict[uuid.UUID, Product] = {
        p.id: p for p in db.scalars(select(Product).where(Product.id.in_(ids))).all()
    }
    missing = [str(i) for i in ids if i not in products]
    if missing:
        raise HTTPException(422, detail=f"Unknown products: {missing}")

    # ---- inventory check ----
    out_of_stock: list[str] = []
    subtotal = Decimal("0.00")
    for line in body.items:
        p = products[line.product_id]
        if line.quantity > p.stock_quantity:
            out_of_stock.append(p.sku)
        subtotal += p.unit_price * line.quantity
    if out_of_stock:
        raise HTTPException(422, detail={
            "code": "OUT_OF_STOCK",
            "skus": out_of_stock,
            "hint":  "Reduce quantity or remove these items and retry.",
        })

    tax           = _round2(subtotal * TAX_RATE)
    delivery_fee  = DELIVERY_FEE
    total_price   = _round2(subtotal + tax + delivery_fee)

    order = Order(
        user_id=user.id,
        status=OrderStatus.PENDING_PAYMENT,
        subtotal=_round2(subtotal),
        tax=tax,
        delivery_fee=delivery_fee,
        total_price=total_price,
        substitution_rule=body.substitution_rule,
        delivery_slot=body.delivery_slot,
    )
    db.add(order); db.flush()    # populate order.id without commit

    for line in body.items:
        p = products[line.product_id]
        p.stock_quantity = p.stock_quantity - line.quantity
        db.add(OrderItem(order_id=order.id, product_id=p.id, quantity=line.quantity))

    db.commit()
    db.refresh(order)

    # Stub payment URL — to be replaced with real Stripe/PayPal/M-Pesa session next sprint.
    return CheckoutResponse(
        order_id=order.id,
        payment_gateway_url=f"/orders/success?provider={body.payment_method}&order={order.id}",
    )


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: uuid.UUID,
    db:       Annotated[Session, Depends(get_session)],
    user:     Annotated[User, Depends(current_user)],
):
    order = db.get(Order, order_id)
    if not order or order.user_id != user.id:
        raise HTTPException(404, detail="Order not found")
    return order
