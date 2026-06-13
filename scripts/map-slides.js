const fs = require('fs');
const path = require('path');

const inputDir = path.join(process.cwd(), 'apps/web/public/images/destinations');
const allFiles = fs.readdirSync(inputDir);
const images = allFiles.filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
images.sort(); // alphabetical - same as sharp script

const selected = images.slice(0, 40);
selected.forEach((file, i) => {
  const paddedIndex = String(i + 1).padStart(2, '0');
  console.log(`Slide ${paddedIndex} <- ${file}`);
});
