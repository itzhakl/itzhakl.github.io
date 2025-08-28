'use client';

import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  experienceAchievement,
  experienceAchievements,
  experienceCategory,
  experienceContainer,
  experienceItem,
} from '@/lib/motion';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

interface ExperienceItemProps {
  namespace: string;
}

const ExperienceItem = ({ namespace }: ExperienceItemProps) => {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const isRTL = locale === 'he';

  // Get achievements array directly from translations
  const achievements = useMemo(() => {
    try {
      const achievementsArray = t.raw('achievements');
      if (Array.isArray(achievementsArray)) {
        return achievementsArray;
      }
      return [];
    } catch {
      return [];
    }
  }, [t]);

  return (
    <motion.div
      variants={experienceItem}
      className="bg-surface/50 hover:border-primary/30 hover:bg-surface/70 hover:shadow-primary/5 group relative overflow-hidden rounded-xl border border-border p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg sm:p-6"
    >
      {/* Hover gradient overlay */}
      <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 min-w-0 space-y-3 sm:space-y-4">
        {/* Header */}
        <div
          className={`min-w-0 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h3
            className={`break-words text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl ${
              isRTL ? 'hyphens-none' : 'hyphens-auto'
            }`}
          >
            {t('title')}
          </h3>
          <p
            className={`break-words text-base font-medium text-primary sm:text-lg ${
              isRTL ? 'hyphens-none' : 'hyphens-auto'
            }`}
          >
            {t('organization')}
          </p>
        </div>

        {/* Meta information */}
        <div
        // className={`flex flex-col flex-wrap gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4 ${
        //   isRTL ? 'items-end sm:justify-end' : ''
        // }`}
        >
          {/* Div for Period (Date) */}
          <div className="flex items-center gap-1">
            <FaCalendarAlt
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="break-words">{t('period')}</span>
          </div>

          {/* Div for Location */}
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="break-words">{t('location')}</span>
          </div>
        </div>

        {/* Summary */}
        <p
          className={`min-w-0 break-words text-sm leading-relaxed text-muted-foreground sm:text-base ${
            isRTL ? 'hyphens-none text-right' : 'hyphens-auto text-left'
          }`}
        >
          {t('summary')}
        </p>

        {/* Achievements */}
        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-2">
            <FaUsers
              className="h-4 w-4 flex-shrink-0 text-primary"
              aria-hidden="true"
            />
            <h4 className="text-sm font-semibold text-foreground sm:text-base">
              {isRTL ? 'הישגים מרכזיים' : 'Key Achievements'}
            </h4>
          </div>

          <motion.ul
            variants={experienceAchievements}
            className={`min-w-0 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}
            role="list"
          >
            {achievements.map((achievement, index) => (
              <motion.li
                key={index}
                variants={experienceAchievement}
                className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground sm:gap-3"
              >
                <div
                  className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span className="min-w-0 break-words leading-relaxed">
                  {achievement}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.div>
  );
};

interface ExperienceCategoryProps {
  title: string;
  children: React.ReactNode;
}

const ExperienceCategory = ({ title, children }: ExperienceCategoryProps) => {
  const locale = useLocale();
  const isRTL = locale === 'he';

  return (
    <motion.div variants={experienceCategory} className="min-w-0 space-y-6">
      {/* Category header */}
      <div
        className={`flex min-w-0 items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className="h-px min-w-0 flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/5 flex-shrink-0 break-words px-3 py-2 text-sm font-semibold text-primary sm:px-4"
        >
          {title}
        </Badge>
        <div className="h-px min-w-0 flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Category content */}
      <div className="min-w-0 space-y-6">{children}</div>
    </motion.div>
  );
};

export const Experience = () => {
  const t = useTranslations('experience');
  const locale = useLocale();
  const isRTL = locale === 'he';

  return (
    <section
      id="experience"
      className="overflow-hidden bg-muted/30 py-12 sm:py-16 md:py-24"
    >
      <Container>
        <div
          className={`min-w-0 space-y-8 sm:space-y-12 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {/* Section heading */}
          <SectionHeading
            title={t('title')}
            description={t('description')}
            align={isRTL ? 'right' : 'left'}
          />

          {/* Experience content */}
          <motion.div
            variants={experienceContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="min-w-0 space-y-8 sm:space-y-12"
          >
            {/* IDF Tech Unit Experience */}
            <ExperienceCategory title={t('categories.idf')}>
              <ExperienceItem namespace="experience.idf" />
            </ExperienceCategory>

            {/* Civilian Experience */}
            <ExperienceCategory title={t('categories.civilian')}>
              <div className="min-w-0 space-y-6">
                {/* Freelance Experience */}
                <ExperienceItem namespace="experience.civilian.freelance" />

                {/* Star Car Rental Experience */}
                <ExperienceItem namespace="experience.civilian.starCar" />
              </div>
            </ExperienceCategory>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
