import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
