import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/lib/i18n';

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

  const t = await getTranslations('hero');

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-4xl font-bold">
          {t('greeting')} Modern Portfolio
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          {t('description')}
        </p>
      </div>
    </main>
  );
};

export default HomePage;
