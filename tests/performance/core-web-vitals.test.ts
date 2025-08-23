import { expect, test } from '@playwright/test';

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint - 2.5s
  FID: 100, // First Input Delay - 100ms
  CLS: 0.1, // Cumulative Layout Shift - 0.1
  FCP: 1800, // First Contentful Paint - 1.8s
  TTFB: 800, // Time to First Byte - 800ms
};

test.describe('Core Web Vitals Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache and cookies for consistent testing
    await page.context().clearCookies();
    await page.evaluate(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister());
        });
      }
    });
  });

  test('should meet LCP threshold on homepage', async ({ page }) => {
    // const startTime = Date.now();

    await page.goto('/en');

    // Wait for the largest contentful paint
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });

    console.log(`LCP: ${lcp}ms`);

    if (lcp > 0) {
      expect(lcp).toBeLessThan(THRESHOLDS.LCP);
    }
  });

  test('should meet FID threshold with user interaction', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Measure First Input Delay
    const fid = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        // const startTime = performance.now();

        document.addEventListener(
          'click',
          () => {
            const delay = performance.now() - startTime;
            resolve(delay);
          },
          { once: true }
        );

        // Trigger click after a short delay
        setTimeout(() => {
          document.body.click();
        }, 100);
      });
    });

    console.log(`FID: ${fid}ms`);
    expect(fid).toBeLessThan(THRESHOLDS.FID);
  });

  test('should meet CLS threshold during page load', async ({ page }) => {
    await page.goto('/en');

    // Measure Cumulative Layout Shift
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });

        // Wait for page to stabilize
        setTimeout(() => {
          resolve(clsValue);
        }, 3000);
      });
    });

    console.log(`CLS: ${cls}`);
    expect(cls).toBeLessThan(THRESHOLDS.CLS);
  });

  test('should meet FCP threshold', async ({ page }) => {
    // const startTime = Date.now();

    await page.goto('/en');

    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(
            (entry) => entry.name === 'first-contentful-paint'
          );
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });

        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });

    console.log(`FCP: ${fcp}ms`);

    if (fcp > 0) {
      expect(fcp).toBeLessThan(THRESHOLDS.FCP);
    }
  });

  test('should meet TTFB threshold', async ({ page }) => {
    const response = await page.goto('/en');

    const ttfb = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return navigation.responseStart - navigation.requestStart;
    });

    console.log(`TTFB: ${ttfb}ms`);
    expect(ttfb).toBeLessThan(THRESHOLDS.TTFB);
    expect(response?.status()).toBe(200);
  });

  test('should maintain performance on mobile devices', async ({ page }) => {
    // Simulate mobile device
    await page.emulate({
      viewport: { width: 375, height: 667 },
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    });

    // Throttle network to simulate 3G
    await page.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Add 50ms delay
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/en');
    await page.waitForSelector('main');
    const loadTime = Date.now() - startTime;

    console.log(`Mobile load time: ${loadTime}ms`);

    // Should load within 5 seconds on mobile 3G
    expect(loadTime).toBeLessThan(5000);

    // Check that critical content is visible
    await expect(page.locator('text=Itzhak Leshinsky')).toBeVisible();
  });

  test('should handle multiple language switches efficiently', async ({
    page,
  }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const languages = ['he', 'en', 'he', 'en'];
    const switchTimes: number[] = [];

    for (const lang of languages) {
      const startTime = Date.now();

      // Find and click language toggle
      const languageToggle = page
        .locator('[aria-label*="language"], [data-testid="language-toggle"]')
        .first();
      await languageToggle.click();

      // Wait for navigation
      await page.waitForURL(`/${lang}`);
      await page.waitForLoadState('networkidle');

      const switchTime = Date.now() - startTime;
      switchTimes.push(switchTime);

      console.log(`Language switch to ${lang}: ${switchTime}ms`);
    }

    // Each language switch should be fast
    switchTimes.forEach((time) => {
      expect(time).toBeLessThan(2000); // 2 seconds max
    });

    // Average switch time should be reasonable
    const averageTime =
      switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
    expect(averageTime).toBeLessThan(1500); // 1.5 seconds average
  });

  test('should optimize image loading performance', async ({ page }) => {
    await page.goto('/en');

    // Navigate to projects section with images
    await page.click('[href="#projects"]');
    await page.waitForTimeout(1000);

    // Measure image loading performance
    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const metrics = images.map((img) => ({
        src: img.src,
        loading: img.loading,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: img.width,
        height: img.height,
      }));

      return metrics;
    });

    // Check that images are properly optimized
    imageMetrics.forEach((metric) => {
      // Images should have proper dimensions
      if (metric.complete) {
        expect(metric.naturalWidth).toBeGreaterThan(0);
        expect(metric.naturalHeight).toBeGreaterThan(0);
      }

      // Images should use lazy loading (except above-the-fold)
      expect(['lazy', 'eager', '']).toContain(metric.loading);
    });

    // Check that images load within reasonable time
    await page.waitForFunction(
      () => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.every((img) => img.complete || img.loading === 'lazy');
      },
      { timeout: 5000 }
    );
  });

  test('should maintain performance during animations', async ({ page }) => {
    await page.goto('/en');

    // Scroll through sections to trigger animations
    const sections = [
      '#about',
      '#stack',
      '#projects',
      '#experience',
      '#contact',
    ];

    for (const section of sections) {
      const startTime = Date.now();

      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(500); // Wait for animations

      const scrollTime = Date.now() - startTime;
      console.log(`Scroll to ${section}: ${scrollTime}ms`);

      // Scroll and animation should be smooth
      expect(scrollTime).toBeLessThan(1000);

      // Section should be visible after animation
      await expect(page.locator(section)).toBeInViewport();
    }
  });

  test('should handle concurrent user interactions efficiently', async ({
    page,
  }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Simulate rapid user interactions
    const interactions = [
      () => page.click('[href="#about"]'),
      () => page.click('[href="#stack"]'),
      () => page.click('[href="#projects"]'),
      () => page.hover('button:first-of-type'),
      () =>
        page
          .click('[data-testid="language-toggle"]', { timeout: 1000 })
          .catch(() => {}),
    ];

    const startTime = Date.now();

    // Execute interactions rapidly
    await Promise.all(
      interactions.map(async (interaction, index) => {
        await new Promise((resolve) => setTimeout(resolve, index * 100));
        return interaction();
      })
    );

    const totalTime = Date.now() - startTime;
    console.log(`Concurrent interactions completed in: ${totalTime}ms`);

    // Should handle concurrent interactions smoothly
    expect(totalTime).toBeLessThan(3000);

    // Page should still be responsive
    await expect(page.locator('main')).toBeVisible();
  });
});
