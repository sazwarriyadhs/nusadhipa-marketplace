import Link from "next/link";
import { getProduct, formatRupiah, type ProductDetail, type ProductVariant } from "@/lib/marketplace-api";`r`nimport { getSauriImage } from "@/lib/sauri-images";

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

  // Ambil harga & stok dari varian pertama (karena di ProductDetail min_price di-Omit)
  const firstVariant = product.variants?.[0];
  const price = firstVariant
    ? formatRupiah(firstVariant.price)
    : "Harga belum tersedia";
  const stock = firstVariant?.available_stock ?? 0;

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
          
          {stock > 0 && (
            <p className="mt-2 text-sm text-gray-600">Stok tersedia: <strong>{stock}</strong></p>
          )}

          {product.description && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold">Deskripsi Produk</h2>
              <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="flex-1 rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 transition">
              🛒 Beli Sekarang
            </button>
            <Link
              href={`/umkm/${product.business_slug}`}
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-center font-bold text-gray-900 hover:bg-gray-50 transition"
            >
              🏪 Kunjungi Toko
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

