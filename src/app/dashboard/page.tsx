import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Mitra</h1>
          <p className="text-gray-500 mt-1">Kelola produk dan pesanan toko Anda di NUSA-DHIPA.</p>
        </div>
        <Link href="/dashboard/produk/baru" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition">
          + Tambah Produk
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-600">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Produk</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pesanan Baru</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-600">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pendapatan</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">Rp 0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        <p>Belum ada aktivitas terbaru. Fitur manajemen produk sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}
