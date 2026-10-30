export const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  "http://127.0.0.1:4000/api/v1"
).replace(/\/+$/, "");

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface Product {
  public_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  brand: string | null;
  product_type: string;
  condition_type: string;
  weight_grams: number;
  requires_shipping: number;
  category_name: string;
  category_slug: string;
  business_name: string;
  business_slug: string;
  min_price: string | number;
  max_price: string | number;
  min_retail_price?: string | number | null;
  max_retail_price?: string | number | null;
  min_b2b_price?: string | number | null;
  max_b2b_price?: string | number | null;
  min_b2b_kg?: string | number | null;
  selling_unit?: string | null;
  sales_mode?: string | null;
  available_stock: number;
  image_url: string | null;
}

export interface ProductVariant {
  id: number;
  variant_name: string;
  sku: string | null;
  attributes: string | null;
  price: string | number;
  compare_at_price: string | number | null;
  retail_price?: string | number | null;
  b2b_price?: string | number | null;
  min_retail_kg?: string | number | null;
  min_b2b_kg?: string | number | null;
  retail_step_kg?: string | number | null;
  b2b_step_kg?: string | number | null;
  selling_unit?: string | null;
  sales_mode?: string | null;
  weight_grams: number | null;
  available_stock: number;
}

export interface ProductImage {
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: number;
}

export interface ProductDetail extends Omit<Product, "min_price" | "max_price" | "available_stock" | "image_url"> {
  sku: string | null;
  description: string | null;
  published_at: string | null;
  business_logo_url: string | null;
  variants: ProductVariant[];
  images: ProductImage[];
}

interface ApiList<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

interface ApiItem<T> {
  success: boolean;
  data: T;
}

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Marketplace API mengembalikan HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getCategories(): Promise<Category[]> {
  const result = await apiFetch<ApiList<Category>>("/categories");
  return result.data;
}

export async function getProducts(options: {
  q?: string;
  category?: string;
  businessSlug?: string;
  page?: number;
  limit?: number;
} = {}): Promise<ApiList<Product>> {
  const query = new URLSearchParams();
  if (options.q) query.set("q", options.q);
  if (options.category) query.set("category", options.category);
  if (options.businessSlug) query.set("business", options.businessSlug);
  query.set("page", String(options.page ?? 1));
  query.set("limit", String(options.limit ?? 24));

  return apiFetch<ApiList<Product>>(`/products?${query.toString()}`);
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const result = await apiFetch<ApiItem<ProductDetail>>(
      `/products/${encodeURIComponent(slug)}`
    );
    return result.data;
  } catch (error) {
    if (error instanceof Error && error.message.includes("HTTP 404")) {
      return null;
    }
    throw error;
  }
}


/* ============================================================
   BUSINESS INFO
   ============================================================ */

export interface BusinessInfo {
  instagram_url?: string | null;
  tiktok_url?: string | null;
  facebook_url?: string | null;
  website_url?: string | null;
  public_id: string;
  business_name: string;
  legal_name: string | null;
  slug: string;
  business_type: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  email: string | null;
  phone: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  nib: string | null;
  tax_number: string | null;
  kbli_code: string | null;
  kbli_name: string | null;
  verification_status: string;
  status: string;
  kbli_list: Array<{
    code: string;
    name: string;
    is_primary: boolean;
  }>;
}

/**
 * Ambil info business tenant (untuk logo, banner, dll).
 * Endpoint: /businesses/me
 */
export async function getBusinessInfo(): Promise<BusinessInfo | null> {
  try {
    const response = await fetch(`${API_BASE}/businesses/me`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    if (json?.success && json?.data) {
      return json.data as BusinessInfo;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Ambil business detail publik by slug (public endpoint).
 * Endpoint: GET /businesses/:slug
 */
/**
 * Ambil list semua business aktif (public endpoint).
 * Endpoint: GET /businesses
 */
export async function getBusinesses(): Promise<BusinessInfo[]> {
  try {
    const response = await fetch(`${API_BASE}/businesses`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const json = await response.json();
    return Array.isArray(json?.data) ? (json.data as BusinessInfo[]) : [];
  } catch {
    return [];
  }
}

export async function getBusinessBySlug(
  slug: string
): Promise<BusinessInfo | null> {
  try {
    const response = await fetch(
      `${API_BASE}/businesses/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    if (json?.success && json?.data) {
      return json.data as BusinessInfo;
    }
    return null;
  } catch {
    return null;
  }
}

export function formatRupiah(value: string | number): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Harga belum tersedia";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}



