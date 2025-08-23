# Deployment Guide

This guide covers deploying the modern portfolio to various platforms.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository set up

## Environment Variables

Before deploying, set up the following environment variables in your deployment platform:

### Required Variables

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="Itzhak Leshinsky - Full-Stack Developer"
NEXT_PUBLIC_SITE_DESCRIPTION="Full-Stack Developer specializing in GIS systems, web applications, and AI-powered automation tools"
NEXT_PUBLIC_EMAIL=itzhak.lesh@gmail.com
NEXT_PUBLIC_GITHUB_USERNAME=itzhakl
NEXT_PUBLIC_LINKEDIN_USERNAME=itzhak-leshinsky
NEXT_PUBLIC_WHATSAPP_NUMBER=+972123456789
```

### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX

# Performance Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

## Vercel Deployment (Recommended)

### Automatic Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Vercel Configuration

The project includes a `vercel.json` file with optimized settings:

- Security headers
- Caching strategies
- Redirects for social links
- Performance optimizations

## Netlify Deployment

### Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### Build Settings

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18+

## Other Platforms

### Railway

1. Connect GitHub repository
2. Set environment variables
3. Deploy with build command: `npm run build`

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
3. Set environment variables

## Local Production Testing

Test the production build locally before deploying:

```bash
# Build for production
npm run build

# Start production server
npm start

# Or test with clean build
npm run build:clean
npm start
```

## Performance Optimization

The build includes several optimizations:

- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: Preloaded fonts to prevent FOUT
- **Bundle Analysis**: Run `npm run analyze` to check bundle size
- **Code Splitting**: Automatic code splitting for optimal loading
- **Caching**: Optimized caching headers in vercel.json

## SEO and Social Media

The deployment includes:

- **Sitemap**: Auto-generated at `/sitemap.xml`
- **Robots.txt**: SEO-friendly robots file
- **Open Graph**: Social media preview cards
- **Structured Data**: JSON-LD for better search indexing
- **Multilingual SEO**: Proper hreflang attributes

## Monitoring and Analytics

### Performance Monitoring

- **Lighthouse CI**: Automated performance testing
- **Core Web Vitals**: Monitored in production
- **Bundle Analysis**: Regular bundle size monitoring

### Error Tracking

Optional Sentry integration for error tracking:

```bash
# Install Sentry (optional)
npm install @sentry/nextjs

# Configure in next.config.js
```

## Security

The deployment includes security headers:

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Permissions Policy

## Troubleshooting

### Build Failures

1. Check Node.js version (18+ required)
2. Clear cache: `npm run clean`
3. Reinstall dependencies: `npm run clean:all`
4. Check environment variables

### Performance Issues

1. Run bundle analysis: `npm run analyze`
2. Check image optimization
3. Verify caching headers
4. Test with Lighthouse: `npm run lighthouse`

### Content Issues

1. Validate content: `npm run validate-content`
2. Check translation files
3. Verify image paths
4. Test internationalization

## Post-Deployment Checklist

- [ ] Site loads correctly on desktop and mobile
- [ ] All navigation links work
- [ ] Language switching functions properly
- [ ] Contact forms/links work
- [ ] Images load with proper optimization
- [ ] Social media previews display correctly
- [ ] Performance score > 95 on Lighthouse
- [ ] Accessibility score > 95 on Lighthouse
- [ ] SEO elements are properly configured
- [ ] Analytics tracking works (if enabled)

## Domain Configuration

### Custom Domain on Vercel

1. Add domain in Vercel dashboard
2. Configure DNS records:
   - A record: `76.76.19.61`
   - CNAME record: `cname.vercel-dns.com`
3. Enable HTTPS (automatic)

### SSL Certificate

SSL certificates are automatically provisioned by most platforms. For custom setups:

- Use Let's Encrypt for free SSL
- Configure automatic renewal
- Test SSL configuration

## Maintenance

### Regular Updates

- Update dependencies monthly
- Monitor security advisories
- Test after major Next.js updates
- Review and update content regularly

### Performance Monitoring

- Monthly Lighthouse audits
- Bundle size monitoring
- Core Web Vitals tracking
- User experience metrics

## Support

For deployment issues:

1. Check platform-specific documentation
2. Review build logs for errors
3. Test locally with production build
4. Contact platform support if needed
