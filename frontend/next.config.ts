import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return {
      // First let Next.js match any internal routes (e.g., /api/health),
      // then proxy remaining /api/* calls to the backend.
      afterFiles: [
        {
          source: '/api/:path*',
          destination:
            'https://urukundo-fromntend-urukundo-back-1.onrender.com/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
