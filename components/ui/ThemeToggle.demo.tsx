'use client';

import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

export const ThemeToggleDemo = () => {
  return (
    <ThemeProvider>
      <div className="space-y-4 p-8">
        <h2 className="text-2xl font-bold">ThemeToggle Component Demo</h2>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Default</h3>
            <ThemeToggle />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Sizes</h3>
            <div className="flex items-center gap-4">
              <ThemeToggle size="sm" />
              <ThemeToggle size="md" />
              <ThemeToggle size="lg" />
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Variants</h3>
            <div className="flex items-center gap-4">
              <ThemeToggle variant="ghost" />
              <ThemeToggle variant="outline" />
              <ThemeToggle variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
