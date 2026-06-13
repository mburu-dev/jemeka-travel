const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'apps/web/public/ABOUT US IMAGES');
const outputDir = path.join(__dirname, 'apps/web/public/images/team');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const inputPath = path.join(inputDir, file);
      // Clean up the name to be URL friendly
      const safeName = file.replace(/\.(png|jpg|jpeg)$/i, '')
                           .replace(/\s+/g, '-')
                           .toLowerCase() + '.webp';
      const outputPath = path.join(outputDir, safeName);
      
      console.log(`Optimizing ${file} -> ${safeName}...`);
      await sharp(inputPath)
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Saved ${outputPath}`);
    }
  }
}

optimizeImages().catch(console.error);
