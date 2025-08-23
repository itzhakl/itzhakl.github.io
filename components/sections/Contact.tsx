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
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

export const Contact = () => {
  const t = useTranslations('contact');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const contactMethods = [
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: t('whatsapp'),
      href: 'https://wa.me/972123456789', // Replace with actual WhatsApp number
      color: 'bg-green-500 hover:bg-green-600',
      ariaLabel: t('buttons.whatsapp'),
    },
    {
      id: 'email',
      icon: Mail,
      label: t('email'),
      href: 'mailto:itzhak.lesh@gmail.com',
      color: 'bg-blue-500 hover:bg-blue-600',
      ariaLabel: t('buttons.email'),
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: t('linkedin'),
      href: 'https://linkedin.com/in/itzhak-leshinsky',
      color: 'bg-blue-600 hover:bg-blue-700',
      ariaLabel: t('buttons.linkedin'),
    },
    {
      id: 'github',
      icon: Github,
      label: t('github'),
      href: 'https://github.com/itzhakl',
      color: 'bg-gray-700 hover:bg-gray-800',
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
              eyebrow={t('eyebrow')}
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
                          group h-auto w-full flex-col gap-4 p-6 text-white transition-all duration-300
                          ${method.color}
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

              {/* Additional Contact Info */}
              <motion.div variants={fadeInUp} className="mt-12 text-center">
                <div className="mx-auto h-px w-24 bg-border" />
                <p className="mt-6 text-sm text-muted-foreground">
                  Available for freelance projects and full-time opportunities
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
