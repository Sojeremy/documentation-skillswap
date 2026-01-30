import type { NextConfig } from 'next';

// Internal API URL for Docker network (server-side calls)
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || 'http://backend:3000';

// Public site URL for image patterns
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8888';
const siteHostname = new URL(SITE_URL).hostname;

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      // Development: localhost avatars
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/avatars/**',
      },
      // Production: avatars from site domain
      {
        protocol: 'https',
        hostname: siteHostname,
        pathname: '/avatars/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/avatars/:path*',
        destination: `${INTERNAL_API_URL}/avatars/:path*`,
      },
    ];
  },
};

export default nextConfig;
