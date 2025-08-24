'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  contactButton,
  contactContainer,
  fadeInUp,
  staggerContainer,
} from '@/lib/motion';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

const getContactMethodStyles = (
  variant: 'whatsapp' | 'email' | 'linkedin' | 'github'
) => {
  const baseStyles = 'text-white';

  switch (variant) {
    case 'whatsapp':
      return `${baseStyles} bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600`;
    case 'email':
      return `${baseStyles} bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600`;
    case 'linkedin':
      return `${baseStyles} bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700`;
    case 'github':
      return `${baseStyles} bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800`;
    default:
      return `${baseStyles} bg-primary hover:bg-primary-hover`;
  }
};

export const Contact = () => {
  const t = useTranslations('contact');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const contactMethods = [
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      label: t('whatsapp'),
      href: 'https://wa.me/972535561849',
      variant: 'whatsapp' as const,
      ariaLabel: t('buttons.whatsapp'),
    },
    {
      id: 'email',
      icon: SiGmail,
      label: t('email'),
      href: 'mailto:itzhak.lesh@gmail.com',
      variant: 'email' as const,
      ariaLabel: t('buttons.email'),
    },
    {
      id: 'linkedin',
      icon: FaLinkedin,
      label: t('linkedin'),
      href: 'https://linkedin.com/in/itzhak-leshinsky',
      variant: 'linkedin' as const,
      ariaLabel: t('buttons.linkedin'),
    },
    {
      id: 'github',
      icon: FaGithub,
      label: t('github'),
      href: 'https://github.com/itzhakl',
      variant: 'github' as const,
      ariaLabel: t('buttons.github'),
    },
  ];

  return (
    <section
      id="contact"
      className="py-20"
      aria-labelledby="contact-heading"
      tabIndex={-1}
      ref={ref}
    >
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
        >
          {/* Section Heading */}
          <motion.div variants={fadeInUp} className="mb-16">
            <SectionHeading
              title={t('title')}
              description={t('description')}
              align="center"
              headingId="contact-heading"
            />
          </motion.div>

          {/* Contact Methods */}
          <motion.div variants={fadeInUp}>
            <Card className="mx-auto max-w-4xl p-8 md:p-12">
              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                variants={contactContainer}
                initial="initial"
                animate={isInView ? 'animate' : 'initial'}
                role="list"
                aria-label="Contact methods"
              >
                {contactMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <motion.div
                      key={method.id}
                      variants={contactButton}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                      role="listitem"
                    >
                      <Button
                        href={method.href}
                        external
                        variant="ghost"
                        className={`
                          group h-auto w-full flex-col gap-4 p-6 transition-all duration-300
                          ${getContactMethodStyles(method.variant)}
                          hover:shadow-lg hover:shadow-primary/20
                          focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                          focus-visible:ring-offset-background
                        `}
                        aria-label={method.ariaLabel}
                      >
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:scale-110"
                          aria-hidden="true"
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium">
                          {method.label}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
