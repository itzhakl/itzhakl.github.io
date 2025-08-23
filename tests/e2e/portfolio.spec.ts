import { expect, test } from '@playwright/test';

test.describe('Portfolio Website E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Itzhak Leshinsky/);

    // Check main content is visible
    await expect(page.locator('main')).toBeVisible();

    // Check hero section
    await expect(page.locator('text=Hi there 👋')).toBeVisible();
    await expect(page.locator('text=Full-Stack Developer')).toBeVisible();
  });

  test('should navigate through all sections', async ({ page }) => {
    // Test navigation links
    const sections = ['about', 'stack', 'projects', 'experience', 'contact'];

    for (const section of sections) {
      await page.click(`[href="#${section}"]`);
      await page.waitForTimeout(1000); // Wait for smooth scroll

      // Check if section is in viewport
      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeInViewport();
    }
  });

  test('should switch languages correctly', async ({ page }) => {
    // Find and click language toggle
    const languageToggle = page
      .locator('[aria-label*="language"], [data-testid="language-toggle"]')
      .first();
    await languageToggle.click();

    // Wait for navigation to Hebrew version
    await page.waitForURL('/he');

    // Check Hebrew content is displayed
    await expect(page.locator('text=איציק לשינסקי')).toBeVisible();
    await expect(page.locator('text=מפתח פול סטאק')).toBeVisible();

    // Check RTL direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');

    // Switch back to English
    await languageToggle.click();
    await page.waitForURL('/en');

    // Check English content is restored
    await expect(page.locator('text=Itzhak Leshinsky')).toBeVisible();
    await expect(html).toHaveAttribute('dir', 'ltr');
  });

  test('should display all project cards', async ({ page }) => {
    // Navigate to projects section
    await page.click('[href="#projects"]');
    await page.waitForTimeout(1000);

    // Check project cards are visible
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards).toHaveCount(3); // AI Fitness Coach, Anonymous Chat Bot, GIS Tools

    // Check specific projects
    await expect(page.locator('text=AI Fitness Coach')).toBeVisible();
    await expect(page.locator('text=Anonymous Chat Bot')).toBeVisible();
    await expect(page.locator('text=Interactive GIS Tools')).toBeVisible();
  });

  test('should handle external links correctly', async ({ page }) => {
    // Test social media links in hero section
    const githubLink = page.locator('a[href*="github.com/itzhakl"]').first();
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = page
      .locator('a[href*="linkedin.com/in/itzhak-leshinsky"]')
      .first();
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile navigation
    await expect(page.locator('nav')).toBeVisible();

    // Check content is properly displayed on mobile
    await expect(page.locator('text=Hi there 👋')).toBeVisible();

    // Test mobile scrolling through sections
    await page.click('[href="#projects"]');
    await page.waitForTimeout(1000);

    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport();
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check skip link
    const skipLink = page.locator('text=Skip to main content').first();
    await expect(skipLink).toBeHidden(); // Should be visually hidden initially

    // Focus skip link with keyboard
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeVisible();

    // Check main landmark
    await expect(page.locator('main')).toBeVisible();

    // Check navigation landmark
    await expect(page.locator('nav')).toBeVisible();

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should load images optimally', async ({ page }) => {
    // Navigate to projects section
    await page.click('[href="#projects"]');
    await page.waitForTimeout(1000);

    // Check project images are loaded
    const projectImages = page.locator(
      'img[alt*="project"], img[alt*="Project"]'
    );
    const imageCount = await projectImages.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const image = projectImages.nth(i);
        await expect(image).toBeVisible();

        // Check image has proper alt text
        const altText = await image.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should handle contact form interactions', async ({ page }) => {
    // Navigate to contact section
    await page.click('[href="#contact"]');
    await page.waitForTimeout(1000);

    // Check contact buttons are present
    const contactButtons = page.locator('[data-testid="contact-button"]');
    const buttonCount = await contactButtons.count();

    if (buttonCount > 0) {
      // Test WhatsApp button
      const whatsappButton = page.locator('a[href*="wa.me"]').first();
      if ((await whatsappButton.count()) > 0) {
        await expect(whatsappButton).toHaveAttribute('target', '_blank');
      }

      // Test email button
      const emailButton = page.locator('a[href^="mailto:"]').first();
      if ((await emailButton.count()) > 0) {
        await expect(emailButton).toHaveAttribute(
          'href',
          'mailto:itzhak.lesh@gmail.com'
        );
      }
    }
  });

  test('should display timeline correctly', async ({ page }) => {
    // Navigate to about/timeline section
    await page.click('[href="#about"]');
    await page.waitForTimeout(1000);

    // Check timeline items are visible
    const timelineItems = page.locator('[data-testid="timeline-item"]');
    const itemCount = await timelineItems.count();

    if (itemCount > 0) {
      // Check specific timeline entries
      await expect(page.locator('text=2024')).toBeVisible();
      await expect(page.locator('text=2023')).toBeVisible();
      await expect(page.locator('text=IDF')).toBeVisible();
    }
  });

  test('should show tech stack with proper categorization', async ({
    page,
  }) => {
    // Navigate to tech stack section
    await page.click('[href="#stack"]');
    await page.waitForTimeout(1000);

    // Check tech categories are visible
    await expect(page.locator('text=Frontend')).toBeVisible();
    await expect(page.locator('text=Backend')).toBeVisible();
    await expect(page.locator('text=GIS')).toBeVisible();

    // Check specific technologies
    await expect(page.locator('text=React')).toBeVisible();
    await expect(page.locator('text=Node.js')).toBeVisible();
    await expect(page.locator('text=Python')).toBeVisible();
  });
});
