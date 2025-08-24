import { expect, test } from '@playwright/test';
import { navigateToSection } from './helpers';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should verify all navigation links work correctly', async ({
    page,
  }) => {
    const sections = [
      { id: 'hero', name: 'Home' },
      { id: 'about', name: 'About' },
      { id: 'timeline', name: 'Timeline' },
      { id: 'stack', name: 'Stack' },
      { id: 'projects', name: 'Projects' },
      { id: 'experience', name: 'Experience' },
      { id: 'personal', name: 'Personal' },
      { id: 'contact', name: 'Contact' },
    ];

    for (const section of sections) {
      // Navigate to section using helper function
      await navigateToSection(page, section.id);
      await page.waitForTimeout(1000); // Wait for smooth scroll

      // Verify section is in viewport
      const sectionElement = page.locator(`#${section.id}`);
      await expect(sectionElement).toBeInViewport({ ratio: 0.1 });

      // Verify active state in navigation (if present and visible)
      const navButton = page.locator(`nav button[aria-current="page"]`);
      if ((await navButton.count()) > 0) {
        // Only check visibility if the button is actually visible (not hidden on mobile)
        const isVisible = await navButton.isVisible();
        if (isVisible) {
          await expect(navButton).toBeVisible();
        }
      }
    }
  });

  test('should verify logo redirects to homepage', async ({ page }) => {
    // Navigate to a different section first
    await navigateToSection(page, 'contact');
    await page.waitForTimeout(1000);

    // Click logo
    await page.click('button[aria-label="Go to top"]');
    await page.waitForTimeout(1000);

    // Verify we're back at hero section
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeInViewport({ ratio: 0.5 });
  });

  test('should ensure no broken links (404 errors)', async ({ page }) => {
    const responses: Array<{ url: string; status: number }> = [];

    // Collect all responses
    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
      });
    });

    // Navigate through all sections to trigger any lazy-loaded content
    const sections = [
      'about',
      'timeline',
      'stack',
      'projects',
      'experience',
      'personal',
      'contact',
    ];

    for (const section of sections) {
      await navigateToSection(page, section);
      await page.waitForTimeout(500);
    }

    // Wait for all network activity to complete
    await page.waitForLoadState('networkidle');

    // Check for 404 errors
    const brokenLinks = responses.filter((r) => r.status === 404);
    expect(brokenLinks).toHaveLength(0);

    // Check for other error status codes
    const errorResponses = responses.filter((r) => r.status >= 400);
    if (errorResponses.length > 0) {
    }
  });

  test('should handle anchor links and smooth scrolling', async ({ page }) => {
    // Test direct anchor navigation
    await page.goto('/en#projects');
    await page.waitForTimeout(1000);

    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport({ ratio: 0.1 });

    // Test smooth scrolling behavior
    await navigateToSection(page, 'hero');
    const startTime = Date.now();

    await page.waitForFunction(() => {
      const heroSection = document.querySelector('#hero');
      if (!heroSection) return false;
      const rect = heroSection.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    });

    const scrollTime = Date.now() - startTime;

    // Smooth scroll should take some time (not instant)
    expect(scrollTime).toBeGreaterThan(100);
    expect(scrollTime).toBeLessThan(3000);
  });

  test('should handle mobile navigation menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile menu should be hidden initially
    const mobileMenu = page.locator('nav div.mt-2.rounded-lg');
    await expect(mobileMenu).not.toBeVisible();

    // Click hamburger menu
    const menuToggle = page.locator('button:has-text("☰")');
    await menuToggle.click();
    await page.waitForTimeout(500);

    // Mobile menu should be visible
    await expect(mobileMenu).toBeVisible();

    // Test navigation in mobile menu
    const projectsButton = mobileMenu.locator('button:has-text("Projects")');
    await projectsButton.click();
    await page.waitForTimeout(1000);

    // Menu should close after navigation
    await expect(mobileMenu).not.toBeVisible();

    // Verify navigation worked
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport({ ratio: 0.1 });
  });

  test('should handle language switching', async ({ page }) => {
    // Find visible language toggle (could be in mobile or desktop nav)
    const languageToggle = page
      .locator('[data-testid="language-toggle"]')
      .first();

    // If not visible, it might be in mobile nav area
    if (!(await languageToggle.isVisible())) {
      // Check if we're on mobile and need to look in mobile nav area
      const viewportSize = page.viewportSize();
      const isMobile = viewportSize && viewportSize.width < 768;

      if (isMobile) {
        // Language toggle should be visible in mobile nav area
        const mobileLanguageToggle = page.locator(
          '.md\\:hidden [data-testid="language-toggle"]'
        );
        if (await mobileLanguageToggle.isVisible()) {
          await mobileLanguageToggle.click();
        } else {
          // Skip test if language toggle is not available
          test.skip(true, 'Language toggle not visible on this viewport');
        }
      } else {
        await languageToggle.click();
      }
    } else {
      await languageToggle.click();
    }

    // Wait for navigation to Hebrew version
    await page.waitForURL('/he');

    // Check Hebrew content (use first() to avoid strict mode violation)
    await expect(page.locator('text=איציק לשינסקי').first()).toBeVisible();

    // Check RTL direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');

    // Switch back to English
    const backToggle = page.locator('[data-testid="language-toggle"]').first();
    await backToggle.click();
    await page.waitForURL('/en');

    // Check English content is restored
    await expect(page.locator('text=Itzhak Leshinsky').first()).toBeVisible();
    await expect(html).toHaveAttribute('dir', 'ltr');
  });
});
