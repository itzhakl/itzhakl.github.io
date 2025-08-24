/**
 * Theme initialization script to prevent hydration mismatches and theme flashing
 * This script runs before React hydration to set the initial theme class
 */
export const themeScript = `
(function() {
  try {
    var theme = 'system';
    var resolvedTheme = 'dark';
    
    // Check localStorage for saved preference
    try {
      var stored = localStorage.getItem('theme-preference');
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        theme = stored;
      }
    } catch (e) {}
    
    // Resolve theme
    if (theme === 'system') {
      try {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } catch (e) {
        resolvedTheme = 'dark';
      }
    } else {
      resolvedTheme = theme;
    }
    
    // Apply theme class to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
  } catch (e) {
    // Fallback to dark theme
    document.documentElement.classList.add('dark');
  }
})();
`;
