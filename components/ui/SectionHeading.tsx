import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const sectionHeadingVariants = cva('space-y-2', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

const titleVariants = cva(
  'text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
  {
    variants: {
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      align: 'left',
    },
  }
);

const descriptionVariants = cva('text-lg text-muted-foreground max-w-2xl', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center mx-auto',
      right: 'text-right ml-auto',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionHeadingVariants> {
  title: string;
  description?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingId?: string;
  level?: number;
}

const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  (
    {
      className,
      align,
      title,
      description,
      as: Comp = 'h2',
      headingId,
      level,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(sectionHeadingVariants({ align }), className)}
        {...props}
      >
        <Comp
          id={headingId}
          className={cn(titleVariants({ align }))}
          {...(level && { 'aria-level': level })}
        >
          {title}
        </Comp>
        {description && (
          <p
            className={cn(descriptionVariants({ align }))}
            aria-describedby={headingId}
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = 'SectionHeading';

export { SectionHeading };
