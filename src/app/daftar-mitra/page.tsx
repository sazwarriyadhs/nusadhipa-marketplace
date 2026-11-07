import Link from "next/link";

export const metadata = {
  title: "Daftar Jadi Mitra — NUSA-DHIPA",
  description: "Bergabunglah dengan ekosistem NUSA-DHIPA dan jangkau lebih banyak pelanggan di seluruh Indonesia.",
};

const benefits = [
  {
    icon: "🚀",
    title: "Jangkauan Pasar Lebih Luas",
    desc: "Produk Anda akan dilihat oleh ribuan pembeli dan pelaku bisnis di seluruh Indonesia, tanpa batas geografis.",
  },
  {
    icon: "💰",
    title: "Bebas Biaya Pendaftaran",
    desc: "Bergabung 100% gratis. Tidak ada biaya bulanan, tidak ada potongan tersembunyi. Fokus jualan Anda.",
  },
  {
    icon: "🛡️",
    title: "Terverifikasi & Terpercaya",
    desc: "Dapatkan badge terverifikasi dengan melengkapi NIB/KBLI, tingkatkan kepercayaan calon pembeli.",
  },
  {
    icon: "📊",
    title: "Dashboard Analitik",
    desc: "Pantau penjualan, stok, dan performa toko Anda dengan mudah melalui dashboard mitra.",
  },
  {
    icon: "🤝",
    title: "Dukungan Tim NUSA-DHIPA",
    desc: "Tim support siap membantu Anda dari proses onboarding sampai go-live.",
  },
  {
    icon: "🌐",
    title: "Ekosistem B2B & B2C",
    desc: "Jual secara eceran ke konsumen atau grosir ke sesama pelaku usaha. Satu platform untuk semua.",
  },
];

export default function DaftarMitraPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* HERO SECTION (DENGAN GAMBAR COVER) */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Gambar Background */}
        <img
          src="/images/produk_mitra.jpg"
          alt="Produk Mitra NUSA-DHIPA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay Gradien Merah */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#b91c2c]/80 via-[#b91c2c]/70 to-[#7a0f1a]/90" />

        {/* Konten Teks */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
          <span className="inline-block py-1 px-4 rounded-full bg-white/20 text-white text-sm font-bold tracking-wider mb-6 backdrop-blur-sm">
            GRATIS · MUDAH · TERPERCAYA
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Ingin Produkmu Dikenal <br className="hidden md:block" />
            Seluruh Indonesia?
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow">
            Daftarkan usahamu sebagai mitra NUSA-DHIPA dalam 2 menit. Ribuan UMKM telah bergabung dan tumbuh bersama kami.
          </p>
          <Link
            href="/register?type=tenant"
            className="inline-flex items-center gap-2 bg-white text-[#b91c2c] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl"
          >
            Daftar Sekarang <span aria-hidden="true">→</span>
          </Link>
          <p className="text-white/80 text-sm mt-4">
            Sudah punya akun? <Link href="/login" className="underline font-semibold hover:text-white">Masuk di sini</Link>
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Kenapa Harus Gabung?</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Kami dirancang untuk membantu UMKM dan bisnis Anda tumbuh lebih cepat.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-3xl mb-4">
                {b.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Cara Bergabung</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Hanya 3 langkah mudah untuk mulai berjualan.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Isi Formulir Pendaftaran", desc: "Lengkapi data diri dan informasi usaha Anda melalui halaman registrasi." },
            { step: "2", title: "Verifikasi Admin", desc: "Tim kami akan meninjau data Anda dalam 1-3 hari kerja. Lengkapi NIB/KBLI untuk proses lebih cepat." },
            { step: "3", title: "Mulai Berjualan!", desc: "Setelah aktif, Anda bisa langsung upload produk dan mulai menerima pesanan." },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#b91c2c] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                {s.step}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="max-w-4xl mx-auto px-4 mt-24">
        <div className="bg-[#b91c2c] rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Siap Bergabung?</h2>
          <p className="text-white/90 mb-8 max-w-lg mx-auto">
            Daftarkan usahamu sekarang dan jadilah bagian dari ekosistem UMKM terbesar di Indonesia.
          </p>
          <Link
            href="/register?type=tenant"
            className="inline-flex items-center gap-2 bg-white text-[#b91c2c] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Daftar Jadi Mitra <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

    </main>
  );
}