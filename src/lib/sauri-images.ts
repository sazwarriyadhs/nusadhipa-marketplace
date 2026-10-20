// Mapping nama produk ke nama file gambar di folder public/sauri
export const SAURI_IMAGE_MAP: Record<string, string> = {
  "ayam beku test": "01_boneless-dada.jpg",
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

// Mapping nama kategori ke gambar default
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  // Makanan & Minuman
  "makanan": "01_boneless-dada.jpg",
  "minuman": "01_boneless-dada.jpg",
  
  // Pertanian & Peternakan
  "pertanian": "29_pakan-ternak.jpg",
  "peternakan": "19_ayam-utuh-karkas.jpg",
  "hasil pertanian": "29_pakan-ternak.jpg",
  "bibit": "29_pakan-ternak.jpg",
  
  // Hewan Peliharaan
  "hewan peliharaan": "27_pakan-anjing.jpg",
  "perlengkapan hewan": "27_pakan-anjing.jpg",
  
  // Fashion & Aksesori
  "fashion": "01_boneless-dada.jpg",
  "pakaian": "01_boneless-dada.jpg",
  "alas kaki": "01_boneless-dada.jpg",
  "aksesori fashion": "01_boneless-dada.jpg",
  
  // Rumah & Perlengkapan
  "rumah": "01_boneless-dada.jpg",
  "perlengkapan": "01_boneless-dada.jpg",
  "peralatan rumah": "01_boneless-dada.jpg",
  "peralatan dapur": "01_boneless-dada.jpg",
  
  // Kesehatan & Kecantikan
  "kesehatan": "23_ikan-laut.jpg",
  "kecantikan": "23_ikan-laut.jpg",
  "perawatan diri": "23_ikan-laut.jpg",
  
  // Elektronik & Digital
  "elektronik": "01_boneless-dada.jpg",
  "digital": "01_boneless-dada.jpg",
  "aksesori elektronik": "01_boneless-dada.jpg",
  
  // Jasa & Layanan
  "jasa": "01_boneless-dada.jpg",
  "layanan": "01_boneless-dada.jpg",
  "jasa profesional": "01_boneless-dada.jpg",
  "jasa bisnis": "01_boneless-dada.jpg",
  
  // Daging & Unggas
  "daging": "17_tulang-paha.jpg",
  "unggas": "19_ayam-utuh-karkas.jpg",
  
  // Ikan & Seafood
  "ikan": "23_ikan-laut.jpg",
  "seafood": "20_tuna-loin.jpg",
  
  // Makanan Olahan
  "makanan olahan": "01_boneless-dada.jpg",
  
  // Sembako
  "sembako": "28_pakan-ikan.jpg",
  
  // Pakan
  "pakan ternak": "29_pakan-ternak.jpg",
  "pakan kucing": "26_pakan-kucing.jpg",
  "pakan anjing": "27_pakan-anjing.jpg",
  "pakan ikan": "28_pakan-ikan.jpg",
};

export function getSauriImage(productName: string): string | null {
  const normalized = productName.toLowerCase().trim();
  
  if (SAURI_IMAGE_MAP[normalized]) {
    return `/sauri/SAURI_29_Foto_Produk_Cropped/${SAURI_IMAGE_MAP[normalized]}`;
  }
  
  for (const [key, filename] of Object.entries(SAURI_IMAGE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return `/sauri/SAURI_29_Foto_Produk_Cropped/${filename}`;
    }
  }
  
  return null;
}

export function getCategoryImage(categoryName: string | undefined | null): string {
  if (!categoryName) return "/sauri/SAURI_29_Foto_Produk_Cropped/19_ayam-utuh-karkas.jpg";
  
  const normalized = categoryName.toLowerCase();
  
  // Cari yang persis dulu
  if (CATEGORY_IMAGE_MAP[normalized]) {
    return `/sauri/SAURI_29_Foto_Produk_Cropped/${CATEGORY_IMAGE_MAP[normalized]}`;
  }
  
  // Cari yang mengandung kata kunci
  for (const [key, filename] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return `/sauri/SAURI_29_Foto_Produk_Cropped/${filename}`;
    }
  }
  
  // Default kalau nggak ketemu
  return "/sauri/SAURI_29_Foto_Produk_Cropped/19_ayam-utuh-karkas.jpg";
}
