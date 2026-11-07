import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { getProducts, formatRupiah, type Product } from "@/lib/marketplace-api";
import { formatStock } from "@/lib/format-stock";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  "http://127.0.0.1:4000/api/v1"
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

// Data Mockup untuk Kartu Promo (Karena belum ada API Promo)
const PROMO_DATA = [
  {
    id: 1,
    icon: "🎁",
    title: "Diskon 15% Pembelian Pertama",
    desc: "Berlaku untuk semua produk, maks. Rp50.000",
    code: "NEW15",
    min: "Min. Rp 100.000",
    date: "s/d 31 Des 2026",
    badge: "-25%",
    color: "bg-red-50 text-red-600",
  },
  {
    id: 2,
    icon: "🐟",
    title: "Bundling Ikan Segar 3 Pack",
    desc: "Beli 3 pack ikan segar, gratis 1 pack",
    code: "IKAN3FREE1",
    min: "Min. Rp 200.000",
    date: "s/d 30 Nov 2026",
    badge: "-13%",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 3,
    icon: "🐾",
    title: "Cashback Rp20.000",
    desc: "Min. belanja Rp150.000 untuk produk pakan",
    code: "PAKAN20",
    min: "Min. Rp 150.000",
    date: "s/d 15 Des 2026",
    badge: "GRATIS",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: 4,
    icon: "🚚",
    title: "Gratis Ongkir Se-Indonesia",
    desc: "Min. belanja Rp100.000, maks. potongan Rp25.000",
    code: "FREESHIP",
    min: "Min. Rp 100.000",
    date: "s/d 31 Des 2026",
    badge: "-20%",
    color: "bg-green-50 text-green-600",
  },
];

export default async function PromoPage({ searchParams }: PageProps) {
  await searchParams;

  let products: Product[] = [];
  try {
    const raw = await getProducts({ limit: 8 });
    products = extractApiList<Product>(raw);
  } catch {
    products = [];
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        
        {/* BREADCRUMB */}
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#b91c2c]">Beranda</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Promo</span>
        </nav>

        {/* HERO SECTION */}
        <section className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row items-center mb-12">
          <div className="absolute inset-0 z-0">
            <img src="/images/promo.jpg" alt="Promo Background" className="w-full h-full object-cover opacity-20" />
          </div>
          <div className="relative z-10 p-8 md:p-12 flex-1">
            <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider mb-4">
              🔥 PROMO SPESIAL HARI INI
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Belanja lebih hemat, <br />
              <span className="text-[#b91c2c]">bisnis lebih untung.</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Temukan penawaran terbaru dari mitra usaha NUSA-DHIPA: bundling, diskon grosir, cashback, dan gratis ongkir.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="#promo-produk" className="px-6 py-3 bg-[#b91c2c] text-white font-bold rounded-xl hover:bg-[#991b24] transition shadow-lg shadow-red-600/30">
                Belanja Sekarang →
              </Link>
              <Link href="/umkm" className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition">
                Lihat Mitra
              </Link>
            </div>
          </div>
          <div className="relative z-10 flex-1 p-8 flex items-center justify-center">
             <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-red-100">
                <div className="absolute -top-4 -right-4 bg-[#b91c2c] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  Hingga 50%!
                </div>
                <span className="text-6xl block mb-4">🎁</span>
                <strong className="text-2xl font-black text-gray-900 block mb-1">Promo Spesial</strong>
                <small className="text-gray-500">Berlaku terbatas. Buruan!</small>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-400">Kode:</span>
                  <span className="ml-2 font-mono font-bold text-[#b91c2c] text-lg">NUSAHEMAT</span>
                </div>
              </div>
          </div>
        </section>

        {/* GRID KARTU PROMO */}
        <section className="mb-16">
          <div className="mb-8">
            <span className="text-xs font-bold tracking-widest text-[#b91c2c] uppercase">KATALOG PROMO</span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Penawaran Spesial</h2>
            <p className="text-gray-500 mt-1">Gunakan kode promo di bawah ini saat checkout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROMO_DATA.map((promo) => (
              <div key={promo.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-lg transition">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${promo.color}`}>
                  {promo.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{promo.title}</h3>
                <p className="text-xs text-gray-500 mb-4 flex-grow">{promo.desc}</p>
                
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-4 space-y-1">
                   <p className="text-[10px] text-gray-500">{promo.min}</p>
                   <p className="text-[10px] text-gray-500">{promo.date}</p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-mono font-bold text-sm bg-red-50 text-[#b91c2c] px-3 py-1 rounded border border-red-100">
                    {promo.code}
                  </span>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-[#b91c2c] transition flex items-center gap-1">
                    Salin →
                  </span>
                </div>

                {/* Badge Potongan */}
                <div className="absolute top-0 right-0 bg-[#b91c2c] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  {promo.badge}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUK PROMO (DARI API) */}
        <section id="promo-produk" className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#b91c2c] uppercase">PRODUK TERKAIT</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Sedang Banyak Dicari</h2>
            </div>
            <Link href="/search" className="text-sm font-bold text-[#b91c2c] hover:underline">Lihat Semua →</Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <span className="text-4xl">🛍️</span>
              <p className="text-gray-500 mt-2">Belum ada produk yang tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((p, i) => (
                <Link key={i} href={`/produk/${p.slug}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                  <div className="h-40 bg-gray-100 relative overflow-hidden">
                     {p.image_url ? (
                        <img src={resolveImageUrl(p.image_url) || ""} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                     ) : (
                        <div className="flex items-center justify-center h-full text-4xl">🛍️</div>
                     )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-2">{p.name}</h3>
                    <p className="text-base font-black text-[#b91c2c]">{formatRupiah(p.min_price || 0)}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{p.business_name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA BAWAH */}
        <section className="bg-[#b91c2c] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Daftar Mitra, Dapat Promo Eksklusif</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">Gabung sebagai mitra NUSA-DHIPA dan nikmati akses promo khusus serta penawaran B2B dari mitra terverifikasi.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/daftar" className="bg-white text-[#b91c2c] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                Daftar Jadi Mitra
              </Link>
              <Link href="/bantuan" className="bg-transparent border-2 border-white/30 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition">
                Hubungi Bantuan
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}