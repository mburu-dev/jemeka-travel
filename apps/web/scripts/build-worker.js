/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const payloadPath = path.join(__dirname, '../src/app/(payload)');
const hiddenPath = path.join(__dirname, '../.payload-backup');

// 1. Hide the (payload) directory so Next.js doesn't bundle it for the edge build
if (fs.existsSync(payloadPath)) {
  fs.renameSync(payloadPath, hiddenPath);
  console.log('Moved (payload) to .payload-backup for Worker build');
}

try {
  // 2. Enable Corepack so the Next.js build doesn't accidentally invoke Yarn
  //    (GitHub runners have Yarn 1.x pre-installed; if Next.js's getPkgManager
  //    falls through to execSync('yarn --version') it picks yarn over npm, and
  //    Yarn Classic crashes on the "packageManager": "npm@10.8.2" field.)
  execSync('corepack enable', { stdio: 'inherit' });

  // 3. Run the OpenNext Cloudflare build
  //    NEXT_IGNORE_INCORRECT_LOCKFILE prevents Next.js from calling
  //    getRegistry() to patch the lockfile (another path that triggers yarn).
  execSync(
    'npx cross-env BUILD_WORKER=1 NEXT_IGNORE_INCORRECT_LOCKFILE=1 npx @opennextjs/cloudflare build',
    { stdio: 'inherit' },
  );

  // 4. Patch all generated bundles that use __name() without defining it.
  //
  //    esbuild's keepNames emits __name() helper calls but omits the helper
  //    declaration when bundling across chunk boundaries. This causes a
  //    ReferenceError on the Cloudflare Workers runtime.
  //
  //    The primary bundle is handler.mjs inside server-functions/default.
  //    We also patch worker.js and middleware/handler.mjs for completeness.
  const openNextDir = path.join(__dirname, '../.open-next');
  const polyfill =
    '// esbuild __name polyfill\n' +
    'var __name=(t,v)=>(Object.defineProperty(t,"name",{value:v,configurable:true}),t);\n';

  /**
   * Recursively collect all .js and .mjs files under a directory.
   */
  function collectBundles(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
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
      console.log(`  Prepended __name polyfill to ${path.relative(openNextDir, filePath)}`);
      patchedCount++;
    }
  }

  if (patchedCount === 0) {
    console.log('No __name polyfill needed — all bundles look clean.');
  } else {
    console.log(`Patched ${patchedCount} bundle(s) with __name polyfill.`);
  }
} finally {
  // 5. Always restore the (payload) directory, even if the build fails
  if (fs.existsSync(hiddenPath)) {
    fs.renameSync(hiddenPath, payloadPath);
    console.log('Restored (payload) directory');
  }
}
