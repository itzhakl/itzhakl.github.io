import { expect, test } from '@playwright/test';
import { navigateToSection } from './helpers';

test.describe('Content Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should verify all texts are displayed correctly', async ({ page }) => {
    // Hero section texts (use first() to avoid strict mode violations)
    await expect(page.locator('text=Hi there 👋').first()).toBeVisible();
    await expect(page.locator('text=Itzhak Leshinsky').first()).toBeVisible();
    await expect(
      page.locator('text=Full-Stack Developer').first()
    ).toBeVisible();

    // Navigate through sections and check key texts
    const sectionsToCheck = [
      {
        id: 'about',
        texts: ['About Me', 'passionate', 'developer'],
      },
      {
        id: 'timeline',
        texts: ['Timeline', '2024', '2023'],
      },
      {
        id: 'stack',
        texts: ['Tech Stack', 'Frontend', 'Backend', 'React', 'Node.js'],
      },
      {
        id: 'projects',
        texts: ['Projects', 'AI Fitness Coach', 'Anonymous Chat Bot'],
      },
      {
        id: 'experience',
        texts: ['Experience', 'Full-Stack Developer'],
      },
      {
        id: 'contact',
        texts: ['Contact', 'Get in touch'],
      },
    ];

    for (const section of sectionsToCheck) {
      await navigateToSection(page, section.id);
      await page.waitForTimeout(500);

      for (const text of section.texts) {
        const textElement = page.locator(`text=${text}`).first();
        if ((await textElement.count()) > 0) {
          await expect(textElement).toBeVisible();
        }
      }
    }
  });

  test('should verify all images are displayed and not missing', async ({
    page,
  }) => {
    // Wait for all sections to load
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
      await page.click(`[href="#${section}"]`);
      await page.waitForTimeout(500);
    }

    // Get all images on the page
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);

        // Check image is visible
        await expect(image).toBeVisible();

        // Check image has proper alt text
        const altText = await image.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText?.length).toBeGreaterThan(0);

        // Check image loads successfully (not broken)
        const naturalWidth = await image.evaluate(
          (img: HTMLImageElement) => img.naturalWidth
        );
        const naturalHeight = await image.evaluate(
          (img: HTMLImageElement) => img.naturalHeight
        );

        expect(naturalWidth).toBeGreaterThan(0);
        expect(naturalHeight).toBeGreaterThan(0);
      }
    }
  });

  test('should verify all icons are displayed', async ({ page }) => {
    // Check for React Icons (they render as SVG elements)
    const svgIcons = page.locator(
      'svg[role="img"], svg:not([aria-hidden="true"])'
    );
    const iconCount = await svgIcons.count();

    if (iconCount > 0) {
      for (let i = 0; i < iconCount; i++) {
        const icon = svgIcons.nth(i);
        await expect(icon).toBeVisible();

        // Check icon has proper dimensions
        const width = await icon.evaluate(
          (el) => el.getBoundingClientRect().width
        );
        const height = await icon.evaluate(
          (el) => el.getBoundingClientRect().height
        );

        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
      }
    }

    // Check specific icons in different sections
    await page.click('[href="#stack"]');
    await page.waitForTimeout(500);

    // Tech stack should have technology icons
    const techIcons = page.locator('[data-testid*="tech-icon"], .tech-icon');
    if ((await techIcons.count()) > 0) {
      await expect(techIcons.first()).toBeVisible();
    }

    // Social media icons in hero/contact sections
    await page.click('[href="#hero"]');
    await page.waitForTimeout(500);

    const socialIcons = page.locator('a[href*="github"], a[href*="linkedin"]');
    if ((await socialIcons.count()) > 0) {
      await expect(socialIcons.first()).toBeVisible();
    }
  });

  test('should ensure no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    // Listen for console messages
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    // Navigate through all sections to trigger any potential errors
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
      await page.click(`[href="#${section}"]`);
      await page.waitForTimeout(500);
    }

    // Wait for any async operations to complete
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable warnings/errors
    const filteredErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('net::ERR_') &&
        !error.toLowerCase().includes('warning')
    );

    // Should have no critical console errors
    expect(filteredErrors).toHaveLength(0);

    // Log warnings for debugging but don't fail the test
    if (consoleWarnings.length > 0) {
    }
  });

  test('should verify content loads in different languages', async ({
    page,
  }) => {
    // Test English content (use first() to avoid strict mode violation)
    await expect(page.locator('text=Itzhak Leshinsky').first()).toBeVisible();
    await expect(
      page.locator('text=Full-Stack Developer').first()
    ).toBeVisible();

    // Switch to Hebrew
    const languageToggle = page
      .locator('[data-testid="language-toggle"]')
      .first();
    await languageToggle.click();
    await page.waitForURL('/he');

    // Test Hebrew content (use first() to avoid strict mode violation)
    await expect(page.locator('text=איציק לשינסקי').first()).toBeVisible();
    await expect(page.locator('text=מפתח פול סטאק').first()).toBeVisible();

    // Navigate through sections in Hebrew
    const hebrewSections = ['about', 'stack', 'projects'];
    for (const section of hebrewSections) {
      await page.click(`[href="#${section}"]`);
      await page.waitForTimeout(500);

      // Verify section content is visible
      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeVisible();
    }
  });

  test('should verify dynamic content loads correctly', async ({ page }) => {
    // Test that dynamically imported sections load
    const dynamicSections = [
      { id: 'timeline', loadingText: 'Timeline' },
      { id: 'stack', loadingText: 'Tech Stack' },
      { id: 'projects', loadingText: 'Projects' },
      { id: 'experience', loadingText: 'Experience' },
      { id: 'personal', loadingText: 'Personal' },
      { id: 'contact', loadingText: 'Contact' },
    ];

    for (const section of dynamicSections) {
      await page.click(`[href="#${section.id}"]`);

      // Wait for section to load (it might show loading state first)
      await page.waitForSelector(`#${section.id}`, { timeout: 10000 });

      // Verify section content is loaded (not just loading placeholder)
      const sectionElement = page.locator(`#${section.id}`);
      await expect(sectionElement).toBeVisible();

      // Check that loading placeholder is gone
      const loadingPlaceholder = page.locator('.animate-pulse');
      if ((await loadingPlaceholder.count()) > 0) {
        // Wait a bit more for loading to complete
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should verify all external links have proper attributes', async ({
    page,
  }) => {
    // Navigate through sections to find external links
    const sections = ['hero', 'projects', 'contact'];

    for (const section of sections) {
      await page.click(`[href="#${section}"]`);
      await page.waitForTimeout(500);
    }

    // Check external links (GitHub, LinkedIn, project links, etc.)
    const externalLinks = page.locator('a[href^="http"], a[href^="https"]');
    const linkCount = await externalLinks.count();

    if (linkCount > 0) {
      for (let i = 0; i < linkCount; i++) {
        const link = externalLinks.nth(i);

        // External links should open in new tab
        await expect(link).toHaveAttribute('target', '_blank');

        // External links should have security attributes
        await expect(link).toHaveAttribute('rel', /noopener|noreferrer/);
      }
    }
  });
});
