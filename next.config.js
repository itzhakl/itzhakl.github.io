const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = withNextIntl(nextConfig);
