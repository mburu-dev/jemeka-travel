/**
 * Patches failed destination images with alternative Unsplash URLs
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'apps/web/public/images/destinations');

// Alternative URLs for images that failed the first round
const patchImages = [
  // masai-mara-4 (wildebeest sunset)
  { file: 'masai-mara-4.jpg', url: 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=1920&q=85&fit=crop' },
  // amboseli-4 (elephant silhouette)
  { file: 'amboseli-4.jpg', url: 'https://images.unsplash.com/photo-1520628201618-6b5c8169e4a0?w=1920&q=85&fit=crop' },
  // marrakech-1 (Jemaa el-Fnaa square)
  { file: 'marrakech-1.jpg', url: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=1920&q=85&fit=crop' },
  // marrakech-2 (colourful souk)
  { file: 'marrakech-2.jpg', url: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920&q=85&fit=crop' },
  // marrakech-4 (Atlas Mountains)
  { file: 'marrakech-4.jpg', url: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=1920&q=85&fit=crop' },
  // victoria-falls-3 (rainbow)
  { file: 'victoria-falls-3.jpg', url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1920&q=85&fit=crop' },
  // cape-town-4 (Boulders Beach penguins)
  { file: 'cape-town-4.jpg', url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=85&fit=crop' },
  // zanzibar-3 (Stone Town streets)
  { file: 'zanzibar-3.jpg', url: 'https://images.unsplash.com/photo-1548670904-8ed8467a0a23?w=1920&q=85&fit=crop' },
  // lamu-1 (Lamu Old Town)
  { file: 'lamu-1.jpg', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&q=85&fit=crop' },
];

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.size > 50000) {
        console.log(`  ✓ Already good: ${path.basename(filePath)}`);
        return resolve();
      }
      fs.unlinkSync(filePath); // remove bad file
    }

    const file = fs.createWriteStream(filePath);
    const protocol = url.startsWith('https') ? https : http;

    const makeRequest = (reqUrl, p) => {
      p.get(reqUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.destroy();
          const newFile = fs.createWriteStream(filePath);
          const loc = res.headers.location;
          const np = loc.startsWith('https') ? https : http;
          np.get(loc, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r2) => {
            r2.pipe(newFile);
            newFile.on('finish', () => {
              newFile.close();
              const s = fs.statSync(filePath);
              if (s.size < 50000) { reject(new Error(`Too small: ${path.basename(filePath)}`)); }
              else { console.log(`  ✓ Patched: ${path.basename(filePath)} (${(s.size/1024).toFixed(0)} KB)`); resolve(); }
            });
          }).on('error', reject);
        } else if (res.statusCode === 200) {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            const s = fs.statSync(filePath);
            if (s.size < 50000) { reject(new Error(`Too small: ${path.basename(filePath)}`)); }
            else { console.log(`  ✓ Patched: ${path.basename(filePath)} (${(s.size/1024).toFixed(0)} KB)`); resolve(); }
          });
        } else {
          file.destroy();
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`));
        }
      }).on('error', (e) => { file.destroy(); reject(e); });
    };

    makeRequest(url, protocol);
  });
}

async function main() {
  console.log('\nPatching failed images...\n');
  const failed = [];
  for (const img of patchImages) {
    try {
      await download(img.url, path.join(destDir, img.file));
    } catch (e) {
      console.error(`  ✗ ${img.file}: ${e.message}`);
      failed.push(img.file);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  // Copy fallbacks for anything still missing
  const allExpected = [
    'masai-mara-1','masai-mara-2','masai-mara-3','masai-mara-4',
    'amboseli-1','amboseli-2','amboseli-3','amboseli-4',
    'diani-1','diani-2','diani-3','diani-4',
    'watamu-1','watamu-2','watamu-3','watamu-4',
    'malindi-1','malindi-2','malindi-3','malindi-4',
    'lamu-1','lamu-2','lamu-3','lamu-4',
    'serengeti-1','serengeti-2','serengeti-3','serengeti-4',
    'zanzibar-1','zanzibar-2','zanzibar-3','zanzibar-4',
    'kruger-1','kruger-2','kruger-3','kruger-4',
    'victoria-falls-1','victoria-falls-2','victoria-falls-3','victoria-falls-4',
    'cape-town-1','cape-town-2','cape-town-3','cape-town-4',
    'marrakech-1','marrakech-2','marrakech-3','marrakech-4',
    'santorini-1','santorini-2','santorini-3','santorini-4',
  ];

  console.log('\n📋 Checking all expected images...');
  let missing = 0;
  for (const name of allExpected) {
    const fp = path.join(destDir, name + '.jpg');
    if (!fs.existsSync(fp) || fs.statSync(fp).size < 50000) {
      console.log(`  ⚠ Missing or corrupt: ${name}.jpg`);
      missing++;
    }
  }

  if (missing === 0) {
    console.log('\n✅ All images are present and valid!');
  } else {
    console.log(`\n⚠ ${missing} images still missing. Check logs above.`);
  }
}

main();
