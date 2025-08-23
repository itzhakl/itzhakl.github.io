import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  href?: string;
  external?: boolean;
  'aria-label': string; // Make aria-label required for accessibility
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, href, external, children, ...props }, ref) => {
    const ariaLabel =
      external && href
        ? `${props['aria-label']} (opens in new tab)`
        : props['aria-label'];

    if (href) {
      return (
        <a
          href={href}
          className={cn(iconButtonVariants({ variant, size, className }))}
          {...(external && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
          aria-label={ariaLabel}
          role="button"
          title={props['aria-label']}
        >
          {children}
          {external && <span className="sr-only"> (opens in new tab)</span>}
        </a>
      );
    }

    return (
      <button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        type={props.type || 'button'}
        title={props['aria-label']}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
