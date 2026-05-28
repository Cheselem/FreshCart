/**
 * Wire types — mirror the PostgreSQL schema in
 * docs/database.pdf §2.1–2.4 and the API contracts in TRD §3.
 * Numerics are sent as strings on the wire to preserve NUMERIC(10,2)
 * precision, then parsed to number at the boundary.
 */

export type UUID = string;
export type ISODate = string;

export type Category =
  | "Fresh Produce"
  | "Dairy & Eggs"
  | "Bakery"
  | "Meat & Seafood"
  | "Pantry"
  | "Beverages"
  | "Frozen"
  | "Household";

export interface Product {
  id: UUID;
  name: string;
  sku: string;
  unit_price: number;       // per unit, or per kg if is_weighed
  is_weighed: boolean;
  stock_quantity: number;   // supports fractional kg
  // ---- frontend-only enrichments (display, not persisted by the spec) ----
  category: Category;
  description: string;
  image_url: string;
  rating: number;           // 0..5
  brand?: string;
  unit_label?: string;      // e.g. "per kg", "500g loaf", "12 ct"
  badges?: ("organic" | "local" | "sale" | "new")[];
}

export interface User {
  id: UUID;
  email: string;
  created_at: ISODate;
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PACKED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export type SubstitutionRule = "REFUND" | "CONTACT_BUYER" | "CHOOSE_ALTERNATIVE";

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  quantity: number;
  final_weight_captured?: number | null;
}

export interface Order {
  id: UUID;
  user_id: UUID;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total_price: number;
  substitution_rule: SubstitutionRule;
  delivery_slot: ISODate;
  items: OrderItem[];
}

/* ----------------- Client-side cart shape (not persisted) ----------------- */

export interface CartLine {
  product: Product;
  quantity: number;   // units, or kg if product.is_weighed
}

/* ----------------- API request/response payloads ----------------- */

export interface RegisterRequest { email: string; password: string; }
export interface RegisterResponse { id: UUID; email: string; }

export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { access_token: string; type: "bearer"; }

export interface CheckoutRequestItem { product_id: UUID; quantity: number; }
export interface CheckoutRequest {
  items: CheckoutRequestItem[];
  substitution_rule: SubstitutionRule;
  delivery_slot: ISODate;
  payment_method: "stripe" | "paypal" | "mpesa";
}
export interface CheckoutResponse {
  order_id: UUID;
  payment_gateway_url: string;
}

/* ----------------- Delivery slot helper ----------------- */

export interface DeliverySlot {
  iso: ISODate;       // canonical key sent to /orders/checkout
  label: string;      // e.g. "Today, 4 – 6 PM"
  remaining: number;  // capacity left (display only)
  surcharge: number;  // 0 for standard, e.g. 1.99 for express
}
