import type { Category } from "@/lib/marketplace-api";

export const CATEGORY_VISUALS: Record<
  string,
  { image: string; label: string; num: number }
> = {
  "makanan-minuman": { image: "/kategori/01-makanan-minuman.png", label: "Makanan & Minuman", num: 1 },
  makanan: { image: "/kategori/01-makanan-minuman.png", label: "Makanan", num: 1 },
  minuman: { image: "/kategori/01-makanan-minuman.png", label: "Minuman", num: 1 },
  sembako: { image: "/kategori/01-makanan-minuman.png", label: "Sembako", num: 1 },
  "makanan-olahan": { image: "/kategori/01-makanan-minuman.png", label: "Makanan Olahan", num: 1 },

  "pertanian-hasil-bumi": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian & Hasil Bumi", num: 2 },
  "pertanian-peternakan": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian & Peternakan", num: 2 },
  pertanian: { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian", num: 2 },
  "hasil-pertanian": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Hasil Pertanian", num: 2 },
  "bibit-benih": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Bibit & Benih", num: 2 },

  "peternakan-daging-perikanan": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan, Daging & Perikanan", num: 3 },
  peternakan: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan", num: 3 },
  daging: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Daging", num: 3 },
  unggas: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Unggas", num: 3 },
  ikan: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ikan", num: 3 },
  seafood: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Seafood", num: 3 },

  "petfood-kebutuhan-hewan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood & Kebutuhan Hewan", num: 4 },
  petfood: { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood", num: 4 },
  "hewan-peliharaan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Hewan Peliharaan", num: 4 },
  pakan: { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Pakan", num: 4 },
  "makanan-kucing-basah": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Makanan Kucing Basah", num: 4 },
  "makanan-anjing-basah": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Makanan Anjing Basah", num: 4 },
  "makanan-burung": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Makanan Burung", num: 4 },
  "makanan-hamster-kelinci": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Makanan Hamster & Kelinci", num: 4 },
  "perawatan-kesehatan-hewan-nonresep": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Perawatan Kesehatan Hewan", num: 4 },
  "vitamin-suplemen-hewan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Vitamin & Suplemen Hewan", num: 4 },

  "fashion-aksesori": { image: "/kategori/05-fashion-aksesori.png", label: "Fashion & Aksesori", num: 5 },
  fashion: { image: "/kategori/05-fashion-aksesori.png", label: "Fashion", num: 5 },
  pakaian: { image: "/kategori/05-fashion-aksesori.png", label: "Pakaian", num: 5 },
  "alas-kaki": { image: "/kategori/05-fashion-aksesori.png", label: "Alas Kaki", num: 5 },

  "kerajinan-produk-kreatif": { image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan & Produk Kreatif", num: 6 },
  kerajinan: { image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan", num: 6 },

  "rumah-tangga-perlengkapan": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah Tangga & Perlengkapan", num: 7 },
  "rumah-perlengkapan": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah & Perlengkapan", num: 7 },
  rumah: { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah", num: 7 },
  "peralatan-rumah": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Peralatan Rumah", num: 7 },
  "peralatan-dapur": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Peralatan Dapur", num: 7 },

  "kecantikan-perawatan-diri": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan & Perawatan Diri", num: 8 },
  "kesehatan-kecantikan": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kesehatan & Kecantikan", num: 8 },
  kecantikan: { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan", num: 8 },
  "perawatan-diri": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Perawatan Diri", num: 8 },

  "tanaman-bunga-florist": { image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman, Bunga & Florist", num: 9 },
  tanaman: { image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman", num: 9 },

  "elektronik-peralatan": { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Peralatan", num: 10 },
  "elektronik-digital": { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Digital", num: 10 },
  elektronik: { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik", num: 10 },
  "produk-digital": { image: "/kategori/10-elektronik-peralatan.png", label: "Produk Digital", num: 10 },

  "jasa-layanan-bisnis": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan Bisnis", num: 11 },
  "jasa-layanan": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan", num: 11 },
  "jasa-profesional": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa Profesional", num: 11 },
  "jasa-bisnis": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa Bisnis", num: 11 },

  "industri-grosir-b2b": { image: "/kategori/12-industri-grosir-b2b.png", label: "Industri, Grosir & B2B", num: 12 },
  industri: { image: "/kategori/12-industri-grosir-b2b.png", label: "Industri", num: 12 },
};

// Pemetaan URL frontend ke slug API (Database)
export const CATEGORY_SLUG_MAP: Record<string, string> = {
  "makanan-minuman": "makanan-olahan", 
  "pertanian-peternakan": "pertanian-hasil-bumi",
  "pertanian-hasil-bumi": "pertanian-hasil-bumi",
  "hewan-peliharaan": "petfood-kebutuhan-hewan",
  "petfood-kebutuhan-hewan": "petfood-kebutuhan-hewan",
  "peternakan-daging-perikanan": "petfood-kebutuhan-hewan", // Fallback karena belum ada di DB
  "fashion-aksesori": "fashion-aksesori",
  "kerajinan-produk-kreatif": "kerajinan-produk-kreatif",
  "rumah-tangga-perlengkapan": "rumah-tangga-perlengkapan",
  "rumah-perlengkapan": "rumah-tangga-perlengkapan",
  "kecantikan-perawatan-diri": "kecantikan-perawatan-diri",
  "kesehatan-kecantikan": "kecantikan-perawatan-diri",
  "tanaman-bunga-florist": "tanaman-bunga-florist",
  "elektronik-peralatan": "elektronik-peralatan",
  "elektronik-digital": "elektronik-peralatan",
  "jasa-layanan-bisnis": "jasa-layanan-bisnis",
  "jasa-layanan": "jasa-layanan-bisnis",
  "industri-grosir-b2b": "industri-grosir-b2b",
};

export function resolveCategorySlug(rawSlug?: string | null): string {
  const slug = (rawSlug ?? "").toLowerCase().trim();
  return CATEGORY_SLUG_MAP[slug] ?? slug;
}

export function getCategoryVisual(
  category: Pick<Category, "slug" | "name">,
): { image: string; label: string; num: number } {
  const slug = (category.slug ?? "").toLowerCase().trim();
  const bySlug = CATEGORY_VISUALS[slug];
  if (bySlug) return bySlug;

  const name = (category.name ?? "").toLowerCase().trim();
  const byName = CATEGORY_VISUALS[name];
  if (byName) return byName;

  return {
    image: "/kategori/01-makanan-minuman.png",
    label: category.name || "Lainnya",
    num: 99, // Taruh di urutan paling belakang
  };
}