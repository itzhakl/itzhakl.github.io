'use client';

import { Container } from '@/components/ui/Container';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { SkipLink } from './SkipLink';
import { Logo } from '../ui/Logo';
import { useScrollspy } from '@/lib/hooks/useScrollspy';
import { cn, scrollToSection } from '@/lib/utils';
import { announceToScreenReader } from '@/lib/accessibility';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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

const NavLinks = ({
  sections,
  activeSection,
  onClick,
  mobile = false,
}: {
  sections: typeof navigationSections;
  activeSection: string | null;
  onClick: (id: string) => void;
  mobile?: boolean;
}) => {
  const t = useTranslations('navigation');
  return (
    <>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onClick(section.id)}
          className={cn(
            'rounded-md px-3 py-2 font-medium transition-colors',
            mobile ? 'block w-full text-left text-base' : 'text-sm',
            'hover:bg-accent/50 hover:text-primary',
            activeSection === section.id
              ? 'bg-accent/30 text-primary'
              : 'text-muted-foreground'
          )}
          aria-current={activeSection === section.id ? 'page' : undefined}
        >
          {t(section.key)}
        </button>
      ))}
    </>
  );
};

const NavControls = ({ mobile = false }: { mobile?: boolean }) => (
  <div
    className={cn(
      'flex items-center space-x-2',
      mobile && 'mt-3 justify-center border-t border-border/30 pt-3'
    )}
  >
    <ThemeToggle
      variant="ghost"
      size="md"
      className="text-muted-foreground hover:text-primary"
    />
    <LanguageToggle />
  </div>
);

const Navbar = ({ className }: NavbarProps) => {
  const t = useTranslations('navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionIds = navigationSections.map((s) => s.id);
  const activeSection = useScrollspy({ sectionIds });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsMobileMenuOpen(false);
    const sectionName = navigationSections.find((s) => s.id === id)?.key;
    if (sectionName) {
      announceToScreenReader(
        `Navigated to ${t(sectionName)} section`,
        'assertive'
      );
    }
  };

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
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('hero')}
              className="group rounded-sm p-1 transition hover:scale-105 focus:outline-none"
              aria-label="Go to top"
            >
              <Logo className="group-hover:opacity-80" />
            </button>

            {/* Desktop Nav */}
            <div className="hidden items-center space-x-1 md:flex">
              <NavLinks
                sections={navigationSections}
                activeSection={activeSection}
                onClick={handleNavClick}
              />
            </div>

            {/* Desktop Controls */}
            <div className="hidden items-center space-x-2 md:flex">
              <NavControls />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center space-x-2 md:hidden">
              <LanguageToggle />
              <ThemeToggle
                variant="ghost"
                size="md"
                className="text-muted-foreground hover:text-primary"
              />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent focus:outline-none"
              >
                {isMobileMenuOpen ? '✖' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-2 rounded-lg border bg-background/95 p-2 backdrop-blur-sm md:hidden">
              <NavLinks
                sections={navigationSections}
                activeSection={activeSection}
                onClick={handleNavClick}
                mobile
              />
            </div>
          )}
        </Container>
      </nav>
    </>
  );
};

export { Navbar };
