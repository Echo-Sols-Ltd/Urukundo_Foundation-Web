import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Reduce memory usage during build
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          'https://urukundo-fromntend-urukundo-back-1.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
