'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Lock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { projectCard, projectCardHover, projectsContainer } from '@/lib/motion';

// Import projects data
import projectsData from '@/content/projects.json';

interface Project {
  slug: string;
  title: {
    en: string;
    he: string;
  };
  summary: {
    en: string;
    he: string;
  };
  tech: string[];
  links: {
    github?: string;
    live?: string;
  };
  image: string;
  featured?: boolean;
  role: {
    en: string;
    he: string;
  };
  impact: {
    en: string;
    he: string;
  };
  isInternal?: boolean;
}

export const Projects = () => {
  const t = useTranslations('projects');
  const locale = useLocale() as 'en' | 'he';

  // Filter featured projects
  const featuredProjects = projectsData.filter(
    (project: Project) => project.featured
  );

  return (
    <section
      id="projects"
      className="bg-background py-24"
      aria-labelledby="projects-heading"
      tabIndex={-1}
    >
      <Container>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={projectsContainer}
        >
          <motion.div variants={projectCard}>
            <SectionHeading
              eyebrow={t('eyebrow')}
              title={t('title')}
              description={t('description')}
              align="center"
              className="mb-16"
              headingId="projects-heading"
            />
          </motion.div>

          <div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Featured projects"
          >
            {featuredProjects.map((project: Project) => (
              <motion.div
                key={project.slug}
                variants={projectCard}
                whileHover="hover"
                className="group"
                role="listitem"
              >
                <motion.div
                  variants={projectCardHover}
                  className="h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Card
                    hover
                    className="flex h-full flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/20"
                  >
                    {/* Project Image */}
                    <div
                      className="relative h-48 overflow-hidden"
                      role="img"
                      aria-label={`${project.title[locale]} project screenshot`}
                    >
                      <Image
                        src={project.image}
                        alt={`Screenshot of ${project.title[locale]} project showing ${project.summary[locale]}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
                        priority={
                          featuredProjects.findIndex(
                            (p) => p.slug === project.slug
                          ) < 2
                        } // Only prioritize first 2 projects
                        loading={
                          featuredProjects.findIndex(
                            (p) => p.slug === project.slug
                          ) < 2
                            ? 'eager'
                            : 'lazy'
                        }
                        quality={85}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                        aria-hidden="true"
                      />
                    </div>

                    <CardHeader className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl transition-colors group-hover:text-primary">
                          {project.title[locale]}
                        </CardTitle>
                        {project.isInternal && (
                          <div title="Internal project - source code not publicly available">
                            <Lock
                              className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground"
                              aria-label="Internal project - source code not publicly available"
                            />
                          </div>
                        )}
                      </div>

                      <CardDescription className="text-sm leading-relaxed">
                        {project.summary[locale]}
                      </CardDescription>

                      {/* Role and Impact */}
                      <div className="space-y-2 pt-2">
                        <div>
                          <span className="text-xs font-medium text-primary">
                            {locale === 'en' ? 'Role:' : 'תפקיד:'}
                          </span>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {project.role[locale]}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-primary">
                            {locale === 'en' ? 'Impact:' : 'השפעה:'}
                          </span>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {project.impact[locale]}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Technology Badges */}
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                          <Badge
                            key={tech}
                            variant="tech"
                            className="px-2 py-0.5 text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {project.links.github && (
                          <Button
                            variant="secondary"
                            size="sm"
                            href={project.links.github}
                            external
                            className="flex-1 text-xs"
                          >
                            <Github className="mr-1.5 h-3 w-3" />
                            {t('viewCode')}
                          </Button>
                        )}

                        {project.links.live && (
                          <Button
                            variant="primary"
                            size="sm"
                            href={project.links.live}
                            external
                            className="flex-1 text-xs"
                          >
                            <ExternalLink className="mr-1.5 h-3 w-3" />
                            {t('viewProject')}
                          </Button>
                        )}

                        {project.isInternal &&
                          !project.links.github &&
                          !project.links.live && (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled
                              className="flex-1 text-xs opacity-60"
                            >
                              <Lock className="mr-1.5 h-3 w-3" />
                              {locale === 'en'
                                ? 'Internal Project'
                                : 'פרויקט פנימי'}
                            </Button>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Show all projects link */}
          <motion.div variants={projectCard} className="mt-12 text-center">
            <Button variant="ghost" size="lg" className="group">
              {locale === 'en' ? 'View All Projects' : 'צפה בכל הפרויקטים'}
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
