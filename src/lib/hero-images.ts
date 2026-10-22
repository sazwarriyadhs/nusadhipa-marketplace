export const HERO_IMAGE_MAP: Record<string, string> = {
  florist: "/images/hero-florist.jpg",
  bunga: "/images/hero-florist.jpg",
  digital: "/images/hero-digital-media.jpg",
  media: "/images/hero-digital-media.jpg",
  komunika: "/images/hero-digital-media.jpg",
  it: "/images/hero-digital-media.jpg",
  kopi: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
};

export const DEFAULT_HERO_IMAGE = "/images/hero-banner.png";

export function getHeroImage(businessName: string = "", description: string = ""): string {
  const text = `${businessName} ${description}`.toLowerCase();
  
  for (const [key, img] of Object.entries(HERO_IMAGE_MAP)) {
    if (text.includes(key)) {
      return img;
    }
  }
  
  return DEFAULT_HERO_IMAGE;
}
