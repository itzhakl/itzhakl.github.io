import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'white' | 'dark';
  interactive?: boolean;
}

const Logo = ({
  size = 32,
  className,
  variant = 'primary',
  interactive = false,
}: LogoProps) => {
  const variants = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    white: 'text-white',
    dark: 'text-text',
  };

  return (
    <svg
      width={size}
      viewBox="0 0 500 500"
      className={cn(
        'transition-all duration-300',
        variants[variant],
        interactive && 'cursor-pointer hover:scale-105 hover:drop-shadow-lg',
        className
      )}
      role="img"
      aria-label="לוגו"
    >
      <rect x="0" y="0" width="500" height="500" rx="80" fill="currentColor" />
      <circle cx="210" cy="130" r="20" className="fill-white" />
      <rect
        x="190"
        y="180"
        width="40"
        height="180"
        rx="20"
        className="fill-white"
      />
      <rect
        x="270"
        y="110"
        width="40"
        height="250"
        rx="20"
        className="fill-white"
      />
    </svg>
  );
};

export { Logo };
