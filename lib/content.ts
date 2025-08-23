import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import {
  projectsSchema,
  stackSchema,
  timelineSchema,
  personalContentSchema,
  type Projects,
  type Stack,
  type Timeline,
  type PersonalContent,
  type TechCategory,
} from './schemas';

// Content validation utilities with error handling
export class ContentValidationError extends Error {
  constructor(
    public contentType: string,
    public validationErrors: z.ZodError
  ) {
    super(`Validation failed for ${contentType}: ${validationErrors.message}`);
    this.name = 'ContentValidationError';
  }
}

// Generic content loader with validation
const loadAndValidateContent = <T>(
  filePath: string,
  schema: z.ZodSchema<T>,
  contentType: string
): T => {
  try {
    const fullPath = join(process.cwd(), 'content', filePath);
    const fileContent = readFileSync(fullPath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    const result = schema.safeParse(jsonData);

    if (!result.success) {
      throw new ContentValidationError(contentType, result.error);
    }

    return result.data;
  } catch (error) {
    if (error instanceof ContentValidationError) {
      throw error;
    }

    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${contentType} file: ${error.message}`);
    }

    throw new Error(
      `Failed to load ${contentType}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Content loaders for each data type
export const loadProjects = (): Projects => {
  return loadAndValidateContent('projects.json', projectsSchema, 'projects');
};

export const loadStack = (): Stack => {
  return loadAndValidateContent('stack.json', stackSchema, 'tech stack');
};

export const loadTimeline = (): Timeline => {
  return loadAndValidateContent('timeline.json', timelineSchema, 'timeline');
};

export const loadPersonalContent = (): PersonalContent => {
  return loadAndValidateContent(
    'personal.json',
    personalContentSchema,
    'personal content'
  );
};

// Validate all content files at once
export const validateAllContent = (): {
  projects: Projects;
  stack: Stack;
  timeline: Timeline;
  personal: PersonalContent;
} => {
  const errors: string[] = [];
  let projects: Projects = [];
  let stack: Stack = [];
  let timeline: Timeline = [];
  let personal: PersonalContent = {
    funFacts: { en: [], he: [] },
    interests: { en: [], he: [] },
    values: { en: [], he: [] },
  };

  try {
    projects = loadProjects();
  } catch (error) {
    errors.push(
      `Projects: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  try {
    stack = loadStack();
  } catch (error) {
    errors.push(
      `Stack: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  try {
    timeline = loadTimeline();
  } catch (error) {
    errors.push(
      `Timeline: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  try {
    personal = loadPersonalContent();
  } catch (error) {
    errors.push(
      `Personal: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  if (errors.length > 0) {
    throw new Error(`Content validation failed:\n${errors.join('\n')}`);
  }

  return { projects, stack, timeline, personal };
};

// Helper function to get featured projects
export const getFeaturedProjects = (): Projects => {
  const projects = loadProjects();
  return projects.filter((project) => project.featured);
};

// Helper function to get projects by category
export const getProjectsByTech = (tech: string): Projects => {
  const projects = loadProjects();
  return projects.filter((project) =>
    project.tech.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
  );
};

// Helper function to get timeline by category
export const getTimelineByCategory = (
  category: 'idf' | 'education' | 'civilian'
): Timeline => {
  const timeline = loadTimeline();
  return timeline.filter((item) => item.category === category);
};

// Helper function to get tech stack by category name
export const getTechStackByCategory = (
  categoryName: string
): TechCategory | undefined => {
  const stack = loadStack();
  return stack.find(
    (category) =>
      category.category.en.toLowerCase().includes(categoryName.toLowerCase()) ||
      category.category.he.includes(categoryName)
  );
};

// Helper function to validate content at build time
export const validateContentForBuild = (): boolean => {
  try {
    validateAllContent();
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Build-time content validation failed:', error);
    return false;
  }
};

// Helper function to get all tech skills as a flat array
export const getAllTechSkills = (): string[] => {
  const stack = loadStack();
  return stack.flatMap((category) => category.items.map((item) => item.name));
};

// Helper function to get projects that use specific technology
export const getProjectsUsingTech = (techName: string): Projects => {
  const projects = loadProjects();
  return projects.filter((project) =>
    project.tech.some((tech) =>
      tech.toLowerCase().includes(techName.toLowerCase())
    )
  );
};
