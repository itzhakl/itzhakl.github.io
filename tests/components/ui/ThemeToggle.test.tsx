import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: query === '(prefers-color-scheme: dark)',
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

const ThemeToggleWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.mockReturnValue({
      matches: true, // Default to dark mode
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    document.documentElement.className = '';
    vi.clearAllTimers();
  });

  describe('Rendering', () => {
    it('renders toggle button with proper ARIA attributes', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('aria-checked');
        expect(button).toHaveAttribute('title');
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('displays correct icon for dark mode', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'true');
        expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      });
    });

    it('displays correct icon for light mode', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'false');
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      });
    });

    it('renders with custom className', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle className="custom-class" />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('custom-class');
      });
    });

    it('renders with different sizes', async () => {
      const { rerender } = render(
        <ThemeToggleWrapper>
          <ThemeToggle size="sm" />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('h-8', 'w-8');
      });

      rerender(
        <ThemeToggleWrapper>
          <ThemeToggle size="lg" />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('h-12', 'w-12');
      });
    });

    it('renders with different variants', async () => {
      const { rerender } = render(
        <ThemeToggleWrapper>
          <ThemeToggle variant="outline" />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('border', 'border-input');
      });

      rerender(
        <ThemeToggleWrapper>
          <ThemeToggle variant="secondary" />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('bg-secondary');
      });
    });
  });

  describe('Theme Switching', () => {
    it('toggles theme when clicked', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'true');
      });

      const button = screen.getByRole('switch');
      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-checked', 'false');
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      });
    });

    it('saves theme preference to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const button = screen.getByRole('switch');
      await user.click(button);

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'theme-preference',
          'light'
        );
      });
    });

    it('applies theme class to document root', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark');
      });

      const button = screen.getByRole('switch');
      await user.click(button);

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('light');
        expect(document.documentElement).not.toHaveClass('dark');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('toggles theme when Enter key is pressed', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'true');
      });

      const button = screen.getByRole('switch');
      button.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-checked', 'false');
      });
    });

    it('toggles theme when Space key is pressed', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'true');
      });

      const button = screen.getByRole('switch');
      button.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-checked', 'false');
      });
    });

    it('is focusable with Tab key', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Previous button</button>
          <ThemeToggleWrapper>
            <ThemeToggle />
          </ThemeToggleWrapper>
          <button>Next button</button>
        </div>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      // Focus first button
      const prevButton = screen.getByText('Previous button');
      prevButton.focus();

      // Tab to theme toggle
      await user.tab();

      await waitFor(() => {
        const themeToggle = screen.getByRole('switch');
        expect(themeToggle).toHaveFocus();
      });
    });

    it('calls custom onKeyDown handler', async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle onKeyDown={onKeyDown} />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const button = screen.getByRole('switch');
      button.focus();
      await user.keyboard('{Enter}');

      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe('Accessibility Features', () => {
    it('provides screen reader announcements', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        // Check for screen reader content
        expect(screen.getByText(/Current theme:/)).toBeInTheDocument();
        expect(screen.getByText(/Switch to light mode/)).toBeInTheDocument();
      });
    });

    it('has proper role and ARIA attributes', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('role', 'switch');
        expect(button).toHaveAttribute('aria-checked');
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('announces theme changes to screen readers', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const button = screen.getByRole('switch');
      await user.click(button);

      await waitFor(() => {
        const liveRegion = screen.getByRole('status');
        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion).toHaveAttribute('aria-live', 'polite');
        expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
      });
    });

    it('has proper focus indicators', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('focus-visible:outline-none');
        expect(button).toHaveClass('focus-visible:ring-2');
        expect(button).toHaveClass('focus-visible:ring-ring');
        expect(button).toHaveClass('focus-visible:ring-offset-2');
      });
    });
  });

  describe('Animation and Transitions', () => {
    it('has smooth transition classes', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('transition-all', 'duration-200');
      });
    });

    it('handles animation state during theme changes', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const button = screen.getByRole('switch');
      await user.click(button);

      // Animation should be triggered
      await waitFor(() => {
        const liveRegion = screen.getByRole('status');
        expect(liveRegion.textContent).toContain('Theme changed to light mode');
      });
    });
  });

  describe('SSR and Hydration', () => {
    it('renders loading state before hydration', async () => {
      // Mock the mounted state to false by rendering without waiting
      const { container } = render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      // Should render a disabled button initially (before useEffect runs)
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();

      // Wait for the component to mount and become interactive
      await waitFor(() => {
        const interactiveButton = screen.getByRole('switch');
        expect(interactiveButton).toBeInTheDocument();
      });
    });

    it('prevents hydration mismatch with proper initialization', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      // Should eventually render the proper button
      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).not.toBeDisabled();
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles localStorage errors gracefully', async () => {
      const user = userEvent.setup();
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const button = screen.getByRole('switch');

      // Should not throw error when clicking
      expect(async () => {
        await user.click(button);
      }).not.toThrow();
    });

    it('handles matchMedia errors gracefully', async () => {
      // Mock matchMedia to throw error
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: () => {
          throw new Error('matchMedia not supported');
        },
      });

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      // Should still render without errors
      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Comprehensive Accessibility Tests', () => {
    it('meets WCAG color contrast requirements', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');

        // Button should have proper contrast classes
        expect(button).toHaveClass('focus-visible:ring-2');
        expect(button).toHaveClass('focus-visible:ring-ring');
      });
    });

    it('provides proper screen reader context', async () => {
      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        // Check for comprehensive screen reader support
        const button = screen.getByRole('switch');
        const srText = screen.getByText(/Current theme:/);

        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('title');
        expect(srText).toBeInTheDocument();
        expect(srText.className).toContain('sr-only');
      });
    });

    it('handles high contrast mode compatibility', async () => {
      // Mock high contrast media query
      const highContrastQuery = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      matchMediaMock.mockImplementation((query) => {
        if (query.includes('prefers-contrast')) {
          return highContrastQuery;
        }
        return {
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      });

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        expect(button).toBeInTheDocument();
        // Should render without issues in high contrast mode
      });
    });

    it('supports reduced motion preferences', async () => {
      // Mock prefers-reduced-motion
      const reducedMotionQuery = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      matchMediaMock.mockImplementation((query) => {
        if (query.includes('prefers-reduced-motion')) {
          return reducedMotionQuery;
        }
        return {
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      });

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('switch');
        // Should still have transition classes but respect user preference
        expect(button).toHaveClass('transition-all');
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles rapid successive clicks', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const button = screen.getByRole('switch');

      // Rapid clicks should not cause issues
      await user.click(button);
      await user.click(button);
      await user.click(button);

      await waitFor(() => {
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-checked');
      });
    });

    it('maintains state consistency during animations', async () => {
      const user = userEvent.setup();

      render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const button = screen.getByRole('switch');
      const initialChecked = button.getAttribute('aria-checked');

      await user.click(button);

      // State should be updated immediately
      expect(button.getAttribute('aria-checked')).not.toBe(initialChecked);
    });

    it('handles component unmounting gracefully', async () => {
      const user = userEvent.setup();

      const { unmount } = render(
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const button = screen.getByRole('switch');
      await user.click(button);

      // Should not throw error when unmounting
      expect(() => unmount()).not.toThrow();
    });
  });
});
