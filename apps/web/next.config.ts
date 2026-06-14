import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize Cloudflare context for local `dev:worker` (wrangler preview) mode.
// This is a no-op in production Worker builds.
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // Dramatically reduces dev-mode cold compile time by tree-shaking icon/animation imports
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",
      "@radix-ui/react-separator",
    ],
  },
  // Exclude Payload CMS and its heavy transitive deps from the shared bundle.
  // Without this, withPayload() causes every route to compile ~2500 modules.
  // With this, Payload only compiles when /cms routes are visited.
  serverExternalPackages: [
    // Payload CMS (Node.js-only, runs on Oracle VPS not on Cloudflare)
    "@payloadcms/db-sqlite",
    "@payloadcms/richtext-lexical",
    "@payloadcms/storage-s3",
    "payload",
    // Database clients (Node.js-only — not supported in Workers edge runtime)
    "@libsql/client",
    "drizzle-orm",
    "better-sqlite3",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // Production CDN / OCI Object Storage media assets
        protocol: 'https',
        hostname: 'assets.jemekatoursandtravel.com',
      },
      {
        // OCI Object Storage direct endpoint
        protocol: 'https',
        hostname: '**.objectstorage.**.oci.customer-oci.com',
      },
      {
        // Cloudflare R2 public endpoint
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      }
    ],
  },
  webpack(config, { isServer }) {
    // esbuild (used by @opennextjs/cloudflare) may emit __name() calls from
    // packages compiled with keepNames=true (e.g. framer-motion, some radix
    // primitives). When those chunks are imported without the __name helper
    // defined, the Worker throws ReferenceError: __name is not defined.
    //
    // Inject the __name polyfill as a banner at the start of every webpack
    // chunk so it is always available regardless of chunk splitting.
    if (!isServer) {
      const __nameBanner = [
        '/* esbuild __name polyfill */',
        'if(typeof __name==="undefined"){',
        'var __name=function(fn,name){',
        'try{Object.defineProperty(fn,"name",{value:name,configurable:true})}catch(e){}',
        'return fn;};}',
      ].join('');

      config.output = config.output ?? {};
      const existingBanner = config.output.chunkLoadingGlobal
        ? config.output.devtoolFallbackModuleFilenameTemplate
        : undefined;
      // Prepend polyfill to the webpack chunk runtime so __name is always
      // defined before any module code runs.
      config.optimization = config.optimization ?? {};
      config.plugins = config.plugins ?? [];

      // Use webpack's BannerPlugin to prepend the polyfill to every JS chunk.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: __nameBanner,
          raw: true,
          entryOnly: false,
        })
      );
    }
    return config;
  },
};

// Disable Payload in Worker build to avoid Node.js native module errors
export default process.env.BUILD_WORKER === '1' ? nextConfig : withPayload(nextConfig);
