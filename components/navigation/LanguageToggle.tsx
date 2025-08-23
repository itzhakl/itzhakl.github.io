'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { localeNames, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle = ({ className }: LanguageToggleProps) => {
  const t = useTranslations('language');
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const toggleLanguage = () => {
    const currentLocale = locale;
    const nextLocale = currentLocale === 'en' ? 'he' : 'en';

    // Remove the current locale from the pathname and add the new one
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    const newPath = `/${nextLocale}${pathWithoutLocale}`;

    // Use window.location for locale switching to avoid TypeScript issues
    window.location.href = newPath;
  };

  const nextLocale = locale === 'en' ? 'he' : 'en';
  const nextLanguageName = localeNames[nextLocale];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        'text-sm font-medium transition-colors',
        'hover:text-primary focus:text-primary',
        className
      )}
      aria-label={t('switchTo', { language: nextLanguageName })}
      title={t('switchTo', { language: nextLanguageName })}
    >
      <span className="hidden sm:inline">{nextLanguageName}</span>
      <span className="sm:hidden">{nextLocale.toUpperCase()}</span>
    </Button>
  );
};

export { LanguageToggle };
