/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure server components don't try to use client-side only features
  experimental: {
    // Only needed for Next.js 13+
    appDir: true,
  },
}

module.exports = nextConfig
