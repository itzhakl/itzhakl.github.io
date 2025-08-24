import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo = ({ size = 32, className }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="currentColor"
      className={cn('transition-colors duration-200', className)}
      aria-hidden="true"
      role="img"
    >
      {/* רקע מעוגל */}
      <rect
        x="0"
        y="0"
        width="500"
        height="500"
        rx="80"
        ry="80"
        fill="currentColor"
        className="drop-shadow-sm"
      />

      {/* נקודה עליונה */}
      <circle cx="210" cy="130" r="20" className="fill-background" />

      {/* קו שמאלי */}
      <rect
        x="190"
        y="180"
        width="40"
        height="180"
        rx="20"
        ry="20"
        className="fill-background"
      />

      {/* קו ימני */}
      <rect
        x="270"
        y="110"
        width="40"
        height="250"
        rx="20"
        ry="20"
        className="fill-background"
      />
    </svg>
  );
};

export { Logo };
