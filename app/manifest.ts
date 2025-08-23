import { type MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Itzhak Leshinsky - Full-Stack Developer Portfolio',
    short_name: 'Itzhak Leshinsky',
    description:
      'Professional portfolio of Itzhak Leshinsky, Full-Stack Developer and Tech Leader specializing in GIS systems, team leadership, and AI-powered automation tools.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0f14',
    theme_color: '#0b0f14',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'portfolio'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/assets/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Desktop view of Itzhak Leshinsky portfolio',
      },
      {
        src: '/assets/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile view of Itzhak Leshinsky portfolio',
      },
    ],
    shortcuts: [
      {
        name: 'Projects',
        short_name: 'Projects',
        description: 'View featured projects',
        url: '/#projects',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
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
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
