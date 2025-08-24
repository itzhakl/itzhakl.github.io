import { expect, test } from '@playwright/test';

test.describe('E2E Test Suite Overview', () => {
  test('should run all test categories successfully', async ({ page }) => {
    // This is a meta-test that ensures the basic functionality works
    // before running the full test suite

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Basic smoke test
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('#hero')).toBeVisible();

    // Test that key sections exist by using the navigation buttons
    const sections = [
      { id: 'about', text: 'About' },
      { id: 'stack', text: 'Stack' },
      { id: 'projects', text: 'Projects' },
      { id: 'contact', text: 'Contact' },
    ];

    for (const section of sections) {
      // Check if we're on mobile (viewport width < 768px)
      const viewportSize = page.viewportSize();
      const isMobile = viewportSize && viewportSize.width < 768;

      if (isMobile) {
        // Open mobile menu first
        const menuToggle = page.locator('button:has-text("☰")');
        if ((await menuToggle.count()) > 0 && (await menuToggle.isVisible())) {
          await menuToggle.click();
          await page.waitForTimeout(500);
        }

        // Click navigation button in mobile menu
        const mobileNavButton = page.locator(
          `nav .md\\:hidden button:has-text("${section.text}")`
        );
        if ((await mobileNavButton.count()) > 0) {
          await mobileNavButton.click();
          await page.waitForTimeout(1000);
        }
      } else {
        // Use desktop navigation
        const desktopNavButton = page.locator(
          `nav .hidden.md\\:flex button:has-text("${section.text}")`
        );
        if ((await desktopNavButton.count()) > 0) {
          await desktopNavButton.click();
          await page.waitForTimeout(1000);
        }
      }

      const sectionElement = page.locator(`#${section.id}`);
      await expect(sectionElement).toBeVisible();
    }
  });
});
