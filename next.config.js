/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;
