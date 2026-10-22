"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatRupiah, type Product } from "@/lib/marketplace-api";
import { getSauriImage, getCategoryImage } from "@/lib/sauri-images";

type Props = {
  products: Product[];
  categories: string[];
  businessName: string;
};

function resolveImage(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (
    process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
    process.env.MARKETPLACE_API_URL ||
    "https://api.nusadhipa.shop/api/v1"
  ).replace(/\/api\/v1\/?$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function StoreCatalog({ products, categories, businessName }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(12);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("id-ID");
    return products.filter((p) => {
      const categoryMatch =
        activeCategory === "Semua" || p.category_name === activeCategory;
      const queryMatch =
        !q ||
        p.name.toLocaleLowerCase("id-ID").includes(q) ||
        (p.category_name ?? "").toLocaleLowerCase("id-ID").includes(q);
      return categoryMatch && queryMatch;
    });
  }, [products, query, activeCategory]);

  function resetVisible() {
    setVisibleCount(12);
  }

  return (
    <>
      <section className="nd-store-category-filter">
        <h2 className="nd-store-section-title">Kategori Produk</h2>
        <div className="nd-store-categories">
          {["Semua", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`nd-store-category-chip${activeCategory === cat ? " is-active" : ""}`}
              aria-pressed={activeCategory === cat}
              onClick={() => {
                setActiveCategory(cat);
                resetVisible();
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="nd-store-products-section">
        <div className="nd-store-section-heading">
          <div>
            <span className="nd-eyebrow">KATALOG TOKO</span>
            <h2 className="nd-store-section-title">Produk dari {businessName}</h2>
            <p className="nd-store-section-subtitle">
              {filtered.length} produk ditemukan
            </p>
          </div>
          <Link href="/search" className="nd-store-view-all">
            Lihat semua produk
          </Link>
        </div>

        <div className="nd-store-search">
          <label htmlFor="nd-store-product-search">Cari produk toko</label>
          <input
            id="nd-store-product-search"
            type="search"
            value={query}
            placeholder="Nama produk atau kategori..."
            onChange={(event) => {
              setQuery(event.target.value);
              resetVisible();
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="nd-store-empty">
            <span aria-hidden="true">📦</span>
            <p>
              {products.length === 0
                ? "Toko ini belum menambahkan produk."
                : "Produk tidak ditemukan. Coba kata kunci lain."}
            </p>
          </div>
        ) : (
          <>
            <div className="nd-store-products-grid">
              {filtered.slice(0, visibleCount).map((product, index) => {
                const id = String(product.public_id ?? product.slug ?? `p-${index}`);
                const image =
                  resolveImage(product.image_url) ||
                  getSauriImage(product.name) ||
                  getCategoryImage(product.category_name);
                const price =
                  product.min_price == null
                    ? "Harga belum tersedia"
                    : product.max_price != null &&
                        Number(product.max_price) !== Number(product.min_price)
                      ? `${formatRupiah(product.min_price)} - ${formatRupiah(product.max_price)}`
                      : formatRupiah(product.min_price);
                const favorite = favorites.includes(id);

                return (
                  <article className="nd-store-product-card nd-store-product-card--interactive" key={id}>
                    <div className="nd-store-product-card__media">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt={product.name} loading="lazy" />
                      ) : (
                        <div className="nd-store-product-card__empty">
                          <span aria-hidden="true">🛍️</span>
                          <small>Foto belum tersedia</small>
                        </div>
                      )}
                      {product.category_name && (
                        <span className="nd-store-product-card__tag">{product.category_name}</span>
                      )}
                      <button
                        type="button"
                        className={`nd-store-favorite${favorite ? " is-active" : ""}`}
                        aria-label={favorite ? "Hapus favorit" : "Tambah favorit"}
                        aria-pressed={favorite}
                        onClick={() => setFavorites((current) =>
                          favorite ? current.filter((item) => item !== id) : [...current, id]
                        )}
                      >
                        {favorite ? "♥" : "♡"}
                      </button>
                    </div>
                    <div className="nd-store-product-card__body">
                      <h3>{product.name}</h3>
                      <p className="nd-store-product-card__price">{price}</p>
                      {product.available_stock != null && (
                        <p className="nd-store-product-card__stock">
                          Stok: {product.available_stock}
                        </p>
                      )}
                      <Link
                        href={`/produk/${encodeURIComponent(product.slug)}`}
                        className="nd-store-product-link"
                      >
                        Lihat Produk
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
            {visibleCount < filtered.length && (
              <div className="nd-store-load-more">
                <button
                  type="button"
                  className="nd-store-btn-primary"
                  onClick={() => setVisibleCount((count) => count + 12)}
                >
                  Muat Produk Lainnya
                </button>
                <small>
                  Menampilkan {Math.min(visibleCount, filtered.length)} dari {filtered.length} produk
                </small>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
