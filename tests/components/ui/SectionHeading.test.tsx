import { SectionHeading } from '@/components/ui/SectionHeading';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('SectionHeading Component', () => {
  it('renders title correctly', () => {
    render(<SectionHeading title="Test Title" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
  });

  it('renders eyebrow text when provided', () => {
    render(<SectionHeading eyebrow="About Me" title="My Story" />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'My Story'
    );
  });

  it('renders description when provided', () => {
    render(
      <SectionHeading
        title="Test Title"
        description="This is a test description"
      />
    );
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders all parts together', () => {
    render(
      <SectionHeading
        eyebrow="Section"
        title="Complete Heading"
        description="With all parts included"
      />
    );

    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Complete Heading'
    );
    expect(screen.getByText('With all parts included')).toBeInTheDocument();
  });

  it('applies center alignment when specified', () => {
    const { container } = render(
      <SectionHeading title="Centered Title" align="center" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('text-center');
  });

  it('applies left alignment by default', () => {
    const { container } = render(<SectionHeading title="Left Title" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveClass('text-center');
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <SectionHeading
        eyebrow="Accessible"
        title="Section Heading"
        description="This heading is accessible"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper heading hierarchy', () => {
    render(<SectionHeading title="Main Section" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('eyebrow text has proper styling', () => {
    render(<SectionHeading eyebrow="Eyebrow" title="Title" />);
    const eyebrow = screen.getByText('Eyebrow');
    expect(eyebrow).toHaveClass('text-primary');
    expect(eyebrow).toHaveClass('text-sm');
  });

  it('description has proper styling', () => {
    render(<SectionHeading title="Title" description="Description text" />);
    const description = screen.getByText('Description text');
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('supports custom className', () => {
    const { container } = render(
      <SectionHeading title="Custom" className="custom-class" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('maintains proper spacing between elements', () => {
    render(
      <SectionHeading
        eyebrow="Eyebrow"
        title="Title"
        description="Description"
      />
    );

    // Check that all elements are present and properly structured
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
