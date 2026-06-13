const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(process.cwd(), 'apps/web/public/images/destinations');
const outputDir = path.join(process.cwd(), 'apps/web/public/images/hero-slides');

// Curated list - no duplicates, no bad images, diverse travel scenes
const CURATED_IMAGES = [
  'aberdare.jpg',
  'amboseli-1.jpg',
  'amboseli-2.jpg',
  'amboseli-4.jpg',
  'cape-town-1.jpg',
  'cape-town-2.jpg',
  'cape-town-4.jpg',
  'diani-1.jpg',
  'diani-2.jpg',
  'diani-3.jpg',
  'diani-4.jpg',
  'hells-gate.jpg',
  'kruger-1.jpg',
  'kruger-2.jpg',
  'kruger-3.jpg',
  'kruger-4.jpg',
  'lamu-1.jpg',
  'lamu-2.jpg',
  'lamu-3.jpg',
  'lamu-4.jpg',
  'malindi-1.jpg',
  'malindi-2.jpg',
  'malindi-3.jpg',
  'malindi-4.jpg',
  'marrakech-1.jpg',
  'marrakech-2.jpg',
  'marrakech-3.jpg',
  'marrakech-4.jpg',
  'masai-mara-1.jpg',
  'masai-mara-2.jpg',
  'masai-mara-3.jpg',
  'masai-mara-4.jpg',
  'meru.jpg',
  'mombasa.jpg',
  'mount-kenya.jpg',
  'nairobi-park.jpg',
  'naivasha.jpg',
  'nakuru.jpg',
];

// Wipe old hero slides
if (fs.existsSync(outputDir)) {
  fs.readdirSync(outputDir).forEach(f => fs.unlinkSync(path.join(outputDir, f)));
} else {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [
  { suffix: 'desktop', width: 1920, height: 1080 },
  { suffix: 'tablet', width: 1280, height: 720 },
  { suffix: 'mobile', width: 768, height: 432 }
];

async function optimizeHeroImages() {
  console.log(`Processing ${CURATED_IMAGES.length} curated images...`);
  for (let i = 0; i < CURATED_IMAGES.length; i++) {
    const file = CURATED_IMAGES[i];
    const inputPath = path.join(inputDir, file);

    if (!fs.existsSync(inputPath)) {
      console.warn(`MISSING: ${file} — skipping`);
      continue;
    }

    const paddedIndex = String(i + 1).padStart(2, '0');
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `hero-slide-${paddedIndex}-${size.suffix}.webp`);
      try {
        await sharp(inputPath)
          .resize(size.width, size.height, { fit: 'cover' })
          .webp({ quality: 82 })
          .toFile(outputPath);
      } catch (err) {
        console.error(`Error on ${file} @ ${size.suffix}:`, err.message);
      }
    }
    console.log(`[${paddedIndex}/${CURATED_IMAGES.length}] ${file}`);
  }
  console.log(`\nDone! Generated ${CURATED_IMAGES.length * 3} hero slide files.`);
}

optimizeHeroImages().catch(console.error);
