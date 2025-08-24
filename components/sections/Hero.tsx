'use client';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';
import {
  heroActions,
  heroGreeting,
  heroSocial,
  heroTagline,
  staggerContainer,
} from '@/lib/motion';
import { scrollToSection } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export const Hero = () => {
  const t = useTranslations('hero');

  const handleScrollToProjects = () => {
    scrollToSection('projects');
  };

  const socialLinks = [
    {
      href: 'https://github.com/itzhakl',
      icon: FaGithub,
      label: t('socialLinks.github'),
      'aria-label': t('socialLinks.github'),
    },
    {
      href: 'https://linkedin.com/in/itzhak-leshinsky',
      icon: FaLinkedin,
      label: t('socialLinks.linkedin'),
      'aria-label': t('socialLinks.linkedin'),
    },
    {
      href: 'mailto:itzhak.lesh@gmail.com',
      icon: SiGmail,
      label: t('socialLinks.email'),
      'aria-label': t('socialLinks.email'),
    },
    {
      href: 'https://wa.me/972535561849', // Replace with actual WhatsApp number
      icon: FaWhatsapp,
      label: t('socialLinks.whatsapp'),
      'aria-label': t('socialLinks.whatsapp'),
    },
  ];

  return (
    <section
      id="hero"
      className="flex min-h-screen items-center justify-center pt-16"
      aria-labelledby="hero-heading"
      role="banner"
      tabIndex={-1}
    >
      <Container>
        <motion.div
          className="text-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Greeting with gradient name */}
          <motion.h1
            id="hero-heading"
            className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
            variants={heroGreeting}
            role="heading"
            aria-level={1}
          >
            <span className="bg-gradient-to-r from-primary via-primary to-blue-500 bg-clip-text text-transparent dark:to-blue-400">
              {t('greeting')}
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mb-8 text-xl text-muted-foreground md:text-2xl lg:text-3xl"
            variants={heroTagline}
          >
            {t('tagline')}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            variants={heroActions}
          >
            <Button
              size="lg"
              onClick={handleScrollToProjects}
              className="min-w-[160px]"
              aria-label="Scroll to projects section"
            >
              {t('viewProjects')}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="min-w-[160px]"
              aria-label="Scroll to contact section"
            >
              {t('getInTouch')}
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="flex items-center justify-center gap-4"
            variants={heroSocial}
            role="group"
            aria-label="Social media links"
          >
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <IconButton
                  key={link.href}
                  href={link.href}
                  external
                  variant="ghost"
                  size="lg"
                  aria-label={link['aria-label']}
                  className="transition-transform hover:scale-110 focus:scale-110"
                  title={link.label}
                >
                  <IconComponent className="h-6 w-6" aria-hidden="true" />
                </IconButton>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
