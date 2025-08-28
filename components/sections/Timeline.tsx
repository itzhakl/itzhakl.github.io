'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  fadeInUp,
  timelineConnector,
  timelineContainer,
  timelineItem,
} from '@/lib/motion';
import { motion, useInView } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useRef } from 'react';

// Import timeline data
import timelineData from '@/content/timeline.json';

interface TimelineItem {
  year: string;
  title: {
    en: string;
    he: string;
  };
  summary: {
    en: string;
    he: string;
  };
  tags: string[];
  category: 'civilian' | 'education' | 'idf';
  location?: {
    en: string;
    he: string;
  };
}

const categoryColors = {
  civilian: 'bg-primary/10 text-primary border-primary/20',
  education: 'bg-success/10 text-success border-success/20',
  idf: 'bg-secondary/10 text-secondary border-secondary/20',
};

const categoryIcons = {
  civilian: '💼',
  education: '🎓',
  idf: '🛡️',
};

export const Timeline = () => {
  const t = useTranslations('timeline');
  const locale = useLocale() as 'en' | 'he';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isRTL = locale === 'he';

  const timeline = timelineData as TimelineItem[];

  return (
    <section
      id="timeline"
      className="py-20"
      aria-label="Career timeline section"
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Container>
        <motion.div
          variants={timelineContainer}
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

          {/* Timeline */}
          <div className="relative">
            {/* Connector line */}
            <motion.div
              variants={timelineConnector}
              className={`absolute bottom-0 top-0 w-0.5 origin-top bg-border md:left-1/2`}
              style={{ transformOrigin: 'top' }}
            />

            {/* Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={`${item.year}-${index}`}
                    variants={timelineItem}
                    className={`relative flex items-start ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-surface md:left-1/2 md:-translate-x-1/2">
                      <span
                        className="text-lg"
                        role="img"
                        aria-label={t(`categories.${item.category}`)}
                      >
                        {categoryIcons[item.category]}
                      </span>
                    </div>

                    {/* תמונה */}
                    <div className="flex w-full items-center justify-center p-4 md:w-1/3">
                      <img
                        src={`/images/timeline/${item.year}.jpg`}
                        alt={item.title[locale]}
                        className="h-48 w-full rounded-2xl object-cover shadow-md"
                      />
                    </div>

                    {/* תוכן */}
                    <div className="w-full p-4 md:w-2/3">
                      <Card className="p-6 transition-shadow duration-300 hover:shadow-lg">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <time
                            className="text-2xl font-bold text-primary"
                            dateTime={item.year}
                          >
                            {item.year}
                          </time>
                          <Badge
                            variant="outline"
                            className={categoryColors[item.category]}
                          >
                            {t(`categories.${item.category}`)}
                          </Badge>
                        </div>

                        <h3 className="mb-2 text-xl font-semibold text-foreground">
                          {item.title[locale]}
                        </h3>

                        {item.location && (
                          <p className="mb-3 text-sm text-muted-foreground">
                            📍 {item.location[locale]}
                          </p>
                        )}

                        <p className="mb-4 leading-relaxed text-muted-foreground">
                          {item.summary[locale]}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
