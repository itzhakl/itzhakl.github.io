import { Page } from '@playwright/test';

// Helper function to navigate to sections using the correct navigation method
export const navigateToSection = async (page: Page, sectionId: string) => {
  const sectionMap: Record<string, string> = {
    hero: 'Home',
    about: 'About',
    timeline: 'Timeline',
    stack: 'Stack',
    projects: 'Projects',
    experience: 'Experience',
    personal: 'Personal',
    contact: 'Contact',
  };

  const buttonText = sectionMap[sectionId];
  if (buttonText) {
    // Check if we're on mobile (viewport width < 768px)
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize && viewportSize.width < 768;

    if (isMobile) {
      // Open mobile menu first if not already open
      const mobileMenu = page.locator('nav div.md\\:hidden div.mt-2');
      const isMenuOpen = await mobileMenu.isVisible();

      if (!isMenuOpen) {
        const menuToggle = page.locator('button:has-text("☰")');
        if ((await menuToggle.count()) > 0 && (await menuToggle.isVisible())) {
          await menuToggle.click();
          await page.waitForTimeout(500);
        }
      }

      // Click navigation button in mobile menu
      const mobileNavButton = page.locator(
        `nav .md\\:hidden button:has-text("${buttonText}")`
      );
      if ((await mobileNavButton.count()) > 0) {
        await mobileNavButton.click();
        return;
      }
    } else {
      // Use desktop navigation
      const desktopNavButton = page.locator(
        `nav .hidden.md\\:flex button:has-text("${buttonText}")`
      );
      if (
        (await desktopNavButton.count()) > 0 &&
        (await desktopNavButton.isVisible())
      ) {
        await desktopNavButton.click();
        return;
      }
    }

    // Try any navigation button with the text as fallback
    const anyNavButton = page.locator(`nav button:has-text("${buttonText}")`);
    if ((await anyNavButton.count()) > 0) {
      const visibleButton = anyNavButton.first();
      if (await visibleButton.isVisible()) {
        await visibleButton.click();
        return;
      }
    }
  }

  // Fallback: try to scroll to section directly
  await page.evaluate((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, sectionId);
};

// Helper to wait for section to be in viewport
export const waitForSectionInView = async (
  page: Page,
  sectionId: string,
  timeout = 5000
) => {
  await page.waitForFunction(
    (id) => {
      const element = document.getElementById(id);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    },
    sectionId,
    { timeout }
  );
};
