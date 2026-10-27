
import Link from 'next/link';

type DetailPesananPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailPesananPage({
  params,
}: DetailPesananPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto p-6 md:p-8 max-w-4xl">
      <Link
        href="/pesanan"
        className="text-red-600 hover:underline mb-4 inline-block text-sm font-semibold"
      >
        &larr; Kembali ke Daftar Pesanan
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Detail Pesanan
      </h1>

      <p className="text-gray-500 mb-6">
        ID Pesanan:{' '}
        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
          {id}
        </span>
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-700 font-semibold">Status Pesanan</p>

          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
            Menunggu Pembayaran
          </span>
        </div>

        <div className="border-t pt-4 mt-4">
          <p className="text-gray-500 text-sm text-center py-8">
            Rincian item, alamat pengiriman, dan total biaya akan ditampilkan di sini.
          </p>
        </div>
      </div>
    </div>
  );
}
