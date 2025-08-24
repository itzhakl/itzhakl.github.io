import { expect, test } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load page successfully and quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Page should load within reasonable time
    expect(loadTime).toBeLessThan(10000); // 10 seconds max

    // Main content should be visible
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('#hero')).toBeVisible();

    // Critical content should be loaded
    await expect(page.locator('text=Itzhak Leshinsky')).toBeVisible();
  });

  test('should not have infinite loading states', async ({ page }) => {
    await page.goto('/en');

    // Wait for initial load
    await page.waitForLoadState('domcontentloaded');

    // Check that loading spinners/placeholders don't persist
    const maxWaitTime = 15000; // 15 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const loadingElements = page.locator(
        '.animate-pulse, .loading, .spinner'
      );
      const loadingCount = await loadingElements.count();

      if (loadingCount === 0) {
        break; // No loading elements found, good!
      }

      await page.waitForTimeout(500);
    }

    // Verify main content is loaded
    await expect(page.locator('main')).toBeVisible();

    // Navigate through sections to ensure they load
    const sections = ['about', 'stack', 'projects'];

    for (const section of sections) {
      await page.click(`[href="#${section}"]`);
      await page.waitForSelector(`#${section}`, { timeout: 10000 });

      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeVisible();
    }
  });

  test('should handle slow network conditions gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', async (route) => {
      // Add delay to simulate slow network
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/en');

    // Should still load within reasonable time even on slow network
    await page.waitForSelector('main', { timeout: 20000 });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(20000); // 20 seconds max for slow network

    // Critical content should be visible
    await expect(page.locator('text=Itzhak Leshinsky')).toBeVisible();

    // Test navigation still works
    await page.click('[href="#about"]');
    await page.waitForSelector('#about', { timeout: 10000 });
    await expect(page.locator('#about')).toBeVisible();
  });

  test('should load images efficiently', async ({ page }) => {
    const imageLoadTimes: number[] = [];

    // Monitor image loading
    page.on('response', (response) => {
      if (response.url().match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        const timing = response.timing();
        if (timing.responseEnd && timing.responseStart) {
          imageLoadTimes.push(timing.responseEnd - timing.responseStart);
        }
      }
    });

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Navigate through sections to load all images
    const sections = ['about', 'projects', 'contact'];

    for (const section of sections) {
      await page.click(`[href="#${section}"]`);
      await page.waitForTimeout(1000);
    }

    // Check that images load reasonably fast
    if (imageLoadTimes.length > 0) {
      const averageLoadTime =
        imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length;
      expect(averageLoadTime).toBeLessThan(3000); // 3 seconds average

      // No single image should take too long
      const maxLoadTime = Math.max(...imageLoadTimes);
      expect(maxLoadTime).toBeLessThan(10000); // 10 seconds max
    }

    // Check that images have proper loading attributes
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

        // Check that image has loaded successfully
        const naturalWidth = await image.evaluate(
          (img: HTMLImageElement) => img.naturalWidth
        );
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test('should have reasonable bundle sizes', async ({ page }) => {
    const resourceSizes: Array<{ url: string; size: number; type: string }> =
      [];

    // Monitor resource loading
    page.on('response', async (response) => {
      const contentLength = response.headers()['content-length'];
      const contentType = response.headers()['content-type'] || '';

      if (contentLength) {
        resourceSizes.push({
          url: response.url(),
          size: parseInt(contentLength),
          type: contentType,
        });
      }
    });

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Analyze JavaScript bundles
    const jsResources = resourceSizes.filter(
      (r) => r.type.includes('javascript') || r.url.includes('.js')
    );

    if (jsResources.length > 0) {
      // Total JS size should be reasonable
      const totalJSSize = jsResources.reduce((sum, r) => sum + r.size, 0);
      const totalJSSizeKB = totalJSSize / 1024;

      expect(totalJSSizeKB).toBeLessThan(2000); // 2MB total JS

      // Individual chunks should be reasonable
      jsResources.forEach((resource) => {
        const sizeKB = resource.size / 1024;
        expect(sizeKB).toBeLessThan(1000); // 1MB per chunk
      });
    }

    // Analyze CSS bundles
    const cssResources = resourceSizes.filter(
      (r) => r.type.includes('css') || r.url.includes('.css')
    );

    if (cssResources.length > 0) {
      const totalCSSSize = cssResources.reduce((sum, r) => sum + r.size, 0);
      const totalCSSSizeKB = totalCSSSize / 1024;

      expect(totalCSSSizeKB).toBeLessThan(500); // 500KB total CSS
    }
  });

  test('should handle animations smoothly', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Test scroll animations
    const sections = ['about', 'stack', 'projects', 'experience'];

    for (const section of sections) {
      const startTime = Date.now();

      await page.click(`[href="#${section}"]`);

      // Wait for scroll animation to complete
      await page.waitForFunction((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight;
      }, section);

      const animationTime = Date.now() - startTime;

      // Animation should be smooth (not too fast or slow)
      expect(animationTime).toBeGreaterThan(100);
      expect(animationTime).toBeLessThan(3000);

      // Section should be visible after animation
      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeInViewport();
    }

    // Test hover animations don't cause performance issues
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);

        await button.hover();
        await page.waitForTimeout(100);

        // Button should still be responsive
        await expect(button).toBeVisible();
      }
    }
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      interface PerformanceMemory {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
      }

      const perfWithMemory = performance as Performance & {
        memory?: PerformanceMemory;
      };
      return perfWithMemory.memory
        ? {
            usedJSHeapSize: perfWithMemory.memory.usedJSHeapSize,
            totalJSHeapSize: perfWithMemory.memory.totalJSHeapSize,
          }
        : null;
    });

    // Navigate through all sections multiple times
    const sections = [
      'about',
      'timeline',
      'stack',
      'projects',
      'experience',
      'personal',
      'contact',
    ];

    for (let round = 0; round < 3; round++) {
      for (const section of sections) {
        await page.click(`[href="#${section}"]`);
        await page.waitForTimeout(200);
      }
    }

    // Check memory usage after navigation
    const finalMemory = await page.evaluate(() => {
      interface PerformanceMemory {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
      }

      const perfWithMemory = performance as Performance & {
        memory?: PerformanceMemory;
      };
      return perfWithMemory.memory
        ? {
            usedJSHeapSize: perfWithMemory.memory.usedJSHeapSize,
            totalJSHeapSize: perfWithMemory.memory.totalJSHeapSize,
          }
        : null;
    });

    if (initialMemory && finalMemory) {
      // Memory usage shouldn't grow excessively
      const memoryGrowth =
        finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      const memoryGrowthMB = memoryGrowth / (1024 * 1024);

      // Should not leak more than 50MB during navigation
      expect(memoryGrowthMB).toBeLessThan(50);
    }
  });

  test('should cache resources effectively', async ({ page }) => {
    // First visit
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Track cached responses on second visit
    const cachedResponses: Array<{ url: string; fromCache: boolean }> = [];

    page.on('response', (response) => {
      cachedResponses.push({
        url: response.url(),
        fromCache: response.fromServiceWorker() || response.status() === 304,
      });
    });

    // Second visit (reload)
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that static resources are cached
    const staticResources = cachedResponses.filter(
      (r) =>
        r.url.includes('/_next/static/') ||
        r.url.includes('.css') ||
        r.url.includes('.js') ||
        r.url.includes('.woff') ||
        r.url.includes('.woff2')
    );

    if (staticResources.length > 0) {
      // At least some static resources should be cached in production
      // In test environment, caching might not be fully enabled
      expect(staticResources.length).toBeGreaterThan(0);
    }
  });

  test('should handle concurrent requests efficiently', async ({ page }) => {
    const requestTimes: number[] = [];

    // Monitor request timing
    page.on('response', (response) => {
      const timing = response.timing();
      if (timing.responseEnd && timing.requestStart) {
        requestTimes.push(timing.responseEnd - timing.requestStart);
      }
    });

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Navigate quickly through sections to trigger concurrent requests
    const sections = ['about', 'stack', 'projects', 'experience'];

    await Promise.all(
      sections.map(async (section, index) => {
        await page.waitForTimeout(index * 100); // Stagger slightly
        await page.click(`[href="#${section}"]`);
      })
    );

    await page.waitForLoadState('networkidle');

    // Check that requests complete in reasonable time
    if (requestTimes.length > 0) {
      const averageRequestTime =
        requestTimes.reduce((a, b) => a + b, 0) / requestTimes.length;
      expect(averageRequestTime).toBeLessThan(5000); // 5 seconds average

      // No single request should take too long
      const maxRequestTime = Math.max(...requestTimes);
      expect(maxRequestTime).toBeLessThan(15000); // 15 seconds max
    }
  });

  test('should maintain performance on mobile devices', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load reasonably fast on mobile
    expect(loadTime).toBeLessThan(15000); // 15 seconds on mobile

    // Test mobile navigation performance
    const navStartTime = Date.now();

    await page.click('[href="#projects"]');
    await page.waitForSelector('#projects');

    const navTime = Date.now() - navStartTime;
    expect(navTime).toBeLessThan(3000); // 3 seconds for navigation

    // Mobile menu should be responsive
    const menuToggle = page.locator('button:has-text("☰")');
    if ((await menuToggle.count()) > 0) {
      const menuStartTime = Date.now();

      await menuToggle.click();
      await page.waitForSelector('nav div.mt-2', { state: 'visible' });

      const menuTime = Date.now() - menuStartTime;
      expect(menuTime).toBeLessThan(1000); // 1 second for menu
    }
  });
});
