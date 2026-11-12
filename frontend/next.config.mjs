/** @type {import('next').NextConfig} */
const defaultApiUrl = 'https://gleaming-youthfulness-production-87570148.up.railway.app';
const configuredApiUrl = (process.env.NEXT_PUBLIC_API_URL || defaultApiUrl).trim().replace(/\/+$/, '');
const apiBaseUrl = `${configuredApiUrl.replace(/\/api$/i, '')}/api`;

const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
