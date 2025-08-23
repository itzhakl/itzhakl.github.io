'use client';

import { useEffect, useRef } from 'react';

/**
 * Announces text to screen readers
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  if (typeof window === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the announcement after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Hook to announce route changes to screen readers
 */
export const useRouteAnnouncement = () => {
  const previousPath = useRef<string>('');

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (previousPath.current && previousPath.current !== currentPath) {
      // Announce page change
      const pageName = getPageNameFromPath(currentPath);
      announceToScreenReader(`Navigated to ${pageName}`, 'assertive');
    }

    previousPath.current = currentPath;
  }, []);
};

/**
 * Get readable page name from path
 */
const getPageNameFromPath = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment || lastSegment.length === 2) {
    return 'Home page';
  }

  return (
    lastSegment.charAt(0).toUpperCase() +
    lastSegment.slice(1).replace(/-/g, ' ')
  );
};

/**
 * Hook to manage focus trap for modals and menus
 */
export const useFocusTrap = <T extends HTMLElement = HTMLDivElement>(
  isActive: boolean
) => {
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook to handle keyboard navigation for custom components
 */
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onSpace?: () => void,
  onEscape?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (onEnter) {
          e.preventDefault();
          onEnter();
        }
        break;
      case ' ':
        if (onSpace) {
          e.preventDefault();
          onSpace();
        }
        break;
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        break;
      case 'ArrowUp':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('up');
        }
        break;
      case 'ArrowDown':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('down');
        }
        break;
      case 'ArrowLeft':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('left');
        }
        break;
      case 'ArrowRight':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('right');
        }
        break;
    }
  };

  return { onKeyDown: handleKeyDown };
};

/**
 * Generate unique IDs for accessibility attributes
 */
let idCounter = 0;
export const generateId = (prefix: string = 'id'): string => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Hook to generate stable IDs for accessibility
 */
export const useId = (prefix: string = 'id'): string => {
  const idRef = useRef<string>();

  if (!idRef.current) {
    idRef.current = generateId(prefix);
  }

  return idRef.current;
};

/**
 * Check if an element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  return focusableSelectors.some((selector) => element.matches(selector));
};

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors));
};

/**
 * Hook to announce dynamic content changes
 */
export const useContentAnnouncement = () => {
  const announce = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    announceToScreenReader(message, priority);
  };

  return { announce };
};
