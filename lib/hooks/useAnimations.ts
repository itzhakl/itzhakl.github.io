'use client';

import { Variants } from 'framer-motion';
import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

interface UseAnimationsOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseAnimationsReturn<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  controls: {
    initial: string;
    animate: string;
  };
  variants: Variants;
}

/**
 * Combined hook that handles reduced motion preferences and in-view animations
 * Returns optimized animation controls based on user preferences and viewport visibility
 */
const useAnimations = <T extends HTMLElement = HTMLElement>(
  animationVariants: Variants,
  options: UseAnimationsOptions = {}
): UseAnimationsReturn<T> => {
  const prefersReducedMotion = useReducedMotion();
  const { ref, inView } = useInView<T>({
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '0px 0px -10% 0px',
    triggerOnce: options.triggerOnce !== false, // Default to true
  });

  // Create reduced motion variants
  const reducedMotionVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: 'linear',
      },
    },
  };

  // Choose variants based on user preference
  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : animationVariants;

  // Control animation state based on in-view status
  const controls = {
    initial: 'initial',
    animate: inView ? 'animate' : 'initial',
  };

  return {
    ref,
    controls,
    variants,
  };
};

export { useAnimations };
