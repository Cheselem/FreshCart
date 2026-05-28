import type { Category, DeliverySlot, Product } from "./types";

export const CATEGORIES: { name: Category; emoji: string; tagline: string }[] = [
  { name: "Fresh Produce",    emoji: "🥬", tagline: "Crisp, in-season, picked daily" },
  { name: "Dairy & Eggs",     emoji: "🥛", tagline: "Cold-chain, farm-to-fridge" },
  { name: "Bakery",           emoji: "🥖", tagline: "Baked this morning" },
  { name: "Meat & Seafood",   emoji: "🍣", tagline: "Butcher-cut, vacuum-sealed" },
  { name: "Pantry",           emoji: "🥫", tagline: "Staples & long-life" },
  { name: "Beverages",        emoji: "🧃", tagline: "Juices, coffee, sparkling" },
  { name: "Frozen",           emoji: "🧊", tagline: "Flash-frozen freshness" },
  { name: "Household",        emoji: "🧼", tagline: "Cleaning & home essentials" },
];

/** Stable UUID-shaped IDs; the real backend will use gen_random_uuid(). */
const uid = (n: number) => `0000${n.toString(16).padStart(4, "0")}-0000-4000-8000-000000000000`;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: uid(1), sku: "FP-BAN-001", name: "Organic Bananas",
    unit_price: 150, is_weighed: true, stock_quantity: 122.5,
    category: "Fresh Produce", brand: "Sunny Farms",
    description: "Hand-picked Cavendish bananas, naturally ripened.",
    image_url:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=70",
    rating: 4.7, unit_label: "per kg", badges: ["organic"],
  },
  {
    id: uid(2), sku: "FP-AVO-014", name: "Hass Avocados",
    unit_price: 25, is_weighed: false, stock_quantity: 240,
    category: "Fresh Produce", brand: "Greenleaf",
    description: "Ripe, ready-to-eat. Perfect on toast or in salad.",
    // Photo by Eddie Pipocas — https://unsplash.com/photos/Utnc4nbYFKo
    image_url:
      "https://images.unsplash.com/photo-1612506266679-606568a33215?auto=format&fit=crop&w=800&q=70",
    rating: 4.5, unit_label: "each", badges: ["sale"],
  },
  {
    id: uid(3), sku: "FP-TOM-007", name: "Vine Tomatoes",
    unit_price: 180, is_weighed: true, stock_quantity: 64.2,
    category: "Fresh Produce",
    description: "Sweet, sun-ripened vine tomatoes from local growers.",
    // Photo by Olivie Strauss (Unsplash+) — https://unsplash.com/photos/hEu2_nC1jqg
    image_url:
      "https://plus.unsplash.com/premium_photo-1726138647192-5275bef08970?auto=format&fit=crop&w=800&q=70",
    rating: 4.4, unit_label: "per kg", badges: ["local"],
  },
  {
    id: uid(4), sku: "FP-SPI-022", name: "Baby Spinach",
    unit_price: 120, is_weighed: false, stock_quantity: 78,
    category: "Fresh Produce", brand: "Earthbound",
    description: "Triple-washed organic baby spinach, 200g clamshell.",
    image_url:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=70",
    rating: 4.6, unit_label: "200 g", badges: ["organic"],
  },
  {
    id: uid(5), sku: "DE-MLK-001", name: "Whole Milk",
    unit_price: 250, is_weighed: false, stock_quantity: 156,
    category: "Dairy & Eggs", brand: "Clover Valley",
    description: "Grade A whole milk, 1 gallon. Hormone-free.",
    image_url:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=70",
    rating: 4.8, unit_label: "1 gal",
  },
  {
    id: uid(6), sku: "DE-EGG-012", name: "Free-Range Eggs",
    unit_price: 480, is_weighed: false, stock_quantity: 92,
    category: "Dairy & Eggs", brand: "Happy Hens",
    description: "Large brown eggs, dozen. Pasture-raised.",
    image_url:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=70",
    rating: 4.9, unit_label: "12 ct", badges: ["new"],
  },
  {
    id: uid(7), sku: "BK-SDG-003", name: "Sourdough Loaf",
    unit_price: 450, is_weighed: false, stock_quantity: 42,
    category: "Bakery", brand: "Hearth Baker",
    description: "Crusty artisan sourdough, naturally leavened.",
    image_url:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=70",
    rating: 4.7, unit_label: "500 g loaf",
  },
  {
    id: uid(8), sku: "BK-CRO-018", name: "Butter Croissants",
    unit_price: 600, is_weighed: false, stock_quantity: 38,
    category: "Bakery", brand: "Petit Paris",
    description: "All-butter croissants, 4-pack. Baked this morning.",
    image_url:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=70",
    rating: 4.8, unit_label: "4-pack",
  },
  {
    id: uid(9), sku: "MS-SAL-005", name: "Atlantic Salmon Fillet",
    unit_price: 3500, is_weighed: true, stock_quantity: 22.4,
    category: "Meat & Seafood", brand: "Cold Bay",
    description: "Center-cut, skin-on, sustainably sourced.",
    image_url:
      "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=70",
    rating: 4.6, unit_label: "per kg",
  },
  {
    id: uid(10), sku: "MS-CHK-029", name: "Chicken Breast",
    unit_price: 800, is_weighed: true, stock_quantity: 41.2,
    category: "Meat & Seafood", brand: "Pasture Co.",
    description: "Boneless, skinless. Free-range, no antibiotics.",
    image_url:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=70",
    rating: 4.5, unit_label: "per kg",
  },
  {
    id: uid(11), sku: "PN-PST-002", name: "Bronze-Cut Spaghetti",
    unit_price: 220, is_weighed: false, stock_quantity: 210,
    category: "Pantry", brand: "Mulino Verde",
    description: "Slow-dried bronze-cut spaghetti, 500g.",
    image_url:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=70",
    rating: 4.6, unit_label: "500 g",
  },
  {
    id: uid(12), sku: "PN-OIL-009", name: "Extra-Virgin Olive Oil",
    unit_price: 1200, is_weighed: false, stock_quantity: 64,
    category: "Pantry", brand: "Casa Verde",
    description: "Cold-pressed, single-estate olive oil, 500 mL.",
    image_url:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=70",
    rating: 4.7, unit_label: "500 mL",
  },
  {
    id: uid(13), sku: "BV-CFE-011", name: "Single-Origin Coffee",
    unit_price: 1500, is_weighed: false, stock_quantity: 88,
    category: "Beverages", brand: "Roast Yard",
    description: "Whole-bean Ethiopian Yirgacheffe, 340 g.",
    image_url:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=70",
    rating: 4.8, unit_label: "340 g",
  },
  {
    id: uid(14), sku: "BV-OJU-006", name: "Cold-Pressed Orange Juice",
    unit_price: 450, is_weighed: false, stock_quantity: 54,
    category: "Beverages", brand: "Citrus Press",
    description: "100% Valencia oranges, no concentrate, 1 L.",
    image_url:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=70",
    rating: 4.5, unit_label: "1 L",
  },
  {
    id: uid(15), sku: "FR-BER-031", name: "Mixed Berries (Frozen)",
    unit_price: 1100, is_weighed: false, stock_quantity: 70,
    category: "Frozen", brand: "Polar Harvest",
    description: "Strawberry, blueberry, raspberry. 1 kg bag.",
    image_url:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=70",
    rating: 4.6, unit_label: "1 kg",
  },
  {
    id: uid(16), sku: "HH-DET-040", name: "Plant-Based Dish Soap",
    unit_price: 400, is_weighed: false, stock_quantity: 132,
    category: "Household", brand: "Honest Home",
    description: "Biodegradable formula, lemon-thyme scent, 750 mL.",
    image_url:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=70",
    rating: 4.4, unit_label: "750 mL",
  },
];

/**
 * Generate today + tomorrow delivery windows (2-hr blocks, 8 AM – 8 PM).
 * In production this comes from /api/v1/delivery/slots.
 */
export function generateDeliverySlots(): DeliverySlot[] {
  const slots: DeliverySlot[] = [];
  const now = new Date();
  const dayLabels = ["Today", "Tomorrow"];
  for (let d = 0; d < 2; d++) {
    for (let hour = 8; hour < 20; hour += 2) {
      const start = new Date(now);
      start.setDate(now.getDate() + d);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(hour + 2);
      // skip slots that already passed
      if (start.getTime() < now.getTime() + 60 * 60 * 1000) continue;
      const fmt = (h: number) => {
        const period = h >= 12 ? "PM" : "AM";
        const h12 = ((h + 11) % 12) + 1;
        return `${h12} ${period}`;
      };
      slots.push({
        iso: start.toISOString(),
        label: `${dayLabels[d]}, ${fmt(hour)} – ${fmt(hour + 2)}`,
        remaining: Math.max(2, 18 - (hour % 7) - d * 3),
        surcharge: hour === 18 || (d === 0 && hour < 12) ? 100 : 0,
      });
    }
  }
  return slots;
}
