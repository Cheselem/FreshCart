"""Populate the products table with sample grocery inventory."""
from decimal import Decimal

from sqlalchemy import select

from app.database import Base, engine, session_scope
from app.models import Product


PRODUCTS = [
    # (sku, name, unit_price, is_weighed, stock, category, description, image_url)
    ("FP-BAN-001", "Organic Bananas",          150,  True,  122.5, "Fresh Produce",
     "Hand-picked Cavendish bananas, naturally ripened.",
     "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800"),
    ("FP-AVO-014", "Hass Avocados",             25,  False, 240,   "Fresh Produce",
     "Ripe, ready-to-eat. Perfect on toast or in salad.",
     "https://images.unsplash.com/photo-1612506266679-606568a33215?w=800"),
    ("FP-TOM-007", "Vine Tomatoes",            180,  True,  64.2,  "Fresh Produce",
     "Sweet, sun-ripened vine tomatoes from local growers.",
     "https://plus.unsplash.com/premium_photo-1726138647192-5275bef08970?w=800"),
    ("FP-SPI-022", "Baby Spinach",             120,  False, 78,    "Fresh Produce",
     "Triple-washed organic baby spinach, 200g clamshell.",
     "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800"),
    ("DE-MLK-001", "Whole Milk",               250,  False, 156,   "Dairy & Eggs",
     "Grade A whole milk, 1 gallon. Hormone-free.",
     "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800"),
    ("DE-EGG-012", "Free-Range Eggs",          480,  False, 92,    "Dairy & Eggs",
     "Large brown eggs, dozen. Pasture-raised.",
     "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800"),
    ("BK-SDG-003", "Sourdough Loaf",           450,  False, 42,    "Bakery",
     "Crusty artisan sourdough, naturally leavened.",
     "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800"),
    ("BK-CRO-018", "Butter Croissants",        600,  False, 38,    "Bakery",
     "All-butter croissants, 4-pack. Baked this morning.",
     "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800"),
    ("MS-SAL-005", "Atlantic Salmon Fillet", 3500,   True,  22.4,  "Meat & Seafood",
     "Center-cut, skin-on, sustainably sourced.",
     "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800"),
    ("MS-CHK-029", "Chicken Breast",          800,   True,  41.2,  "Meat & Seafood",
     "Boneless, skinless. Free-range, no antibiotics.",
     "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800"),
    ("PN-PST-002", "Bronze-Cut Spaghetti",    220,   False, 210,   "Pantry",
     "Slow-dried bronze-cut spaghetti, 500g.",
     "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800"),
    ("PN-OIL-009", "Extra-Virgin Olive Oil", 1200,   False, 64,    "Pantry",
     "Cold-pressed, single-estate olive oil, 500 mL.",
     "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800"),
    ("BV-CFE-011", "Single-Origin Coffee",   1500,   False, 88,    "Beverages",
     "Whole-bean Ethiopian Yirgacheffe, 340 g.",
     "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800"),
    ("BV-OJU-006", "Cold-Pressed Orange Juice", 450, False, 54,    "Beverages",
     "100% Valencia oranges, no concentrate, 1 L.",
     "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800"),
    ("FR-BER-031", "Mixed Berries (Frozen)", 1100,   False, 70,    "Frozen",
     "Strawberry, blueberry, raspberry. 1 kg bag.",
     "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800"),
    ("HH-DET-040", "Plant-Based Dish Soap",   400,   False, 132,   "Household",
     "Biodegradable formula, lemon-thyme scent, 750 mL.",
     "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800"),
]


def seed() -> int:
    Base.metadata.create_all(engine)
    with session_scope() as db:
        inserted = 0
        for sku, name, price, is_weighed, stock, cat, desc, img in PRODUCTS:
            if db.scalar(select(Product).where(Product.sku == sku)):
                continue
            db.add(Product(
                sku=sku, name=name,
                unit_price=Decimal(str(price)),
                is_weighed=is_weighed,
                stock_quantity=Decimal(str(stock)),
                category=cat, description=desc, image_url=img,
            ))
            inserted += 1
    return inserted


if __name__ == "__main__":
    n = seed()
    print(f"Seeded {n} new product(s).")
