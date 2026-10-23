import Link from "next/link";
import { getProduct, formatRupiah, type ProductDetail, type ProductVariant } from "@/lib/marketplace-api";
import { getSauriImage } from "@/lib/sauri-images";
import ProductPurchase from "@/components/products/ProductPurchase";

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
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="text-center py-20">
          <span className="text-6xl">🛍️</span>
          <h1 className="mt-4 text-3xl font-bold">Produk tidak ditemukan</h1>
          <Link href="/search" className="mt-4 inline-block rounded-xl bg-red-600 px-6 py-3 text-white font-semibold">
            Kembali ke Katalog
          </Link>
        </div>
      </main>
    );
  }

  // Ambil gambar dari array images (kalau ada), atau fallback ke null
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const originalImageUrl = resolveImageUrl(primaryImage?.image_url);
  
  // Kalau gambar di database kosong, pakai fallback dari folder public/sauri
  const fallbackImageUrl = getSauriImage(product.name);
  const imageUrl = originalImageUrl || fallbackImageUrl;

  // Harga publik menggunakan harga retail bila sudah ditetapkan.
  const firstVariant = product.variants?.[0];
  const retailPrice = firstVariant?.retail_price ?? firstVariant?.price;
  const b2bPrice = firstVariant?.b2b_price;
  const price = retailPrice != null
    ? formatRupiah(retailPrice)
    : "Harga belum tersedia";
  const stock = firstVariant?.available_stock ?? 0;
  const minRetailKg = firstVariant?.min_retail_kg;
  const minB2bKg = firstVariant?.min_b2b_kg;

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-red-600">Beranda</Link>
        {" / "}
        <Link href="/search" className="hover:text-red-600">Produk</Link>
        {" / "}
        <span>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gambar */}
        <div className="aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 border border-gray-200">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <span className="text-6xl">🛍️</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-wider text-red-600">
            {product.category_name || "Kategori"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            {product.name}
          </h1>
          
          <p className="mt-4 text-3xl font-black text-red-600">{price}</p>
          {firstVariant?.selling_unit === "kg" && (
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              {minRetailKg != null && (
                <p>Minimum pembelian retail: <strong>{Number(minRetailKg)} kg</strong></p>
              )}
              {b2bPrice != null && (
                <p>Harga B2B: <strong>{formatRupiah(b2bPrice)}/kg</strong></p>
              )}
              {minB2bKg != null && (
                <p>Minimum pembelian B2B: <strong>{Number(minB2bKg)} kg</strong></p>
              )}
            </div>
          )}
          <p className="mt-2 text-sm text-gray-600">
            Stok tersedia: <strong>{stock}</strong>{firstVariant?.selling_unit === "kg" ? " kg" : ""}
          </p>

          {product.description && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold">Deskripsi Produk</h2>
              <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <ProductPurchase
            productSlug={product.slug}
            productName={product.name}
            businessName={product.business_name}
            imageUrl={imageUrl}
            variants={product.variants || []}
          />
          <Link
            href={`/umkm/${product.business_slug}`}
            className="mt-3 block rounded-xl border border-gray-300 px-6 py-3 text-center font-bold text-gray-900 transition hover:bg-gray-50"
          >
            🏪 Kunjungi Toko
          </Link>
        </div>
      </div>
    </main>
  );
}



