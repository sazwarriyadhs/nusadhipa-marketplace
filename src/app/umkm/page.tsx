import Image from "next/image";
import Link from "next/link";
import { getBusinesses, getProducts, type BusinessInfo } from "@/lib/marketplace-api";

export const dynamic = "force-dynamic";

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

export default async function UmkmPage() {
  const [businesses, allProducts] = await Promise.all([
    getBusinesses().catch(() => []),
    getProducts({ limit: 500 }).then(res => res.data).catch(() => [])
  ]);

  const businessStats = businesses.map(biz => {
    const bizProducts = allProducts.filter(p => p.business_slug === biz.slug);
    const uniqueCategories = new Set(bizProducts.map(p => p.category_name).filter(Boolean));
    
    let finalBannerUrl = resolveImageUrl(biz.banner_url);
    if (biz.slug === "pt-digi-media-komunika" || biz.business_name.toUpperCase().includes("DIGI MEDIA")) {
      finalBannerUrl = "https://res.cloudinary.com/wqytmco9/image/upload/v1794031446/digi_media.jpg"; 
    }

    return {
      ...biz,
      productCount: bizProducts.length,
      categories: Array.from(uniqueCategories),
      categoryCount: uniqueCategories.size,
      safeLogoUrl: resolveImageUrl(biz.logo_url),
      safeBannerUrl: finalBannerUrl,
    };
  }).sort((a, b) => b.productCount - a.productCount);

  const topCategories = [
    { name: "Makanan Olahan", count: 28, image: "/kategori/01-makanan-minuman.png" },
    { name: "Makanan & Minuman", count: 25, image: "/kategori/01-makanan-minuman.png" },
    { name: "Pertanian & Hasil Bumi", count: 8, image: "/kategori/02-pertanian-hasil-bumi.png" },
    { name: "Ikan & Seafood", count: 8, image: "/kategori/03-peternakan-daging-perikanan.png" },
    { name: "Daging & Unggas", count: 7, image: "/kategori/03-peternakan-daging-perikanan.png" },
    { name: "Petfood & Kebutuhan Hewan", count: 6, image: "/kategori/04-petfood-kebutuhan-hewan.png" },
  ]; 

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto mt-6 px-4">
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch">
          <div className="flex-1 p-8 md:p-12 lg:p-16 z-10 flex flex-col justify-center">
            <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-[#b91c2c] text-sm font-bold tracking-wider mb-4 w-fit">
              EKOSISTEM UMKM NUSANTARA
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Kenali mitra usaha <br className="hidden md:block" />
              <span className="text-[#b91c2c]">NUSA-DHIPA.</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Jelajahi pelaku usaha lokal yang mempercayakan produknya di marketplace NUSA-DHIPA. Temukan mitra yang tepat untuk kebutuhan bisnismu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-[#b91c2c] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#991b24] transition shadow-lg shadow-red-600/20">
                Cari Produk <span aria-hidden="true">→</span>
              </Link>
              <Link href="#daftar-mitra" className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition">
                Lihat Daftar Mitra
              </Link>
            </div>
          </div>
          <div className="flex-1 relative min-h-[300px] md:min-h-[450px] w-full">
            <img src="/images/belanja_dipasar.jpg" alt="Belanja di Pasar - UMKM Nusantara" className="absolute inset-0 w-full h-full object-cover object-center md:rounded-l-[3rem]" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-1/2 hidden md:block" />
          </div>
        </div>
      </section>

      {/* KATEGORI POPULER */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">KATEGORI POPULER</h2>
          <p className="text-gray-500 text-sm mt-1">Kategori mitra paling aktif</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.map((cat, idx) => (
            <Link key={idx} href={`/search?category=${encodeURIComponent(cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition group flex flex-col">
              <div className="w-full h-24 rounded-lg overflow-hidden mb-4 bg-gray-50 relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-bold text-sm text-gray-800 leading-tight mb-2 min-h-[40px]">{cat.name}</h3>
              <span className="mt-auto inline-flex items-center justify-center bg-gray-50 text-gray-600 text-xs font-bold px-2 py-1 rounded-md border border-gray-100 w-fit">
                {cat.count} Produk
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* DIREKTORI MITRA */}
      <section id="daftar-mitra" className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">DIREKTORI MITRA</h2>
            <p className="text-gray-500 mt-1">Menampilkan {businessStats.length} mitra usaha dari katalog.</p>
          </div>
          <Link href="/search" className="inline-flex items-center gap-2 text-[#b91c2c] font-semibold hover:underline">
            Jelajahi katalog <span aria-hidden="true">→</span>
          </Link>
        </div>

        {businessStats.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl">🏪</span>
            <h3 className="mt-4 text-xl font-bold text-gray-800">Belum ada mitra terdaftar</h3>
            <p className="text-gray-500 mt-2">Mitra usaha akan muncul di sini setelah terdaftar di sistem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessStats.map((biz, idx) => (
              <div key={idx} className="nd-tenant-card bg-white rounded-2xl overflow-hidden flex flex-col relative h-full pb-5">
                
                {/* Banner Toko */}
                <div className="relative h-40 bg-gray-200 w-full overflow-hidden flex-shrink-0">
                   {biz.safeBannerUrl ? (
                     <img src={biz.safeBannerUrl} alt={`Cover ${biz.business_name}`} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                       <span className="text-gray-400 text-sm font-medium">Belum ada banner</span>
                     </div>
                   )}
                </div>
                
                {/* LOGO TOKO */}
                <div className="absolute top-24 left-5 z-10 flex-shrink-0">
                  {biz.safeLogoUrl ? (
                    <img 
                      src={biz.safeLogoUrl} 
                      alt={`Logo ${biz.business_name}`} 
                      className="nd-tenant-logo w-16 h-16 rounded-xl border-4 border-white bg-white object-cover shadow-sm"
                    />
                  ) : (
                    <div className="nd-tenant-logo w-16 h-16 rounded-xl border-4 border-white bg-[#b91c2c] flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                      {biz.business_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="p-5 pt-10 flex-1 flex flex-col">
                  {/* Nama Toko & Centang */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{biz.business_name}</h3>
                    {biz.verification_status === "verified" && (
                      <span className="text-green-500 text-lg" title="Terverifikasi">✓</span>
                    )}
                  </div>
                  
                  {/* Deskripsi Singkat */}
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed min-h-[32px]">
                    {biz.description || "Mitra usaha lokal NUSA-DHIPA yang menyediakan produk dan layanan berkualitas."}
                  </p>

                  {/* Legalitas / KBLI */}
                  <div className="mb-3 flex flex-wrap gap-1.5 min-h-[24px]">
                    {biz.nib && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">
                        🛡️ NIB Terdaftar
                      </span>
                    )}
                    {biz.kbli_name && (
                      <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded border border-blue-100 truncate w-fit max-w-[220px]" title={biz.kbli_name}>
                        {biz.kbli_name}
                      </span>
                    )}
                  </div>

                  {/* KOTAK STATISTIK & KATEGORI */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 mt-auto">
                    <div className="flex items-center gap-6 mb-2 border-b border-gray-200 pb-2">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Produk</p>
                        <p className="font-bold text-sm text-gray-900">{biz.productCount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Kategori</p>
                        <p className="font-bold text-sm text-gray-900">{biz.categoryCount}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {biz.categories.length > 0 ? (
                        <>
                          {biz.categories.slice(0, 3).map((catName, i) => (
                            <span key={i} className="nd-tenant-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] max-w-[140px] truncate" title={catName}>
                              {catName}
                            </span>
                          ))}
                          {biz.categoryCount > 3 && (
                            <span className="inline-block bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-300">
                              +{biz.categoryCount - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <p className="text-[10px] text-gray-400 italic m-0">Belum ada produk</p>
                      )}
                    </div>
                  </div>

                  {/* TOMBOL LIHAT TOKO (Baru, Penuh Warna) */}
                  <div className="pt-2">
                    <Link 
                      href={`/umkm/${biz.slug}`} 
                      className="flex items-center justify-center gap-2 w-full bg-[#b91c2c] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#991b24] transition shadow-sm hover:shadow-md"
                    >
                      Kunjungi Toko <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* GABUNG EKOSISTEM */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-[#b91c2c] rounded-3xl overflow-hidden relative shadow-xl flex flex-col md:flex-row items-center">
          <div className="p-8 md:p-12 lg:p-16 flex-1 z-10 text-white">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider mb-4">
              GABUNG EKOSISTEM NUSA-DHIPA
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
              Ingin produkmu dikenal lebih luas?
            </h2>
            <p className="text-white/90 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
              Daftarkan usahamu sebagai mitra NUSA-DHIPA dan jangkau lebih banyak pelanggan serta pelaku bisnis di seluruh Indonesia.
            </p>
            <Link href="/daftar-mitra" className="inline-flex items-center justify-center gap-2 bg-white text-[#b91c2c] px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
              Daftar Jadi Mitra <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
