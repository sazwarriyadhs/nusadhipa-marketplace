import Link from "next/link";

export default function NotFound() {
  return (
    <main className="empty-page">
      <span className="eyebrow">404 · PRODUK TIDAK DITEMUKAN</span>
      <h1>Produk ini belum tersedia.</h1>
      <p>Produk mungkin sudah tidak aktif atau alamatnya tidak sesuai.</p>
      <Link href="/" className="primary-link">Kembali ke marketplace</Link>
    </main>
  );
}
