'use client';

import {
  initAccessibilityAudit,
  testKeyboardNavigation,
  testScreenReaderContent,
} from '@/lib/accessibility-testing';
import { useEffect } from 'react';

export const AccessibilityTester = () => {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return undefined;

    // Initialize accessibility audit
    initAccessibilityAudit();

    // Add keyboard shortcuts for testing
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Alt + A: Run accessibility audit
      if (e.ctrlKey && e.altKey && e.key === 'a') {
        e.preventDefault();
        const {
          runAccessibilityAudit,
          logAccessibilityIssues,
        } = require('@/lib/accessibility-testing');
        const issues = runAccessibilityAudit();
        logAccessibilityIssues(issues);
      }

      // Ctrl + Alt + K: Test keyboard navigation
      if (e.ctrlKey && e.altKey && e.key === 'k') {
        e.preventDefault();
        testKeyboardNavigation();
      }

      // Ctrl + Alt + S: Test screen reader content
      if (e.ctrlKey && e.altKey && e.key === 's') {
        e.preventDefault();
        testScreenReaderContent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Log testing shortcuts
    console.log('🔧 Accessibility Testing Shortcuts:');
    console.log('  Ctrl+Alt+A: Run accessibility audit');
    console.log('  Ctrl+Alt+K: Test keyboard navigation');
    console.log('  Ctrl+Alt+S: Test screen reader content');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // This component doesn't render anything
  return null;
};
