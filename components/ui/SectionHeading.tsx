import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sectionHeadingVariants = cva('space-y-2', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

const eyebrowVariants = cva(
  'text-sm font-medium uppercase tracking-wider text-primary',
  {
    variants: {
      align: {
        left: 'text-left',
        center: 'text-center',
      },
    },
    defaultVariants: {
      align: 'left',
    },
  }
);

const titleVariants = cva(
  'text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
  {
    variants: {
      align: {
        left: 'text-left',
        center: 'text-center',
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
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionHeadingVariants> {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  (
    {
      className,
      align,
      eyebrow,
      title,
      description,
      as: Comp = 'h2',
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
        {eyebrow && (
          <p
            className={cn(eyebrowVariants({ align }))}
            aria-label="Section category"
          >
            {eyebrow}
          </p>
        )}
        <Comp className={cn(titleVariants({ align }))}>{title}</Comp>
        {description && (
          <p className={cn(descriptionVariants({ align }))}>{description}</p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = 'SectionHeading';

export { SectionHeading };
