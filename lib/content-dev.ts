/**
 * Development utilities for content management
 * These utilities are only used during development and not in production builds
 */

import { join } from 'path';

// Development helper to generate content templates
export const generateContentTemplate = (
  type: 'project' | 'timeline' | 'tech-category' | 'personal'
) => {
  const templates = {
    project: {
      slug: 'example-project',
      title: {
        en: 'Example Project',
        he: 'פרויקט לדוגמה',
      },
      summary: {
        en: 'A brief description of the project',
        he: 'תיאור קצר של הפרויקט',
      },
      tech: ['Technology1', 'Technology2'],
      links: {
        github: 'https://github.com/username/repo',
        live: 'https://example.com',
      },
      image: '/assets/projects/example.jpg',
      featured: false,
      role: {
        en: 'Your role in the project',
        he: 'התפקיד שלך בפרויקט',
      },
      impact: {
        en: 'The impact or results achieved',
        he: 'ההשפעה או התוצאות שהושגו',
      },
      isInternal: false,
    },
    timeline: {
      year: '2024',
      title: {
        en: 'Timeline Item Title',
        he: 'כותרת פריט בציר הזמן',
      },
      summary: {
        en: 'Description of what happened during this period',
        he: 'תיאור של מה שקרה במהלך התקופה הזו',
      },
      tags: ['Tag1', 'Tag2', 'Tag3'],
      category: 'civilian' as const,
      location: {
        en: 'Location',
        he: 'מיקום',
      },
    },
    'tech-category': {
      category: {
        en: 'Category Name',
        he: 'שם הקטגוריה',
      },
      items: [
        {
          name: 'Technology Name',
          icon: 'icon-name',
          level: 'intermediate' as const,
        },
      ],
    },
    personal: {
      funFacts: {
        en: ['Fun fact 1', 'Fun fact 2'],
        he: ['עובדה מעניינת 1', 'עובדה מעניינת 2'],
      },
      interests: {
        en: ['Interest 1', 'Interest 2'],
        he: ['עניין 1', 'עניין 2'],
      },
      values: {
        en: ['Value 1', 'Value 2'],
        he: ['ערך 1', 'ערך 2'],
      },
    },
  };

  return templates[type];
};

// Development helper to backup content files
export const backupContentFiles = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(process.cwd(), 'content', 'backups', timestamp);

  // This would create backups in a real implementation
  // eslint-disable-next-line no-console
  console.log(`Content backup would be created at: ${backupDir}`);
};

// Development helper to validate specific content file
export const validateSingleContentFile = (filename: string): boolean => {
  try {
    const filePath = join(process.cwd(), 'content', filename);
    // eslint-disable-next-line no-console
    console.log(`Validating ${filePath}...`);

    // Implementation would validate the specific file
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Validation failed for ${filename}:`, error);
    return false;
  }
};

// Development helper to generate content statistics
export const generateContentStats = () => {
  // This would analyze content and provide statistics
  return {
    totalProjects: 0,
    featuredProjects: 0,
    techCategories: 0,
    timelineItems: 0,
    translationCoverage: '100%',
  };
};

// Development helper to check for missing translations
export const checkMissingTranslations = (): string[] => {
  const issues: string[] = [];

  // Implementation would check all content for missing translations
  // and return an array of issues found

  return issues;
};

// Development helper to export content for external tools
export const exportContentForTools = (
  format: 'json' | 'csv' | 'markdown' = 'json'
) => {
  // eslint-disable-next-line no-console
  console.log(`Exporting content in ${format} format...`);

  // Implementation would export content in the specified format
  // for use with external tools like CMS, documentation generators, etc.
};
