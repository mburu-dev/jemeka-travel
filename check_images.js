const fs = require('fs');
const seed = fs.readFileSync('packages/db/src/seed.ts', 'utf8');
const destImages = seed.match(/image:\s*['"](\/images\/destinations\/[^'"]+)['"]/g) || [];
const missing = [];
destImages.forEach(match => {
  const file = match.match(/['"](.*?)['"]/)[1];
  const fullPath = 'apps/web/public' + file;
  if (!fs.existsSync(fullPath)) {
    missing.push(file);
  }
});
console.log('Missing files:', missing);
