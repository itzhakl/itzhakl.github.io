import { expect, test } from '@playwright/test';

test.describe('Responsiveness Tests', () => {
  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Mobile Medium', width: 375, height: 667 },
    { name: 'Mobile Small', width: 320, height: 568 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should look good on ${name} viewport (${width}x${height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      // Check that main content is visible
      await expect(page.locator('main')).toBeVisible();

      // Check hero section is properly displayed
      const heroSection = page.locator('#hero');
      await expect(heroSection).toBeVisible();
      await expect(heroSection).toBeInViewport();

      // Check navigation is visible and functional
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Test navigation through sections
      const sections = ['about', 'stack', 'projects', 'contact'];

      for (const section of sections) {
        await page.click(`[href="#${section}"]`);
        await page.waitForTimeout(500);

        const sectionElement = page.locator(`#${section}`);
        await expect(sectionElement).toBeInViewport({ ratio: 0.1 });
      }

      // Check that content doesn't overflow horizontally
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(width + 20); // Allow small margin for scrollbars
    });
  });

  test('should handle mobile menu correctly', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Mobile menu should be hidden initially
    const mobileMenuContent = page.locator('nav div.md\\:hidden div.mt-2');
    await expect(mobileMenuContent).not.toBeVisible();

    // Desktop navigation should be hidden on mobile
    const desktopNav = page.locator('nav div.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();

    // Mobile menu toggle should be visible
    const menuToggle = page.locator('button:has-text("☰")');
    await expect(menuToggle).toBeVisible();

    // Click to open mobile menu
    await menuToggle.click();
    await expect(mobileMenuContent).toBeVisible();

    // Menu should contain all navigation items
    const navItems = [
      'Home',
      'About',
      'Timeline',
      'Stack',
      'Projects',
      'Experience',
      'Personal',
      'Contact',
    ];

    for (const item of navItems) {
      const navButton = mobileMenuContent.locator(`button:has-text("${item}")`);
      if ((await navButton.count()) > 0) {
        await expect(navButton).toBeVisible();
      }
    }

    // Test navigation from mobile menu
    await page.click('text=Projects');
    await page.waitForTimeout(1000);

    // Menu should close after navigation
    await expect(mobileMenuContent).not.toBeVisible();

    // Should navigate to correct section
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport({ ratio: 0.1 });

    // Click to open menu again
    await menuToggle.click();
    await expect(mobileMenuContent).toBeVisible();

    // Click close button (X)
    const closeButton = page.locator('button:has-text("✖")');
    await closeButton.click();
    await expect(mobileMenuContent).not.toBeVisible();
  });

  test('should handle tablet viewport correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Check that content adapts to tablet size
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();

    // Navigation should still work
    await page.click('[href="#projects"]');
    await page.waitForTimeout(500);

    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport();

    // Check that project cards adapt to tablet layout
    const projectCards = page.locator('[data-testid="project-card"]');
    if ((await projectCards.count()) > 0) {
      await expect(projectCards.first()).toBeVisible();
    }
  });

  test('should maintain readability across all screen sizes', async ({
    page,
  }) => {
    const testViewports = [
      { width: 320, height: 568 }, // Small mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      // Check text is readable (not too small)
      const headings = page.locator('h1, h2, h3');
      const headingCount = await headings.count();

      if (headingCount > 0) {
        for (let i = 0; i < Math.min(headingCount, 3); i++) {
          const heading = headings.nth(i);
          const fontSize = await heading.evaluate((el) => {
            return parseInt(window.getComputedStyle(el).fontSize);
          });

          // Headings should be at least 16px
          expect(fontSize).toBeGreaterThanOrEqual(16);
        }
      }

      // Check paragraph text
      const paragraphs = page.locator('p');
      const paragraphCount = await paragraphs.count();

      if (paragraphCount > 0) {
        const paragraph = paragraphs.first();
        const fontSize = await paragraph.evaluate((el) => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });

        // Body text should be at least 14px
        expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    }
  });

  test('should handle orientation changes on mobile', async ({ page }) => {
    // Start in portrait mode
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Verify content is visible in portrait
    await expect(page.locator('#hero')).toBeVisible();

    // Switch to landscape mode
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    // Content should still be visible and functional
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();

    // Navigation should still work in landscape
    await page.click('[href="#about"]');
    await page.waitForTimeout(500);

    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport({ ratio: 0.1 });
  });

  test('should handle very wide screens correctly', async ({ page }) => {
    // Test ultra-wide screen
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Content should be centered and not stretched too wide
    const container = page.locator('.container, .max-w-').first();
    if ((await container.count()) > 0) {
      const containerWidth = await container.evaluate(
        (el) => el.getBoundingClientRect().width
      );

      // Container should have reasonable max width (not full screen width)
      expect(containerWidth).toBeLessThan(1400);
    }

    // Navigation should still work
    await page.click('[href="#projects"]');
    await page.waitForTimeout(500);

    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport();
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Test touch scrolling
    await page.touchscreen.tap(200, 300);

    // Swipe down to scroll
    await page.touchscreen.tap(200, 400);
    await page.mouse.move(200, 200);

    // Test touch navigation
    const navButton = page.locator('[href="#contact"]');
    if ((await navButton.count()) > 0) {
      await navButton.tap();
      await page.waitForTimeout(1000);

      const contactSection = page.locator('#contact');
      await expect(contactSection).toBeInViewport({ ratio: 0.1 });
    }
  });

  test('should maintain proper spacing and layout on all devices', async ({
    page,
  }) => {
    const testSizes = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
    ];

    for (const size of testSizes) {
      await page.setViewportSize(size);
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      // Check that sections have proper spacing
      const sections = page.locator('section');
      const sectionCount = await sections.count();

      if (sectionCount > 1) {
        for (let i = 0; i < Math.min(sectionCount, 3); i++) {
          const section = sections.nth(i);

          // Check section has proper padding/margin
          const styles = await section.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              paddingTop: parseInt(computed.paddingTop),
              paddingBottom: parseInt(computed.paddingBottom),
              marginTop: parseInt(computed.marginTop),
              marginBottom: parseInt(computed.marginBottom),
            };
          });

          // Sections should have some vertical spacing
          const totalVerticalSpace =
            styles.paddingTop +
            styles.paddingBottom +
            styles.marginTop +
            styles.marginBottom;
          expect(totalVerticalSpace).toBeGreaterThan(0);
        }
      }
    }
  });
});
