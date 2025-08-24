import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/lib/hooks/useTheme';
import { mockLocalStorage, mockMatchMedia } from '@/tests/utils/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Test component that uses the theme
const TestThemeComponent = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>
        Set System
      </button>
      <button data-testid="toggle" onClick={toggleTheme}>
        Toggle
      </button>
    </div>
  );
};

// Full integration test component with ThemeToggle
const FullThemeIntegrationComponent = () => {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <ThemeToggle data-testid="theme-toggle" />
      <div
        className="bg-background p-4 text-foreground"
        data-testid="themed-content"
      >
        <h1 className="text-primary">Themed Content</h1>
        <p className="text-muted-foreground">
          This content should change with theme
        </p>
      </div>
    </div>
  );
};

describe('Theme Integration', () => {
  beforeEach(() => {
    mockLocalStorage();
    mockMatchMedia(false); // Default to light system preference
    vi.clearAllMocks();
    document.documentElement.className = '';
  });

  describe('Basic Theme Switching', () => {
    it('should provide theme context and allow theme switching', async () => {
      render(
        <ThemeProvider>
          <TestThemeComponent />
        </ThemeProvider>
      );

      // Wait for initial theme setup
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });

      // Test setting theme to dark
      fireEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // Test setting theme to light
      fireEvent.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });

      // Test toggle functionality
      fireEvent.click(screen.getByTestId('toggle'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });
    });

    it('should apply theme classes to document root', async () => {
      render(
        <ThemeProvider>
          <TestThemeComponent />
        </ThemeProvider>
      );

      // Wait for initial theme setup
      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
      });

      // Switch to dark theme
      fireEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(
          false
        );
      });

      // Switch back to light theme
      fireEvent.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });

    it('should persist theme preference to localStorage', async () => {
      const localStorageMock = mockLocalStorage();

      render(
        <ThemeProvider>
          <TestThemeComponent />
        </ThemeProvider>
      );

      // Wait for initial theme setup
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system');
      });

      // Switch to dark theme
      fireEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'theme-preference',
          'dark'
        );
      });

      // Switch to light theme
      fireEvent.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'theme-preference',
          'light'
        );
      });
    });
  });

  describe('System Preference Integration', () => {
    it('should respond to system preference changes when theme is system', async () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        media: '(prefers-color-scheme: dark)',
        onchange: null,
      };

      vi.mocked(window.matchMedia).mockReturnValue(
        mockMediaQuery as MediaQueryList
      );

      render(
        <ThemeProvider>
          <TestThemeComponent />
        </ThemeProvider>
      );

      // Wait for initial theme setup (system -> light)
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });

      // Simulate system preference change to dark
      const changeHandler = mockMediaQuery.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1];

      if (changeHandler) {
        fireEvent(window, new Event('change'));
        changeHandler({ matches: true } as MediaQueryListEvent);

        await waitFor(() => {
          expect(screen.getByTestId('resolved-theme')).toHaveTextContent(
            'dark'
          );
          expect(document.documentElement.classList.contains('dark')).toBe(
            true
          );
        });
      }
    });

    it('should not respond to system changes when theme is explicitly set', async () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        media: '(prefers-color-scheme: dark)',
        onchange: null,
      };

      vi.mocked(window.matchMedia).mockReturnValue(
        mockMediaQuery as MediaQueryList
      );

      render(
        <ThemeProvider>
          <TestThemeComponent />
        </ThemeProvider>
      );

      // Set explicit theme
      fireEvent.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });

      // Simulate system preference change
      const changeHandler = mockMediaQuery.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1];

      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);

        // Should remain light since explicitly set
        await waitFor(() => {
          expect(screen.getByTestId('resolved-theme')).toHaveTextContent(
            'light'
          );
        });
      }
    });
  });

  describe('Full Component Integration', () => {
    it('should integrate ThemeToggle with theme system', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <FullThemeIntegrationComponent />
        </ThemeProvider>
      );

      // Wait for initial setup
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });

      // Click theme toggle
      const themeToggle = screen.getByRole('switch');
      await user.click(themeToggle);

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
        expect(themeToggle).toHaveAttribute('aria-checked', 'true');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });

      // Click again to toggle back
      await user.click(themeToggle);

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
        expect(themeToggle).toHaveAttribute('aria-checked', 'false');
        expect(document.documentElement.classList.contains('light')).toBe(true);
      });
    });

    it('should maintain theme consistency across multiple components', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestThemeComponent />
          <FullThemeIntegrationComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('resolved-theme')[0]).toHaveTextContent(
          'light'
        );
        expect(screen.getAllByTestId('resolved-theme')[1]).toHaveTextContent(
          'light'
        );
      });

      // Change theme via button
      fireEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getAllByTestId('resolved-theme')[0]).toHaveTextContent(
          'dark'
        );
        expect(screen.getAllByTestId('resolved-theme')[1]).toHaveTextContent(
          'dark'
        );
        expect(screen.getByRole('switch')).toHaveAttribute(
          'aria-checked',
          'true'
        );
      });

      // Change theme via toggle
      await user.click(screen.getByRole('switch'));

      await waitFor(() => {
        expect(screen.getAllByTestId('resolved-theme')[0]).toHaveTextContent(
          'light'
        );
        expect(screen.getAllByTestId('resolved-theme')[1]).toHaveTextContent(
          'light'
        );
      });
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('should recover from localStorage corruption', async () => {
      const localStorageMock = mockLocalStorage();

      // Simulate corrupted localStorage
      localStorageMock.getItem.mockReturnValue('corrupted-data');

      render(
        <ThemeProvider>
          <TestThemeComponent />
        </ThemeProvider>
      );

      // Should fallback to system theme
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system');
      });

      // Should still be able to set themes
      fireEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'theme-preference',
          'dark'
        );
      });
    });

    it('should handle multiple rapid theme changes', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <FullThemeIntegrationComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const themeToggle = screen.getByRole('switch');

      // Rapid clicks
      await user.click(themeToggle);
      await user.click(themeToggle);
      await user.click(themeToggle);
      await user.click(themeToggle);

      // Should end up in consistent state
      await waitFor(() => {
        const isChecked = themeToggle.getAttribute('aria-checked') === 'true';
        const expectedTheme = isChecked ? 'dark' : 'light';
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent(
          expectedTheme
        );
        expect(document.documentElement.classList.contains(expectedTheme)).toBe(
          true
        );
      });
    });

    it('should maintain accessibility during theme transitions', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <FullThemeIntegrationComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        screen.getByRole('switch');
      });

      const themeToggle = screen.getByRole('switch');

      // Verify accessibility attributes before change
      expect(themeToggle).toHaveAttribute('aria-label');
      expect(themeToggle).toHaveAttribute('role', 'switch');

      await user.click(themeToggle);

      // Verify accessibility attributes after change
      await waitFor(() => {
        expect(themeToggle).toHaveAttribute('aria-label');
        expect(themeToggle).toHaveAttribute('role', 'switch');
        expect(themeToggle).toHaveAttribute('aria-checked');
      });
    });
  });

  describe('Performance and Memory Management', () => {
    it('should clean up event listeners on unmount', async () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        media: '(prefers-color-scheme: dark)',
        onchange: null,
      };

      vi.mocked(window.matchMedia).mockReturnValue(
        mockMediaQuery as MediaQueryList
      );

      const { unmount } = render(
        <ThemeProvider>
          <TestThemeComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith(
          'change',
          expect.any(Function)
        );
      });

      unmount();

      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should not cause memory leaks with multiple mounts/unmounts', async () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        media: '(prefers-color-scheme: dark)',
        onchange: null,
      };

      vi.mocked(window.matchMedia).mockReturnValue(
        mockMediaQuery as MediaQueryList
      );

      // Mount and unmount multiple times
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <ThemeProvider>
            <TestThemeComponent />
          </ThemeProvider>
        );

        await waitFor(() => {
          screen.getByTestId('theme');
        });

        unmount();
      }

      // Should have equal number of add and remove calls
      expect(mockMediaQuery.addEventListener).toHaveBeenCalledTimes(5);
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledTimes(5);
    });
  });
});
