"""Pydantic request/response schemas — the JSON contract."""
import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import OrderStatus, SubstitutionRule


# ---------- auth ----------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RegisterResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- products ----------
class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    name: str
    sku: str
    unit_price: Decimal
    is_weighed: bool
    stock_quantity: Decimal
    category: str
    description: str
    image_url: str


class ProductsPage(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    page_size: int


# ---------- orders ----------
class CheckoutItem(BaseModel):
    product_id: uuid.UUID
    quantity: Decimal = Field(gt=0)


class CheckoutRequest(BaseModel):
    items: list[CheckoutItem] = Field(min_length=1)
    substitution_rule: SubstitutionRule = SubstitutionRule.REFUND
    delivery_slot: datetime
    payment_method: str = Field(pattern="^(stripe|paypal|mpesa)$")


class CheckoutResponse(BaseModel):
    order_id: uuid.UUID
    payment_gateway_url: str


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    product_id: uuid.UUID
    quantity: Decimal
    final_weight_captured: Decimal | None = None


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    status: OrderStatus
    subtotal: Decimal
    tax: Decimal
    delivery_fee: Decimal
    total_price: Decimal
    substitution_rule: SubstitutionRule
    delivery_slot: datetime
    items: list[OrderItemOut]
