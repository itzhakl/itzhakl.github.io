import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// RTL languages
export const rtlLocales: Locale[] = ['he'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  he: 'עברית',
};

export const isRtlLocale = (locale: string): boolean => {
  return rtlLocales.includes(locale as Locale);
};

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../i18n/messages/${locale}.json`)).default,
  };
});
