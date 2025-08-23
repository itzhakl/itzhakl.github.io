import { locales } from '@/lib/i18n';
import { type MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://itzhak-leshinsky.com';
  const currentDate = new Date().toISOString();

  // Generate sitemap entries for each locale
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add root redirect
  sitemapEntries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 1,
  });

  // Add locale-specific pages
  locales.forEach((locale) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  });

  // Add section-specific URLs (for deep linking to sections)
  const sections = [
    'about',
    'timeline',
    'stack',
    'projects',
    'experience',
    'personal',
    'contact',
  ];

  locales.forEach((locale) => {
    sections.forEach((section) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}#${section}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  return sitemapEntries;
}
