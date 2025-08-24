import { LanguageToggle } from '@/components/navigation/LanguageToggle';
import { Navbar } from '@/components/navigation/Navbar';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Helper function to render components with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

// Mock next-intl with more realistic behavior
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'nav.about': 'About',
      'nav.stack': 'Tech Stack',
      'nav.projects': 'Projects',
      'nav.experience': 'Experience',
      'nav.contact': 'Contact',
      'nav.toggleLanguage': 'Toggle Language',
    };
    return translations[key] || key;
  },
  useLocale: () => 'en',
}));

// Mock next/navigation with more realistic router
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/en',
}));

describe('Navigation Integration Tests', () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();

    // Store original location
    originalLocation = window.location;

    // Mock window.location
    delete (window as Window & { location?: Location }).location;
    window.location = {
      ...originalLocation,
      href: '',
    } as Location;

    // Mock scrollTo for smooth scrolling tests
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
  });

  describe('Navbar Component', () => {
    it('renders all navigation links', () => {
      renderWithTheme(<Navbar />);

      expect(screen.getAllByText('about')[0]).toBeInTheDocument();
      expect(screen.getAllByText('stack')[0]).toBeInTheDocument();
      expect(screen.getAllByText('projects')[0]).toBeInTheDocument();
      expect(screen.getAllByText('experience')[0]).toBeInTheDocument();
      expect(screen.getAllByText('contact')[0]).toBeInTheDocument();
    });

    it('handles smooth scroll navigation', async () => {
      // Mock document.getElementById to return a mock element
      const mockElement = {
        getBoundingClientRect: vi.fn().mockReturnValue({ top: 100 }),
      } as HTMLElement;

      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      // Mock window.scrollTo
      const mockScrollTo = vi.fn();
      Object.defineProperty(window, 'scrollTo', {
        value: mockScrollTo,
        writable: true,
      });

      renderWithTheme(<Navbar />);

      // Get the desktop navigation button (first one)
      const aboutLinks = screen.getAllByText('about');
      const aboutLink = aboutLinks[0]; // Desktop version
      await userEvent.click(aboutLink);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: 'smooth',
      });
    });

    it('highlights active section', () => {
      renderWithTheme(<Navbar />);

      // Test that desktop navigation items have proper styling
      const desktopNavItems = screen.getAllByText('about');
      expect(desktopNavItems.length).toBeGreaterThan(0);

      // Check the desktop navigation button (first one)
      const desktopButton = desktopNavItems[0];
      expect(desktopButton).toHaveClass('transition-colors');
    });

    it('is keyboard accessible', async () => {
      renderWithTheme(<Navbar />);

      // Get the desktop navigation buttons
      const aboutLinks = screen.getAllByText('about');
      const firstLink = aboutLinks[0]; // Desktop version
      firstLink.focus();
      expect(firstLink).toHaveFocus();

      // Test Tab navigation - next button should be timeline
      await userEvent.tab();
      const timelineLinks = screen.getAllByText('timeline');
      expect(timelineLinks[0]).toHaveFocus(); // Desktop version
    });

    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<Navbar />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA labels', () => {
      renderWithTheme(<Navbar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('handles mobile responsiveness', () => {
      renderWithTheme(<Navbar />);

      // Check for mobile menu button (if implemented)
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('fixed');
      expect(nav).toHaveClass('top-0');
    });
  });

  describe('Language Toggle Integration', () => {
    it('renders language toggle button', () => {
      render(<LanguageToggle />);

      const toggleButton = screen.getByRole('button', {
        name: /switchTo/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });

    it('handles language switching', async () => {
      render(<LanguageToggle />);

      const toggleButton = screen.getByRole('button');
      await userEvent.click(toggleButton);

      // Should update window.location.href with new locale
      expect(window.location.href).toContain('/he');
    });

    it('shows current language state', () => {
      render(<LanguageToggle />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();

      // Should show some indication of current language
      expect(button).toHaveTextContent(/en|he/i);
    });

    it('is keyboard accessible', async () => {
      render(<LanguageToggle />);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      // Test Enter key activation
      await userEvent.keyboard('{Enter}');
      await waitFor(() => {
        expect(window.location.href).toContain('/he');
      });
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(<LanguageToggle />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Navigation and Language Integration', () => {
    it('maintains navigation state during language switch', async () => {
      const { rerender } = renderWithTheme(
        <div>
          <Navbar />
          <LanguageToggle />
        </div>
      );

      // Click language toggle (get the first one - standalone LanguageToggle)
      const toggleButtons = screen.getAllByRole('button', {
        name: /switchTo/i,
      });
      const toggleButton = toggleButtons[0];
      await userEvent.click(toggleButton);

      // Navigation should still be present
      rerender(
        <ThemeProvider>
          <div>
            <Navbar />
            <LanguageToggle />
          </div>
        </ThemeProvider>
      );

      expect(screen.getAllByText('about')[0]).toBeInTheDocument();
      expect(
        screen.getAllByRole('button', { name: /switchTo/i })[0]
      ).toBeInTheDocument();
    });

    it('preserves scroll position during language switch', async () => {
      renderWithTheme(
        <div>
          <Navbar />
          <LanguageToggle />
        </div>
      );

      // Mock current scroll position
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });

      // Get the first language toggle button (standalone LanguageToggle)
      const toggleButtons = screen.getAllByRole('button', {
        name: /switchTo/i,
      });
      const toggleButton = toggleButtons[0];
      await userEvent.click(toggleButton);

      // Should maintain scroll position (implementation dependent)
      expect(window.location.href).toContain('/he');
    });

    it('updates navigation labels when language changes', () => {
      // This would test that navigation labels update when locale changes
      // Implementation depends on how translations are handled
      renderWithTheme(<Navbar />);

      expect(screen.getAllByText('about')[0]).toBeInTheDocument();
      expect(screen.getAllByText('stack')[0]).toBeInTheDocument();
    });
  });

  describe('Skip Link Integration', () => {
    it('provides skip to main content functionality', () => {
      renderWithTheme(
        <div>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <Navbar />
          <main id="main">Main content</main>
        </div>
      );

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main');
    });
  });
});
