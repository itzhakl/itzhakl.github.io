/**
 * Accessibility testing utilities for development and testing
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: HTMLElement;
  message: string;
  rule: string;
  suggestion?: string;
}

/**
 * Check for common accessibility issues
 */
export const runAccessibilityAudit = (): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];

  // Check for missing alt text on images
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      issues.push({
        type: 'error',
        element: img,
        message: 'Image missing alt text',
        rule: 'WCAG 1.1.1',
        suggestion: 'Add descriptive alt text or aria-label to the image',
      });
    }
  });

  // Check for missing form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    const htmlInput = input as HTMLElement;
    const hasLabel = document.querySelector(`label[for="${htmlInput.id}"]`);
    const hasAriaLabel = htmlInput.getAttribute('aria-label');
    const hasAriaLabelledBy = htmlInput.getAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'error',
        element: htmlInput,
        message: 'Form control missing label',
        rule: 'WCAG 1.3.1',
        suggestion:
          'Add a label element, aria-label, or aria-labelledby attribute',
      });
    }
  });

  // Check for missing heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading) => {
    const htmlHeading = heading as HTMLElement;
    const level = parseInt(htmlHeading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      issues.push({
        type: 'warning',
        element: htmlHeading,
        message: `Heading level skipped from h${previousLevel} to h${level}`,
        rule: 'WCAG 1.3.1',
        suggestion: 'Use heading levels in sequential order',
      });
    }
    previousLevel = level;
  });

  // Check for insufficient color contrast (basic check)
  const textElements = document.querySelectorAll('p, span, div, a, button');
  textElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const styles = window.getComputedStyle(htmlElement);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // Skip elements with transparent or inherit backgrounds
    if (
      backgroundColor === 'transparent' ||
      backgroundColor === 'rgba(0, 0, 0, 0)' ||
      backgroundColor === 'inherit' ||
      backgroundColor === 'initial' ||
      backgroundColor === 'unset'
    ) {
      return;
    }

    // Skip elements with no visible text content
    const textContent = htmlElement.textContent?.trim();
    if (!textContent) {
      return;
    }

    // Helper function to normalize color values to RGB
    const normalizeColor = (colorValue: string): string | null => {
      if (!colorValue || colorValue === 'transparent') return null;

      // Create a temporary element to get computed color
      const tempElement = document.createElement('div');
      tempElement.style.color = colorValue;
      document.body.appendChild(tempElement);
      const computedColor = window.getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);

      return computedColor;
    };

    const normalizedColor = normalizeColor(color);
    const normalizedBgColor = normalizeColor(backgroundColor);

    // Only check if both colors are valid and the same
    if (
      normalizedColor &&
      normalizedBgColor &&
      normalizedColor === normalizedBgColor
    ) {
      issues.push({
        type: 'error',
        element: htmlElement,
        message: 'Text and background colors are the same',
        rule: 'WCAG 1.4.3',
        suggestion:
          'Ensure sufficient color contrast between text and background',
      });
    }
  });

  // Check for missing focus indicators
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  focusableElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const styles = window.getComputedStyle(htmlElement, ':focus');
    const outline = styles.outline;
    const boxShadow = styles.boxShadow;

    if (outline === 'none' && boxShadow === 'none') {
      issues.push({
        type: 'warning',
        element: htmlElement,
        message: 'Element may not have visible focus indicator',
        rule: 'WCAG 2.4.7',
        suggestion: 'Ensure focusable elements have visible focus indicators',
      });
    }
  });

  // Check for missing ARIA landmarks
  const main = document.querySelector('main');
  const nav = document.querySelector('nav');

  if (!main) {
    issues.push({
      type: 'error',
      element: document.body,
      message: 'Page missing main landmark',
      rule: 'WCAG 1.3.1',
      suggestion: 'Add a main element to identify the primary content',
    });
  }

  if (!nav) {
    issues.push({
      type: 'warning',
      element: document.body,
      message: 'Page missing navigation landmark',
      rule: 'WCAG 1.3.1',
      suggestion: 'Add a nav element for the main navigation',
    });
  }

  // Check for empty links or buttons
  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');

  [...links, ...buttons].forEach((element) => {
    const htmlElement = element as HTMLElement;
    const text = htmlElement.textContent?.trim();
    const ariaLabel = htmlElement.getAttribute('aria-label');
    const ariaLabelledBy = htmlElement.getAttribute('aria-labelledby');

    if (!text && !ariaLabel && !ariaLabelledBy) {
      issues.push({
        type: 'error',
        element: htmlElement,
        message: `${htmlElement.tagName.toLowerCase()} has no accessible text`,
        rule: 'WCAG 2.4.4',
        suggestion:
          'Add text content, aria-label, or aria-labelledby attribute',
      });
    }
  });

  return issues;
};

/**
 * Log accessibility issues to console (development only)
 */
export const logAccessibilityIssues = (issues: AccessibilityIssue[]) => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('🔍 Accessibility Audit Results');

  const errors = issues.filter((issue) => issue.type === 'error');
  const warnings = issues.filter((issue) => issue.type === 'warning');
  const info = issues.filter((issue) => issue.type === 'info');

  if (errors.length > 0) {
    console.group(`❌ ${errors.length} Error(s)`);
    errors.forEach((issue) => {
      console.error(`${issue.rule}: ${issue.message}`, issue.element);
      if (issue.suggestion) {
        console.info(`💡 Suggestion: ${issue.suggestion}`);
      }
    });
    console.groupEnd();
  }

  if (warnings.length > 0) {
    console.group(`⚠️ ${warnings.length} Warning(s)`);
    warnings.forEach((issue) => {
      console.warn(`${issue.rule}: ${issue.message}`, issue.element);
      if (issue.suggestion) {
        console.info(`💡 Suggestion: ${issue.suggestion}`);
      }
    });
    console.groupEnd();
  }

  if (info.length > 0) {
    console.group(`ℹ️ ${info.length} Info`);
    info.forEach((issue) => {
      console.info(`${issue.rule}: ${issue.message}`, issue.element);
      if (issue.suggestion) {
        console.info(`💡 Suggestion: ${issue.suggestion}`);
      }
    });
    console.groupEnd();
  }

  if (issues.length === 0) {
    console.log('✅ No accessibility issues found!');
  }

  console.groupEnd();
};

/**
 * Run accessibility audit on page load (development only)
 */
export const initAccessibilityAudit = () => {
  if (process.env.NODE_ENV !== 'development') return;

  // Run audit after page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      const issues = runAccessibilityAudit();
      logAccessibilityIssues(issues);
    }, 1000);
  });
};

/**
 * Keyboard navigation testing helper
 */
export const testKeyboardNavigation = () => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('⌨️ Keyboard Navigation Test');

  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );

  console.log(`Found ${focusableElements.length} focusable elements:`);
  focusableElements.forEach((element, index) => {
    console.log(
      `${index + 1}. ${element.tagName} - ${element.textContent?.trim() || element.getAttribute('aria-label') || 'No accessible text'}`
    );
  });

  console.log('💡 Test by pressing Tab to navigate through all elements');
  console.groupEnd();
};

/**
 * Screen reader testing helper
 */
export const testScreenReaderContent = () => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('🔊 Screen Reader Content Test');

  // Check for proper heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  console.log('Heading structure:');
  headings.forEach((heading) => {
    const level = heading.tagName;
    const text = heading.textContent?.trim();
    console.log(`${level}: ${text}`);
  });

  // Check for ARIA landmarks
  const landmarks = document.querySelectorAll(
    '[role], main, nav, header, footer, aside, section'
  );
  console.log('\nLandmarks:');
  landmarks.forEach((landmark) => {
    const role =
      landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const label =
      landmark.getAttribute('aria-label') ||
      landmark.getAttribute('aria-labelledby');
    console.log(`${role}${label ? ` (${label})` : ''}`);
  });

  console.groupEnd();
};
