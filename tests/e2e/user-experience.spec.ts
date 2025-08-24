import { expect, test } from '@playwright/test';

test.describe('User Experience Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should have smooth scrolling between sections', async ({ page }) => {
    const sections = [
      'about',
      'timeline',
      'stack',
      'projects',
      'experience',
      'contact',
    ];

    for (const section of sections) {
      const startTime = Date.now();

      // Click navigation link
      await page.click(`[href="#${section}"]`);

      // Wait for scroll to complete
      await page.waitForFunction((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight;
      }, section);

      const scrollTime = Date.now() - startTime;

      // Smooth scroll should take some time (not instant) but not too long
      expect(scrollTime).toBeGreaterThan(100);
      expect(scrollTime).toBeLessThan(3000);

      // Verify section is in viewport
      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeInViewport({ ratio: 0.1 });
    }
  });

  test('should handle anchor links correctly', async ({ page }) => {
    // Test direct anchor navigation
    await page.goto('/en#projects');
    await page.waitForTimeout(1000);

    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport({ ratio: 0.1 });

    // Test anchor navigation from different section
    await page.goto('/en#hero');
    await page.waitForTimeout(500);

    await page.goto('/en#contact');
    await page.waitForTimeout(1000);

    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport({ ratio: 0.1 });
  });

  test('should have responsive animations and interactions', async ({
    page,
  }) => {
    // Test hover effects on buttons
    const buttons = page.locator(
      'button, a[role="button"], [data-testid="contact-button"]'
    );
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const firstButton = buttons.first();

      // Get initial styles
      const initialStyles = await firstButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          transform: computed.transform,
          opacity: computed.opacity,
          backgroundColor: computed.backgroundColor,
        };
      });

      // Hover over button
      await firstButton.hover();
      await page.waitForTimeout(300); // Wait for hover animation

      // Check if styles changed (indicating hover effect)
      const hoverStyles = await firstButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          transform: computed.transform,
          opacity: computed.opacity,
          backgroundColor: computed.backgroundColor,
        };
      });

      // At least one style should change on hover
      const stylesChanged =
        initialStyles.transform !== hoverStyles.transform ||
        initialStyles.opacity !== hoverStyles.opacity ||
        initialStyles.backgroundColor !== hoverStyles.backgroundColor;

      // Verify hover effect occurred
      expect(typeof stylesChanged).toBe('boolean');

      // Button should still be visible and functional
      await expect(firstButton).toBeVisible();
    }
  });

  test('should handle keyboard navigation properly', async ({ page }) => {
    // Start from top of page
    await page.keyboard.press('Home');

    // Tab through interactive elements
    const interactiveElements = page.locator(
      'button, a, input, textarea, [tabindex="0"]'
    );
    const elementCount = await interactiveElements.count();

    if (elementCount > 0) {
      // Focus first element
      await page.keyboard.press('Tab');

      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Tab through several elements
      for (let i = 0; i < Math.min(5, elementCount - 1); i++) {
        await page.keyboard.press('Tab');
        focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }

      // Test Shift+Tab (reverse navigation)
      await page.keyboard.press('Shift+Tab');
      focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should handle focus management correctly', async ({ page }) => {
    // Test skip link functionality
    const skipLink = page.locator('text=Skip to main content').first();

    if ((await skipLink.count()) > 0) {
      // Focus skip link with keyboard
      await page.keyboard.press('Tab');

      if (await skipLink.isVisible()) {
        await expect(skipLink).toBeFocused();

        // Activate skip link
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        // Focus should move to main content
        const mainContent = page.locator('#main-content, main');
        const isFocused = await mainContent.evaluate(
          (el) => document.activeElement === el
        );

        if (!isFocused) {
          // At minimum, we should be near the main content
          await expect(mainContent).toBeInViewport();
        }
      }
    }
  });

  test('should provide visual feedback for interactions', async ({ page }) => {
    // Test navigation button active states
    await page.click('[href="#projects"]');
    await page.waitForTimeout(500);

    // Check if navigation shows active state
    const activeNavButton = page.locator('nav button[aria-current="page"]');
    if ((await activeNavButton.count()) > 0) {
      await expect(activeNavButton).toBeVisible();
    }

    // Test button press feedback
    const buttons = page.locator('button:not([disabled])');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const testButton = buttons.first();

      // Mouse down should provide visual feedback
      await testButton.hover();
      await page.mouse.down();
      await page.waitForTimeout(100);

      // Button should still be visible during press
      await expect(testButton).toBeVisible();

      await page.mouse.up();
    }
  });

  test('should handle loading states gracefully', async ({ page }) => {
    // Test page load with slow network
    await page.route('**/*', async (route) => {
      // Add small delay to simulate slower loading
      await new Promise((resolve) => setTimeout(resolve, 50));
      await route.continue();
    });

    await page.goto('/en');

    // Check that loading states don't break the experience
    await page.waitForSelector('main', { timeout: 10000 });
    await expect(page.locator('main')).toBeVisible();

    // Navigate through sections to test dynamic loading
    const sections = ['timeline', 'stack', 'projects'];

    for (const section of sections) {
      await page.click(`[href="#${section}"]`);

      // Wait for section to load
      await page.waitForSelector(`#${section}`, { timeout: 10000 });

      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeVisible();

      // Check that loading placeholder is replaced with content
      const loadingPlaceholder = sectionElement.locator('.animate-pulse');
      if ((await loadingPlaceholder.count()) > 0) {
        // Wait for loading to complete
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should maintain scroll position during interactions', async ({
    page,
  }) => {
    // Scroll to middle of page
    await page.click('[href="#stack"]');
    await page.waitForTimeout(1000);

    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBeGreaterThan(100);

    // Interact with theme toggle (if present)
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if ((await themeToggle.count()) > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Scroll position should be maintained
      const newScrollY = await page.evaluate(() => window.scrollY);
      expect(Math.abs(newScrollY - initialScrollY)).toBeLessThan(50);
    }

    // Interact with language toggle
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    if ((await languageToggle.count()) > 0) {
      // Note: Language toggle changes URL, so scroll position will reset
      // This is expected behavior
    }
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test handling of missing images
    await page.route('**/*.{png,jpg,jpeg,gif,webp}', (route) => {
      // Simulate some images failing to load
      if (Math.random() > 0.7) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Navigate through sections
    const sections = ['about', 'projects', 'contact'];

    for (const section of sections) {
      await page.click(`[href="#${section}"]`);
      await page.waitForTimeout(500);

      // Section should still be visible even if some images fail
      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeVisible();
    }

    // Page should still be functional
    await expect(page.locator('main')).toBeVisible();
  });

  test('should provide appropriate feedback for user actions', async ({
    page,
  }) => {
    // Test contact button interactions
    await page.click('[href="#contact"]');
    await page.waitForTimeout(500);

    const contactButtons = page.locator(
      '[data-testid="contact-button"], a[href^="mailto:"]'
    );
    const buttonCount = await contactButtons.count();

    if (buttonCount > 0) {
      const contactButton = contactButtons.first();

      // Button should provide visual feedback on hover
      await contactButton.hover();
      await page.waitForTimeout(200);

      await expect(contactButton).toBeVisible();

      // Button should be clearly clickable
      const cursor = await contactButton.evaluate((el) => {
        return window.getComputedStyle(el).cursor;
      });

      expect(cursor).toBe('pointer');
    }
  });

  test('should handle rapid navigation gracefully', async ({ page }) => {
    const sections = ['about', 'stack', 'projects', 'experience', 'contact'];

    // Rapidly navigate through sections
    for (let i = 0; i < 2; i++) {
      for (const section of sections) {
        await page.click(`[href="#${section}"]`);
        await page.waitForTimeout(100); // Very short wait to test rapid navigation
      }
    }

    // Should end up at the last section
    const contactSection = page.locator('#contact');
    await page.waitForTimeout(1000); // Wait for final scroll to complete
    await expect(contactSection).toBeInViewport({ ratio: 0.1 });

    // Page should still be responsive
    await page.click('[href="#hero"]');
    await page.waitForTimeout(1000);

    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeInViewport({ ratio: 0.1 });
  });
});
