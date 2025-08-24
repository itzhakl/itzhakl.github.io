import { ThemeProvider, useTheme } from '@/components/providers/ThemeProvider';
import { mockLocalStorage, mockMatchMedia } from '@/tests/utils/test-utils';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage and matchMedia for each test
const createWrapper = () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  Wrapper.displayName = 'ThemeProviderWrapper';
  return Wrapper;
};

describe('ThemeProvider', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    localStorageMock = mockLocalStorage();
    mockMatchMedia(false); // Default to light system preference
    vi.clearAllMocks();
    // Clean up document classes safely
    if (document.documentElement) {
      document.documentElement.className = '';
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial theme detection', () => {
    it('should default to system theme when no localStorage value exists', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
        expect(result.current.resolvedTheme).toBe('light'); // matchMedia returns false (light)
      });
    });

    it('should use stored theme preference from localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
        expect(result.current.resolvedTheme).toBe('dark');
      });
    });

    it('should resolve system theme to dark when prefers-color-scheme is dark', async () => {
      localStorageMock.getItem.mockReturnValue('system');
      mockMatchMedia(true); // Dark system preference

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
        expect(result.current.resolvedTheme).toBe('dark');
      });
    });

    it('should fallback to system when localStorage contains invalid value', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
      });
    });
  });

  describe('Theme switching', () => {
    it('should update theme and save to localStorage when setTheme is called', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
      });

      act(() => {
        result.current.setTheme('dark');
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
        expect(result.current.resolvedTheme).toBe('dark');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'theme-preference',
          'dark'
        );
      });
    });

    it('should toggle between light and dark themes', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.resolvedTheme).toBe('light');
      });

      act(() => {
        result.current.toggleTheme();
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
        expect(result.current.resolvedTheme).toBe('dark');
      });

      act(() => {
        result.current.toggleTheme();
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('light');
        expect(result.current.resolvedTheme).toBe('light');
      });
    });
  });

  describe('System theme changes', () => {
    it('should respond to system theme changes when theme is set to system', async () => {
      localStorageMock.getItem.mockReturnValue('system');

      // Mock matchMedia with event listener support
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

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
        expect(result.current.resolvedTheme).toBe('light');
      });

      // Simulate system theme change to dark
      const changeHandler = mockMediaQuery.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1];

      if (changeHandler) {
        act(() => {
          changeHandler({ matches: true } as MediaQueryListEvent);
        });

        await waitFor(() => {
          expect(result.current.resolvedTheme).toBe('dark');
        });
      }
    });

    it('should not respond to system theme changes when theme is explicitly set', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      vi.mocked(window.matchMedia).mockReturnValue(mockMediaQuery as unknown);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('light');
        expect(result.current.resolvedTheme).toBe('light');
      });

      // Simulate system theme change to dark
      const changeHandler = mockMediaQuery.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1];

      if (changeHandler) {
        act(() => {
          changeHandler({ matches: true } as MediaQueryListEvent);
        });

        // Should remain light since theme is explicitly set to light
        await waitFor(() => {
          expect(result.current.resolvedTheme).toBe('light');
        });
      }
    });
  });

  describe('Error handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
      });
    });

    it('should handle localStorage setItem errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
      });

      act(() => {
        result.current.setTheme('dark');
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
        // Theme should still be set even if localStorage fails
        expect(result.current.resolvedTheme).toBe('dark');
      });
    });

    it('should handle matchMedia errors gracefully', async () => {
      vi.mocked(window.matchMedia).mockImplementation(() => {
        throw new Error('matchMedia not supported');
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
        expect(result.current.resolvedTheme).toBe('dark'); // Should fallback to dark
      });
    });
  });

  describe('useTheme hook error handling', () => {
    it('should throw error when used outside ThemeProvider', () => {
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within ThemeProvider');
    });
  });

  describe('DOM manipulation', () => {
    it('should apply theme classes to document root', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
        expect(document.documentElement.classList.contains('light')).toBe(true);
      });

      act(() => {
        result.current.setTheme('dark');
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(
          false
        );
      });
    });

    it('should remove previous theme classes when switching', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
      });

      // Set to dark
      act(() => {
        result.current.setTheme('dark');
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(
          false
        );
      });

      // Set to light
      act(() => {
        result.current.setTheme('light');
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });
  });

  describe('Comprehensive theme persistence', () => {
    it('should persist theme across multiple changes', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
      });

      // Multiple theme changes
      const themes: Array<'light' | 'dark' | 'system'> = [
        'dark',
        'light',
        'system',
        'dark',
      ];

      for (const theme of themes) {
        act(() => {
          result.current.setTheme(theme);
        });

        await waitFor(() => {
          expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'theme-preference',
            theme
          );
        });
      }

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(themes.length);
    });

    it('should handle localStorage quota exceeded error', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
      });

      // Should not throw error
      act(() => {
        result.current.setTheme('dark');
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
        expect(result.current.resolvedTheme).toBe('dark');
      });
    });
  });

  describe('System preference edge cases', () => {
    it('should handle rapid system theme changes', async () => {
      localStorageMock.getItem.mockReturnValue('system');

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

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('system');
        expect(result.current.resolvedTheme).toBe('light');
      });

      const changeHandler = mockMediaQuery.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1];

      if (changeHandler) {
        // Rapid changes
        act(() => {
          changeHandler({ matches: true } as MediaQueryListEvent);
        });
        act(() => {
          changeHandler({ matches: false } as MediaQueryListEvent);
        });
        act(() => {
          changeHandler({ matches: true } as MediaQueryListEvent);
        });

        await waitFor(() => {
          expect(result.current.resolvedTheme).toBe('dark');
        });
      }
    });

    it('should clean up event listeners on unmount', async () => {
      localStorageMock.getItem.mockReturnValue('system');

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

      const { unmount } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

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
  });
});
