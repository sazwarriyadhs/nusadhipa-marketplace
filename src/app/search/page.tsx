import Link from "next/link";

import {
  getCategories,
  getProducts,
  formatRupiah,
  type Category,
  type Product,
} from "@/lib/marketplace-api";
import { getSauriImage } from "@/lib/sauri-images";

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

const categoryVisuals: Record<string, { image: string; label: string; num: number }> = {
  makanan: { image: "/kategori/01-makanan-minuman.png", label: "Makanan", num: 1 },
  minuman: { image: "/kategori/01-makanan-minuman.png", label: "Minuman", num: 1 },
  "makanan-minuman": { image: "/kategori/01-makanan-minuman.png", label: "Makanan & Minuman", num: 1 },
  pertanian: { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian", num: 2 },
  "pertanian-hasil-bumi": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian & Hasil Bumi", num: 2 },
  "pertanian-peternakan": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian & Peternakan", num: 2 },
  peternakan: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan", num: 3 },
  "peternakan-daging-perikanan": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan, Daging & Perikanan", num: 3 },
  daging: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Daging", num: 3 },
  "daging-unggas": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Daging & Unggas", num: 3 },
  ikan: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ikan", num: 3 },
  "ikan-seafood": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ikan & Seafood", num: 3 },
  petfood: { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood", num: 4 },
  "petfood-kebutuhan-hewan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood & Kebutuhan Hewan", num: 4 },
  "hewan-peliharaan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Hewan Peliharaan", num: 4 },
  pakan: { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Pakan", num: 4 },
  "pakan-ternak": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Pakan Ternak", num: 4 },
  fashion: { image: "/kategori/05-fashion-aksesori.png", label: "Fashion", num: 5 },
  "fashion-aksesori": { image: "/kategori/05-fashion-aksesori.png", label: "Fashion & Aksesori", num: 5 },
  pakaian: { image: "/kategori/05-fashion-aksesori.png", label: "Pakaian", num: 5 },
  "aksesori-fashion": { image: "/kategori/05-fashion-aksesori.png", label: "Aksesori Fashion", num: 5 },
  "alas-kaki": { image: "/kategori/05-fashion-aksesori.png", label: "Alas Kaki", num: 5 },
  kerajinan: { image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan", num: 6 },
  "kerajinan-produk-kreatif": { image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan & Produk Kreatif", num: 6 },
  rumah: { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah", num: 7 },
  "rumah-perlengkapan": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah & Perlengkapan", num: 7 },
  "rumah-tangga-perlengkapan": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah Tangga & Perlengkapan", num: 7 },
  "peralatan-rumah": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Peralatan Rumah", num: 7 },
  "peralatan-dapur": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Peralatan Dapur", num: 7 },
  kecantikan: { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan", num: 8 },
  "kesehatan-kecantikan": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kesehatan & Kecantikan", num: 8 },
  "kecantikan-perawatan-diri": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan & Perawatan Diri", num: 8 },
  "perawatan-diri": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Perawatan Diri", num: 8 },
  tanaman: { image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman", num: 9 },
  "tanaman-bunga-florist": { image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman, Bunga & Florist", num: 9 },
  elektronik: { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik", num: 10 },
  "elektronik-digital": { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Digital", num: 10 },
  "elektronik-peralatan": { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Peralatan", num: 10 },
  "aksesori-elektronik": { image: "/kategori/10-elektronik-peralatan.png", label: "Aksesori Elektronik", num: 10 },
  "produk-digital": { image: "/kategori/10-elektronik-peralatan.png", label: "Produk Digital", num: 10 },
  jasa: { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa", num: 11 },
  "jasa-layanan": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan", num: 11 },
  "jasa-profesional": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa Profesional", num: 11 },
  "jasa-bisnis": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa Bisnis", num: 11 },
  "jasa-layanan-bisnis": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan Bisnis", num: 11 },
  industri: { image: "/kategori/12-industri-grosir-b2b.png", label: "Industri", num: 12 },
  "industri-grosir-b2b": { image: "/kategori/12-industri-grosir-b2b.png", label: "Industri, Grosir & B2B", num: 12 },
};


const CATEGORY_SLUG_MAP: Record<string, string> = {
  "makanan-minuman": "makanan-minuman",
  "pertanian-peternakan": "pertanian-hasil-bumi",
  "pertanian-hasil-bumi": "pertanian-hasil-bumi",
  "hewan-peliharaan": "petfood-kebutuhan-hewan",
  "petfood-kebutuhan-hewan": "petfood-kebutuhan-hewan",
  "fashion-aksesori": "fashion-aksesori",
  "kerajinan-produk-kreatif": "kerajinan-produk-kreatif",
  "rumah-tangga-perlengkapan": "rumah-tangga-perlengkapan",
  "rumah-perlengkapan": "rumah-tangga-perlengkapan",
  "kecantikan-perawatan-diri": "kecantikan-perawatan-diri",
  "kesehatan-kecantikan": "kecantikan-perawatan-diri",
  "tanaman-bunga-florist": "tanaman-bunga-florist",
  "elektronik-peralatan": "elektronik-peralatan",
  "elektronik-digital": "elektronik-peralatan",
  "jasa-layanan-bisnis": "jasa-layanan-bisnis",
  "jasa-layanan": "jasa-layanan-bisnis",
  "industri-grosir-b2b": "industri-grosir-b2b",
};

function getCategoryVisual(category: Category) {
  const slug = (category.slug ?? "").toLowerCase().trim();
  const exact = categoryVisuals[slug];
  if (exact) return exact;
  const name = (category.name ?? "").toLowerCase().trim();
  const fallback = categoryVisuals[name];
  if (fallback) return fallback;
  return { image: "/kategori/01-makanan-minuman.png", label: category.name || "Lainnya", num: 0 };
}

function ProductCard({ product }: { product: Product }) {
  const originalImageUrl = resolveImageUrl(product.image_url);
  const fallbackByProduct = getSauriImage(product.name);
  const imageUrl = originalImageUrl || fallbackByProduct;

  const href = `/produk/${encodeURIComponent(product.slug)}`;

  const price =
    product.min_price == null
      ? "Harga belum tersedia"
      : product.max_price != null && product.max_price !== product.min_price
        ? `${formatRupiah(product.min_price)} - ${formatRupiah(product.max_price)}`
        : formatRupiah(product.min_price);

  return (
    <Link href={href} style={{display: "block", overflow: "hidden", borderRadius: "12px", border: "1px solid #e5e7eb", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.05)"}}>
      <div style={{position: "relative", width: "100%", height: "200px", overflow: "hidden", background: "#f3f4f6"}}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={product.name} style={{width: "100%", height: "200px", objectFit: "cover", display: "block"}} />
        ) : (
          <div className="nd-store-product-card__empty">
            <span aria-hidden="true">{"\uD83D\uDECD\uFE0F"}</span>
            <small>Foto belum tersedia</small>
          </div>
        )}
        {product.category_name && (
          <span className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-red-600">
            {product.category_name}
          </span>
        )}
      </div>
      <div style={{padding: "16px"}}>
        <h3>{product.name}</h3>
        <p style={{fontSize: "18px", fontWeight: "900", color: "#dc2626", marginTop: "8px"}}>{price}</p>
        {product.available_stock != null && (
          <p style={{fontSize: "12px", color: "#6b7280", marginTop: "4px"}}>
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
    limit: 500,
  }).catch(() => ({ data: [] }));

  const allCategories: Category[] = Array.isArray(categoriesResult) ? categoriesResult : [];
  // Filter: cuma ambil kategori utama (parent_id === null)
  const categories = allCategories.filter((cat) => cat.parent_id === null);
    const allProducts: Product[] = productsResult?.data || [];

  const finalProducts: Product[] = allProducts;

  // Pagination: 20 produk per halaman
  const PAGE_SIZE = 26;
  const totalPages = Math.ceil(finalProducts.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const products: Product[] = finalProducts.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <main className="nd-marketplace">
      <div style={{maxWidth: "1280px", margin: "0 auto", padding: "0 20px"}}>
        <div style={{textAlign: "center", marginBottom: "32px", padding: "0 16px"}}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#111827",
            marginBottom: "12px",
            lineHeight: "1.3",
            letterSpacing: "-0.5px",
          }}>
            Cari produk, layanan, atau mitra usaha
          </h1>
          <p style={{
            fontSize: "15px",
            color: "#6b7280",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}>
            Gunakan kata kunci atau filter kategori untuk menemukan produk yang kamu butuhkan.
          </p>
        </div>

        {/* KATEGORI: GRID KARTU BESAR */}
        <div style={{marginBottom: "32px"}}>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px"}}>
            {categories.slice(0, 12).map((cat) => {
              const isActive = category === (CATEGORY_SLUG_MAP[cat.slug] || cat.slug);
              const visual = getCategoryVisual(cat);
              
              return (
                <Link
                  key={cat.id}
                  href={isActive ? "/search" : `/search?category=${CATEGORY_SLUG_MAP[cat.slug] || cat.slug}`}
                  style={{
                    display: "block",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: isActive ? "2px solid #dc2626" : "1px solid #e5e7eb",
                    background: "#fff",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{position: "relative", width: "100%", height: "140px", overflow: "hidden", background: "#f3f4f6"}}>
                    <img 
                      src={visual.image} 
                      alt={cat.name} 
                      style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} 
                    />
                    <span style={{
                      position: "absolute", 
                      top: "8px", 
                      left: "8px", 
                      background: "#dc2626", 
                      color: "#fff", 
                      borderRadius: "50%", 
                      width: "24px", 
                      height: "24px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "11px", 
                      fontWeight: "700"
                    }}>
                      {visual.num}
                    </span>
                  </div>
                  <div style={{padding: "12px"}}>
                    <h3 style={{fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0}}>{cat.name}</h3>
                    <p style={{fontSize: "11px", color: "#6b7280", margin: "4px 0 0 0"}}>{visual.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
            <p style={{fontSize: "14px", color: "#6b7280"}}>Menampilkan {products.length} produk</p>
            {(q || category) && (
              <Link href="/search" className="nd-marketplace__reset">
                Reset pencarian ×
              </Link>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <div>
            <div className="nd-store-empty">
              <span aria-hidden="true">{"\uD83D\uDCE6"}</span>
              <p>Tidak ada produk ditemukan.</p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", alignItems: "stretch"}}>
              {products.map((product, idx) => (
                <ProductCard
                  key={product.public_id ?? product.slug ?? `p-${idx}`}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "32px",
                marginBottom: "16px",
              }}>
                {currentPage > 1 && (
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(category ? { category } : {}),
                      page: String(currentPage - 1),
                    }).toString()}`}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      color: "#374151",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    ← Sebelumnya
                  </Link>
                )}
                
                <span style={{fontSize: "13px", color: "#6b7280"}}>
                  Halaman {currentPage} dari {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(category ? { category } : {}),
                      page: String(currentPage + 1),
                    }).toString()}`}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      color: "#374151",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Selanjutnya →
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}























