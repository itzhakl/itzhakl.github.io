import { type MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Itzhak Leshinsky - Full-Stack Developer Portfolio',
    short_name: 'Itzhak Leshinsky',
    description:
      'Professional portfolio of Itzhak Leshinsky, Full-Stack Developer and Tech Leader specializing in GIS systems, team leadership, and AI-powered automation tools.',
    start_url: '/',
    display: 'standalone',
    background_color: 'var(--color-bg)',
    theme_color: 'var(--color-primary)',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'portfolio'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
        purpose: 'any',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: 'Projects',
        short_name: 'Projects',
        description: 'View featured projects',
        url: '/#projects',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Get in touch',
        url: '/#contact',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
