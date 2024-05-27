// import the plugin
const createNextIntlPlugin = require('next-intl/plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  webpack: config => {
    config.module.rules.push({
      test: /.node$/,
      use: "node-loader",
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'npkizkcronebzvryltyp.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'frdlfotfupnkjfzudpvq.supabase.co',
        port: '',
        pathname: '/**',
      },  
      
    ],
  },
  staticPageGenerationTimeout: 200,
};

// Initialize the NextIntl plugin
const withNextIntl = createNextIntlPlugin();

// Compose the plugins
module.exports = withNextIntl(nextConfig);