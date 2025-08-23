import { z } from 'zod';

// Locale schema for multilingual content
const localeSchema = z.object({
  en: z.string(),
  he: z.string(),
});

// Project schema with enhanced fields for Itzhak's specific projects
export const projectSchema = z.object({
  slug: z.string(),
  title: localeSchema,
  summary: localeSchema,
  tech: z.array(z.string()),
  links: z.object({
    github: z.string().url().optional(),
    live: z.string().url().optional(),
  }),
  image: z.string(),
  featured: z.boolean().optional(),
  role: localeSchema.optional(),
  impact: localeSchema.optional(),
  isInternal: z.boolean().optional(), // For IDF projects that can't be publicly linked
});

// Tech stack item schema
export const techItemSchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

// Tech category schema
export const techCategorySchema = z.object({
  category: localeSchema,
  items: z.array(techItemSchema),
});

// Timeline item schema with enhanced fields
export const timelineItemSchema = z.object({
  year: z.string(),
  title: localeSchema,
  summary: localeSchema,
  tags: z.array(z.string()),
  category: z.enum(['idf', 'education', 'civilian']),
  location: localeSchema.optional(),
});

// Personal content schema for fun facts and interests
export const personalContentSchema = z.object({
  funFacts: z.object({
    en: z.array(z.string()),
    he: z.array(z.string()),
  }),
  interests: z.object({
    en: z.array(z.string()),
    he: z.array(z.string()),
  }),
  values: z.object({
    en: z.array(z.string()),
    he: z.array(z.string()),
  }),
});

// Array schemas for collections
export const projectsSchema = z.array(projectSchema);
export const stackSchema = z.array(techCategorySchema);
export const timelineSchema = z.array(timelineItemSchema);

// TypeScript interfaces inferred from Zod schemas
export type Project = z.infer<typeof projectSchema>;
export type TechItem = z.infer<typeof techItemSchema>;
export type TechCategory = z.infer<typeof techCategorySchema>;
export type TimelineItem = z.infer<typeof timelineItemSchema>;
export type PersonalContent = z.infer<typeof personalContentSchema>;
export type LocaleContent = z.infer<typeof localeSchema>;

// Collection types
export type Projects = z.infer<typeof projectsSchema>;
export type Stack = z.infer<typeof stackSchema>;
export type Timeline = z.infer<typeof timelineSchema>;
