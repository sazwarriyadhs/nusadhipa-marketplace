import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import {
  getCategories,
  getProducts,
  formatRupiah,
  type Category,
  type Product,
} from "@/lib/marketplace-api";
import { getSauriImage, getCategoryImage } from "@/lib/sauri-images";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  "https://api.nusadhipa.shop/api/v1"
).replace(/\/api\/v1\/?$/, "");

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function extractApiList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== "object") return [];
  const result = response as Record<string, unknown>;
  for (const key of ["items", "data", "results", "products", "rows"]) {
    const value = result[key];
    if (Array.isArray(value)) return value as T[];
    if (value && typeof value === "object") {
      const nested = extractApiList<T>(value);
      if (nested.length > 0) return nested;
    }
  }
  return [];
}

function ProductCard({ product }: { product: Product }) {
  const originalImageUrl = resolveImageUrl(product.image_url);
  const fallbackByProduct = getSauriImage(product.name);
  const fallbackByCategory = getCategoryImage(product.category_name);
  const imageUrl = originalImageUrl || fallbackByProduct || fallbackByCategory;

  const href = `/produk/${encodeURIComponent(product.slug)}`;

  const price =
    product.min_price == null
      ? "Harga belum tersedia"
      : product.max_price != null && product.max_price !== product.min_price
        ? `${formatRupiah(product.min_price)} - ${formatRupiah(product.max_price)}`
        : formatRupiah(product.min_price);

  return (
    <Link href={href} className="nd-store-product-card">
      <div className="nd-store-product-card__media">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={product.name} />
        ) : (
          <div className="nd-store-product-card__empty">
            <span aria-hidden="true">{"\uD83D\uDECD\uFE0F"}</span>
            <small>Foto belum tersedia</small>
          </div>
        )}
        {product.category_name && (
          <span className="nd-store-product-card__tag">
            {product.category_name}
          </span>
        )}
      </div>
      <div className="nd-store-product-card__body">
        <h3>{product.name}</h3>
        <p className="nd-store-product-card__price">{price}</p>
        {product.available_stock != null && (
          <p className="nd-store-product-card__stock">
            Stok: {product.available_stock}
          </p>
        )}
      </div>
    </Link>
  );
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, category, page } = await searchParams;
  const currentPage = Number(page || 1);

  const categoriesResult = await getCategories().catch(() => []);
  const productsResult = await getProducts({
    q: q || undefined,
    category: category || undefined,
    page: currentPage,
    limit: 24,
  }).catch(() => ({ data: [] }));

  const categories: Category[] = extractApiList<Category>(categoriesResult);
  const products: Product[] = extractApiList<Product>(productsResult);

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        <Reveal>
          <section className="nd-marketplace__header">
            <h1>Cari produk, layanan, atau mitra usaha</h1>
            <p>Gunakan kata kunci atau filter kategori untuk menemukan produk yang kamu butuhkan.</p>
          </section>
        </Reveal>

        <Reveal delay={40}>
          <div className="nd-marketplace__filters">
            {categories.map((cat) => {
              const isActive = category === cat.slug;
              const catImage = getCategoryImage(cat.name);
              return (
                <Link
                  key={cat.id}
                  href={isActive ? "/search" : `/search?category=${cat.slug}`}
                  className={`nd-chip nd-chip--with-image${isActive ? " is-active" : ""}`}
                >
                  {catImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={catImage} alt={cat.name} />
                  )}
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="nd-marketplace__results">
            <p>Menampilkan {products.length} produk</p>
            {(q || category) && (
              <Link href="/search" className="nd-marketplace__reset">
                Reset pencarian ×
              </Link>
            )}
          </div>
        </Reveal>

        {products.length === 0 ? (
          <Reveal delay={80}>
            <div className="nd-store-empty">
              <span aria-hidden="true">{"\uD83D\uDCE6"}</span>
              <p>Tidak ada produk ditemukan.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={80}>
            <div className="nd-store-products-grid">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.public_id ?? product.slug ?? `p-${idx}`}
                  product={product}
                />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}
