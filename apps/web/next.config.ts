import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
