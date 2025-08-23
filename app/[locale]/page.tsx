import { Navbar } from '@/components/navigation';
import { About, Hero, Stack, Timeline } from '@/components/sections';
import { Container } from '@/components/ui/Container';
import { loadStack } from '@/lib/content';
import { locales } from '@/lib/i18n';
import { getTranslations, setRequestLocale } from 'next-intl/server';

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

  const t = await getTranslations();

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
        <section id="projects" className="py-20">
          <Container>
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                {t('projects.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                {t('projects.description')}
              </p>
            </div>
          </Container>
        </section>

        {/* Experience Section */}
        <section id="experience" className="bg-muted/30 py-20">
          <Container>
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                {t('experience.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                {t('experience.description')}
              </p>
            </div>
          </Container>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <Container>
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                {t('contact.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                {t('contact.description')}
              </p>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
};

export default HomePage;
