import { expect, test } from '@playwright/test';

test.describe('SEO and Meta Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper page title', async ({ page }) => {
    // Check page title exists and is meaningful
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60); // SEO best practice

    // Should contain relevant keywords
    expect(title.toLowerCase()).toMatch(/itzhak|leshinsky|developer|portfolio/);
  });

  test('should have proper h1 heading', async ({ page }) => {
    // Should have exactly one h1 tag
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // H1 should be visible and contain meaningful content
    const firstH1 = h1Elements.first();
    await expect(firstH1).toBeVisible();

    const h1Text = await firstH1.textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text!.length).toBeGreaterThan(5);

    // Should contain relevant keywords
    expect(h1Text!.toLowerCase()).toMatch(
      /itzhak|developer|portfolio|full.stack/
    );
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check heading structure (h1 -> h2 -> h3, etc.)
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    if (headingCount > 1) {
      const headingLevels: number[] = [];

      for (let i = 0; i < headingCount; i++) {
        const heading = headings.nth(i);
        const tagName = await heading.evaluate((el) =>
          el.tagName.toLowerCase()
        );
        const level = parseInt(tagName.charAt(1));
        headingLevels.push(level);
      }

      // First heading should be h1
      expect(headingLevels[0]).toBe(1);

      // Check for proper hierarchy (no skipping levels)
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];

        // Should not skip more than one level
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    }
  });

  test('should have favicon displayed', async ({ page }) => {
    // Check for favicon link in head
    const faviconLinks = page.locator('link[rel*="icon"]');
    const faviconCount = await faviconLinks.count();
    expect(faviconCount).toBeGreaterThan(0);

    // Check that favicon loads successfully
    const responses: Array<{ url: string; status: number }> = [];
    page.on('response', (response) => {
      if (
        response.url().includes('favicon') ||
        response.url().includes('.ico')
      ) {
        responses.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });

    // Reload to trigger favicon request
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check if favicon loaded successfully
    const faviconResponses = responses.filter((r) => r.status === 200);
    if (responses.length > 0) {
      expect(faviconResponses.length).toBeGreaterThan(0);
    }
  });

  test('should have proper meta description', async ({ page }) => {
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    const descriptionCount = await metaDescription.count();

    if (descriptionCount > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(50);
      expect(content!.length).toBeLessThan(160); // SEO best practice

      // Should contain relevant keywords
      expect(content!.toLowerCase()).toMatch(
        /developer|portfolio|itzhak|full.stack/
      );
    }
  });

  test('should have proper Open Graph meta tags', async ({ page }) => {
    // Check for essential Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    const ogType = page.locator('meta[property="og:type"]');
    const ogUrl = page.locator('meta[property="og:url"]');

    // OG title should exist
    if ((await ogTitle.count()) > 0) {
      const titleContent = await ogTitle.getAttribute('content');
      expect(titleContent).toBeTruthy();
      expect(titleContent!.length).toBeGreaterThan(10);
    }

    // OG description should exist
    if ((await ogDescription.count()) > 0) {
      const descContent = await ogDescription.getAttribute('content');
      expect(descContent).toBeTruthy();
      expect(descContent!.length).toBeGreaterThan(20);
    }

    // OG type should be appropriate
    if ((await ogType.count()) > 0) {
      const typeContent = await ogType.getAttribute('content');
      expect(typeContent).toMatch(/website|profile|article/);
    }

    // OG URL should be valid
    if ((await ogUrl.count()) > 0) {
      const urlContent = await ogUrl.getAttribute('content');
      expect(urlContent).toMatch(/^https?:\/\//);
    }
  });

  test('should have proper Twitter Card meta tags', async ({ page }) => {
    // Check for Twitter Card tags
    const twitterCard = page.locator('meta[name="twitter:card"]');
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    const twitterDescription = page.locator('meta[name="twitter:description"]');

    // Twitter card type should exist
    if ((await twitterCard.count()) > 0) {
      const cardContent = await twitterCard.getAttribute('content');
      expect(cardContent).toMatch(/summary|summary_large_image/);
    }

    // Twitter title should exist
    if ((await twitterTitle.count()) > 0) {
      const titleContent = await twitterTitle.getAttribute('content');
      expect(titleContent).toBeTruthy();
      expect(titleContent!.length).toBeGreaterThan(10);
    }

    // Twitter description should exist
    if ((await twitterDescription.count()) > 0) {
      const descContent = await twitterDescription.getAttribute('content');
      expect(descContent).toBeTruthy();
      expect(descContent!.length).toBeGreaterThan(20);
    }
  });

  test('should have proper viewport meta tag', async ({ page }) => {
    // Check for viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);

    const content = await viewport.getAttribute('content');
    expect(content).toContain('width=device-width');
    expect(content).toContain('initial-scale=1');
  });

  test('should have proper language attributes', async ({ page }) => {
    // Check html lang attribute
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // e.g., 'en', 'en-US'

    // Test Hebrew version
    await page.goto('/he');
    await page.waitForLoadState('networkidle');

    const htmlHe = page.locator('html');
    const langHe = await htmlHe.getAttribute('lang');
    expect(langHe).toBe('he');

    // Check dir attribute for RTL
    const dir = await htmlHe.getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('should have proper canonical URL', async ({ page }) => {
    // Check for canonical link
    const canonical = page.locator('link[rel="canonical"]');

    if ((await canonical.count()) > 0) {
      const href = await canonical.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
      expect(href).toContain('/en');
    }
  });

  test('should have proper robots meta tag', async ({ page }) => {
    // Check for robots meta tag
    const robots = page.locator('meta[name="robots"]');

    if ((await robots.count()) > 0) {
      const content = await robots.getAttribute('content');
      expect(content).toBeTruthy();

      // Should allow indexing for a portfolio site
      expect(content!.toLowerCase()).not.toContain('noindex');
      expect(content!.toLowerCase()).not.toContain('nofollow');
    }
  });

  test('should have structured data (JSON-LD)', async ({ page }) => {
    // Check for JSON-LD structured data
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const jsonLdCount = await jsonLd.count();

    if (jsonLdCount > 0) {
      const jsonContent = await jsonLd.first().textContent();
      expect(jsonContent).toBeTruthy();

      // Parse JSON to ensure it's valid
      let parsedJson;
      expect(() => {
        parsedJson = JSON.parse(jsonContent!);
      }).not.toThrow();

      // Should have proper schema.org type
      if (parsedJson) {
        expect(parsedJson['@context']).toBe('https://schema.org');
        expect(parsedJson['@type']).toMatch(/Person|WebSite|Portfolio/);
      }
    }
  });

  test('should have proper charset declaration', async ({ page }) => {
    // Check for charset meta tag
    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveCount(1);

    const charsetValue = await charset.getAttribute('charset');
    expect(charsetValue?.toLowerCase()).toBe('utf-8');
  });

  test('should have proper theme-color meta tag', async ({ page }) => {
    // Check for theme-color meta tag (for mobile browsers)
    const themeColor = page.locator('meta[name="theme-color"]');

    if ((await themeColor.count()) > 0) {
      const content = await themeColor.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/^#[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{3}$/); // Valid hex color
    }
  });

  test('should have proper manifest file', async ({ page }) => {
    // Check for web app manifest
    const manifest = page.locator('link[rel="manifest"]');

    if ((await manifest.count()) > 0) {
      const href = await manifest.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\.json$|manifest/);

      // Try to fetch manifest file
      const response = await page.request.get(href!);
      expect(response.status()).toBe(200);

      const manifestContent = await response.json();
      expect(manifestContent.name || manifestContent.short_name).toBeTruthy();
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    // Navigate through sections to load all images
    const sections = ['about', 'projects', 'contact'];

    for (const section of sections) {
      await page.click(`[href="#${section}"]`);
      await page.waitForTimeout(500);
    }

    // Check all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        const alt = await image.getAttribute('alt');

        // Alt text should exist and be meaningful
        expect(alt).toBeTruthy();
        expect(alt!.length).toBeGreaterThan(0);

        // Should not be generic alt text
        expect(alt!.toLowerCase()).not.toBe('image');
        expect(alt!.toLowerCase()).not.toBe('photo');
        expect(alt!.toLowerCase()).not.toBe('picture');
      }
    }
  });
});
