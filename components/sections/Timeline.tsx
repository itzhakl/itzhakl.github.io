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
  civilian:
    'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
  education:
    'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400 dark:border-green-500/30',
  idf: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
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
            {/* Timeline connector line */}
            <motion.div
              variants={timelineConnector}
              className={`absolute bottom-0 top-0 w-0.5 origin-top bg-border ${
                isRTL ? 'right-6 md:right-1/2' : 'left-6 md:left-1/2'
              }`}
              style={{ transformOrigin: 'top' }}
            />

            {/* Timeline items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={`${item.year}-${index}`}
                  variants={timelineItem}
                  className={`relative flex items-start ${
                    isRTL ? 'md:flex-row-reverse' : ''
                  } ${
                    index % 2 === 0 && !isRTL
                      ? 'md:flex-row-reverse'
                      : isRTL && index % 2 === 1
                        ? 'md:flex-row'
                        : ''
                  }`}
                  data-testid="timeline-item"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-surface ${
                      isRTL
                        ? 'right-0 md:right-1/2 md:-mr-6'
                        : 'left-0 md:left-1/2 md:-ml-6'
                    }`}
                  >
                    <span
                      className="text-lg"
                      role="img"
                      aria-label={t(`categories.${item.category}`)}
                    >
                      {categoryIcons[item.category]}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`w-full ${
                      isRTL ? 'pr-16 md:pl-8 md:pr-0' : 'pl-16 md:pl-0 md:pr-8'
                    } ${
                      index % 2 === 0 && !isRTL
                        ? 'md:pl-0 md:pr-8 md:text-right'
                        : isRTL && index % 2 === 1
                          ? 'md:pl-8 md:pr-0 md:text-left'
                          : isRTL
                            ? 'md:text-right'
                            : 'md:text-left'
                    }`}
                  >
                    <Card className="p-6 transition-shadow duration-300 hover:shadow-lg">
                      {/* Year and Category */}
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

                      {/* Title */}
                      <h3 className="mb-2 text-xl font-semibold text-foreground">
                        {item.title[locale]}
                      </h3>

                      {/* Location */}
                      {item.location && (
                        <p className="mb-3 text-sm text-muted-foreground">
                          📍 {item.location[locale]}
                        </p>
                      )}

                      {/* Summary */}
                      <p className="mb-4 leading-relaxed text-muted-foreground">
                        {item.summary[locale]}
                      </p>

                      {/* Tags */}
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
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
