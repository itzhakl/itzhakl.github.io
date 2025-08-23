import { chromium, FullConfig } from '@playwright/test';

const globalSetup = async (config: FullConfig) => {
  const { baseURL } = config.projects[0].use;

  if (!baseURL) {
    throw new Error('baseURL is not defined in playwright config');
  }

  // Launch browser to warm up the application
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the application to be ready
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');

    // Check if the main content is loaded
    await page.waitForSelector('main', { timeout: 30000 });

    console.log('✅ Application is ready for testing');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

export default globalSetup;
