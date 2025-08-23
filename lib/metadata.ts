import { type Metadata, type Viewport } from 'next';
import { type Locale } from './i18n';

interface MetadataParams {
  locale: Locale;
  pathname?: string;
}

export const generateMetadata = async ({
  locale,
  pathname = '',
}: MetadataParams): Promise<Metadata> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://itzhak-leshinsky.com';
  const currentUrl = `${baseUrl}/${locale}${pathname}`;

  // Dynamic titles and descriptions based on locale
  const title =
    locale === 'he'
      ? 'איציק לשינסקי - מפתח פול סטאק | מערכות GIS ואתרים | מוביל טכנולוגי'
      : 'Itzhak Leshinsky - Full-Stack Developer | GIS & Web Systems | Tech Leader';

  const description =
    locale === 'he'
      ? 'מפתח פול סטאק מנוסה עם התמחות במערכות GIS, הובלת צוותים וכלי אוטומציה מבוססי בינה מלאכותית. מומחה ב-React, Node.js, Next.js ו-Python.'
      : 'Experienced Full-Stack Developer specializing in GIS systems, team leadership, and AI-powered automation tools. Expert in React, Node.js, Next.js, and Python.';

  const keywords =
    locale === 'he'
      ? 'מפתח פול סטאק, GIS, React, Node.js, Next.js, Python, בינה מלאכותית, אוטומציה, הובלת צוותים, איציק לשינסקי'
      : 'Full-Stack Developer, GIS, React, Node.js, Next.js, Python, AI, Automation, Team Leadership, Itzhak Leshinsky';

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Itzhak Leshinsky', url: 'https://github.com/itzhakl' }],
    creator: 'Itzhak Leshinsky',
    publisher: 'Itzhak Leshinsky',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en`,
        he: `${baseUrl}/he`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      alternateLocale: locale === 'he' ? 'en_US' : 'he_IL',
      url: currentUrl,
      title,
      description,
      siteName:
        locale === 'he'
          ? 'איציק לשינסקי - תיק עבודות'
          : 'Itzhak Leshinsky - Portfolio',
      images: [
        {
          url: `${baseUrl}/assets/og-image.jpg`,
          width: 1200,
          height: 630,
          alt:
            locale === 'he'
              ? 'איציק לשינסקי - מפתח פול סטאק ומוביל טכנולוגי'
              : 'Itzhak Leshinsky - Full-Stack Developer and Tech Leader',
        },
        {
          url: `${baseUrl}/assets/og-image-square.jpg`,
          width: 1200,
          height: 1200,
          alt:
            locale === 'he'
              ? 'איציק לשינסקי - תיק עבודות'
              : 'Itzhak Leshinsky - Portfolio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title:
        locale === 'he'
          ? 'איציק לשינסקי - מפתח פול סטאק | GIS ומוביל טכנולוגי'
          : 'Itzhak Leshinsky - Full-Stack Developer | GIS & Tech Leader',
      description,
      images: [`${baseUrl}/assets/og-image.jpg`],
      creator: '@itzhakl',
      site: '@itzhakl',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
    category: 'technology',
    classification: 'Portfolio Website',
    referrer: 'origin-when-cross-origin',

    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: locale === 'he' ? 'איציק לשינסקי' : 'Itzhak Leshinsky',
    },
    applicationName:
      locale === 'he'
        ? 'איציק לשינסקי - תיק עבודות'
        : 'Itzhak Leshinsky - Portfolio',
    appLinks: {
      web: {
        url: currentUrl,
        should_fallback: true,
      },
    },
    archives: [`${baseUrl}/sitemap.xml`],
    bookmarks: [currentUrl],
    other: {
      'msapplication-TileColor': '#0b0f14',
      'msapplication-config': '/browserconfig.xml',
      'apple-mobile-web-app-title':
        locale === 'he' ? 'איציק לשינסקי' : 'Itzhak Leshinsky',
    },
  };
};
export const generateDynamicViewport = (_locale: Locale): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
    colorScheme: 'dark',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#0b0f14' },
    ],
  };
};

export const generateStructuredData = (locale: Locale) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://itzhak-leshinsky.com';

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Itzhak Leshinsky',
    alternateName: locale === 'he' ? 'איציק לשינסקי' : 'Itzhak Leshinsky',
    url: baseUrl,
    image: `${baseUrl}/assets/profile-photo.jpg`,
    sameAs: [
      'https://github.com/itzhakl',
      'https://linkedin.com/in/itzhak-leshinsky',
      'mailto:itzhak.lesh@gmail.com',
    ],
    jobTitle:
      locale === 'he'
        ? 'מפתח פול סטאק ומוביל טכנולוגי'
        : 'Full-Stack Developer and Tech Leader',
    description:
      locale === 'he'
        ? 'מפתח פול סטאק מנוסה עם התמחות במערכות GIS, הובלת צוותים וכלי אוטומציה מבוססי בינה מלאכותית'
        : 'Experienced Full-Stack Developer specializing in GIS systems, team leadership, and AI-powered automation tools',
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'GIS',
      'OpenLayers',
      'Cesium',
      'PostgreSQL',
      'MongoDB',
      'Docker',
      'CI/CD',
      'Team Leadership',
      'Artificial Intelligence',
      'Automation',
    ],
    alumniOf: [
      {
        '@type': 'Organization',
        name:
          locale === 'he' ? 'האוניברסיטה הפתוחה' : 'Open University of Israel',
        description:
          locale === 'he'
            ? 'תואר ראשון במדעי המחשב'
            : 'Bachelor of Science in Computer Science',
      },
      {
        '@type': 'Organization',
        name: locale === 'he' ? 'מכללת INT' : 'INT College',
        description:
          locale === 'he' ? 'קורס בדיקות תוכנה' : 'Software Testing Course',
      },
    ],
    worksFor: [
      {
        '@type': 'Organization',
        name: locale === 'he' ? 'עצמאי' : 'Freelance',
        description:
          locale === 'he'
            ? 'מפתח פול סטאק עצמאי המתמחה בבוטים מבוססי בינה מלאכותית ומערכות ווב'
            : 'Freelance Full-Stack Developer specializing in AI-powered bots and web systems',
      },
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: locale === 'he' ? 'מפתח פול סטאק' : 'Full-Stack Developer',
      occupationLocation: {
        '@type': 'Country',
        name: locale === 'he' ? 'ישראל' : 'Israel',
      },
      skills: [
        'Full-Stack Development',
        'GIS Systems',
        'Team Leadership',
        'React Development',
        'Node.js Development',
        'Python Programming',
        'AI Integration',
        'Automation Tools',
        'Microservices Architecture',
        'DevOps',
      ],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressRegion: locale === 'he' ? 'ישראל' : 'Israel',
    },
    nationality: {
      '@type': 'Country',
      name: locale === 'he' ? 'ישראל' : 'Israel',
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name:
      locale === 'he'
        ? 'איציק לשינסקי - תיק עבודות'
        : 'Itzhak Leshinsky - Portfolio',
    alternateName:
      locale === 'he'
        ? 'תיק עבודות איציק לשינסקי'
        : 'Itzhak Leshinsky Portfolio',
    url: baseUrl,
    description:
      locale === 'he'
        ? 'תיק עבודות מקצועי של איציק לשינסקי, מפתח פול סטאק ומוביל טכנולוגי עם התמחות במערכות GIS'
        : 'Professional portfolio of Itzhak Leshinsky, Full-Stack Developer and Tech Leader specializing in GIS systems',
    inLanguage: [
      {
        '@type': 'Language',
        name: 'English',
        alternateName: 'en',
      },
      {
        '@type': 'Language',
        name: 'Hebrew',
        alternateName: 'he',
      },
    ],
    author: {
      '@type': 'Person',
      name: 'Itzhak Leshinsky',
    },
    creator: {
      '@type': 'Person',
      name: 'Itzhak Leshinsky',
    },
    publisher: {
      '@type': 'Person',
      name: 'Itzhak Leshinsky',
    },
    copyrightHolder: {
      '@type': 'Person',
      name: 'Itzhak Leshinsky',
    },
    copyrightYear: new Date().getFullYear(),
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    datePublished: '2024-01-01',
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    keywords:
      locale === 'he'
        ? 'מפתח פול סטאק, GIS, React, Node.js, Next.js, Python, בינה מלאכותית, אוטומציה, הובלת צוותים'
        : 'Full-Stack Developer, GIS, React, Node.js, Next.js, Python, AI, Automation, Team Leadership',
    mainEntity: person,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'he' ? 'בית' : 'Home',
        item: `${baseUrl}/${locale}`,
      },
    ],
  };

  return {
    person,
    website,
    breadcrumbList,
  };
};
