'use client';

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseInViewReturn<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  inView: boolean;
  entry: IntersectionObserverEntry | undefined;
}

/**
 * Hook that detects when an element is in view using Intersection Observer
 * Optimized for scroll-triggered animations
 */
const useInView = <T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  rootMargin = '0px 0px -10% 0px',
  triggerOnce = true,
}: UseInViewOptions = {}): UseInViewReturn<T> => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        if (!observerEntry) return;

        const isIntersecting = observerEntry.isIntersecting;

        setEntry(observerEntry);

        if (isIntersecting) {
          setInView(true);

          // If triggerOnce is true, stop observing after first intersection
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView, entry };
};

export { useInView };
