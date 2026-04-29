/** Vercel env da ba'zida `.../api` qo‘shib yuboriladi — rewrite allaqachon `/api` qo‘shadi, shuning uchun 404. */
const normalizeBackendOrigin = (raw) => {
  if (!raw) return raw;
  let u = String(raw).trim().replace(/\/+$/, '');
  if (u.toLowerCase().endsWith('/api')) u = u.slice(0, -4);
  return u;
};

const backendBaseUrl = (() => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_ORIGIN;

  if (configuredUrl) {
    return normalizeBackendOrigin(configuredUrl);
  }

  return process.env.NODE_ENV === 'production'
    ? 'https://aidevix-backend-production.up.railway.app'
    : 'http://127.0.0.1:5000';
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy-Report-Only',
            value:
              "default-src 'self'; img-src 'self' https: data: blob:; media-src 'self' https: blob:; font-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; connect-src 'self' https: wss:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${backendBaseUrl}/api/:path*`,
      },
      {
        source: '/api-proxy/:path*',
        destination: `${backendBaseUrl}/api/:path*`,
      },
      // Agar Vercel env da `NEXT_PUBLIC_API_BASE_URL=/api` (noto'g'ri) bo'lib qolsa ham
      // `POST /api/auth/2fa/setup` kabi so'rovlar Next 404 emas, backendga tushadi.
      {
        source: '/api/auth/:path*',
        destination: `${backendBaseUrl}/api/auth/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'searchyour.ai' },
      { protocol: 'https', hostname: 'www.searchyour.ai' },
      { protocol: 'https', hostname: 'static.vecteezy.com' },
      { protocol: 'https', hostname: 'www.gstatic.com' },
      { protocol: 'https', hostname: 'thumbs.dreamstime.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'iframe.mediadelivery.net' },
      { protocol: 'https', hostname: 'assets.mixkit.co' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
