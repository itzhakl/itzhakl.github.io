import { Card } from '@/components/ui/Card';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('rounded-lg');
  });

  it('applies hover effects when hover prop is true', () => {
    const { container } = render(<Card hover>Hoverable Card</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('hover:bg-card-hover');
    expect(card).toHaveClass('transition-colors');
  });

  it('applies different padding sizes', () => {
    const { container, rerender } = render(
      <Card padding="sm">Small Padding</Card>
    );
    let card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-4');

    rerender(<Card padding="md">Medium Padding</Card>);
    card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-6');

    rerender(<Card padding="lg">Large Padding</Card>);
    card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-8');
  });

  it('merges custom className with default classes', () => {
    const { container } = render(
      <Card className="custom-class">Custom Card</Card>
    );
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-card'); // Still has default classes
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Card>
        <h2>Accessible Card</h2>
        <p>This card should be accessible</p>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders with proper semantic structure', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card description</p>
      </Card>
    );

    // Check that content is properly structured
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Card Title');
  });

  it('supports complex content structures', () => {
    render(
      <Card>
        <header>
          <h3>Card Header</h3>
        </header>
        <main>
          <p>Main content</p>
        </main>
        <footer>
          <button>Action</button>
        </footer>
      </Card>
    );

    expect(screen.getByText('Card Header')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
