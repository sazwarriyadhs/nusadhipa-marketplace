import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Jadi Kurir Freelance — NUSA-DHIPA",
  description: "Bebas atur waktu, pilih rute sendiri, dan dapat penghasilan tambahan. Terbuka untuk mahasiswa, ibu rumah tangga, atau siapa saja.",
};

export default function CourierPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* HERO SECTION DENGAN BACKGROUND GAMBAR & OVERLAY */}
      <section className="relative w-full pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        
        {/* Gambar Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/kurir_freelance.jpg"
            alt="Kurir Freelance NUSA-DHIPA"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/90 to-white/60" />
        </div>

        {/* Konten Hero */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          
          {/* LOGO NUSA-DHIPA + LOGO KURIR (Digabung) */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <img 
              src="/images/logo_nusadhipa.png" 
              alt="NUSA-DHIPA" 
              className="h-20 md:h-28 w-auto drop-shadow-md"
            />
            <div className="h-16 md:h-24 w-px bg-gray-300"></div>
            <img 
              src="/logos/courier-motor.png" 
              alt="Kurir" 
              className="h-16 md:h-24 w-auto drop-shadow-md"
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Jadi Kurir Freelance NUSA-DHIPA
          </h1>
          <p className="text-gray-700 text-base md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Bebas atur waktu, pilih rute sendiri, dan dapat penghasilan tambahan. Terbuka untuk mahasiswa, ibu rumah tangga, atau siapa saja yang punya waktu luang.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/courier/register"
              className="inline-flex items-center justify-center gap-2 bg-[#b91c2c] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#991b24] transition shadow-lg shadow-red-600/30"
            >
              Daftar Jadi Kurir <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/courier/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition"
            >
              Sudah Punya Akun? Login
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Pilih Rute Sendiri</h3>
            <p className="text-gray-600 leading-relaxed">
              Lihat rute tersedia (A, B, C), ambil yang sesuai kapasitas dan lokasi kamu.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Fee Transparan</h3>
            <p className="text-gray-600 leading-relaxed">
              Fee per rute dan per pesanan terlihat sebelum kamu ambil tugas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Pencairan Fleksibel</h3>
            <p className="text-gray-600 leading-relaxed">
              Cairkan penghasilan harian, mingguan, atau bulanan sesuai kebutuhanmu.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}