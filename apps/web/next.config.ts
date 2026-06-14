import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";

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
    "@payloadcms/db-sqlite",
    "@payloadcms/richtext-lexical",
    "@payloadcms/storage-s3",
    "payload",
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
    ],
  },
  output: "standalone",
};

export default withPayload(nextConfig);
