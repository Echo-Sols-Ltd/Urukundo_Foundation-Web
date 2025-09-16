import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ensure the app runs on port 3000
  env: {
    PORT: '3000',
  },
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
