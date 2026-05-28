/**
 * Single fetch surface for all backend calls. Endpoints/payloads match
 * the FastAPI contracts in TRD §3:
 *   POST /api/v1/auth/register
 *   POST /api/v1/auth/login
 *   GET  /api/v1/products/
 *   GET  /api/v1/products/search?q=&category=
 *   POST /api/v1/orders/checkout
 *
 * When NEXT_PUBLIC_USE_MOCKS=true (the portfolio default) every call is
 * fulfilled from in-memory mock data so the UI is fully clickable
 * before Phase 2 of the engineering plan is finished.
 */

import {
  CheckoutRequest,
  CheckoutResponse,
  LoginRequest,
  LoginResponse,
  Product,
  RegisterRequest,
  RegisterResponse,
  Order,
} from "./types";
import { MOCK_PRODUCTS } from "./mock-data";

const USE_MOCKS =
  (process.env.NEXT_PUBLIC_USE_MOCKS ?? "true").toLowerCase() === "true";

/* -------------------------------------------------------------------------- */
/*                              low-level fetcher                             */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    let body: unknown = undefined;
    try { body = await res.json(); } catch { /* non-JSON error */ }
    // Per spec edge-case table: a 401 means the JWT expired —
    // the caller decides whether to redirect to /login.
    throw new ApiError(res.status, `HTTP ${res.status} on ${path}`, body);
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

/* -------------------------------------------------------------------------- */
/*                                   auth                                     */
/* -------------------------------------------------------------------------- */

export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  if (USE_MOCKS) {
    await delay(450);
    if (!body.email.includes("@")) throw new ApiError(422, "Invalid email");
    return { id: "mock-user-1", email: body.email };
  }
  return http("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCKS) {
    await delay(450);
    if (body.password.length < 6)
      throw new ApiError(401, "Incorrect email or password");
    return { access_token: "mock.jwt.token", type: "bearer" };
  }
  // OAuth2 password flow uses form-encoded payload, not JSON
  const form = new URLSearchParams();
  form.set("username", body.username);
  form.set("password", body.password);
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",
    body: form.toString(),
  });
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
  return res.json();
}

export async function logout(): Promise<void> {
  if (USE_MOCKS) return;
  await http("/api/v1/auth/logout", { method: "POST" });
}

/* -------------------------------------------------------------------------- */
/*                                  catalog                                   */
/* -------------------------------------------------------------------------- */

export interface ListProductsParams {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductsPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export async function listProducts(p: ListProductsParams = {}): Promise<ProductsPage> {
  const page = p.page ?? 1;
  const pageSize = p.pageSize ?? 24;

  if (USE_MOCKS) {
    await delay(180);
    const q = (p.q ?? "").trim().toLowerCase();
    const cat = p.category;
    let filtered = MOCK_PRODUCTS.filter((prod) => {
      const matchesQ =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q) ||
        prod.brand?.toLowerCase().includes(q);
      const matchesCat = !cat || prod.category === cat;
      return matchesQ && matchesCat;
    });
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total, page, pageSize };
  }

  const qs = new URLSearchParams();
  if (p.q) qs.set("q", p.q);
  if (p.category) qs.set("category", p.category);
  qs.set("page", String(page));
  qs.set("page_size", String(pageSize));
  const endpoint = p.q || p.category ? "/api/v1/products/search" : "/api/v1/products/";
  return http(`${endpoint}?${qs.toString()}`);
}

/* -------------------------------------------------------------------------- */
/*                                  checkout                                  */
/* -------------------------------------------------------------------------- */

export async function checkout(req: CheckoutRequest): Promise<CheckoutResponse> {
  if (USE_MOCKS) {
    await delay(700);
    return {
      order_id: "mock-order-" + Math.random().toString(36).slice(2, 8),
      payment_gateway_url: `/orders/success?provider=${req.payment_method}`,
    };
  }
  return http("/api/v1/orders/checkout", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getOrder(orderId: string): Promise<Order> {
  if (USE_MOCKS) {
    await delay(250);
    // Mock progression: each call advances the order by one step,
    // simulating the spec's 3-second polling loop.
    const stages = ["PENDING_PAYMENT", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED"] as const;
    const seedHash = Array.from(orderId).reduce((s, c) => s + c.charCodeAt(0), 0);
    const idx = Math.min(stages.length - 1, Math.floor((Date.now() / 4000 + seedHash) % stages.length));
    return {
      id: orderId,
      user_id: "mock-user-1",
      status: stages[idx],
      subtotal: 0,
      tax: 0,
      delivery_fee: 0,
      total_price: 0,
      substitution_rule: "REFUND",
      delivery_slot: new Date(Date.now() + 3600_000).toISOString(),
      items: [],
    };
  }
  return http(`/api/v1/orders/${orderId}`);
}

/* -------------------------------------------------------------------------- */

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
