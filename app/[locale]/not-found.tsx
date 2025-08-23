import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const NotFound = () => {
  const t = useTranslations('navigation');

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <Container>
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
          <p className="mb-8 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button href="/" variant="primary">
            {t('home')}
          </Button>
        </div>
      </Container>
    </main>
  );
};

export default NotFound;
