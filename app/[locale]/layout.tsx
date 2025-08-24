import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { isRtlLocale, locales, type Locale } from '@/lib/i18n';
import {
  generateMetadata as generateDynamicMetadata,
  generateStructuredData,
  generateDynamicViewport as generateViewportConfig,
} from '@/lib/metadata';
import { themeScript } from '@/lib/theme-script';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter, Noto_Sans_Hebrew } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  variable: '--font-hebrew',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  return generateDynamicMetadata({ locale: locale as Locale });
};

export const generateViewport = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  return generateViewportConfig(locale as Locale);
};

export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  const direction = isRtlLocale(locale) ? 'rtl' : 'ltr';
  const structuredData = generateStructuredData(locale as Locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://itzhak-leshinsky.com';

  return (
    <html lang={locale} dir={direction}>
      <head>
        {/* Theme initialization script - must run before React hydration */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* Hreflang attributes for multilingual SEO */}
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="he" href={`${baseUrl}/he`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en`} />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.svg" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.svg" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.person),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.website),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.breadcrumbList),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${notoSansHebrew.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
};

export default LocaleLayout;
