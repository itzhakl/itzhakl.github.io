import { Navbar } from '@/components/navigation';
import {
  About,
  Contact,
  Experience,
  Hero,
  Personal,
  Projects,
  Stack,
  Timeline,
} from '@/components/sections';
import { loadStack } from '@/lib/content';
import { locales } from '@/lib/i18n';
import { setRequestLocale } from 'next-intl/server';

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
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen bg-background text-foreground"
      >
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Timeline Section */}
        <Timeline />

        {/* Stack Section */}
        <div className="bg-muted/30">
          <Stack stackData={stackData} />
        </div>

        {/* Projects Section */}
        <Projects />

        {/* Experience Section */}
        <Experience />

        {/* Personal Section */}
        <div className="bg-muted/30">
          <Personal />
        </div>

        {/* Contact Section */}
        <Contact />
      </main>
    </>
  );
};

export default HomePage;
