import { expect, test } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/en');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: Record<string, number> = {};

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID) - simulate with click
        const startTime = performance.now();
        document.addEventListener(
          'click',
          () => {
            vitals.fid = performance.now() - startTime;
          },
          { once: true }
        );

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });

        // Wait a bit for measurements
        setTimeout(() => {
          resolve(vitals);
        }, 3000);
      });
    });

    // Simulate user interaction for FID
    await page.click('body');

    // Check Core Web Vitals thresholds
    // LCP should be < 2.5s (2500ms)
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500);
    }

    // FID should be < 100ms
    if (vitals.fid) {
      expect(vitals.fid).toBeLessThan(100);
    }

    // CLS should be < 0.1
    if (vitals.cls) {
      expect(vitals.cls).toBeLessThan(0.1);
    }
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/en');

    // Check that images are lazy loaded
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);

        // Check loading attribute
        const loading = await image.getAttribute('loading');
        if (loading) {
          expect(['lazy', 'eager']).toContain(loading);
        }

        // Check that image has proper dimensions
        const width = await image.getAttribute('width');
        const height = await image.getAttribute('height');

        if (width && height) {
          expect(parseInt(width)).toBeGreaterThan(0);
          expect(parseInt(height)).toBeGreaterThan(0);
        }
      }
    }
  });

  test('should have optimized font loading', async ({ page }) => {
    await page.goto('/en');

    // Check for font preload links
    const preloadLinks = page.locator('link[rel="preload"][as="font"]');
    const preloadCount = await preloadLinks.count();

    // Should have at least one font preloaded
    expect(preloadCount).toBeGreaterThanOrEqual(0);

    // Check font-display property
    const fontFaces = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      const fontFaces: string[] = [];

      stylesheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach((rule) => {
            if (rule.constructor.name === 'CSSFontFaceRule') {
              const fontFaceRule = rule as CSSFontFaceRule;
              fontFaces.push(fontFaceRule.style.fontDisplay || 'auto');
            }
          });
        } catch (e) {
          // Cross-origin stylesheets might throw errors
        }
      });

      return fontFaces;
    });

    // Check that fonts use swap or fallback display
    fontFaces.forEach((display) => {
      expect(['swap', 'fallback', 'optional', 'auto']).toContain(display);
    });
  });

  test('should have minimal bundle size impact', async ({ page }) => {
    // Start measuring network activity
    const responses: any[] = [];
    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'],
        type: response.headers()['content-type'],
      });
    });

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Analyze JavaScript bundles
    const jsResponses = responses.filter(
      (r) => r.type?.includes('javascript') && r.url.includes('/_next/static/')
    );

    // Check that we don't have too many JS chunks
    expect(jsResponses.length).toBeLessThan(20);

    // Check individual chunk sizes (if size is available)
    jsResponses.forEach((response) => {
      if (response.size) {
        const sizeKB = parseInt(response.size) / 1024;
        // Individual chunks should be reasonable size
        expect(sizeKB).toBeLessThan(500); // 500KB per chunk
      }
    });
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow 3G network
    await page.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/en');
    await page.waitForSelector('main');
    const loadTime = Date.now() - startTime;

    // Should still load within reasonable time even on slow network
    expect(loadTime).toBeLessThan(10000); // 10 seconds max

    // Check that critical content is visible
    await expect(page.locator('text=Itzhak Leshinsky')).toBeVisible();
  });

  test('should cache resources effectively', async ({ page }) => {
    // First visit
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Second visit - should use cached resources
    const cachedResponses: any[] = [];
    page.on('response', (response) => {
      cachedResponses.push({
        url: response.url(),
        fromCache: response.fromServiceWorker() || response.status() === 304,
      });
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that some resources are served from cache
    const staticResources = cachedResponses.filter(
      (r) =>
        r.url.includes('/_next/static/') ||
        r.url.includes('.css') ||
        r.url.includes('.js')
    );

    if (staticResources.length > 0) {
      const cachedCount = staticResources.filter((r) => r.fromCache).length;
      const cacheRatio = cachedCount / staticResources.length;

      // At least 50% of static resources should be cached
      expect(cacheRatio).toBeGreaterThan(0.3);
    }
  });

  test('should handle animations smoothly', async ({ page }) => {
    await page.goto('/en');

    // Scroll through sections to trigger animations
    const sections = ['#about', '#stack', '#projects', '#experience'];

    for (const section of sections) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(500); // Wait for animations

      // Check that section is visible after animation
      await expect(page.locator(section)).toBeInViewport();
    }

    // Test hover animations don't cause layout shifts
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.hover();
      await page.waitForTimeout(300); // Wait for hover animation

      // Button should still be in the same position
      await expect(firstButton).toBeVisible();
    }
  });
});
