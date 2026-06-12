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
        hostname: 'www.google.com',
      },
      {
        // OCI Object Storage CDN — production media assets
        protocol: 'https',
        hostname: 'assets.jemekatours.com',
      },
      {
        // OCI Container Registry — future use
        protocol: 'https',
        hostname: '**.ocir.io',
      },
    ],
  },
  output: "standalone",
};

export default withPayload(nextConfig);
