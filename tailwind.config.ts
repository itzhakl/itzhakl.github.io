import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        // Blue-Purple Design System - Direct CSS Variables Integration
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          hover: 'var(--color-primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
          hover: 'var(--color-secondary-hover)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
          hover: 'var(--color-accent-hover)',
        },

        // Background and surface colors
        bg: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          secondary: 'var(--color-surface-secondary)',
        },

        // Text colors with semantic naming
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-muted)',
        },

        // Border colors
        border: {
          DEFAULT: 'var(--color-border)',
          secondary: 'var(--color-border-secondary)',
        },

        // Status colors
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          foreground: 'var(--color-warning-foreground)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          foreground: 'var(--color-error-foreground)',
        },

        // Interactive states
        hover: 'var(--color-hover)',
        'focus-ring': 'var(--color-focus-ring)',

        // Brand colors
        brand: {
          gmail: 'var(--color-gmail-red)',
          linkedin: 'var(--color-linkedin-blue)',
          whatsapp: 'var(--color-whatsapp-green)',
          github: 'var(--color-github-gray)',
        },

        // Legacy HSL-based variables for shadcn/ui compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          hover: 'hsl(var(--card-hover))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        focus: 'hsl(var(--focus-ring))',
      },

      // Enhanced shadows with professional depth
      boxShadow: {
        xs: 'var(--shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',

        // Special shadows for interactive elements
        focus: '0 0 0 3px var(--color-focus-ring)',
        'focus-primary': '0 0 0 3px rgba(79, 70, 229, 0.3)',
        'focus-secondary': '0 0 0 3px rgba(124, 58, 237, 0.3)',
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',

        // NEW: Interactive shadows
        'hover-sm': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'hover-md': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'hover-lg': '0 12px 40px rgba(0, 0, 0, 0.15)',
        click: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        neon: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
      },

      // Professional border radius scale
      borderRadius: {
        xs: 'var(--radius-xs, 4px)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl, 20px)',
      },

      // Typography enhancements
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Roboto Mono',
          'Courier New',
          'monospace',
        ],
        hebrew: ['var(--font-hebrew)', 'Inter', 'system-ui', 'sans-serif'],
      },

      // Enhanced animations with modern easing
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        stagger: 'stagger 0.32s cubic-bezier(0.16, 1, 0.3, 1) both',
        glow: 'glow 2s ease-in-out infinite alternate',
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',

        // NEW: Interactive animations
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        shake: 'shake 0.5s ease-in-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        'zoom-in': 'zoomIn 0.2s ease-out',
        'rubber-band': 'rubberBand 1s ease-out',
        'heart-beat': 'heartBeat 1.3s ease-in-out infinite',
        tada: 'tada 1s ease-in-out',
        jello: 'jello 1s ease-in-out',
        swing: 'swing 1s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        stagger: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },

        // NEW: Interactive keyframes
        bounceSubtle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-8px)' },
          '70%': { transform: 'translateY(-4px)' },
          '90%': { transform: 'translateY(-2px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        wiggle: {
          '0%, 7%, 14%, 21%, 28%, 35%, 42%, 49%, 56%, 63%, 70%, 77%, 84%, 91%, 98%, 100%':
            {
              transform: 'rotate(0deg)',
            },
          '3.5%, 10.5%, 17.5%, 24.5%, 31.5%, 38.5%, 45.5%, 52.5%, 59.5%, 66.5%, 73.5%, 80.5%, 87.5%, 94.5%':
            {
              transform: 'rotate(-1deg)',
            },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rubberBand: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
          '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
          '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
          '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
          '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        tada: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '10%, 20%': {
            transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)',
          },
          '30%, 50%, 70%, 90%': {
            transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',
          },
          '40%, 60%, 80%': {
            transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)',
          },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        jello: {
          '0%, 11.1%, 100%': { transform: 'translateX(0)' },
          '22.2%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
          '33.3%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
          '44.4%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
          '55.5%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
          '66.6%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
          '77.7%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
          '88.8%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
        },
        swing: {
          '20%': { transform: 'rotate3d(0, 0, 1, 15deg)' },
          '40%': { transform: 'rotate3d(0, 0, 1, -10deg)' },
          '60%': { transform: 'rotate3d(0, 0, 1, 5deg)' },
          '80%': { transform: 'rotate3d(0, 0, 1, -5deg)' },
          '100%': { transform: 'rotate3d(0, 0, 1, 0deg)' },
        },
      },

      // Enhanced backdrop blur options
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },

      // Extended spacing for layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // Professional transition timing functions
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      // Default transition duration
      transitionDuration: {
        DEFAULT: '200ms',
        '250': '250ms',
        '350': '350ms',
      },

      // Z-index scale for layering
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // Typography scale enhancements
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
      },

      // Professional line heights
      lineHeight: {
        '3': '0.75rem',
        '4': '1rem',
        '11': '2.75rem',
        '12': '3rem',
        '13': '3.25rem',
        '14': '3.5rem',
      },

      // Letter spacing for better readability
      letterSpacing: {
        tightest: '-0.075em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },

      // Professional aspect ratios
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },

      // NEW: Custom transforms for interactions
      scale: {
        '102': '1.02',
        '103': '1.03',
        '97': '0.97',
        '98': '0.98',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    // Plugin לאפקטים גלובליים
    ({
      addUtilities,
      theme,
    }: {
      addUtilities: (
        utilities: Record<string, Record<string, unknown>>
      ) => void;
      theme: (path: string) => unknown;
    }) => {
      const newUtilities = {
        // Glass morphism effect
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },

        // Interactive button effects
        '.btn-hover': {
          transition: 'all 0.2s ease-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.hover-md'),
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: theme('boxShadow.click'),
          },
        },

        '.btn-bounce': {
          transition: 'all 0.2s ease-out',
          '&:hover': {
            animation: 'bounceSubtle 0.6s ease-out',
          },
        },

        '.btn-scale': {
          transition: 'transform 0.15s ease-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },

        // Card hover effects
        '.card-hover': {
          transition: 'all 0.3s ease-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme('boxShadow.hover-lg'),
          },
        },

        '.card-tilt': {
          transition: 'transform 0.3s ease-out',
          '&:hover': {
            transform:
              'perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(10px)',
          },
        },

        // Text effects
        '.text-shimmer': {
          background:
            'linear-gradient(90deg, #9333ea, #3b82f6, #06b6d4, #3b82f6, #9333ea)',
          backgroundSize: '400% 100%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shimmer 3s ease-in-out infinite',
        },

        '.text-glow': {
          textShadow:
            '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        },

        // Neon border effect
        '.border-neon': {
          borderColor: 'currentColor',
          boxShadow: theme('boxShadow.neon'),
        },

        // Pulse ring effect
        '.pulse-ring': {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            border: '2px solid currentColor',
            borderRadius: 'inherit',
            transform: 'translate(-50%, -50%)',
            animation: 'pulseRing 1.5s ease-out infinite',
          },
        },

        // Loading spinner
        '.spinner': {
          width: '20px',
          height: '20px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: 'currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        },
      };

      // Add shimmer and pulse ring keyframes
      addUtilities({
        ...newUtilities,
        '@keyframes shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        '@keyframes pulseRing': {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(2)', opacity: '0' },
        },
      });
    },
  ],
};

export default config;
