'use client';

import { Container } from '@/components/ui/Container';
import {
  announceToScreenReader,
  useFocusTrap,
  useKeyboardNavigation,
} from '@/lib/accessibility';
import { useScrollspy } from '@/lib/hooks/useScrollspy';
import { cn, scrollToSection } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { LanguageToggle } from './LanguageToggle';
import { SkipLink } from './SkipLink';

const navigationSections = [
  { id: 'hero', key: 'home' },
  { id: 'about', key: 'about' },
  { id: 'timeline', key: 'timeline' },
  { id: 'stack', key: 'stack' },
  { id: 'projects', key: 'projects' },
  { id: 'experience', key: 'experience' },
  { id: 'personal', key: 'personal' },
  { id: 'contact', key: 'contact' },
] as const;

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const t = useTranslations('navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionIds = navigationSections.map((section) => section.id);
  const activeSection = useScrollspy({ sectionIds });

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-mobile-menu]')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }

    return undefined;
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);

    // Announce navigation to screen readers
    const sectionName = navigationSections.find((s) => s.id === sectionId)?.key;
    if (sectionName) {
      announceToScreenReader(
        `Navigated to ${t(sectionName)} section`,
        'assertive'
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavClick(sectionId);
    }
  };

  // Focus trap for mobile menu
  const mobileMenuRef = useFocusTrap(isMobileMenuOpen);

  // Keyboard navigation for mobile menu
  const mobileMenuKeyboard = useKeyboardNavigation(
    undefined, // onEnter
    undefined, // onSpace
    () => setIsMobileMenuOpen(false), // onEscape
    (direction) => {
      // Handle arrow key navigation in mobile menu
      if (!isMobileMenuOpen) return;

      const focusableElements = mobileMenuRef.current?.querySelectorAll(
        'button:not([disabled]), a[href]'
      ) as NodeListOf<HTMLElement>;

      if (!focusableElements.length) return;

      const currentIndex = Array.from(focusableElements).indexOf(
        document.activeElement as HTMLElement
      );
      let nextIndex = currentIndex;

      if (direction === 'down' || direction === 'right') {
        nextIndex = (currentIndex + 1) % focusableElements.length;
      } else if (direction === 'up' || direction === 'left') {
        nextIndex =
          currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
      }

      focusableElements[nextIndex]?.focus();
    }
  );

  return (
    <>
      <SkipLink href="#main-content" />
      <nav
        className={cn(
          'fixed left-0 right-0 top-0 z-40 transition-all duration-300',
          isScrolled
            ? 'border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-md'
            : 'bg-transparent',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <button
                onClick={() => handleNavClick('hero')}
                className="rounded-sm text-xl font-bold text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Go to top"
              >
                IL
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-1 md:flex">
              {navigationSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  onKeyDown={(e) => handleKeyDown(e, section.id)}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent/50 hover:text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    activeSection === section.id
                      ? 'bg-accent/30 text-primary'
                      : 'text-muted-foreground'
                  )}
                  aria-current={
                    activeSection === section.id ? 'page' : undefined
                  }
                >
                  {t(section.key)}
                </button>
              ))}
            </div>

            {/* Desktop Language Toggle */}
            <div className="hidden items-center md:flex">
              <LanguageToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <LanguageToggle />
              <button
                data-mobile-menu
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  'transition-colors'
                )}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            data-mobile-menu
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
              isMobileMenuOpen
                ? 'max-h-96 pb-4 opacity-100'
                : 'max-h-0 pb-0 opacity-0'
            )}
            role="menu"
            aria-label="Mobile navigation menu"
            aria-hidden={!isMobileMenuOpen}
            {...(!isMobileMenuOpen && { inert: true })}
            {...mobileMenuKeyboard}
          >
            <div className="mt-2 space-y-1 rounded-lg border border-border/50 bg-background/95 px-2 pb-3 pt-2 backdrop-blur-sm">
              {navigationSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  onKeyDown={(e) => handleKeyDown(e, section.id)}
                  className={cn(
                    'block w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors',
                    'hover:bg-accent/50 hover:text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    activeSection === section.id
                      ? 'bg-accent/30 text-primary'
                      : 'text-muted-foreground'
                  )}
                  role="menuitem"
                  aria-current={
                    activeSection === section.id ? 'page' : undefined
                  }
                  aria-label={`Navigate to ${t(section.key)} section`}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  {t(section.key)}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </nav>
    </>
  );
};

export { Navbar };
