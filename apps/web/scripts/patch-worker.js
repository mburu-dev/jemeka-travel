/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Standalone post-build patcher for the __name polyfill.
 *
 * esbuild's keepNames emits __name() calls but may omit the helper definition
 * when bundling across entry points. This causes ReferenceError on Cloudflare
 * Workers. Run this after `@opennextjs/cloudflare build` to patch all affected
 * bundles under .open-next/.
 *
 * Usage:  node scripts/patch-worker.js
 */
const fs = require('fs');
const path = require('path');

const openNextDir = path.join(__dirname, '../.open-next');

const polyfill =
  '// esbuild __name polyfill\n' +
  'var __name=(t,v)=>(Object.defineProperty(t,"name",{value:v,configurable:true}),t);\n';

function collectBundles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return results;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectBundles(fullPath));
    } else if (/\.(m?js)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

let patchedCount = 0;
let skippedCount = 0;

for (const filePath of collectBundles(openNextDir)) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    continue;
  }

  const hasCall = content.includes('__name(');
  const hasDef =
    content.includes('var __name=') ||
    content.includes('var __name =') ||
    content.includes('function __name(') ||
    content.includes('const __name=') ||
    content.includes('let __name=');

  if (hasCall && !hasDef) {
    fs.writeFileSync(filePath, polyfill + content);
    console.log(`  Patched: ${path.relative(openNextDir, filePath)}`);
    patchedCount++;
  } else if (hasCall && hasDef) {
    skippedCount++;
  }
}

if (patchedCount === 0 && skippedCount === 0) {
  console.log('No __name() calls found in any bundle — nothing to patch.');
} else {
  console.log(`Done. Patched: ${patchedCount}, already-defined: ${skippedCount}.`);
}
