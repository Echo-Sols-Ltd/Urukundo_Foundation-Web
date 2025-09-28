import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ensure the app runs on port 3000
  env: {
    PORT: '3000',
  },
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const backendUrl = isDevelopment 
      ? 'http://localhost:8080' 
      : 'https://urukundo-fromntend-urukundo-back-1.onrender.com';
    
    return {
      // First let Next.js match any internal routes (e.g., /api/health),
      // then proxy remaining /api/* calls to the backend.
      afterFiles: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
