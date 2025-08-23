'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  className?: string;
}

const SkipLink = ({ href, className }: SkipLinkProps) => {
  const t = useTranslations('navigation');

  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50',
        'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'transition-all duration-200',
        className
      )}
    >
      {t('skipToContent')}
    </a>
  );
};

export { SkipLink };
