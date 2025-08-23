'use client';

import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

import {
  stackCategory,
  stackContainer,
  stackItem,
  stackItemContainer,
} from '@/lib/motion';
import type { TechCategory, TechItem } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

interface StackItemProps {
  item: TechItem;
  locale: string;
}

const StackItem = ({ item, locale }: StackItemProps) => {
  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'advanced':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'beginner':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getLevelText = (level?: string) => {
    switch (level) {
      case 'advanced':
        return locale === 'he' ? 'מתקדם' : 'Advanced';
      case 'intermediate':
        return locale === 'he' ? 'בינוני' : 'Intermediate';
      case 'beginner':
        return locale === 'he' ? 'מתחיל' : 'Beginner';
      default:
        return '';
    }
  };

  const levelText = getLevelText(item.level);
  const ariaLabel = levelText ? `${item.name}, ${levelText}` : item.name;

  return (
    <motion.div
      variants={stackItem}
      className="group relative"
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="relative overflow-hidden rounded-lg border border-border bg-surface/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-surface/70 hover:shadow-lg hover:shadow-primary/5"
        role="article"
        aria-label={ariaLabel}
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-col items-center space-y-2 text-center">
          {/* Icon placeholder - could be enhanced with actual icons */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <span className="text-sm font-semibold">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Technology name */}
          <h3 className="font-medium text-text transition-colors duration-300 group-hover:text-primary">
            {item.name}
          </h3>

          {/* Level badge */}
          {item.level && (
            <Badge
              variant="secondary"
              className={`text-xs ${getLevelColor(item.level)}`}
              aria-label={`Skill level: ${levelText}`}
            >
              {levelText}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface StackCategoryProps {
  category: TechCategory;
  locale: string;
}

const StackCategory = ({ category, locale }: StackCategoryProps) => {
  const isRTL = locale === 'he';

  return (
    <motion.div variants={stackCategory} className="space-y-4">
      {/* Category title */}
      <h3
        className={`text-lg font-semibold text-text ${isRTL ? 'text-right' : 'text-left'}`}
      >
        {category.category[locale as keyof typeof category.category]}
      </h3>

      {/* Category items grid */}
      <motion.div
        variants={stackItemContainer}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {category.items.map((item) => (
          <StackItem key={item.name} item={item} locale={locale} />
        ))}
      </motion.div>
    </motion.div>
  );
};

interface StackProps {
  stackData: TechCategory[];
}

export const Stack = ({ stackData }: StackProps) => {
  const t = useTranslations('stack');
  const locale = useLocale();
  const isRTL = locale === 'he';

  return (
    <section id="stack" className="py-16 md:py-24">
      <Container>
        <div className={`space-y-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Section heading */}
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
            align={isRTL ? 'right' : 'left'}
          />

          {/* Stack categories */}
          <motion.div
            variants={stackContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-12"
          >
            {stackData.map((category) => (
              <StackCategory
                key={category.category.en}
                category={category}
                locale={locale}
              />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
