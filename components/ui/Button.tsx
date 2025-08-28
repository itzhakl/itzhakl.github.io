import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:brightness-95 focus:ring-4 focus:ring-accent/30 shadow-sm',
        secondary:
          'bg-transparent border border-border text-primary hover:bg-surface/70 focus:ring-4 focus:ring-accent/30',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        icon: 'hover:bg-accent hover:text-accent-foreground rounded-full',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-5 py-2',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  external?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, external, children, ...props }, ref) => {
    if (href) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(external && {
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': props['aria-label']
              ? `${props['aria-label']} (opens in new tab)`
              : undefined,
          })}
          role="button"
        >
          {children}
          {external && <span className="sr-only"> (opens in new tab)</span>}
        </a>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={props.type || 'button'}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
