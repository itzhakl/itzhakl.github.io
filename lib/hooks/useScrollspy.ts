'use client';

import { useEffect, useState } from 'react';

interface UseScrollspyOptions {
  sectionIds: string[];
  threshold?: number;
  rootMargin?: string;
}

const useScrollspy = ({
  sectionIds,
  threshold = 0.3,
  rootMargin = '-20% 0px -35% 0px',
}: UseScrollspyOptions) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Sort by intersection ratio and get the most visible section
          const mostVisible = visibleEntries.reduce((prev, current) => {
            return current.intersectionRatio > prev.intersectionRatio
              ? current
              : prev;
          });

          setActiveSection(mostVisible.target.id);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, threshold, rootMargin]);

  return activeSection;
};

export { useScrollspy };
