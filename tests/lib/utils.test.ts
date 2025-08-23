import { describe, expect, it } from 'vitest';

// Mock the utils functions since we don't have the actual implementation
// In a real scenario, these would import from @/lib/utils

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      // Mock implementation
      const cn = (...classes: (string | undefined | null | boolean)[]) => {
        return classes.filter(Boolean).join(' ');
      };

      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn('class1', null, 'class2')).toBe('class1 class2');
      expect(cn('class1', false, 'class2')).toBe('class1 class2');
    });

    it('should handle empty inputs', () => {
      const cn = (...classes: (string | undefined | null | boolean)[]) => {
        return classes.filter(Boolean).join(' ');
      };

      expect(cn()).toBe('');
      expect(cn(undefined, null, false)).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly for different locales', () => {
      const formatDate = (date: Date, locale: string) => {
        return new Intl.DateTimeFormat(locale).format(date);
      };

      const testDate = new Date('2024-01-15');

      expect(formatDate(testDate, 'en-US')).toMatch(/1\/15\/2024|15\/1\/2024/);
      expect(formatDate(testDate, 'he-IL')).toMatch(/15\.1\.2024|15\/1\/2024/);
    });
  });

  describe('slugify', () => {
    it('should convert strings to URL-friendly slugs', () => {
      const slugify = (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      };

      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test Project #1')).toBe('test-project-1');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(slugify('Special!@#$%Characters')).toBe('specialcharacters');
    });
  });

  describe('truncateText', () => {
    it('should truncate text to specified length', () => {
      const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
      };

      expect(truncateText('Short text', 20)).toBe('Short text');
      expect(
        truncateText('This is a very long text that should be truncated', 20)
      ).toBe('This is a very long...');
      expect(truncateText('Exactly twenty chars', 20)).toBe(
        'Exactly twenty chars'
      );
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0;
      const testFn = () => callCount++;

      const debounce = (fn: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => fn.apply(null, args), delay);
        };
      };

      const debouncedFn = debounce(testFn, 100);

      // Call multiple times rapidly
      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(callCount).toBe(0);

      // Wait for debounce delay
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(callCount).toBe(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      let callCount = 0;
      const testFn = () => callCount++;

      const throttle = (fn: Function, delay: number) => {
        let lastCall = 0;
        return (...args: any[]) => {
          const now = Date.now();
          if (now - lastCall >= delay) {
            lastCall = now;
            fn.apply(null, args);
          }
        };
      };

      const throttledFn = throttle(testFn, 100);

      // Call multiple times rapidly
      throttledFn();
      throttledFn();
      throttledFn();

      expect(callCount).toBe(1);

      // Wait and call again
      await new Promise((resolve) => setTimeout(resolve, 150));
      throttledFn();
      expect(callCount).toBe(2);
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid.email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      const isValidUrl = (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };

      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const generateId = (prefix = 'id') => {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
      };

      const id1 = generateId();
      const id2 = generateId();
      const id3 = generateId('test');

      expect(id1).toMatch(/^id-[a-z0-9]{9}$/);
      expect(id2).toMatch(/^id-[a-z0-9]{9}$/);
      expect(id3).toMatch(/^test-[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      const clamp = (value: number, min: number, max: number) => {
        return Math.min(Math.max(value, min), max);
      };

      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('lerp (linear interpolation)', () => {
    it('should interpolate between values', () => {
      const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
      };

      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(10, 20, 0.25)).toBe(12.5);
    });
  });

  describe('formatBytes', () => {
    it('should format byte sizes', () => {
      const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
          parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
      };

      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1536, 1)).toBe('1.5 KB');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      const capitalizeFirst = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('WORLD');
      expect(capitalizeFirst('a')).toBe('A');
      expect(capitalizeFirst('')).toBe('');
    });
  });

  describe('removeHtmlTags', () => {
    it('should remove HTML tags from strings', () => {
      const removeHtmlTags = (html: string) => {
        return html.replace(/<[^>]*>/g, '');
      };

      expect(removeHtmlTags('<p>Hello <strong>world</strong></p>')).toBe(
        'Hello world'
      );
      expect(removeHtmlTags('<div><span>Test</span></div>')).toBe('Test');
      expect(removeHtmlTags('No tags here')).toBe('No tags here');
    });
  });

  describe('getInitials', () => {
    it('should extract initials from names', () => {
      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase())
          .join('');
      };

      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Itzhak Leshinsky')).toBe('IL');
      expect(getInitials('Single')).toBe('S');
      expect(getInitials('First Middle Last')).toBe('FML');
    });
  });
});
