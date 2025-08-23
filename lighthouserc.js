module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/en', 'http://localhost:3000/he'],
      startServerCommand: 'npm start',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 60000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': ['warn', { minScore: 0.8 }],

        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],

        // Accessibility
        'color-contrast': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',
        label: 'error',
        'link-name': 'error',
        list: 'error',
        'meta-viewport': 'error',

        // Best Practices
        'uses-https': 'error',
        'uses-http2': 'warn',
        'no-vulnerable-libraries': 'error',
        'external-anchors-use-rel-noopener': 'error',

        // SEO
        'document-title': 'error',
        'meta-description': 'error',
        hreflang: 'error',
        canonical: 'error',
        'robots-txt': 'warn',

        // Performance
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',
        'uses-text-compression': 'error',
        'render-blocking-resources': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        'efficient-animated-content': 'warn',
        'preload-lcp-image': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: '.lighthouseci',
    },
  },
};
