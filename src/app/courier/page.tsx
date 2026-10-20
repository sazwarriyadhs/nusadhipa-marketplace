import Link from "next/link";
import Image from "next/image";

export default function CourierLandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <div className="text-center">
        <div className="flex justify-center">
          <Image 
            src="/logos/courier-motor.png" 
            alt="NUSA-DHIPA Kurir" 
            width={280} 
            height={280} 
            priority
          />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-gray-900">
          Jadi Kurir Freelance NUSA-DHIPA
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Bebas atur waktu, pilih rute sendiri, dan dapat penghasilan tambahan.
          Terbuka untuk mahasiswa, ibu rumah tangga, atau siapa saja yang punya waktu luang.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <span className="text-3xl">📍</span>
          <h3 className="mt-3 text-lg font-bold">Pilih Rute Sendiri</h3>
          <p className="mt-2 text-sm text-gray-600">
            Lihat rute tersedia (A, B, C), ambil yang sesuai kapasitas dan lokasi kamu.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <span className="text-3xl">💰</span>
          <h3 className="mt-3 text-lg font-bold">Fee Transparan</h3>
          <p className="mt-2 text-sm text-gray-600">
            Fee per rute dan per pesanan terlihat sebelum kamu ambil tugas.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <span className="text-3xl">📊</span>
          <h3 className="mt-3 text-lg font-bold">Pencairan Fleksibel</h3>
          <p className="mt-2 text-sm text-gray-600">
            Cairkan penghasilan harian, mingguan, atau bulanan.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/courier/register" className="rounded-xl bg-red-600 px-8 py-4 text-center text-lg font-bold text-white hover:bg-red-700">
          Daftar Jadi Kurir →
        </Link>
        <Link href="/courier/login" className="rounded-xl border border-gray-300 px-8 py-4 text-center text-lg font-bold text-gray-900 hover:bg-gray-50">
          Sudah Punya Akun? Login
        </Link>
      </div>
    </main>
  );
}
