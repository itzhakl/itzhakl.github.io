'use client';

import { announceToScreenReader } from '@/lib/accessibility';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  highContrast: boolean;
  announceToScreenReader: (
    message: string,
    priority?: 'polite' | 'assertive'
  ) => void;
  focusManagement: {
    trapFocus: boolean;
    setTrapFocus: (trap: boolean) => void;
  };
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'useAccessibility must be used within AccessibilityProvider'
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider = ({
  children,
}: AccessibilityProviderProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [highContrast, setHighContrast] = useState(false);
  const [trapFocus, setTrapFocus] = useState(false);

  // Detect high contrast preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global keyboard shortcuts
      if (e.altKey && e.key === 'h') {
        // Alt + H: Go to home/hero section
        e.preventDefault();
        const heroSection = document.getElementById('hero');
        if (heroSection) {
          heroSection.focus();
          heroSection.scrollIntoView({ behavior: 'smooth' });
          announceToScreenReader('Navigated to hero section', 'assertive');
        }
      }

      if (e.altKey && e.key === 'n') {
        // Alt + N: Focus navigation
        e.preventDefault();
        const nav = document.querySelector(
          'nav[role="navigation"]'
        ) as HTMLElement;
        if (nav) {
          const firstLink = nav.querySelector('button, a') as HTMLElement;
          if (firstLink) {
            firstLink.focus();
            announceToScreenReader('Focused navigation menu', 'assertive');
          }
        }
      }

      if (e.altKey && e.key === 'c') {
        // Alt + C: Go to contact section
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.focus();
          contactSection.scrollIntoView({ behavior: 'smooth' });
          announceToScreenReader('Navigated to contact section', 'assertive');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Announce page load
  useEffect(() => {
    const timer = setTimeout(() => {
      announceToScreenReader(
        'Portfolio page loaded. Use Alt+H for home, Alt+N for navigation, Alt+C for contact.',
        'polite'
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const contextValue: AccessibilityContextType = {
    prefersReducedMotion,
    highContrast,
    announceToScreenReader,
    focusManagement: {
      trapFocus,
      setTrapFocus,
    },
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};
