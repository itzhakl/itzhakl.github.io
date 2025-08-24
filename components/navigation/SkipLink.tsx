'use client';

import { announceToScreenReader } from '@/lib/accessibility';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SkipLinkProps {
  href: string;
  className?: string;
}

const SkipLink = ({ href, className }: SkipLinkProps) => {
  const t = useTranslations('navigation');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const targetElement = document.querySelector(href) as HTMLElement;
    if (targetElement) {
      // Focus the target element
      targetElement.focus();

      // If the element isn't naturally focusable, make it focusable temporarily
      if (!targetElement.hasAttribute('tabindex')) {
        targetElement.setAttribute('tabindex', '-1');
        targetElement.addEventListener(
          'blur',
          () => {
            targetElement.removeAttribute('tabindex');
          },
          { once: true }
        );
      }

      // Scroll to the element
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Announce to screen readers
      announceToScreenReader(t('skipToContent'), 'assertive');
    }
  };

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={cn('skip-link', className)}
        aria-label={t('skipToContent')}
      >
        {t('skipToContent')}
      </a>

      {/* Additional skip links for better navigation */}
      <a
        href="#navigation"
        onClick={(e) => {
          e.preventDefault();
          const nav = document.querySelector(
            'nav[role="navigation"]'
          ) as HTMLElement;
          if (nav) {
            nav.focus();
            if (!nav.hasAttribute('tabindex')) {
              nav.setAttribute('tabindex', '-1');
            }
            announceToScreenReader('Skipped to navigation', 'assertive');
          }
        }}
        className={cn(
          'skip-link',
          'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-16 focus:z-50',
          'rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'no-underline transition-all duration-200'
        )}
        aria-label="Skip to navigation"
      >
        Skip to navigation
      </a>
    </>
  );
};

export { SkipLink };
