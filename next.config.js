/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable if needed for specific features
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'serpay.penjire.com',
      },
    ],
  },
}

module.exports = nextConfig