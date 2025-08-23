'use client';

import dynamic from 'next/dynamic';

// Dynamic import for development-only component (client-side only)
const AccessibilityTester = dynamic(
  () =>
    import('./AccessibilityTester').then((mod) => ({
      default: mod.AccessibilityTester,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

export const AccessibilityTesterWrapper = () => {
  return <AccessibilityTester />;
};
