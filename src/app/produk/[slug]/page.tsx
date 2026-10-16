import Link from "next/link";
import ProductAddToCart from "@/components/cart/ProductAddToCart";

// Helper: pastikan URL gambar absolute
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
import { getProduct, formatRupiah } from "@/lib/marketplace-api";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  let product = null;
  let unavailable = false;

  try {
    product = await getProduct(slug);
  } catch {
    unavailable = true;
  }

  if (unavailable) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm text-gray-500">NUSA-DHIPA / Marketplace</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Katalog sementara tidak tersedia
        </h1>
        <p className="mt-2 text-gray-600">
          Layanan katalog belum dapat dihubungi. Silakan coba kembali nanti.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
        >
          Kembali ke marketplace
        </Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm text-gray-500">NUSA-DHIPA / Marketplace</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Produk tidak ditemukan
        </h1>
        <p className="mt-2 text-gray-600">
          Produk belum dipublikasikan atau tautannya tidak valid.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
        >
          Kembali ke marketplace
        </Link>
      </main>
    );
  }

  const variants = product.variants ?? [];
  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price >= 0);

  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const availableStock = variants.reduce(
    (total, variant) => total + Math.max(0, Number(variant.available_stock) || 0),
    0
  );

  const productImages = product.images ?? [];
  const primaryImage =
    productImages.find((image) => Number(image.is_primary) === 1) ??
    productImages[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-red-600">
          Beranda
        </Link>
        {" / "}
        <Link href="/search" className="hover:text-red-600">
          Marketplace
        </Link>
        {" / "}
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="flex min-h-80 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 p-6">
          {primaryImage?.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImageUrl(primaryImage.image_url) || ""}
              alt={primaryImage.alt_text || product.name}
              className="max-h-[440px] w-full rounded-xl object-contain"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl" aria-hidden="true">
                {"🛍️"}
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Foto produk belum tersedia
              </p>
            </div>
          )}
        </section>

        <section className="py-2">
          <p className="text-sm font-medium text-red-600">
            {product.category_name}
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          {product.brand ? (
            <p className="mt-2 text-sm text-gray-500">
              Merek: {product.brand}
            </p>
          ) : null}

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {minPrice === null
              ? "Harga belum tersedia"
              : minPrice === maxPrice
                ? formatRupiah(minPrice)
                : `${formatRupiah(minPrice)} – ${formatRupiah(maxPrice!)}`}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            {availableStock > 0
              ? `Stok tersedia: ${availableStock} unit stok tercatat`
              : "Stok belum tersedia"}
          </p>

          <p className="mt-5 leading-7 text-gray-600">
            {product.description ||
              product.short_description ||
              "Informasi produk belum tersedia."}
          </p>

          {variants.length > 0 ? (
            <section className="mt-6 rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900">
                Pilihan varian
              </h2>

              <ul className="mt-3 space-y-3">
                {variants.map((variant) => {
                  const stock = Math.max(
                    0,
                    Number(variant.available_stock) || 0
                  );

                  return (
                    <li
                      key={variant.id}
                      className="flex items-start justify-between gap-4 border-t border-gray-100 pt-3"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {variant.variant_name}
                        </p>
                        {variant.weight_grams ? (
                          <p className="text-sm text-gray-500">
                            {variant.weight_grams >= 1000
                              ? `${variant.weight_grams / 1000} kg`
                              : `${variant.weight_grams} gram`}
                          </p>
                        ) : null}
                        <p className="text-sm text-gray-500">
                          {stock > 0
                            ? `Stok: ${stock}`
                            : "Stok kosong"}
                        </p>
                      </div>

                      <p className="whitespace-nowrap font-semibold text-gray-900">
                        {formatRupiah(variant.price)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : (
            <p className="mt-5 text-sm text-gray-500">
              Varian produk belum tersedia.
            </p>
          )}

          <div className="mt-6 rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Penjual</p>
            <p className="mt-1 font-semibold text-gray-900">
              {product.business_name}
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              Periksa informasi penjual, persyaratan produk, harga, dan
              ketersediaan aktual sebelum transaksi.
            </p>
          </div>

          <div className="mt-6">
            <ProductAddToCart
              productSlug={product.slug}
              productName={product.name}
              businessName={product.business_name}
              imageUrl={primaryImage?.image_url ?? null}
              variants={product.variants ?? []}
            />
          </div>

          <p className="mt-3 text-xs leading-5 text-gray-500">
            Informasi harga dan stok bersumber dari katalog. Konfirmasikan
            ketersediaan aktual sebelum transaksi.
          </p>
        </section>
      </div>
    </main>
  );
}