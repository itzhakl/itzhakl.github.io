import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { useTheme, useThemeClass, useThemeEffect } from '@/lib/hooks/useTheme';
import { mockLocalStorage, mockMatchMedia } from '@/tests/utils/test-utils';
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createWrapper = () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  Wrapper.displayName = 'ThemeProviderWrapper';
  return Wrapper;
};

describe('useTheme hook utilities', () => {
  beforeEach(() => {
    mockLocalStorage();
    mockMatchMedia(false);
    vi.clearAllMocks();
  });

  describe('useTheme', () => {
    it('should return theme context', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      // Wait for initial theme setup
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('resolvedTheme');
      expect(result.current).toHaveProperty('setTheme');
      expect(result.current).toHaveProperty('toggleTheme');
      expect(typeof result.current.setTheme).toBe('function');
      expect(typeof result.current.toggleTheme).toBe('function');
    });

    it('should throw descriptive error when used outside provider', () => {
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow(
        'useTheme must be used within a ThemeProvider. Make sure your component is wrapped with ThemeProvider.'
      );
    });
  });

  describe('useThemeClass', () => {
    it('should return light class when theme is light', async () => {
      const { result } = renderHook(
        () => useThemeClass('light-class', 'dark-class'),
        { wrapper: createWrapper() }
      );

      // Wait for initial theme setup
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current).toBe('light-class');
    });

    it('should return dark class when theme is dark', async () => {
      const localStorageMock = mockLocalStorage();
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(
        () => useThemeClass('light-class', 'dark-class'),
        { wrapper: createWrapper() }
      );

      // Wait for initial theme setup
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current).toBe('dark-class');
    });

    it('should update class when theme changes', async () => {
      const { result } = renderHook(
        () => {
          const theme = useTheme();
          const themeClass = useThemeClass('light-class', 'dark-class');
          return { theme, themeClass };
        },
        { wrapper: createWrapper() }
      );

      // Wait for initial theme setup
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.themeClass).toBe('light-class');

      // Change theme to dark
      act(() => {
        result.current.theme.setTheme('dark');
      });

      expect(result.current.themeClass).toBe('dark-class');
    });
  });

  describe('useThemeEffect', () => {
    it('should call callback with current theme on mount', async () => {
      const callback = vi.fn();

      renderHook(() => useThemeEffect(callback), {
        wrapper: createWrapper(),
      });

      // Wait for initial theme setup and effect
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(callback).toHaveBeenCalledWith('light');
    });

    it('should call callback when theme changes', async () => {
      const callback = vi.fn();

      const { result } = renderHook(
        () => {
          const theme = useTheme();
          useThemeEffect(callback);
          return theme;
        },
        { wrapper: createWrapper() }
      );

      // Wait for initial theme setup
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      callback.mockClear();

      // Change theme
      act(() => {
        result.current.setTheme('dark');
      });

      expect(callback).toHaveBeenCalledWith('dark');
    });

    it('should respect additional dependencies', async () => {
      const callback = vi.fn();
      let externalDep = 'initial';

      const { rerender } = renderHook(
        ({ dep }) => useThemeEffect(callback, [dep]),
        {
          wrapper: createWrapper(),
          initialProps: { dep: externalDep },
        }
      );

      // Wait for initial theme setup
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      callback.mockClear();

      // Change external dependency
      externalDep = 'changed';
      rerender({ dep: externalDep });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('light');
    });
  });
});
