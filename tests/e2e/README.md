# E2E Test Suite

This directory contains comprehensive end-to-end tests for the personal portfolio website using Playwright.

## Test Categories

### 1. Navigation Tests (`navigation.spec.ts`)

- ✅ Verify all navigation links work correctly
- ✅ Verify logo redirects to homepage
- ✅ Ensure no broken links (404 errors)
- ✅ Test anchor links and smooth scrolling
- ✅ Test mobile navigation menu
- ✅ Test language switching functionality

### 2. Content Tests (`content.spec.ts`)

- ✅ Verify all texts are displayed correctly
- ✅ Verify all images load and are not missing
- ✅ Verify all icons are displayed
- ✅ Ensure no console errors
- ✅ Test content in different languages
- ✅ Test dynamic content loading
- ✅ Verify external links have proper attributes

### 3. Responsiveness Tests (`responsiveness.spec.ts`)

- ✅ Test on multiple viewport sizes (desktop, tablet, mobile)
- ✅ Test mobile menu functionality
- ✅ Test orientation changes
- ✅ Test touch interactions
- ✅ Verify readability across screen sizes
- ✅ Test layout and spacing consistency

### 4. Forms Tests (`forms.spec.ts`)

- ✅ Test contact form functionality (if present)
- ✅ Test form validation (email format, required fields)
- ✅ Test contact buttons and links
- ✅ Test form accessibility
- ✅ Test keyboard navigation in forms
- ✅ Test error states and feedback

### 5. User Experience Tests (`user-experience.spec.ts`)

- ✅ Test smooth scrolling between sections
- ✅ Test anchor link functionality
- ✅ Test animations and interactions
- ✅ Test keyboard navigation
- ✅ Test focus management
- ✅ Test loading states
- ✅ Test error handling
- ✅ Test rapid navigation

### 6. SEO & Meta Tests (`seo-meta.spec.ts`)

- ✅ Verify proper page title and H1 tags
- ✅ Test heading hierarchy
- ✅ Verify favicon display
- ✅ Test meta descriptions
- ✅ Test Open Graph and Twitter Card tags
- ✅ Test viewport and language attributes
- ✅ Test structured data (JSON-LD)
- ✅ Test image alt text

### 7. Performance Tests (`performance.spec.ts`)

- ✅ Test page load speed
- ✅ Ensure no infinite loading states
- ✅ Test slow network conditions
- ✅ Test image loading efficiency
- ✅ Test bundle sizes
- ✅ Test animation performance
- ✅ Test memory usage
- ✅ Test resource caching
- ✅ Test mobile performance

## Running Tests

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Specific Test Categories

```bash
npm run test:e2e:navigation    # Navigation tests
npm run test:e2e:content       # Content tests
npm run test:e2e:responsive    # Responsiveness tests
npm run test:e2e:forms         # Forms tests
npm run test:e2e:ux           # User experience tests
npm run test:e2e:seo          # SEO and meta tests
npm run test:e2e:performance  # Performance tests
npm run test:e2e:smoke        # Quick smoke test
```

### Run Tests with UI

```bash
npm run test:e2e:ui
```

### Run Tests in Different Browsers

```bash
# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on mobile
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- Multiple browser support (Chrome, Firefox, Safari, Edge)
- Mobile device testing (Pixel 5, iPhone 12)
- Automatic server startup
- Screenshot and video recording on failure
- Trace collection for debugging

## Best Practices

1. **Arrow Functions Only**: All test functions use arrow function syntax
2. **Modular Structure**: Tests are organized by functionality
3. **Comprehensive Coverage**: Tests cover all major user flows
4. **Accessibility**: Tests include accessibility checks
5. **Performance**: Tests verify performance metrics
6. **Cross-browser**: Tests run on multiple browsers and devices
7. **Error Handling**: Tests handle edge cases and error states

## Debugging

### View Test Reports

```bash
npx playwright show-report
```

### Debug Specific Test

```bash
npx playwright test --debug tests/e2e/navigation.spec.ts
```

### Run Tests in Headed Mode

```bash
npx playwright test --headed
```

## CI/CD Integration

The tests are configured to run in CI environments with:

- Retry logic for flaky tests
- Parallel execution
- Multiple output formats (HTML, JSON, JUnit)
- Artifact collection (screenshots, videos, traces)

## Notes

- Tests use `page.waitForLoadState('networkidle')` to ensure content is fully loaded
- Dynamic imports are handled with appropriate timeouts
- Tests are designed to be resilient to timing issues
- Mobile-specific tests verify touch interactions and responsive design
- Performance tests include Core Web Vitals measurements
- SEO tests verify proper meta tags and structured data
