const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'apps/web/public/logo.png');
const outputPath = path.join(__dirname, 'apps/web/public/logo-optimized.png');

async function optimizeLogo() {
  try {
    console.log('Optimizing logo...');
    
    // Check if sharp is available, if not we will let the user know
    // This script assumes sharp is installed in the workspace
    
    await sharp(inputPath)
      .trim() // Removes the white background if it's a solid border
      .png({ quality: 80, compressionLevel: 9 }) // Compress PNG
      .toFile(outputPath);
      
    console.log('Successfully optimized logo to logo-optimized.png');
  } catch (error) {
    console.error('Error optimizing logo:', error);
  }
}

optimizeLogo();
