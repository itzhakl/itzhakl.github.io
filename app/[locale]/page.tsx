import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/lib/i18n';
import { Navbar } from '@/components/navigation';
import { Container } from '@/components/ui/Container';

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

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen bg-background text-foreground"
      >
        {/* Hero Section */}
        <section
          id="hero"
          className="flex min-h-screen items-center justify-center pt-16"
        >
          <Container>
            <div className="text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                <span className="text-muted-foreground">
                  {t('hero.greeting')}
                </span>{' '}
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  Itzhak Leshinsky
                </span>
              </h1>
              <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
                {t('hero.tagline')}
              </p>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {t('hero.description')}
              </p>
            </div>
          </Container>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <Container>
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                {t('about.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                {t('about.description')}
              </p>
            </div>
          </Container>
        </section>

        {/* Stack Section */}
        <section id="stack" className="bg-muted/30 py-20">
          <Container>
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                {t('stack.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                {t('stack.description')}
              </p>
            </div>
          </Container>
        </section>

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
