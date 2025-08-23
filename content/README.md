# Content Management System

This directory contains all the content data for the portfolio website. All content files are validated using Zod schemas to ensure type safety and data integrity.

## Content Files

### `projects.json`

Contains portfolio projects with the following structure:

- `slug`: Unique identifier for the project
- `title`: Project title in English and Hebrew
- `summary`: Project description in English and Hebrew
- `tech`: Array of technology names used
- `links`: Optional GitHub and live demo URLs
- `image`: Path to project image
- `featured`: Boolean indicating if project should be featured

### `stack.json`

Contains technical skills organized by categories:

- `category`: Category name in English and Hebrew
- `items`: Array of tech items with name, optional icon, and skill level

### `timeline.json`

Contains career timeline items:

- `year`: Year or year range
- `title`: Position/role title in English and Hebrew
- `summary`: Description in English and Hebrew
- `tags`: Array of relevant tags
- `category`: One of 'army', 'education', or 'civilian'

## Validation

All content files are automatically validated during the build process using Zod schemas. The validation ensures:

- Required fields are present
- Data types are correct
- URLs are valid
- Multilingual content is complete
- Enum values are valid

### Running Validation

```bash
# Validate all content files
npm run validate-content

# Build with validation (validation runs automatically)
npm run build
```

### Content Validation Errors

If validation fails, you'll see detailed error messages indicating:

- Which file has errors
- Which fields are invalid
- What the expected format should be

## Development Utilities

The `lib/content-dev.ts` file provides utilities for content development:

- Template generators for new content items
- Individual item validation functions
- Content statistics and analysis

## Usage in Components

```typescript
import { getProjects, getStack, getTimeline } from '@/lib/content';

// Load all projects
const projects = getProjects();

// Load only featured projects
const featuredProjects = getFeaturedProjects();

// Load tech stack
const techStack = getStack();

// Load timeline by category
const armyExperience = getTimelineByCategory('army');
```

## Adding New Content

1. Follow the existing JSON structure
2. Ensure all required fields are included
3. Provide translations for both English and Hebrew
4. Run `npm run validate-content` to verify the data
5. Test the build process with `npm run build`

## Content Guidelines

- Keep descriptions concise but informative
- Use consistent terminology across languages
- Ensure all URLs are valid and accessible
- Optimize images and use appropriate file paths
- Use generic, non-sensitive wording for military experience
- Include quantifiable results where possible
