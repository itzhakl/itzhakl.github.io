import { useTheme as useThemeContext } from '@/components/providers/ThemeProvider';
import React, { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

/**
 * Custom hook to access theme context with error handling
 *
 * @returns Theme context with current theme state and controls
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = () => {
  try {
    return useThemeContext();
  } catch (error) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
        'Make sure your component is wrapped with ThemeProvider.'
    );
  }
};

/**
 * Hook to get theme-aware CSS classes
 *
 * @param lightClass - CSS class for light theme
 * @param darkClass - CSS class for dark theme
 * @returns The appropriate CSS class based on current theme
 */
export const useThemeClass = (lightClass: string, darkClass: string) => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'light' ? lightClass : darkClass;
};

/**
 * Hook to execute side effects when theme changes
 *
 * @param callback - Function to execute when theme changes
 * @param deps - Additional dependencies for the effect
 */
export const useThemeEffect = (
  callback: (theme: ResolvedTheme) => void,
  deps: React.DependencyList = []
) => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    callback(resolvedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme, callback, ...deps]);
};

/**
 * Hook for theme persistence utilities
 *
 * @returns Object with theme persistence methods
 */
export const useThemePersistence = () => {
  const { theme, setTheme } = useTheme();

  const saveThemePreference = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem('theme-preference', newTheme);
      return true;
    } catch (error) {
      // Failed to save theme preference
      return false;
    }
  }, []);

  const loadThemePreference = useCallback((): Theme | null => {
    try {
      const stored = localStorage.getItem('theme-preference');
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as Theme;
      }
      return null;
    } catch (error) {
      // Failed to load theme preference
      return null;
    }
  }, []);

  const clearThemePreference = useCallback(() => {
    try {
      localStorage.removeItem('theme-preference');
      setTheme('system'); // Revert to system preference
      return true;
    } catch (error) {
      return false;
    }
  }, [setTheme]);

  return {
    currentTheme: theme,
    saveThemePreference,
    loadThemePreference,
    clearThemePreference,
  };
};

/**
 * Hook for system preference detection utilities
 *
 * @returns Object with system preference detection methods and state
 */
export const useSystemPreference = () => {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'dark';

    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'dark';
    }
  });

  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;

    try {
      return window.matchMedia !== undefined;
    } catch {
      return false;
    }
  });

  const detectSystemPreference = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'dark';

    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'dark';
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!isSupported) return;

    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        setSystemTheme(newSystemTheme);
      };

      mediaQuery.addEventListener('change', handleChange);

      // Update initial state
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } catch (error) {}
  }, [isSupported]);

  return {
    systemTheme,
    isSupported,
    detectSystemPreference,
  };
};
