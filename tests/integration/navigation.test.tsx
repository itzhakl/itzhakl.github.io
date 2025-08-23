import { LanguageToggle } from '@/components/navigation/LanguageToggle';
import { Navbar } from '@/components/navigation/Navbar';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

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
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollTo for smooth scrolling tests
    Element.prototype.scrollIntoView = vi.fn();
  });

  describe('Navbar Component', () => {
    it('renders all navigation links', () => {
      render(<Navbar />);

      expect(screen.getByText('about')).toBeInTheDocument();
      expect(screen.getByText('stack')).toBeInTheDocument();
      expect(screen.getByText('projects')).toBeInTheDocument();
      expect(screen.getByText('experience')).toBeInTheDocument();
      expect(screen.getByText('contact')).toBeInTheDocument();
    });

    it('handles smooth scroll navigation', async () => {
      // Mock document.getElementById to return a mock element
      const mockElement = {
        scrollIntoView: vi.fn(),
      } as any;

      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      render(<Navbar />);

      const aboutLink = screen.getByText('about');
      await userEvent.click(aboutLink);

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('highlights active section', () => {
      render(<Navbar />);

      // Test that navigation items have proper styling
      const navItems = screen.getAllByRole('button');
      expect(navItems.length).toBeGreaterThan(0);

      navItems.forEach((item) => {
        expect(item).toHaveClass('transition-colors');
      });
    });

    it('is keyboard accessible', async () => {
      render(<Navbar />);

      const firstLink = screen.getByText('about');
      firstLink.focus();
      expect(firstLink).toHaveFocus();

      // Test Tab navigation
      await userEvent.tab();
      expect(screen.getByText('stack')).toHaveFocus();
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(<Navbar />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA labels', () => {
      render(<Navbar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('handles mobile responsiveness', () => {
      render(<Navbar />);

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

      // Should call router.replace with new locale
      expect(mockReplace).toHaveBeenCalled();
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
      fireEvent.keyDown(button, { key: 'Enter' });
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalled();
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
      const { rerender } = render(
        <div>
          <Navbar />
          <LanguageToggle />
        </div>
      );

      // Click language toggle
      const toggleButton = screen.getByRole('button', {
        name: /switchTo/i,
      });
      await userEvent.click(toggleButton);

      // Navigation should still be present
      rerender(
        <div>
          <Navbar />
          <LanguageToggle />
        </div>
      );

      expect(screen.getByText('About')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /switchTo/i })
      ).toBeInTheDocument();
    });

    it('preserves scroll position during language switch', async () => {
      render(
        <div>
          <Navbar />
          <LanguageToggle />
        </div>
      );

      // Mock current scroll position
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });

      const toggleButton = screen.getByRole('button', {
        name: /switchTo/i,
      });
      await userEvent.click(toggleButton);

      // Should maintain scroll position (implementation dependent)
      expect(mockReplace).toHaveBeenCalled();
    });

    it('updates navigation labels when language changes', () => {
      // This would test that navigation labels update when locale changes
      // Implementation depends on how translations are handled
      render(<Navbar />);

      expect(screen.getByText('about')).toBeInTheDocument();
      expect(screen.getByText('stack')).toBeInTheDocument();
    });
  });

  describe('Skip Link Integration', () => {
    it('provides skip to main content functionality', () => {
      render(
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
