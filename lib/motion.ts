import { Transition, Variants } from 'framer-motion';

// Re-export animation utilities
export {
  animationQueue,
  createGPUOptimizedStyles,
  getOptimalAnimationConfig,
  testAnimationPerformance,
} from './animation-utils';

// Performance-optimized transition settings
export const SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
  mass: 1,
};

export const EASE_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
};

export const FAST_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
};

export const SLOW_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.6,
  ease: 'easeOut',
};

// GPU-accelerated transform properties
export const GPU_OPTIMIZED_STYLES = {
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
};

// Fade in from bottom animation - GPU optimized
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: EASE_TRANSITION,
  },
};

// Stagger container for child animations
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

// Scale in animation for buttons and interactive elements - GPU optimized
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: SPRING_TRANSITION,
  },
};

// Slide in from left animation - GPU optimized
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: EASE_TRANSITION,
  },
};

// Slide in from right animation - GPU optimized
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 20,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: EASE_TRANSITION,
  },
};

// Hero specific animations - GPU optimized
export const heroGreeting: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: SLOW_TRANSITION,
  },
};

export const heroTagline: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...EASE_TRANSITION,
      delay: 0.2,
    },
  },
};

export const heroActions: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...EASE_TRANSITION,
      delay: 0.4,
    },
  },
};

export const heroSocial: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      ...SPRING_TRANSITION,
      delay: 0.6,
    },
  },
};

// Timeline specific animations - GPU optimized
export const timelineContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export const timelineItem: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: EASE_TRANSITION,
  },
};

export const timelineConnector: Variants = {
  initial: {
    scaleY: 0,
    transformOrigin: 'top',
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    scaleY: 1,
    transition: {
      ...SLOW_TRANSITION,
      delay: 0.2,
    },
  },
};

// Stack specific animations - GPU optimized
export const stackContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export const stackCategory: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: EASE_TRANSITION,
  },
};

export const stackItemContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export const stackItem: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: FAST_TRANSITION,
  },
};

// Projects specific animations - GPU optimized
export const projectsContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export const projectCard: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: EASE_TRANSITION,
  },
};

export const projectCardHover: Variants = {
  hover: {
    y: -8,
    rotateX: 2,
    rotateY: 2,
    scale: 1.02,
    transition: {
      ...FAST_TRANSITION,
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

// Experience specific animations - GPU optimized
export const experienceContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export const experienceCategory: Variants = {
  initial: {
    opacity: 0,
    y: 40,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: EASE_TRANSITION,
  },
};

export const experienceItem: Variants = {
  initial: {
    opacity: 0,
    x: -30,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: EASE_TRANSITION,
  },
};

export const experienceAchievements: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export const experienceAchievement: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: FAST_TRANSITION,
  },
};

// Contact specific animations - GPU optimized
export const contactContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export const contactButton: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING_TRANSITION,
  },
};

// Additional utility animations for common use cases
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: FAST_TRANSITION,
  },
};

export const slideUp: Variants = {
  initial: {
    y: 100,
    opacity: 0,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: EASE_TRANSITION,
  },
};

export const slideDown: Variants = {
  initial: {
    y: -100,
    opacity: 0,
    ...GPU_OPTIMIZED_STYLES,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: EASE_TRANSITION,
  },
};

// Hover animations for interactive elements
export const buttonHover: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

export const cardHover: Variants = {
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};
