import Link from "next/link";
import { getProduct, getBusinessBySlug, formatRupiah, type ProductDetail, type ProductVariant } from "@/lib/marketplace-api";
import { getSauriImage } from "@/lib/sauri-images";
import { formatStock } from "@/lib/format-stock";
import ProductAddToCart from "@/components/cart/ProductAddToCart";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || "https://api.nusadhipa.shop/api/v1"
).replace(/\/api\/v1\/?$/, "");

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  let product: ProductDetail | null = null;
  try {
    product = await getProduct(slug);
  } catch (e) {
    product = null;
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center">
        <span className="text-6xl">🛍️</span>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Produk tidak ditemukan</h1>
        <p className="mt-2 text-gray-500">Mungkin produk sudah dihapus atau tautan salah.</p>
        <Link href="/search" className="mt-6 inline-block rounded-xl bg-[#b91c2c] px-8 py-3 text-white font-semibold hover:bg-[#991b24] transition">
          Kembali ke Katalog
        </Link>
      </main>
    );
  }

  // 🚀 AMBIL DATA LOGO TOKO DARI API BISNIS
  let storeLogoUrl = null;
  if (product.business_slug) {
    const storeInfo = await getBusinessBySlug(product.business_slug);
    storeLogoUrl = resolveImageUrl(storeInfo?.logo_url);
  }

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const originalImageUrl = resolveImageUrl(primaryImage?.image_url);
  const fallbackImageUrl = product.business_slug === "fajar-florist" ? null : getSauriImage(product.name);
  const imageUrl = originalImageUrl || fallbackImageUrl;

  const firstVariant = product.variants?.[0];
  const retailPrice = firstVariant?.retail_price || firstVariant?.price;
  const b2bPrice = firstVariant?.b2b_price;
  const stock = firstVariant?.available_stock ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 bg-gray-50">
      {/* Breadcrumb Rapi */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 w-fit">
        <Link href="/" className="hover:text-[#b91c2c] transition">Beranda</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-[#b91c2c] transition">Katalog</Link>
        <span>/</span>
        <Link href={`/search?category=${product.category_slug}`} className="hover:text-[#b91c2c] transition">
          {product.category_name || "Kategori"}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* KIRI: Gambar Produk */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="h-full w-full object-contain hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <span className="text-8xl">🛍️</span>
              </div>
            )}
          </div>
        </div>

        {/* KANAN: Info Produk */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block rounded-md bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#b91c2c] border border-red-100">
              {product.category_name || "Umum"}
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl leading-snug">
            {product.name}
          </h1>

          {/* Kotak Harga */}
          <div className="mt-4 rounded-xl bg-white p-5 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Harga Eceran</p>
            <p className="text-4xl font-black text-[#b91c2c]">
              {retailPrice ? formatRupiah(retailPrice) : "Harga belum tersedia"}
            </p>
            
            {b2bPrice && Number(b2bPrice) > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-100">
                <span className="font-semibold">🏭 Harga Grosir:</span>
                <span className="font-bold">{formatRupiah(b2bPrice)}</span>
                <span className="text-xs">(min. order berlaku)</span>
              </div>
            )}
            
            {stock > 0 && (
              <p className="mt-3 text-sm text-gray-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Stok tersedia: <strong>{formatStock(stock, firstVariant?.selling_unit, firstVariant?.sales_mode)}</strong>
              </p>
            )}
          </div>

          {/* Tombol Add to Cart */}
          <div className="mt-6">
            <ProductAddToCart
              productSlug={product.slug}
              productName={product.name}
              businessName={product.business_name}
              imageUrl={imageUrl}
              variants={product.variants ?? []}
              brand={product.brand}
            />
          </div>

          {/* INFO TOKO */}
          <div className="mt-8 border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              
              {/* LOGO TOKO (Dinamis dari API) */}
              <div className="w-14 h-14 rounded-full border-2 border-white shadow-sm flex-shrink-0 overflow-hidden bg-red-100 flex items-center justify-center">
                {storeLogoUrl ? (
                  <img 
                    src={storeLogoUrl} 
                    alt={`Logo ${product.business_name}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#b91c2c] text-2xl font-bold">
                    {product.business_name ? product.business_name.charAt(0).toUpperCase() : "T"}
                  </span>
                )}
              </div>

              <div>
                <p className="font-bold text-gray-900 text-lg line-clamp-1">{product.business_name || "Toko Mitra"}</p>
                <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1 bg-green-50 px-2 py-0.5 rounded w-fit">
                  <span>✓</span> Mitra Terverifikasi
                </p>
              </div>
            </div>
            <Link
              href={`/umkm/${product.business_slug}`}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#b91c2c] bg-white px-6 py-2.5 text-sm font-bold text-[#b91c2c] hover:bg-red-50 transition"
            >
              🏪 Kunjungi Toko
            </Link>
          </div>

          {/* Deskripsi */}
          <div className="mt-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Deskripsi Produk</h2>
            <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-line max-w-none">
              {product.description || "Belum ada deskripsi untuk produk ini."}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}