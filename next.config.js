/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  images: {
    domains: ['placehold.co', 'avatars.githubusercontent.com', 'img.youtube.com', 'ui-avatars.com'],
  },
  webpack: (config) => {
    // Handle integration with external repositories
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
}

module.exports = nextConfig 