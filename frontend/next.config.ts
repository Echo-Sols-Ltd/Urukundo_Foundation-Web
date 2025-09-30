import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ensure the app runs on port 3000
  env: {
    PORT: '3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    // Use environment variable for backend URL, fallback to localhost for development
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    
    return {
      // First let Next.js match any internal routes (e.g., /api/health),
      // then proxy remaining /api/* calls to the backend.
      fallback: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${backendUrl}/uploads/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
