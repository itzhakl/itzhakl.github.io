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
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

interface ExperienceItemProps {
  title: string;
  organization: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  isRTL: boolean;
}

const ExperienceItem = ({
  title,
  organization,
  period,
  location,
  summary,
  achievements,
  isRTL,
}: ExperienceItemProps) => {
  return (
    <motion.div
      variants={experienceItem}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-surface/70 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h3 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {title}
          </h3>
          <p className="text-lg font-medium text-primary">{organization}</p>
        </div>

        {/* Meta information */}
        <div
          className={`flex flex-wrap gap-4 text-sm text-muted-foreground ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <div
            className={`flex items-center gap-1 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <FaCalendarAlt className="h-4 w-4" aria-hidden="true" />
            <span>{period}</span>
          </div>
          <div
            className={`flex items-center gap-1 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <FaMapMarkerAlt className="h-4 w-4" aria-hidden="true" />
            <span>{location}</span>
          </div>
        </div>

        {/* Summary */}
        <p
          className={`leading-relaxed text-muted-foreground ${
            isRTL ? 'text-right' : 'text-left'
          }`}
        >
          {summary}
        </p>

        {/* Achievements */}
        <div className="space-y-3">
          <div
            className={`flex items-center gap-2 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <FaUsers className="h-4 w-4 text-primary" aria-hidden="true" />
            <h4 className="font-semibold text-foreground">
              {isRTL ? 'הישגים מרכזיים' : 'Key Achievements'}
            </h4>
          </div>
          <motion.ul
            variants={experienceAchievements}
            className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}
            role="list"
          >
            {achievements.map((achievement, index) => (
              <motion.li
                key={index}
                variants={experienceAchievement}
                className={`flex items-start gap-3 text-sm text-muted-foreground ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{achievement}</span>
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
  isRTL: boolean;
}

const ExperienceCategory = ({
  title,
  children,
  isRTL,
}: ExperienceCategoryProps) => {
  return (
    <motion.div variants={experienceCategory} className="space-y-6">
      {/* Category header */}
      <div
        className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary"
        >
          {title}
        </Badge>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Category content */}
      <div className="space-y-6">{children}</div>
    </motion.div>
  );
};

export const Experience = () => {
  const t = useTranslations('experience');
  const locale = useLocale();
  const isRTL = locale === 'he';

  return (
    <section id="experience" className="bg-muted/30 py-16 md:py-24">
      <Container>
        <div className={`space-y-12 ${isRTL ? 'text-right' : 'text-left'}`}>
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
            className="space-y-12"
          >
            {/* IDF Tech Unit Experience */}
            <ExperienceCategory title={t('categories.idf')} isRTL={isRTL}>
              <ExperienceItem
                title={t('idf.title')}
                organization={t('idf.organization')}
                period={t('idf.period')}
                location={t('idf.location')}
                summary={t('idf.summary')}
                achievements={[
                  t('idf.achievements.0'),
                  t('idf.achievements.1'),
                  t('idf.achievements.2'),
                  t('idf.achievements.3'),
                  t('idf.achievements.4'),
                  t('idf.achievements.5'),
                  t('idf.achievements.6'),
                  t('idf.achievements.7'),
                ]}
                isRTL={isRTL}
              />
            </ExperienceCategory>

            {/* Civilian Experience */}
            <ExperienceCategory title={t('categories.civilian')} isRTL={isRTL}>
              <div className="space-y-6">
                {/* Freelance Experience */}
                <ExperienceItem
                  title={t('civilian.freelance.title')}
                  organization={t('civilian.freelance.organization')}
                  period={t('civilian.freelance.period')}
                  location={t('civilian.freelance.location')}
                  summary={t('civilian.freelance.summary')}
                  achievements={[
                    t('civilian.freelance.achievements.0'),
                    t('civilian.freelance.achievements.1'),
                    t('civilian.freelance.achievements.2'),
                    t('civilian.freelance.achievements.3'),
                    t('civilian.freelance.achievements.4'),
                  ]}
                  isRTL={isRTL}
                />

                {/* Star Car Rental Experience */}
                <ExperienceItem
                  title={t('civilian.starCar.title')}
                  organization={t('civilian.starCar.organization')}
                  period={t('civilian.starCar.period')}
                  location={t('civilian.starCar.location')}
                  summary={t('civilian.starCar.summary')}
                  achievements={[
                    t('civilian.starCar.achievements.0'),
                    t('civilian.starCar.achievements.1'),
                    t('civilian.starCar.achievements.2'),
                    t('civilian.starCar.achievements.3'),
                    t('civilian.starCar.achievements.4'),
                  ]}
                  isRTL={isRTL}
                />
              </div>
            </ExperienceCategory>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
