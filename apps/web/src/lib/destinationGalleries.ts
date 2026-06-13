/**
 * Destination gallery data — 4 HD images per destination
 * Used to power the image rotator on package/destination cards
 */
export const destinationGalleries: Record<string, string[]> = {
  // ===== ACTIVE KENYAN DESTINATIONS =====
  "masai-mara": [
    "/images/destinations/masai-mara-1.jpg",
    "/images/destinations/masai-mara-2.jpg",
    "/images/destinations/masai-mara-3.jpg",
    "/images/destinations/masai-mara-4.jpg",
  ],
  "masai-mara-migration": [
    "/images/destinations/masai-mara-1.jpg",
    "/images/destinations/masai-mara-2.jpg",
    "/images/destinations/masai-mara-3.jpg",
    "/images/destinations/masai-mara-4.jpg",
  ],
  "amboseli-national-park": [
    "/images/destinations/amboseli-1.jpg",
    "/images/destinations/amboseli-2.jpg",
    "/images/destinations/amboseli-3.jpg",
    "/images/destinations/amboseli-4.jpg",
  ],
  "amboseli-elephant-safari": [
    "/images/destinations/amboseli-1.jpg",
    "/images/destinations/amboseli-2.jpg",
    "/images/destinations/amboseli-3.jpg",
    "/images/destinations/amboseli-4.jpg",
  ],

  // ===== KENYAN COASTAL DESTINATIONS =====
  "diani-beach": [
    "/images/destinations/diani-1.jpg",
    "/images/destinations/diani-2.jpg",
    "/images/destinations/diani-3.jpg",
    "/images/destinations/diani-4.jpg",
  ],
  "watamu": [
    "/images/destinations/watamu-1.jpg",
    "/images/destinations/watamu-2.jpg",
    "/images/destinations/watamu-3.jpg",
    "/images/destinations/watamu-4.jpg",
  ],
  "malindi": [
    "/images/destinations/malindi-1.jpg",
    "/images/destinations/malindi-2.jpg",
    "/images/destinations/malindi-3.jpg",
    "/images/destinations/malindi-4.jpg",
  ],
  "lamu-island": [
    "/images/destinations/lamu-1.jpg",
    "/images/destinations/lamu-2.jpg",
    "/images/destinations/lamu-3.jpg",
    "/images/destinations/lamu-4.jpg",
  ],

  // ===== CROSS-BORDER DESTINATIONS (Coming Soon) =====
  "serengeti-national-park": [
    "/images/destinations/serengeti-1.jpg",
    "/images/destinations/serengeti-2.jpg",
    "/images/destinations/serengeti-3.jpg",
    "/images/destinations/serengeti-4.jpg",
  ],
  "serengeti-classic-safari": [
    "/images/destinations/serengeti-1.jpg",
    "/images/destinations/serengeti-2.jpg",
    "/images/destinations/serengeti-3.jpg",
    "/images/destinations/serengeti-4.jpg",
  ],
  "zanzibar": [
    "/images/destinations/zanzibar-1.jpg",
    "/images/destinations/zanzibar-2.jpg",
    "/images/destinations/zanzibar-3.jpg",
    "/images/destinations/zanzibar-4.jpg",
  ],
  "zanzibar-beach-paradise": [
    "/images/destinations/zanzibar-1.jpg",
    "/images/destinations/zanzibar-2.jpg",
    "/images/destinations/zanzibar-3.jpg",
    "/images/destinations/zanzibar-4.jpg",
  ],
  "kruger-national-park": [
    "/images/destinations/kruger-1.jpg",
    "/images/destinations/kruger-2.jpg",
    "/images/destinations/kruger-3.jpg",
    "/images/destinations/kruger-4.jpg",
  ],
  "kruger-big-five-safari": [
    "/images/destinations/kruger-1.jpg",
    "/images/destinations/kruger-2.jpg",
    "/images/destinations/kruger-3.jpg",
    "/images/destinations/kruger-4.jpg",
  ],
  "family-safari-adventure": [
    "/images/destinations/kruger-1.jpg",
    "/images/destinations/kruger-2.jpg",
    "/images/destinations/kruger-3.jpg",
    "/images/destinations/kruger-4.jpg",
  ],
  "victoria-falls": [
    "/images/destinations/victoria-falls-1.jpg",
    "/images/destinations/victoria-falls-2.jpg",
    "/images/destinations/victoria-falls-3.jpg",
    "/images/destinations/victoria-falls-4.jpg",
  ],
  "victoria-falls-adventure": [
    "/images/destinations/victoria-falls-1.jpg",
    "/images/destinations/victoria-falls-2.jpg",
    "/images/destinations/victoria-falls-3.jpg",
    "/images/destinations/victoria-falls-4.jpg",
  ],
  "cape-town": [
    "/images/destinations/cape-town-1.jpg",
    "/images/destinations/cape-town-2.jpg",
    "/images/destinations/cape-town-3.jpg",
    "/images/destinations/cape-town-4.jpg",
  ],
  "cape-town-winelands": [
    "/images/destinations/cape-town-1.jpg",
    "/images/destinations/cape-town-2.jpg",
    "/images/destinations/cape-town-3.jpg",
    "/images/destinations/cape-town-4.jpg",
  ],
  "marrakech": [
    "/images/destinations/marrakech-1.jpg",
    "/images/destinations/marrakech-2.jpg",
    "/images/destinations/marrakech-3.jpg",
    "/images/destinations/marrakech-4.jpg",
  ],
  "moroccan-culture-cuisine": [
    "/images/destinations/marrakech-1.jpg",
    "/images/destinations/marrakech-2.jpg",
    "/images/destinations/marrakech-3.jpg",
    "/images/destinations/marrakech-4.jpg",
  ],
  "santorini": [
    "/images/destinations/santorini-1.jpg",
    "/images/destinations/santorini-2.jpg",
    "/images/destinations/santorini-3.jpg",
    "/images/destinations/santorini-4.jpg",
  ],
  "santorini-island-escape": [
    "/images/destinations/santorini-1.jpg",
    "/images/destinations/santorini-2.jpg",
    "/images/destinations/santorini-3.jpg",
    "/images/destinations/santorini-4.jpg",
  ],
  "east-african-safari-circuit": [
    "/images/destinations/masai-mara-1.jpg",
    "/images/destinations/serengeti-1.jpg",
    "/images/destinations/masai-mara-3.jpg",
    "/images/destinations/serengeti-3.jpg",
  ],
};

/** Returns gallery for a package/destination by slug, with fallback */
export function getGallery(slug: string, fallbackImage?: string): string[] {
  const gallery = destinationGalleries[slug];
  if (gallery && gallery.length > 0) return gallery;
  if (fallbackImage) return [fallbackImage];
  return ["/images/destinations/masai-mara-1.jpg"];
}
