import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Mock providers for testing
const MockProviders = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-providers">{children}</div>;
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: MockProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Common test utilities
export const createMockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

export const createMockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

export const mockScrollTo = () => {
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  });
};

export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  return localStorageMock;
};

export const mockSessionStorage = () => {
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });
  return sessionStorageMock;
};

// Accessibility testing helpers
export const getByLabelText = (container: HTMLElement, text: string) => {
  return (
    container.querySelector(`[aria-label="${text}"]`) ||
    container.querySelector(`[aria-labelledby*="${text}"]`) ||
    container.querySelector(`label[for*="${text}"]`)
  );
};

export const hasProperHeadingHierarchy = (container: HTMLElement) => {
  const headings = Array.from(
    container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  );
  let previousLevel = 0;

  for (const heading of headings) {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      return false;
    }
    previousLevel = level;
  }

  return true;
};

export const hasProperFocusManagement = async (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );

  return focusableElements.length > 0;
};

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

export const waitForAnimations = (element: HTMLElement, timeout = 1000) => {
  return new Promise<void>((resolve) => {
    const animations = element.getAnimations();

    if (animations.length === 0) {
      resolve();
      return;
    }

    Promise.all(animations.map((animation) => animation.finished))
      .then(() => resolve())
      .catch(() => resolve()); // Resolve even if animations fail

    // Fallback timeout
    setTimeout(resolve, timeout);
  });
};

// Mock data generators
export const createMockProject = (overrides = {}) => ({
  slug: 'test-project',
  title: { en: 'Test Project', he: 'פרויקט בדיקה' },
  summary: { en: 'Test summary', he: 'תקציר בדיקה' },
  tech: ['React', 'TypeScript'],
  links: { github: 'https://github.com/test', live: 'https://test.com' },
  image: '/test-image.jpg',
  featured: true,
  role: { en: 'Developer', he: 'מפתח' },
  impact: { en: 'Test impact', he: 'השפעת בדיקה' },
  ...overrides,
});

export const createMockTimelineItem = (overrides = {}) => ({
  year: '2024',
  title: { en: 'Test Event', he: 'אירוע בדיקה' },
  summary: { en: 'Test summary', he: 'תקציר בדיקה' },
  tags: ['test'],
  category: 'civilian' as const,
  location: { en: 'Test Location', he: 'מיקום בדיקה' },
  ...overrides,
});

export const createMockTechCategory = (overrides = {}) => ({
  category: { en: 'Test Category', he: 'קטגוריית בדיקה' },
  items: [{ name: 'Test Tech', level: 'advanced' as const }],
  ...overrides,
});

// Internationalization testing helpers
export const mockTranslations = {
  en: {
    'nav.about': 'About',
    'nav.stack': 'Tech Stack',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    'hero.greeting': "Hi there 👋, I'm Itzhak Leshinsky",
    'hero.tagline': 'Full-Stack Developer | GIS & Web Systems | Tech Leader',
  },
  he: {
    'nav.about': 'אודות',
    'nav.stack': 'טכנולוגיות',
    'nav.projects': 'פרויקטים',
    'nav.experience': 'ניסיון',
    'nav.contact': 'צור קשר',
    'hero.greeting': 'היי שם 👋, אני איציק לשינסקי',
    'hero.tagline': 'מפתח פול סטאק | מערכות GIS ואתרים | מוביל טכנולוגי',
  },
};

export const createMockTranslationFunction = (locale: 'en' | 'he' = 'en') => {
  return (key: string) => {
    return (
      mockTranslations[locale][key as keyof typeof mockTranslations.en] || key
    );
  };
};
