import { Badge } from '@/components/ui/Badge';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Badge Component', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary');

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

    rerender(<Badge variant="muted">Muted</Badge>);
    expect(screen.getByText('Muted')).toHaveClass('bg-muted');
  });

  it('has consistent text size', () => {
    render(<Badge>Badge Text</Badge>);
    expect(screen.getByText('Badge Text')).toHaveClass('text-xs');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('bg-primary'); // Still has default classes
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(<Badge>Accessible Badge</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders as div element by default', () => {
    render(<Badge>Div Badge</Badge>);
    const badge = screen.getByText('Div Badge');
    expect(badge.tagName).toBe('DIV');
  });

  it('supports complex content', () => {
    render(
      <Badge>
        <span>React</span>
        <span>⚛️</span>
      </Badge>
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('⚛️')).toBeInTheDocument();
  });

  it('has proper styling for readability', () => {
    render(<Badge>Readable Badge</Badge>);
    const badge = screen.getByText('Readable Badge');

    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('px-2.5');
    expect(badge).toHaveClass('py-0.5');
  });

  it('maintains consistent styling across variants', () => {
    const variants = ['default', 'primary', 'secondary'] as const;

    variants.forEach((variant) => {
      const { container } = render(<Badge variant={variant}>Test</Badge>);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('rounded-full');
    });
  });
});
