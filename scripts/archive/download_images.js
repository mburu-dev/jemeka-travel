/**
 * Image downloader for Jemeka Tours destination cards
 * Downloads 4 HD images per destination from Unsplash
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'apps/web/public/images/destinations');

// Unsplash direct image URLs (public CDN, no API key needed for direct links)
// Each destination has 4 carefully curated images
const images = [
  // ===== MASAI MARA =====
  { file: 'masai-mara-1.jpg', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85&fit=crop' },
  { file: 'masai-mara-2.jpg', url: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1920&q=85&fit=crop' },
  { file: 'masai-mara-3.jpg', url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1920&q=85&fit=crop' },
  { file: 'masai-mara-4.jpg', url: 'https://images.unsplash.com/photo-1573227895226-533ec0eca7a1?w=1920&q=85&fit=crop' },

  // ===== AMBOSELI =====
  { file: 'amboseli-1.jpg', url: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1920&q=85&fit=crop' },
  { file: 'amboseli-2.jpg', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=85&fit=crop' },
  { file: 'amboseli-3.jpg', url: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=1920&q=85&fit=crop' },
  { file: 'amboseli-4.jpg', url: 'https://images.unsplash.com/photo-1551981945-a9fc965b9bfc?w=1920&q=85&fit=crop' },

  // ===== DIANI BEACH =====
  { file: 'diani-1.jpg', url: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1920&q=85&fit=crop' },
  { file: 'diani-2.jpg', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=85&fit=crop' },
  { file: 'diani-3.jpg', url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=85&fit=crop' },
  { file: 'diani-4.jpg', url: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1920&q=85&fit=crop' },

  // ===== WATAMU =====
  { file: 'watamu-1.jpg', url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1920&q=85&fit=crop' },
  { file: 'watamu-2.jpg', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85&fit=crop' },
  { file: 'watamu-3.jpg', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=85&fit=crop' },
  { file: 'watamu-4.jpg', url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&q=85&fit=crop' },

  // ===== MALINDI =====
  { file: 'malindi-1.jpg', url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1920&q=85&fit=crop' },
  { file: 'malindi-2.jpg', url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=85&fit=crop' },
  { file: 'malindi-3.jpg', url: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1920&q=85&fit=crop' },
  { file: 'malindi-4.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85&fit=crop' },

  // ===== LAMU ISLAND =====
  { file: 'lamu-1.jpg', url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1920&q=85&fit=crop' },
  { file: 'lamu-2.jpg', url: 'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=1920&q=85&fit=crop' },
  { file: 'lamu-3.jpg', url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85&fit=crop' },
  { file: 'lamu-4.jpg', url: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1920&q=85&fit=crop' },

  // ===== SERENGETI (Coming Soon) =====
  { file: 'serengeti-1.jpg', url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=85&fit=crop' },
  { file: 'serengeti-2.jpg', url: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=1920&q=85&fit=crop' },
  { file: 'serengeti-3.jpg', url: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=1920&q=85&fit=crop' },
  { file: 'serengeti-4.jpg', url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1920&q=85&fit=crop' },

  // ===== ZANZIBAR (Coming Soon) =====
  { file: 'zanzibar-1.jpg', url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1920&q=85&fit=crop' },
  { file: 'zanzibar-2.jpg', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85&fit=crop' },
  { file: 'zanzibar-3.jpg', url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1920&q=85&fit=crop' },
  { file: 'zanzibar-4.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85&fit=crop' },

  // ===== KRUGER (Coming Soon) =====
  { file: 'kruger-1.jpg', url: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1920&q=85&fit=crop' },
  { file: 'kruger-2.jpg', url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1920&q=85&fit=crop' },
  { file: 'kruger-3.jpg', url: 'https://images.unsplash.com/photo-1466893450947-2c23ab4ba2f7?w=1920&q=85&fit=crop' },
  { file: 'kruger-4.jpg', url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=85&fit=crop' },

  // ===== VICTORIA FALLS (Coming Soon) =====
  { file: 'victoria-falls-1.jpg', url: 'https://images.unsplash.com/photo-1504173010664-32509107de56?w=1920&q=85&fit=crop' },
  { file: 'victoria-falls-2.jpg', url: 'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=1920&q=85&fit=crop' },
  { file: 'victoria-falls-3.jpg', url: 'https://images.unsplash.com/photo-1529590003096-17a40e9c1e4d?w=1920&q=85&fit=crop' },
  { file: 'victoria-falls-4.jpg', url: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1920&q=85&fit=crop' },

  // ===== CAPE TOWN (Coming Soon) =====
  { file: 'cape-town-1.jpg', url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=85&fit=crop' },
  { file: 'cape-town-2.jpg', url: 'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=1920&q=85&fit=crop' },
  { file: 'cape-town-3.jpg', url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1920&q=85&fit=crop' },
  { file: 'cape-town-4.jpg', url: 'https://images.unsplash.com/photo-1574038014615-1a95ba71e2cd?w=1920&q=85&fit=crop' },

  // ===== MARRAKECH (Coming Soon) =====
  { file: 'marrakech-1.jpg', url: 'https://images.unsplash.com/photo-1597212618440-806262de4f2b?w=1920&q=85&fit=crop' },
  { file: 'marrakech-2.jpg', url: 'https://images.unsplash.com/photo-1530531009-98c7f0c89e8e?w=1920&q=85&fit=crop' },
  { file: 'marrakech-3.jpg', url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1920&q=85&fit=crop' },
  { file: 'marrakech-4.jpg', url: 'https://images.unsplash.com/photo-1553002401-049c48b8c8c3?w=1920&q=85&fit=crop' },

  // ===== SANTORINI (Coming Soon) =====
  { file: 'santorini-1.jpg', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=85&fit=crop' },
  { file: 'santorini-2.jpg', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=85&fit=crop' },
  { file: 'santorini-3.jpg', url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&q=85&fit=crop' },
  { file: 'santorini-4.jpg', url: 'https://images.unsplash.com/photo-1510906594845-bc082582c8cc?w=1920&q=85&fit=crop' },
];

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ Already exists: ${path.basename(filePath)}`);
      return resolve();
    }

    const file = fs.createWriteStream(filePath);
    const protocol = url.startsWith('https') ? https : http;

    const makeRequest = (reqUrl) => {
      protocol.get(reqUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = res.headers.location;
          file.destroy();
          fs.unlink(filePath, () => {});
          const newFile = fs.createWriteStream(filePath);
          const newProtocol = redirectUrl.startsWith('https') ? https : http;
          newProtocol.get(redirectUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
            res2.pipe(newFile);
            newFile.on('finish', () => {
              newFile.close();
              const stat = fs.statSync(filePath);
              if (stat.size < 50000) {
                fs.unlink(filePath, () => {});
                reject(new Error(`File too small (${stat.size} bytes): ${path.basename(filePath)}`));
              } else {
                console.log(`  ✓ Downloaded: ${path.basename(filePath)} (${(stat.size / 1024).toFixed(0)} KB)`);
                resolve();
              }
            });
          }).on('error', reject);
        } else if (res.statusCode === 200) {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            const stat = fs.statSync(filePath);
            if (stat.size < 50000) {
              fs.unlink(filePath, () => {});
              reject(new Error(`File too small (${stat.size} bytes): ${path.basename(filePath)}`));
            } else {
              console.log(`  ✓ Downloaded: ${path.basename(filePath)} (${(stat.size / 1024).toFixed(0)} KB)`);
              resolve();
            }
          });
        } else {
          file.destroy();
          fs.unlink(filePath, () => {});
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
      }).on('error', (err) => {
        file.destroy();
        fs.unlink(filePath, () => {});
        reject(err);
      });
    };

    makeRequest(url);
  });
}

async function main() {
  console.log(`\nDownloading ${images.length} destination images...\n`);
  const results = { success: 0, failed: [] };

  for (const img of images) {
    const filePath = path.join(destDir, img.file);
    try {
      await download(img.url, filePath);
      results.success++;
    } catch (err) {
      console.error(`  ✗ Failed: ${img.file} — ${err.message}`);
      results.failed.push(img.file);
    }
    // Small delay to be respectful to server
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n✅ Done! ${results.success}/${images.length} images downloaded.`);
  if (results.failed.length > 0) {
    console.log('❌ Failed:', results.failed.join(', '));
  }
}

main();
