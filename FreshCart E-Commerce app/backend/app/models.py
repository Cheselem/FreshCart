"""SQLAlchemy ORM models — mirror the schema in TRD §2 and the DB doc."""
import uuid
from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean, DateTime, Enum, ForeignKey, Numeric, String, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# ----- enums (string-backed for portability) -----
class OrderStatus(str, PyEnum):
    PENDING_PAYMENT  = "PENDING_PAYMENT"
    CONFIRMED        = "CONFIRMED"
    PACKED           = "PACKED"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED        = "DELIVERED"


class SubstitutionRule(str, PyEnum):
    REFUND             = "REFUND"
    CONTACT_BUYER      = "CONTACT_BUYER"
    CHOOSE_ALTERNATIVE = "CHOOSE_ALTERNATIVE"


# ----- users -----
class User(Base):
    __tablename__ = "users"

    id:            Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email:         Mapped[str]       = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str]       = mapped_column(String(255), nullable=False)
    created_at:    Mapped[datetime]  = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    orders: Mapped[list["Order"]] = relationship(back_populates="user", cascade="all, delete-orphan")


# ----- products -----
class Product(Base):
    __tablename__ = "products"

    id:             Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name:           Mapped[str]       = mapped_column(String(255), index=True, nullable=False)
    sku:            Mapped[str]       = mapped_column(String(50), unique=True, nullable=False)
    unit_price:     Mapped[Decimal]   = mapped_column(Numeric(10, 2), nullable=False)
    is_weighed:     Mapped[bool]      = mapped_column(Boolean, default=False, nullable=False)
    stock_quantity: Mapped[Decimal]   = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    category:       Mapped[str]       = mapped_column(String(64), index=True, nullable=False)
    description:    Mapped[str]       = mapped_column(String(1024), default="", nullable=False)
    image_url:      Mapped[str]       = mapped_column(String(1024), default="", nullable=False)


# ----- orders -----
class Order(Base):
    __tablename__ = "orders"

    id:                Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id:           Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status:            Mapped[OrderStatus]      = mapped_column(Enum(OrderStatus, name="order_status"), default=OrderStatus.PENDING_PAYMENT, nullable=False)
    subtotal:          Mapped[Decimal]          = mapped_column(Numeric(10, 2), nullable=False)
    tax:               Mapped[Decimal]          = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    delivery_fee:      Mapped[Decimal]          = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    total_price:       Mapped[Decimal]          = mapped_column(Numeric(10, 2), nullable=False)
    substitution_rule: Mapped[SubstitutionRule] = mapped_column(Enum(SubstitutionRule, name="substitution_rule"), default=SubstitutionRule.REFUND, nullable=False)
    delivery_slot:     Mapped[datetime]         = mapped_column(DateTime(timezone=True), nullable=False)
    created_at:        Mapped[datetime]         = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user:  Mapped["User"]              = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]]   = relationship(back_populates="order", cascade="all, delete-orphan")


# ----- order_items -----
class OrderItem(Base):
    __tablename__ = "order_items"

    id:                    Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id:              Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id:            Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    quantity:              Mapped[Decimal]        = mapped_column(Numeric(10, 2), default=Decimal("1.00"), nullable=False)
    final_weight_captured: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    order:   Mapped["Order"]   = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()
