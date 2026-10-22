// src/lib/hero-images.ts
// Mapping KBLI / Kategori Usaha → Gambar Banner Hero

export const HERO_IMAGE_MAP: Record<string, string> = {
  // --- FLORIST / TANAMAN ---
  florist: "/images/hero-florist.jpg",
  bunga: "/images/hero-florist.jpg",
  tanaman: "/images/hero-florist.jpg",
  pertanian: "/images/hero-florist.jpg",

  // --- PET / HEWAN / PETFOOD ---
  pet: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2000&auto=format&fit=crop",
  kucing: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2000&auto=format&fit=crop",
  anjing: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2000&auto=format&fit=crop",
  hewan: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2000&auto=format&fit=crop",
  petfood: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2000&auto=format&fit=crop",
  ternak: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2000&auto=format&fit=crop",

  // --- DIGITAL / MEDIA / IT ---
  digital: "/images/hero-digital-media.jpg",
  media: "/images/hero-digital-media.jpg",
  it: "/images/hero-digital-media.jpg",
  software: "/images/hero-digital-media.jpg",
  teknologi: "/images/hero-digital-media.jpg",
  percetakan: "/images/hero-digital-media.jpg",

  // --- KOPI / KULINER / F&B ---
  kopi: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
  kuliner: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
  makanan: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
  restoran: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",

  // --- FASHION / PAKAIAN ---
  fashion: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
  pakaian: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
  butik: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",

  // --- OTOMOTIF ---
  otomotif: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2000&auto=format&fit=crop",
  bengkel: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2000&auto=format&fit=crop",

  // --- KECANTIKAN / SALON ---
  kecantikan: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop",
  salon: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop",
  kosmetik: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop",
};

export const DEFAULT_HERO_IMAGE = "/images/hero-banner.png";

/**
 * Cari gambar hero berdasarkan nama toko + deskripsi.
 * Loop semua keyword, kalau ada yang match, return gambarnya.
 */
export function getHeroImage(businessName: string = "", description: string = ""): string {
  const haystack = `${businessName} ${description}`.toLowerCase();
  
  for (const [keyword, imageUrl] of Object.entries(HERO_IMAGE_MAP)) {
    if (haystack.includes(keyword)) {
      return imageUrl;
    }
  }
  
  return DEFAULT_HERO_IMAGE;
}
