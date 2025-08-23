// Dynamic import for development only
const AccessibilityTesterWrapper = dynamic(() => {
  if (process.env.NODE_ENV === 'development') {
    return import('@/components/dev/AccessibilityTesterWrapper').then(
      (mod) => mod.AccessibilityTesterWrapper
    );
  }
  return Promise.resolve(() => null);
});
import { Navbar } from '@/components/navigation';
import { AccessibilityProvider } from '@/components/providers/AccessibilityProvider';
import { About, Hero } from '@/components/sections';
import { loadStack } from '@/lib/content';
import { locales } from '@/lib/i18n';
import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

// Dynamic imports for heavy components with Framer Motion
const Timeline = dynamic(
  () =>
    import('@/components/sections/Timeline').then((mod) => ({
      default: mod.Timeline,
    })),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
    ),
  }
);

const Stack = dynamic(
  () =>
    import('@/components/sections/Stack').then((mod) => ({
      default: mod.Stack,
    })),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
    ),
  }
);

const Projects = dynamic(
  () =>
    import('@/components/sections/Projects').then((mod) => ({
      default: mod.Projects,
    })),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
    ),
  }
);

const Experience = dynamic(
  () =>
    import('@/components/sections/Experience').then((mod) => ({
      default: mod.Experience,
    })),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
    ),
  }
);

const Personal = dynamic(
  () =>
    import('@/components/sections/Personal').then((mod) => ({
      default: mod.Personal,
    })),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
    ),
  }
);

const Contact = dynamic(
  () =>
    import('@/components/sections/Contact').then((mod) => ({
      default: mod.Contact,
    })),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
    ),
  }
);

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// Generate static params for all locales
export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Load content data on server side
  const stackData = loadStack();

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <main
          id="main-content"
          className="min-h-screen"
          role="main"
          aria-label="Main content"
        >
          {/* Hero Section */}
          <section aria-labelledby="hero-heading">
            <Hero />
          </section>

          {/* About Section */}
          <section aria-labelledby="about-heading">
            <About />
          </section>

          {/* Timeline Section */}
          <section aria-labelledby="timeline-heading">
            <Timeline />
          </section>

          {/* Stack Section */}
          <section aria-labelledby="stack-heading" className="bg-muted/30">
            <Stack stackData={stackData} />
          </section>

          {/* Projects Section */}
          <section aria-labelledby="projects-heading">
            <Projects />
          </section>

          {/* Experience Section */}
          <section aria-labelledby="experience-heading">
            <Experience />
          </section>

          {/* Personal Section */}
          <section aria-labelledby="personal-heading" className="bg-muted/30">
            <Personal />
          </section>

          {/* Contact Section */}
          <section aria-labelledby="contact-heading">
            <Contact />
          </section>
        </main>

        {/* Live region for announcements */}
        <div
          id="announcements"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        {/* Assertive live region for urgent announcements */}
        <div
          id="urgent-announcements"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        />

        {/* Development accessibility testing */}
        <AccessibilityTesterWrapper />
      </div>
    </AccessibilityProvider>
  );
};

export default HomePage;
