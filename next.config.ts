import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:4036/uploads/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:4036/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.business-standard.com',
      },
      {
        protocol: 'https',
        hostname: 'bsmedia.business-standard.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
