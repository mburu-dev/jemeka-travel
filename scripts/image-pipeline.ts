import fs from 'fs';
import path from 'path';
// Note: You will need to install 'sharp' and 'node-fetch' in the workspace to run this script.
// npm install sharp node-fetch
import sharp from 'sharp';
import fetch from 'node-fetch';

/**
 * AI Image Pipeline Strategy:
 * This script automates fetching high-quality images from Unsplash,
 * optimizes them into WebP format, and generates SEO alt text.
 */

interface DestinationSchema {
  destination: string;
  slug: string;
  keywords: string;
}

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_KEY';
const OUTPUT_DIR = path.join(process.cwd(), 'apps', 'web', 'public', 'images', 'destinations');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchDestinationImages(schema: DestinationSchema) {
  console.log(`\n===========================================`);
  console.log(`Processing: ${schema.destination}`);
  console.log(`===========================================`);

  try {
    // 1. Fetch from Unsplash API
    console.log(`[1/5] Fetching HD photos for keywords: "${schema.keywords}"...`);
    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(schema.keywords)}&orientation=landscape&per_page=4&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}. Did you set the UNSPLASH_ACCESS_KEY in your .env?`);
    }
    
    const data: any = await response.json();
    if (!data.results || data.results.length === 0) {
      console.log(`[!] No images found for ${schema.destination}. Skipping.`);
      return;
    }

    const images = data.results;
    const generatedMeta: any = { destination: schema.destination, slug: schema.slug, images: [] };

    // 2. Process each image
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const imageUrl = img.urls.raw + '&q=80&w=1920&fit=crop'; // Request 1920px width
      
      console.log(`[2/5] Downloading image ${i + 1}/${images.length}...`);
      const imgRes = await fetch(imageUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 3. Optimize to WebP using Sharp
      console.log(`[3/5] Optimizing to WebP (1920x1080)...`);
      const filename = i === 0 ? `${schema.slug}.webp` : `${schema.slug}-${i}.webp`;
      const outputPath = path.join(OUTPUT_DIR, filename);

      await sharp(buffer)
        .resize(1920, 1080, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outputPath);

      // 4. Generate Alt Text (Mock AI text based on Unsplash description)
      console.log(`[4/5] Generating SEO alt text...`);
      const baseAlt = img.alt_description || img.description || schema.destination;
      const optimizedAlt = `${baseAlt} - Luxury Safari in ${schema.destination}, Kenya`.replace(/\n/g, ' ');

      generatedMeta.images.push({
        file: filename,
        originalUrl: img.links.html,
        photographer: img.user.name,
        alt: optimizedAlt
      });

      console.log(`[+] Saved ${filename} successfully!`);
    }

    // 5. Save metadata
    console.log(`[5/5] Saving metadata schema...`);
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${schema.slug}-meta.json`), 
      JSON.stringify(generatedMeta, null, 2)
    );
    console.log(`Done processing ${schema.destination}!\n`);

  } catch (error) {
    console.error(`Error processing ${schema.destination}:`, error);
  }
}

// Example Execution
async function main() {
  const destinationsToProcess: DestinationSchema[] = [
    { destination: "Maasai Mara", slug: "masai-mara", keywords: "maasai mara migration wildlife safari" },
    { destination: "Diani Beach", slug: "diani-beach", keywords: "diani beach kenya white sand" },
    { destination: "Amboseli", slug: "amboseli-national-park", keywords: "amboseli elephants kilimanjaro" },
  ];

  console.log("Starting Jemeka Tours AI Image Pipeline...");
  for (const dest of destinationsToProcess) {
    await fetchDestinationImages(dest);
  }
}

main().catch(console.error);
