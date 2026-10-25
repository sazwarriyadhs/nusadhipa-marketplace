export default function ProfilPage() {
  return (
    <div className="container mx-auto p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Profil Saya</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl font-bold border-4 border-red-200">
            U
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800">Nama Pengguna</h2>
            <p className="text-gray-500">email@example.com</p>
            <span className="inline-block mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">Terverifikasi</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Alamat Pengiriman</h3>
          <p className="text-gray-500 text-sm">Belum ada alamat yang tersimpan.</p>
          <button className="mt-4 border border-red-600 text-red-600 px-4 py-2 rounded text-sm font-semibold hover:bg-red-50 transition">
            Tambah Alamat
          </button>
        </div>
      </div>
    </div>
  );
}
