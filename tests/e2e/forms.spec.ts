import { expect, test } from '@playwright/test';

test.describe('Forms Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Navigate to contact section where forms are likely located
    await page.click('[href="#contact"]');
    await page.waitForTimeout(1000);
  });

  test('should handle contact form if present', async ({ page }) => {
    // Check if there's a contact form on the page
    const contactForm = page.locator('form');
    const formCount = await contactForm.count();

    if (formCount > 0) {
      // Test form inputs
      const nameInput = page.locator(
        'input[name="name"], input[placeholder*="name" i]'
      );
      const emailInput = page.locator(
        'input[name="email"], input[type="email"], input[placeholder*="email" i]'
      );
      const messageInput = page.locator(
        'textarea[name="message"], textarea[placeholder*="message" i]'
      );
      const submitButton = page.locator(
        'button[type="submit"], input[type="submit"]'
      );

      // Test name input if present
      if ((await nameInput.count()) > 0) {
        await nameInput.fill('John Doe');
        await expect(nameInput).toHaveValue('John Doe');
      }

      // Test email input if present
      if ((await emailInput.count()) > 0) {
        await emailInput.fill('john.doe@example.com');
        await expect(emailInput).toHaveValue('john.doe@example.com');
      }

      // Test message input if present
      if ((await messageInput.count()) > 0) {
        await messageInput.fill('This is a test message for the contact form.');
        await expect(messageInput).toHaveValue(
          'This is a test message for the contact form.'
        );
      }

      // Test form submission if submit button exists
      if ((await submitButton.count()) > 0) {
        // Note: We don't actually submit to avoid sending test data
        await expect(submitButton).toBeVisible();
        await expect(submitButton).toBeEnabled();
      }
    } else {
      // If no form exists, check for alternative contact methods
      const contactButtons = page.locator(
        '[data-testid="contact-button"], a[href^="mailto:"], a[href*="wa.me"]'
      );
      const buttonCount = await contactButtons.count();

      // Should have some way to contact
      expect(buttonCount).toBeGreaterThan(0);
    }
  });

  test('should validate email format if email input exists', async ({
    page,
  }) => {
    const emailInput = page.locator(
      'input[type="email"], input[name="email"], input[placeholder*="email" i]'
    );

    if ((await emailInput.count()) > 0) {
      // Test invalid email format
      await emailInput.fill('invalid-email');

      // Check if browser validation kicks in
      const isValid = await emailInput.evaluate(
        (input: HTMLInputElement) => input.validity.valid
      );
      expect(isValid).toBeFalsy();

      // Test valid email format
      await emailInput.fill('valid@example.com');
      const isValidNow = await emailInput.evaluate(
        (input: HTMLInputElement) => input.validity.valid
      );
      expect(isValidNow).toBeTruthy();
    }
  });

  test('should handle required fields validation if form exists', async ({
    page,
  }) => {
    const contactForm = page.locator('form');

    if ((await contactForm.count()) > 0) {
      const requiredInputs = page.locator(
        'input[required], textarea[required]'
      );
      const requiredCount = await requiredInputs.count();

      if (requiredCount > 0) {
        // Try to submit form without filling required fields
        const submitButton = page.locator(
          'button[type="submit"], input[type="submit"]'
        );

        if ((await submitButton.count()) > 0) {
          await submitButton.click();

          // Check if validation messages appear or form doesn't submit
          const firstRequiredInput = requiredInputs.first();
          const isValid = await firstRequiredInput.evaluate(
            (input: HTMLInputElement) => input.validity.valid
          );
          expect(isValid).toBeFalsy();
        }
      }
    }
  });

  test('should handle contact buttons and links', async ({ page }) => {
    // Test email contact button/link
    const emailLink = page.locator('a[href^="mailto:"]');
    if ((await emailLink.count()) > 0) {
      const href = await emailLink.getAttribute('href');
      expect(href).toContain('mailto:');
      expect(href).toContain('@');

      // Should be visible and clickable
      await expect(emailLink).toBeVisible();
    }

    // Test WhatsApp contact button/link
    const whatsappLink = page.locator('a[href*="wa.me"], a[href*="whatsapp"]');
    if ((await whatsappLink.count()) > 0) {
      const href = await whatsappLink.getAttribute('href');
      expect(href).toMatch(/wa\.me|whatsapp/);

      // Should open in new tab
      await expect(whatsappLink).toHaveAttribute('target', '_blank');
      await expect(whatsappLink).toBeVisible();
    }

    // Test phone contact button/link
    const phoneLink = page.locator('a[href^="tel:"]');
    if ((await phoneLink.count()) > 0) {
      const href = await phoneLink.getAttribute('href');
      expect(href).toContain('tel:');

      await expect(phoneLink).toBeVisible();
    }

    // Test general contact buttons
    const contactButtons = page.locator('[data-testid="contact-button"]');
    const buttonCount = await contactButtons.count();

    if (buttonCount > 0) {
      for (let i = 0; i < buttonCount; i++) {
        const button = contactButtons.nth(i);
        await expect(button).toBeVisible();

        // Button should be interactive
        await expect(button).toBeEnabled();
      }
    }
  });

  test('should handle form accessibility if form exists', async ({ page }) => {
    const contactForm = page.locator('form');

    if ((await contactForm.count()) > 0) {
      // Check form has proper labels
      const inputs = page.locator('form input, form textarea');
      const inputCount = await inputs.count();

      if (inputCount > 0) {
        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);

          // Input should have label, aria-label, or placeholder
          const hasLabel = await input.evaluate((el) => {
            const id = el.id;
            const ariaLabel = el.getAttribute('aria-label');
            const placeholder = el.getAttribute('placeholder');
            const label = id
              ? document.querySelector(`label[for="${id}"]`)
              : null;

            return !!(label || ariaLabel || placeholder);
          });

          expect(hasLabel).toBeTruthy();
        }
      }

      // Check form has proper ARIA attributes
      const formRole = await contactForm.getAttribute('role');
      const formAriaLabel = await contactForm.getAttribute('aria-label');
      const formAriaLabelledby =
        await contactForm.getAttribute('aria-labelledby');

      // Form should have some accessibility identifier
      const hasAccessibilityId =
        formRole === 'form' || formAriaLabel || formAriaLabelledby;
      if (inputCount > 0) {
        expect(hasAccessibilityId).toBeTruthy();
      }
    }
  });

  test('should handle form keyboard navigation if form exists', async ({
    page,
  }) => {
    const contactForm = page.locator('form');

    if ((await contactForm.count()) > 0) {
      const inputs = page.locator('form input, form textarea, form button');
      const inputCount = await inputs.count();

      if (inputCount > 1) {
        // Focus first input
        await inputs.first().focus();
        await expect(inputs.first()).toBeFocused();

        // Tab through inputs
        for (let i = 1; i < Math.min(inputCount, 4); i++) {
          await page.keyboard.press('Tab');
          await expect(inputs.nth(i)).toBeFocused();
        }
      }
    }
  });

  test('should handle form error states if form exists', async ({ page }) => {
    const contactForm = page.locator('form');

    if ((await contactForm.count()) > 0) {
      const emailInput = page.locator('input[type="email"]');

      if ((await emailInput.count()) > 0) {
        // Enter invalid email
        await emailInput.fill('invalid-email');
        await emailInput.blur();

        // Check for error styling or messages
        const hasErrorClass = await emailInput.evaluate((el) => {
          const classList = Array.from(el.classList);
          return classList.some(
            (cls) =>
              cls.includes('error') ||
              cls.includes('invalid') ||
              cls.includes('danger') ||
              cls.includes('red')
          );
        });

        const errorMessage = page.locator(
          '[role="alert"], .error-message, .invalid-feedback'
        );
        const hasErrorMessage = (await errorMessage.count()) > 0;

        // Should have some form of error indication
        if (!hasErrorClass && !hasErrorMessage) {
          // At minimum, browser validation should make field invalid
          const isValid = await emailInput.evaluate(
            (input: HTMLInputElement) => input.validity.valid
          );
          expect(isValid).toBeFalsy();
        }
      }
    }
  });

  test('should handle form submission feedback if form exists', async ({
    page,
  }) => {
    const contactForm = page.locator('form');

    if ((await contactForm.count()) > 0) {
      // Fill out form with valid data
      const nameInput = page.locator(
        'input[name="name"], input[placeholder*="name" i]'
      );
      const emailInput = page.locator(
        'input[type="email"], input[name="email"]'
      );
      const messageInput = page.locator('textarea');

      if ((await nameInput.count()) > 0) {
        await nameInput.fill('Test User');
      }

      if ((await emailInput.count()) > 0) {
        await emailInput.fill('test@example.com');
      }

      if ((await messageInput.count()) > 0) {
        await messageInput.fill('This is a test message.');
      }

      const submitButton = page.locator(
        'button[type="submit"], input[type="submit"]'
      );

      if ((await submitButton.count()) > 0) {
        // Note: We don't actually submit to avoid sending test data
        // Just verify the button is ready for submission
        await expect(submitButton).toBeEnabled();

        // Check if button has proper text
        const buttonText = await submitButton.textContent();
        expect(buttonText?.toLowerCase()).toMatch(
          /send|submit|contact|message/
        );
      }
    }
  });
});
