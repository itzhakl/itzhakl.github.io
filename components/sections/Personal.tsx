'use client';

import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

export const Personal = () => {
  const t = useTranslations('personal');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Icons for each category
  const categoryIcons = {
    funFacts: '✨',
    interests: '🎯',
    values: '💎',
  };

  return (
    <section
      id="personal"
      className="py-20"
      aria-label="Personal section"
      ref={ref}
    >
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
        >
          {/* Section Heading */}
          <motion.div variants={fadeInUp} className="mb-16">
            <SectionHeading
              eyebrow={t('eyebrow')}
              title={t('title')}
              description={t('description')}
              align="center"
            />
          </motion.div>

          {/* Personal Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Fun Facts */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full p-8 text-center">
                <div className="mb-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span
                      className="text-3xl"
                      role="img"
                      aria-label="Fun facts"
                    >
                      {categoryIcons.funFacts}
                    </span>
                  </div>
                </div>
                <h3 className="mb-6 text-xl font-bold text-foreground">
                  {t('funFacts.title')}
                </h3>
                <ul className="space-y-4 text-left">
                  {t
                    .raw('funFacts.items')
                    .map((fact: string, index: number) => (
                      <motion.li
                        key={index}
                        variants={fadeInUp}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <span className="leading-relaxed">{fact}</span>
                      </motion.li>
                    ))}
                </ul>
              </Card>
            </motion.div>

            {/* Interests & Hobbies */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full p-8 text-center">
                <div className="mb-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span
                      className="text-3xl"
                      role="img"
                      aria-label="Interests"
                    >
                      {categoryIcons.interests}
                    </span>
                  </div>
                </div>
                <h3 className="mb-6 text-xl font-bold text-foreground">
                  {t('interests.title')}
                </h3>
                <ul className="space-y-4 text-left">
                  {t
                    .raw('interests.items')
                    .map((interest: string, index: number) => (
                      <motion.li
                        key={index}
                        variants={fadeInUp}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <span className="leading-relaxed">{interest}</span>
                      </motion.li>
                    ))}
                </ul>
              </Card>
            </motion.div>

            {/* Core Values */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full p-8 text-center">
                <div className="mb-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-3xl" role="img" aria-label="Values">
                      {categoryIcons.values}
                    </span>
                  </div>
                </div>
                <h3 className="mb-6 text-xl font-bold text-foreground">
                  {t('values.title')}
                </h3>
                <ul className="space-y-4 text-left">
                  {t.raw('values.items').map((value: string, index: number) => (
                    <motion.li
                      key={index}
                      variants={fadeInUp}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="leading-relaxed">{value}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Personal Quote/Message */}
          <motion.div variants={fadeInUp} className="mt-12">
            <Card className="p-8 text-center">
              <blockquote className="text-lg text-muted-foreground">
                <span className="text-4xl text-primary">&ldquo;</span>
                <p className="mx-auto max-w-3xl leading-relaxed">
                  {t('quote')}
                </p>
                <span className="text-4xl text-primary">&rdquo;</span>
              </blockquote>
              <div className="mt-6">
                <div className="mx-auto h-1 w-12 rounded-full bg-primary/30" />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
