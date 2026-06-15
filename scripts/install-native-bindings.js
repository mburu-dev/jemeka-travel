#!/usr/bin/env node
/**
 * install-native-bindings.js
 *
 * Runs automatically as the root `postinstall` hook after every
 * `npm install` / `npm ci`. Detects the current OS + CPU and installs
 * any platform-specific native .node add-ons that npm skipped because
 * the lockfile was generated on a different platform.
 *
 * Why this is needed
 * ------------------
 * Several packages (tailwindcss/oxide, @ast-grep/napi, @rolldown/binding,
 * lightningcss, libsql) ship pre-built Rust/C++ binaries as optional npm
 * dependencies named like `<pkg>-linux-x64-gnu`. npm only installs the
 * variant matching the machine that ran `npm install` last. A lockfile
 * generated on Windows will be missing all Linux variants, causing
 * "Cannot find native binding" crashes on CI and on Linux dev machines.
 *
 * This script installs the missing variants for the CURRENT platform
 * after every install, so the problem never surfaces again regardless
 * of where the lockfile was last regenerated.
 */

'use strict';

const { execSync, spawnSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

// ─── Platform detection ───────────────────────────────────────────────────
const platform = os.platform(); // 'linux' | 'darwin' | 'win32'
const arch = os.arch();         // 'x64' | 'arm64' | 'ia32' ...

// Only act on Linux — Windows/macOS get their binaries from the lockfile
// because the lockfile was generated there.
if (platform !== 'linux') {
  // Nothing to do on the platform where the lockfile was generated.
  process.exit(0);
}

// Map arch to npm suffix
const archSuffix = arch === 'arm64' ? 'arm64-gnu' : 'x64-gnu';

// ─── Package list ─────────────────────────────────────────────────────────
// Each entry is the exact npm package name for the Linux native binary.
// Versions are resolved automatically by npm against what is already
// installed, so we don't need to hard-code them here.
const nativePackages = [
  // Tailwind CSS v4 (Rust engine)
  `@tailwindcss/oxide-linux-${archSuffix}`,
  // @opennextjs/cloudflare AST patching
  `@ast-grep/napi-linux-${archSuffix}`,
  // Vite / Vitest bundler
  `@rolldown/binding-linux-${archSuffix}`,
  // CSS pipeline used by Next.js
  `lightningcss-linux-${archSuffix}`,
  // libSQL / Turso SQLite driver (API + tests)
  `@libsql/linux-${archSuffix}`,
];

// ─── Check which ones are actually missing ────────────────────────────────
const root = path.resolve(__dirname, '..');
const missing = nativePackages.filter((pkg) => {
  const pkgDir = path.join(root, 'node_modules', pkg);
  return !fs.existsSync(pkgDir);
});

if (missing.length === 0) {
  console.log('[native-bindings] All Linux native packages already present.');
  process.exit(0);
}

console.log('[native-bindings] Installing missing Linux native packages:');
missing.forEach((p) => console.log(`  • ${p}`));

// ─── Install ──────────────────────────────────────────────────────────────
// --no-save: don't touch package.json or package-lock.json
// --ignore-scripts: avoid triggering recursive postinstall loops
// --prefer-offline: use cache if available, reduces CI time
const result = spawnSync(
  'npm',
  ['install', '--no-save', '--ignore-scripts', '--prefer-offline', ...missing],
  { cwd: root, stdio: 'inherit', shell: true }
);

if (result.status !== 0) {
  console.error('[native-bindings] Install failed — see output above.');
  // Exit 0 so a failure here doesn't break the entire `npm ci` run.
  // The actual build will fail later with a clearer error if the binary
  // is truly unavailable.
  process.exit(0);
}

console.log('[native-bindings] Done.');
