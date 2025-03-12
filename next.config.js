/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  images: {
    domains: ['placehold.co', 'avatars.githubusercontent.com', 'img.youtube.com', 'ui-avatars.com'],
  },
  webpack: (config) => {
    // Handle integration with external repositories
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    // Add fallbacks for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      child_process: false,
      net: false,
      tls: false,
      'fs-extra': false,
    };
    
    return config;
  },
  // Prevent issues with the dev server's file watcher
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig 