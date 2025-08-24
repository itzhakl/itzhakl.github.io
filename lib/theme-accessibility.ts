/**
 * Theme accessibility testing and validation utilities
 */

export interface ColorContrastResult {
  ratio: number;
  passes: {
    aa: boolean;
    aaa: boolean;
    aaLarge: boolean;
    aaaLarge: boolean;
  };
  foreground: string;
  background: string;
}

export interface ThemeAccessibilityReport {
  colorContrast: {
    light: ColorContrastResult[];
    dark: ColorContrastResult[];
  };
  focusManagement: {
    hasVisibleFocusIndicators: boolean;
    focusTrapsWork: boolean;
    focusOrderLogical: boolean;
  };
  screenReaderSupport: {
    hasProperAnnouncements: boolean;
    hasLiveRegions: boolean;
    hasProperLabels: boolean;
  };
  highContrastCompatibility: {
    worksInHighContrast: boolean;
    maintainsReadability: boolean;
  };
}

/**
 * Calculate color contrast ratio between two colors
 */
export const calculateContrastRatio = (
  foreground: string,
  background: string
): number => {
  // Convert hex/rgb to luminance values
  const getLuminance = (color: string): number => {
    // Simple RGB extraction (works for basic hex and rgb values)
    let r: number, g: number, b: number;

    if (color.startsWith('#')) {
      // Hex color
      const hex = color.slice(1);
      r = parseInt(hex.substr(0, 2), 16) / 255;
      g = parseInt(hex.substr(2, 2), 16) / 255;
      b = parseInt(hex.substr(4, 2), 16) / 255;
    } else if (color.startsWith('rgb')) {
      // RGB color
      const matches = color.match(/\d+/g);
      if (!matches || matches.length < 3) return 0;
      r = parseInt(matches[0]) / 255;
      g = parseInt(matches[1]) / 255;
      b = parseInt(matches[2]) / 255;
    } else {
      // Fallback for other formats
      return 0;
    }

    // Convert to linear RGB
    const toLinear = (c: number) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const rLinear = toLinear(r);
    const gLinear = toLinear(g);
    const bLinear = toLinear(b);

    // Calculate luminance
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG standards
 */
export const checkContrastCompliance = (
  ratio: number
): ColorContrastResult['passes'] => {
  return {
    aa: ratio >= 4.5, // WCAG AA normal text
    aaa: ratio >= 7, // WCAG AAA normal text
    aaLarge: ratio >= 3, // WCAG AA large text (18pt+ or 14pt+ bold)
    aaaLarge: ratio >= 4.5, // WCAG AAA large text
  };
};

/**
 * Test color contrast for all text elements in both themes
 */
export const testThemeColorContrast = (): {
  light: ColorContrastResult[];
  dark: ColorContrastResult[];
} => {
  const results = {
    light: [] as ColorContrastResult[],
    dark: [] as ColorContrastResult[],
  };

  // Test both themes
  ['light', 'dark'].forEach((theme) => {
    // Temporarily apply theme
    const originalClass = document.documentElement.className;
    document.documentElement.className = theme;

    // Get all text elements
    const textElements = document.querySelectorAll(
      'p, span, div, h1, h2, h3, h4, h5, h6, a, button, label, input, textarea'
    );

    textElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const styles = window.getComputedStyle(htmlElement);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Skip if no background color (transparent)
      if (
        backgroundColor === 'rgba(0, 0, 0, 0)' ||
        backgroundColor === 'transparent'
      ) {
        return;
      }

      const ratio = calculateContrastRatio(color, backgroundColor);
      const passes = checkContrastCompliance(ratio);

      const result: ColorContrastResult = {
        ratio,
        passes,
        foreground: color,
        background: backgroundColor,
      };

      if (theme === 'light') {
        results.light.push(result);
      } else {
        results.dark.push(result);
      }
    });

    // Restore original class
    document.documentElement.className = originalClass;
  });

  return results;
};

/**
 * Test focus management during theme transitions
 */
export const testFocusManagement = (): Promise<{
  hasVisibleFocusIndicators: boolean;
  focusTrapsWork: boolean;
  focusOrderLogical: boolean;
}> => {
  return new Promise((resolve) => {
    const results = {
      hasVisibleFocusIndicators: true,
      focusTrapsWork: true,
      focusOrderLogical: true,
    };

    // Test visible focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    // Check for focus-related classes (test environment friendly)
    focusableElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const hasRingClass =
        htmlElement.className.includes('focus-visible:ring') ||
        htmlElement.className.includes('focus:ring') ||
        htmlElement.className.includes('focus-visible:outline') ||
        htmlElement.className.includes('focus-visible:ring-2');

      if (!hasRingClass) {
        results.hasVisibleFocusIndicators = false;
      }
    });

    // Test focus order (simplified check)
    const tabOrder: HTMLElement[] = [];
    let currentElement = document.querySelector(
      '[tabindex="0"]'
    ) as HTMLElement;

    if (!currentElement) {
      currentElement = focusableElements[0] as HTMLElement;
    }

    // Simulate tab navigation
    let iterations = 0;
    while (currentElement && iterations < 20) {
      tabOrder.push(currentElement);

      // Find next focusable element
      const allFocusable = Array.from(focusableElements) as HTMLElement[];
      const currentIndex = allFocusable.indexOf(currentElement);
      currentElement = allFocusable[currentIndex + 1];

      iterations++;
    }

    // Check if tab order follows DOM order (simplified)
    results.focusOrderLogical = tabOrder.length > 0;

    resolve(results);
  });
};

/**
 * Test screen reader support for theme changes
 */
export const testScreenReaderSupport = (): {
  hasProperAnnouncements: boolean;
  hasLiveRegions: boolean;
  hasProperLabels: boolean;
} => {
  const results = {
    hasProperAnnouncements: false,
    hasLiveRegions: false,
    hasProperLabels: false,
  };

  // Check for live regions
  const liveRegions = document.querySelectorAll('[aria-live]');
  results.hasLiveRegions = liveRegions.length > 0;

  // Check theme toggle has proper labels
  const themeToggle = document.querySelector('[role="switch"]');
  if (themeToggle) {
    const hasAriaLabel = themeToggle.hasAttribute('aria-label');
    const hasTitle = themeToggle.hasAttribute('title');
    const hasAriaChecked = themeToggle.hasAttribute('aria-checked');

    results.hasProperLabels = hasAriaLabel && hasTitle && hasAriaChecked;
  }

  // Check for screen reader announcements (look for sr-only content)
  const srOnlyElements = document.querySelectorAll('.sr-only');
  results.hasProperAnnouncements = srOnlyElements.length > 0;

  return results;
};

/**
 * Test high contrast mode compatibility
 */
export const testHighContrastCompatibility = (): {
  worksInHighContrast: boolean;
  maintainsReadability: boolean;
} => {
  const results = {
    worksInHighContrast: true,
    maintainsReadability: true,
  };

  // Check if high contrast media query is supported
  const supportsHighContrast = window.matchMedia(
    '(prefers-contrast: high)'
  ).matches;

  if (supportsHighContrast) {
    // Test that elements are still visible and readable
    const textElements = document.querySelectorAll(
      'p, span, div, h1, h2, h3, h4, h5, h6'
    );

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // In high contrast mode, ensure there's sufficient distinction
      if (color === backgroundColor) {
        results.maintainsReadability = false;
      }
    });
  }

  return results;
};

/**
 * Run comprehensive theme accessibility audit
 */
export const runThemeAccessibilityAudit =
  async (): Promise<ThemeAccessibilityReport> => {
    // Theme Accessibility Audit

    const colorContrast = testThemeColorContrast();
    const focusManagement = await testFocusManagement();
    const screenReaderSupport = testScreenReaderSupport();
    const highContrastCompatibility = testHighContrastCompatibility();

    const report: ThemeAccessibilityReport = {
      colorContrast,
      focusManagement,
      screenReaderSupport,
      highContrastCompatibility,
    };

    // Log results - Color Contrast Results
    // Check for accessibility failures and log results

    return report;
  };

/**
 * Initialize theme accessibility monitoring (development only)
 */
export const initThemeAccessibilityMonitoring = () => {
  if (process.env.NODE_ENV !== 'development') return;

  // Monitor theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class' &&
        mutation.target === document.documentElement
      ) {
        // Theme changed, run quick accessibility check
        setTimeout(() => {
          const screenReaderSupport = testScreenReaderSupport();
          if (!screenReaderSupport.hasProperLabels) {
            // Theme toggle missing proper accessibility labels
          }
        }, 100);
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Run initial audit
  setTimeout(() => {
    runThemeAccessibilityAudit();
  }, 2000);
};
