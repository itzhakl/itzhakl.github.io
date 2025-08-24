'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const About = () => {
  const t = useTranslations('about');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const coreStrengths = [
    'React',
    'Node.js',
    'Next.js',
    'Python',
    'TypeScript',
    'GIS Tools',
    'Leadership',
    'Mentoring',
    'Test Automation',
    'AI Bots',
  ];

  return (
    <section id="about" className="py-20" aria-label="About section" ref={ref}>
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
        >
          {/* Section Heading */}
          <motion.div variants={fadeInUp} className="mb-16">
            <SectionHeading
              title={t('title')}
              description={t('description')}
              align="center"
            />
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Professional Summary */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full p-8">
                <h3 className="mb-6 text-2xl font-bold text-foreground">
                  {t('summary.title')}
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">{t('summary.paragraph1')}</p>
                  <p className="leading-relaxed">{t('summary.paragraph2')}</p>
                  <p className="leading-relaxed">{t('summary.paragraph3')}</p>
                </div>
              </Card>
            </motion.div>

            {/* Core Strengths */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full p-8">
                <h3 className="mb-6 text-2xl font-bold text-foreground">
                  {t('strengths.title')}
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      {t('strengths.technical')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {coreStrengths.slice(0, 6).map((strength) => (
                        <Badge key={strength} variant="secondary">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      {t('strengths.leadership')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {coreStrengths.slice(6).map((strength) => (
                        <Badge key={strength} variant="outline">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t('strengths.description')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Key Highlights */}
          <motion.div variants={fadeInUp} className="mt-12">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 text-center">
                <div className="mb-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl font-bold text-primary">🚀</span>
                  </div>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  {t('highlights.fullstack.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('highlights.fullstack.description')}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="mb-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl font-bold text-primary">🗺️</span>
                  </div>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  {t('highlights.gis.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('highlights.gis.description')}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="mb-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl font-bold text-primary">👥</span>
                  </div>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  {t('highlights.leadership.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('highlights.leadership.description')}
                </p>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
