'use client';

import { useTheme } from '@/lib/hooks/useTheme';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { HiMoon, HiSun } from 'react-icons/hi2';

const themeToggleVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  }
);

export interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
    VariantProps<typeof themeToggleVariants> {
  className?: string;
}

const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, variant, size, ...props }, ref) => {
    const { resolvedTheme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

    // Prevent hydration mismatch
    useEffect(() => {
      setMounted(true);

      // Cleanup function to clear any pending timeouts
      return () => {
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
      };
    }, []);

    const handleToggle = () => {
      setIsAnimating(true);
      toggleTheme();

      // Announce theme change to screen readers
      const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

      // Create a temporary announcement element for immediate feedback
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Switched to ${newTheme} mode`;
      document.body.appendChild(announcement);

      // Remove announcement after screen readers have processed it
      const timeoutId = setTimeout(() => {
        if (
          typeof document !== 'undefined' &&
          document.body &&
          document.body.contains(announcement)
        ) {
          document.body.removeChild(announcement);
        }
      }, 1000);

      // Store timeout ID for cleanup
      timeoutRefs.current.push(timeoutId);

      // Reset animation state after transition
      const animationTimeoutId = setTimeout(() => {
        setIsAnimating(false);
      }, 200);
      timeoutRefs.current.push(animationTimeoutId);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle Enter and Space key activation
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        // Store current focus for restoration after theme change
        const currentTarget = event.currentTarget;

        handleToggle();

        // Ensure focus remains on the button after theme change
        const focusTimeoutId = setTimeout(() => {
          if (currentTarget && document.contains(currentTarget)) {
            currentTarget.focus();
          }
        }, 50);
        timeoutRefs.current.push(focusTimeoutId);
      }

      // Call any additional keyDown handler passed as prop
      props.onKeyDown?.(event);
    };

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
      return (
        <button
          className={cn(themeToggleVariants({ variant, size, className }))}
          disabled
          aria-hidden="true"
        >
          <span className="sr-only">Loading theme toggle</span>
        </button>
      );
    }

    const isDark = resolvedTheme === 'dark';
    const ariaLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    const title = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
      <button
        ref={ref}
        className={cn(themeToggleVariants({ variant, size, className }))}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        type="button"
        aria-label={ariaLabel}
        title={title}
        role="switch"
        aria-checked={isDark}
        {...props}
      >
        {/* Enhanced screen reader context */}
        <span className="sr-only">
          Theme toggle button. Current theme: {resolvedTheme} mode. {ariaLabel}.
        </span>

        {/* Icon container with animation */}
        <div className="relative flex h-5 w-5 items-center justify-center">
          {/* Sun icon for light mode */}
          <HiSun
            className={cn(
              'absolute inset-0 h-5 w-5 transition-all duration-200',
              isDark
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100',
              isAnimating && 'transition-transform'
            )}
            aria-hidden="true"
          />

          {/* Moon icon for dark mode */}
          <HiMoon
            className={cn(
              'absolute inset-0 h-5 w-5 transition-all duration-200',
              isDark
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0',
              isAnimating && 'transition-transform'
            )}
            aria-hidden="true"
          />
        </div>

        {/* Enhanced live region for screen reader announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
          aria-label="Theme change status"
        >
          {isAnimating &&
            `Theme changed to ${resolvedTheme} mode. Page appearance updated.`}
        </div>
      </button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle, themeToggleVariants };
