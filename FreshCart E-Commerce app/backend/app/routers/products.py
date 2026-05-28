"""GET /products and /products/search — TRD §3."""
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.database import get_session
from app.models import Product
from app.schemas import ProductOut, ProductsPage


router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=ProductsPage)
def list_products(
    db:        Annotated[Session, Depends(get_session)],
    category:  Annotated[str | None, Query()] = None,
    page:      Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 24,
):
    """Plain catalog listing, optionally narrowed by category."""
    stmt = select(Product)
    if category:
        stmt = stmt.where(Product.category == category)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Product.name).offset((page - 1) * page_size).limit(page_size)
    ).all()
    return ProductsPage(items=[ProductOut.model_validate(p) for p in items],
                        total=total, page=page, page_size=page_size)


@router.get("/search", response_model=ProductsPage)
def search_products(
    db:        Annotated[Session, Depends(get_session)],
    q:         Annotated[str | None, Query(min_length=1, max_length=128)] = None,
    category:  Annotated[str | None, Query()] = None,
    page:      Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 24,
):
    """Full-text-ish lookup over name + description (ILIKE, case-insensitive)."""
    stmt = select(Product)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Product.name.ilike(like), Product.description.ilike(like)))
    if category:
        stmt = stmt.where(Product.category == category)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Product.name).offset((page - 1) * page_size).limit(page_size)
    ).all()
    return ProductsPage(items=[ProductOut.model_validate(p) for p in items],
                        total=total, page=page, page_size=page_size)
