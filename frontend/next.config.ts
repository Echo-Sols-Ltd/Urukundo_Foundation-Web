import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
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
