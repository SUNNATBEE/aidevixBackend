/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendBaseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_ORIGIN ||
      'https://aidevix-backend-production.up.railway.app';

    return [
      {
        source: '/api/proxy/:path*',
        destination: `${backendBaseUrl.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
