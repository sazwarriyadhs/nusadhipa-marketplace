// Mapping nama produk ke nama file gambar di folder public/sauri
// Dibuat otomatis karena foto udah tersedia
export const SAURI_IMAGE_MAP: Record<string, string> = {
  "ayam beku test": "01_boneless-dada.jpg", // Placeholder, ganti sesuai produk asli
  "boneless dada": "01_boneless-dada.jpg",
  "boneless paha": "02_boneless-paha.jpg",
  "paha pentung": "03_paha-pentung.jpg",
  "sayap r": "04_sayap-r.jpg",
  "sayap bn": "05_sayap-bn.jpg",
  "kepala bn": "06_kepala-bn.jpg",
  "kepala pt": "07_kepala-pt.jpg",
  "ceker bn": "08_ceker-bn.jpg",
  "ceker kuning": "09_ceker-kuning.jpg",
  "kulit body": "10_kulit-body.jpg",
  "krokong pt": "11_krokong-pt.jpg",
  "jantung bersih": "12_jantung-bersih.jpg",
  "ampela bersih": "13_ampela-bersih.jpg",
  "ampela kotor": "14_ampela-kotor.jpg",
  "hati bersih": "15_hati-bersih.jpg",
  "usus": "16_usus.jpg",
  "tulang paha": "17_tulang-paha.jpg",
  "tunggir": "18_tunggir.jpg",
  "ayam utuh karkas": "19_ayam-utuh-karkas.jpg",
  "tuna loin": "20_tuna-loin.jpg",
  "tuna mixed cooked": "21_tuna-mixed-cooked-saurigo-tmc-001.jpg",
  "ikan air tawar": "22_ikan-air-tawar.jpg",
  "ikan laut": "23_ikan-laut.jpg",
  "fillet ikan": "24_fillet-ikan.jpg",
  "ikan potong": "25_ikan-potong.jpg",
  "pakan kucing": "26_pakan-kucing.jpg",
  "pakan anjing": "27_pakan-anjing.jpg",
  "pakan ikan": "28_pakan-ikan.jpg",
  "pakan ternak": "29_pakan-ternak.jpg",
};

/**
 * Fungsi buat nyari gambar berdasarkan nama produk (case-insensitive).
 * Kalau nggak ketemu, return null.
 */

// ===== MAPPING GAMBAR DEFAULT PER KATEGORI =====
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "peternakan": "/sauri/SAURI_29_Foto_Produk_Cropped/19_ayam-utuh-karkas.jpg",
  "daging": "/sauri/SAURI_29_Foto_Produk_Cropped/17_tulang-paha.jpg",
  "ikan": "/sauri/SAURI_29_Foto_Produk_Cropped/23_ikan-laut.jpg",
  "seafood": "/sauri/SAURI_29_Foto_Produk_Cropped/20_tuna-loin.jpg",
  "petfood": "/sauri/SAURI_29_Foto_Produk_Cropped/26_pakan-kucing.jpg",
  "pakan": "/sauri/SAURI_29_Foto_Produk_Cropped/28_pakan-ikan.jpg",
  "pertanian": "/sauri/SAURI_29_Foto_Produk_Cropped/29_pakan-ternak.jpg",
  "sembako": "/sauri/SAURI_29_Foto_Produk_Cropped/28_pakan-ikan.jpg",
};

export function getCategoryImage(categoryName: string | undefined | null): string {
  if (!categoryName) return "/sauri/SAURI_29_Foto_Produk_Cropped/19_ayam-utuh-karkas.jpg"; // Default
  
  const normalized = categoryName.toLowerCase();
  for (const [key, imagePath] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (normalized.includes(key)) return imagePath;
  }
  
  // Kalau nggak ada yang cocok, pakai gambar default (ayam)
  return "/sauri/SAURI_29_Foto_Produk_Cropped/19_ayam-utuh-karkas.jpg";
}

export function getSauriImage(productName: string): string | null {
  const normalized = productName.toLowerCase().trim();
  
  // Cari yang persis sama dulu
  if (SAURI_IMAGE_MAP[normalized]) {
    return `/sauri/SAURI_29_Foto_Produk_Cropped/${SAURI_IMAGE_MAP[normalized]}`;
  }
  
  // Kalau nggak persis, cari yang mengandung kata kunci
  for (const [key, filename] of Object.entries(SAURI_IMAGE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return `/sauri/SAURI_29_Foto_Produk_Cropped/${filename}`;
    }
  }
  
  return null;
}

