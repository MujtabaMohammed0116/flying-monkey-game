/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors in backup folders during build
    ignoreBuildErrors: false,
  },
  // Exclude backup folders from compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/backup-*/**', '**/node_modules/**'],
    };
    return config;
  },
}

module.exports = nextConfig
