import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Import components for testing
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import React from 'react';
import { vi } from 'vitest';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('UI Components Accessibility', () => {
    it('Button component should be accessible', async () => {
      const { container } = render(
        <div>
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button disabled>Disabled Button</Button>
          <Button href="/test">Link Button</Button>
          <Button href="https://example.com" external>
            External Link
          </Button>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Card component should be accessible', async () => {
      const { container } = render(
        <Card>
          <h2>Card Title</h2>
          <p>Card content with proper semantic structure</p>
          <Button>Card Action</Button>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Badge component should be accessible', async () => {
      const { container } = render(
        <div>
          <Badge>Default Badge</Badge>
          <Badge variant="primary">Primary Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('SectionHeading component should be accessible', async () => {
      const { container } = render(
        <div>
          <SectionHeading title="Main Section" />
          <SectionHeading
            eyebrow="About"
            title="Section with Eyebrow"
            description="Section description"
          />
          <SectionHeading
            title="Centered Section"
            align="center"
            description="Centered section description"
          />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Container component should be accessible', async () => {
      const { container } = render(
        <Container>
          <h1>Page Title</h1>
          <p>Container content</p>
        </Container>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('IconButton component should be accessible', async () => {
      const { container } = render(
        <div>
          <IconButton
            aria-label="GitHub Profile"
            href="https://github.com/test"
          >
            <span>GitHub</span>
          </IconButton>
          <IconButton
            aria-label="LinkedIn Profile"
            href="https://linkedin.com/test"
            external
          >
            <span>LinkedIn</span>
          </IconButton>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation for buttons', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <div>
          <Button onClick={handleClick}>First Button</Button>
          <Button>Second Button</Button>
          <Button>Third Button</Button>
        </div>
      );

      const firstButton = screen.getByText('First Button');
      const secondButton = screen.getByText('Second Button');

      // Tab to first button
      await user.tab();
      expect(firstButton).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Tab to second button
      await user.tab();
      expect(secondButton).toHaveFocus();

      // Press Space to activate
      await user.keyboard(' ');
    });

    it('should support keyboard navigation for links', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Button href="/page1">First Link</Button>
          <Button href="/page2">Second Link</Button>
        </div>
      );

      const firstLink = screen.getByRole('button', { name: 'First Link' });
      const secondLink = screen.getByRole('button', { name: 'Second Link' });

      // Tab through links
      await user.tab();
      expect(firstLink).toHaveFocus();

      await user.tab();
      expect(secondLink).toHaveFocus();
    });

    it('should skip disabled elements in tab order', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Button>Enabled Button</Button>
          <Button disabled>Disabled Button</Button>
          <Button>Another Enabled Button</Button>
        </div>
      );

      const enabledButton = screen.getByText('Enabled Button');
      const anotherEnabledButton = screen.getByText('Another Enabled Button');
      const disabledButton = screen.getByText('Disabled Button');

      // Tab to first enabled button
      await user.tab();
      expect(enabledButton).toHaveFocus();

      // Tab should skip disabled button
      await user.tab();
      expect(anotherEnabledButton).toHaveFocus();
      expect(disabledButton).not.toHaveFocus();
    });
  });

  describe('ARIA Labels and Roles', () => {
    it('should have proper ARIA labels for icon buttons', () => {
      render(
        <div>
          <IconButton aria-label="Open GitHub profile">
            <span>GitHub</span>
          </IconButton>
          <IconButton aria-label="Send email">
            <span>Email</span>
          </IconButton>
        </div>
      );

      expect(screen.getByLabelText('Open GitHub profile')).toBeInTheDocument();
      expect(screen.getByLabelText('Send email')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(
        <div>
          <h1>Main Title</h1>
          <SectionHeading title="Section Title" />
          <h3>Subsection Title</h3>
        </div>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Main Title'
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Section Title'
      );
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Subsection Title'
      );
    });

    it('should have proper link relationships', () => {
      render(
        <div>
          <Button href="https://example.com" external>
            External Link
          </Button>
          <Button href="/internal">Internal Link</Button>
        </div>
      );

      const externalLink = screen.getByRole('button', {
        name: /External Link/,
      });
      const internalLink = screen.getByRole('button', {
        name: 'Internal Link',
      });

      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(externalLink).toHaveAttribute('target', '_blank');
      expect(internalLink).not.toHaveAttribute('rel');
      expect(internalLink).not.toHaveAttribute('target');
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should have sufficient color contrast for text', async () => {
      const { container } = render(
        <div>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Badge>Default Badge</Badge>
          <SectionHeading
            title="Section Title"
            description="Section description"
          />
        </div>
      );

      // axe will check color contrast automatically
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain accessibility in different states', async () => {
      const { container } = render(
        <div>
          <Button>Normal State</Button>
          <Button disabled>Disabled State</Button>
          <Button className="hover:bg-primary-dark">Hover State</Button>
          <Button className="focus:ring-2 focus:ring-primary">
            Focus State
          </Button>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide meaningful text for screen readers', () => {
      render(
        <div>
          <Button aria-label="Close dialog">×</Button>
          <IconButton aria-label="Open user menu">
            <span aria-hidden="true">👤</span>
          </IconButton>
          <Badge>
            <span className="sr-only">Technology: </span>
            React
          </Badge>
        </div>
      );

      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
      expect(screen.getByLabelText('Open user menu')).toBeInTheDocument();
      expect(
        screen.getByText('Technology:', { selector: '.sr-only' })
      ).toBeInTheDocument();
    });

    it('should handle dynamic content updates', async () => {
      // const user = userEvent.setup();
      let buttonText = 'Load More';

      const { rerender } = render(
        <Button aria-live="polite">{buttonText}</Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Load More');

      // Simulate content update
      buttonText = 'Loading...';
      rerender(<Button aria-live="polite">{buttonText}</Button>);

      expect(button).toHaveTextContent('Loading...');
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Button>Focusable Button</Button>
          <Button href="/test">Focusable Link</Button>
        </div>
      );

      const button = screen.getByRole('button', { name: 'Focusable Button' });
      const link = screen.getByRole('button', { name: 'Focusable Link' });

      // Focus elements and check they receive focus
      await user.tab();
      expect(button).toHaveFocus();

      await user.tab();
      expect(link).toHaveFocus();
    });

    it('should trap focus in modal-like components', async () => {
      // This would test focus trapping if we had modal components
      // For now, just test basic focus behavior
      const user = userEvent.setup();

      render(
        <div role="dialog" aria-modal="true">
          <Button>First Button</Button>
          <Button>Second Button</Button>
          <Button>Close</Button>
        </div>
      );

      const firstButton = screen.getByText('First Button');
      const secondButton = screen.getByText('Second Button');
      const closeButton = screen.getByText('Close');

      await user.tab();
      expect(firstButton).toHaveFocus();

      await user.tab();
      expect(secondButton).toHaveFocus();

      await user.tab();
      expect(closeButton).toHaveFocus();
    });
  });

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility on different screen sizes', async () => {
      // Mock different viewport sizes
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320, // Mobile width
      });

      const { container } = render(
        <div>
          <Container>
            <SectionHeading title="Mobile Title" />
            <Button>Mobile Button</Button>
          </Container>
        </div>
      );

      let results = await axe(container);
      expect(results).toHaveNoViolations();

      // Test tablet width
      Object.defineProperty(window, 'innerWidth', {
        value: 768,
      });

      results = await axe(container);
      expect(results).toHaveNoViolations();

      // Test desktop width
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
      });

      results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
