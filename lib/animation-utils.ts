/**
 * Animation utilities for performance optimization and testing
 */

// Performance monitoring utilities
export const measureAnimationPerformance = () => {
  let frameCount = 0;
  let startTime = performance.now();

  const measureFrame = () => {
    const currentTime = performance.now();
    frameCount++;

    // Calculate FPS every second
    if (currentTime - startTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - startTime));

      if (fps < 55) {
        // eslint-disable-next-line no-console
        console.warn(`Animation performance warning: ${fps} FPS detected`);
      }

      // Reset counters
      frameCount = 0;
      startTime = currentTime;
    }

    requestAnimationFrame(measureFrame);
  };

  requestAnimationFrame(measureFrame);
};

// Device capability detection
export const getDeviceCapabilities = () => {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  return {
    hasWebGL: !!gl,
    hasHardwareAcceleration: !!gl,
    devicePixelRatio: window.devicePixelRatio || 1,
    isHighDPI: (window.devicePixelRatio || 1) > 1,
    isMobile:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    isLowEndDevice: navigator.hardwareConcurrency <= 2,
    supportsPassiveEvents: (() => {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get() {
            supportsPassive = true;
            return true;
          },
        });
        window.addEventListener('testPassive', () => {}, opts);
        window.removeEventListener('testPassive', () => {}, opts);
      } catch (e) {}
      return supportsPassive;
    })(),
  };
};

// Adaptive animation configuration based on device capabilities
export const getOptimalAnimationConfig = () => {
  const capabilities = getDeviceCapabilities();

  if (capabilities.isLowEndDevice || !capabilities.hasHardwareAcceleration) {
    return {
      reducedAnimations: true,
      maxConcurrentAnimations: 3,
      simplifiedEffects: true,
      duration: 0.2,
      staggerDelay: 0.05,
    };
  }

  if (capabilities.isMobile) {
    return {
      reducedAnimations: false,
      maxConcurrentAnimations: 5,
      simplifiedEffects: false,
      duration: 0.3,
      staggerDelay: 0.08,
    };
  }

  return {
    reducedAnimations: false,
    maxConcurrentAnimations: 10,
    simplifiedEffects: false,
    duration: 0.3,
    staggerDelay: 0.1,
  };
};

// Animation queue manager for performance
class AnimationQueue {
  private queue: Array<() => void> = [];
  private running = false;
  private maxConcurrent: number;

  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  add(animation: () => void) {
    this.queue.push(animation);
    this.process();
  }

  private async process() {
    if (this.running || this.queue.length === 0) return;

    this.running = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.maxConcurrent);

      // Execute animations in parallel
      await Promise.all(
        batch.map(
          (animation) =>
            new Promise<void>((resolve) => {
              animation();
              // Wait for next frame to ensure smooth execution
              requestAnimationFrame(() => resolve());
            })
        )
      );

      // Small delay between batches to prevent overwhelming the main thread
      await new Promise((resolve) => setTimeout(resolve, 16)); // ~60fps
    }

    this.running = false;
  }
}

export const animationQueue = new AnimationQueue();

// Intersection Observer with performance optimizations
export const createOptimizedObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
    ...options,
  };

  // Use passive event listeners if supported
  const capabilities = getDeviceCapabilities();
  if (capabilities.supportsPassiveEvents) {
    // Observer will automatically use passive listeners
  }

  return new IntersectionObserver(callback, defaultOptions);
};

// CSS-in-JS performance utilities
export const createGPUOptimizedStyles = (
  additionalStyles: Record<string, unknown> = {}
) => ({
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  transform: 'translateZ(0)', // Force GPU layer
  ...additionalStyles,
});

// Animation testing utilities for development
export const testAnimationPerformance = (
  animationName: string,
  duration = 5000
) => {
  if (process.env.NODE_ENV !== 'development') return;

  // eslint-disable-next-line no-console
  console.log(`Testing animation performance for: ${animationName}`);

  const startTime = performance.now();
  let frameCount = 0;
  let minFPS = Infinity;
  let maxFPS = 0;
  let lastFrameTime = startTime;

  const measureFrame = (currentTime: number) => {
    frameCount++;
    const frameDuration = currentTime - lastFrameTime;
    const fps = 1000 / frameDuration;

    minFPS = Math.min(minFPS, fps);
    maxFPS = Math.max(maxFPS, fps);
    lastFrameTime = currentTime;

    if (currentTime - startTime < duration) {
      requestAnimationFrame(measureFrame);
    } else {
      const avgFPS = (frameCount * 1000) / (currentTime - startTime);
      // eslint-disable-next-line no-console
      console.log(`Animation performance results for ${animationName}:`, {
        averageFPS: Math.round(avgFPS),
        minFPS: Math.round(minFPS),
        maxFPS: Math.round(maxFPS),
        totalFrames: frameCount,
        duration: Math.round(currentTime - startTime),
      });
    }
  };

  requestAnimationFrame(measureFrame);
};
