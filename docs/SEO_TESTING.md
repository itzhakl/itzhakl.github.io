# SEO and Social Media Testing Guide

This guide provides comprehensive instructions for testing and validating the SEO implementation of Itzhak Leshinsky's portfolio.

## Quick Test

Run the automated SEO test script:

```bash
npm run test:seo
```

## Manual Testing Checklist

### 1. Metadata Validation

#### Open Graph Tags

- [ ] `og:title` - Present and under 100 characters
- [ ] `og:description` - Present and under 300 characters
- [ ] `og:image` - Present and 1200x630px
- [ ] `og:url` - Present and canonical
- [ ] `og:type` - Set to "website"
- [ ] `og:locale` - Set correctly for each language
- [ ] `og:site_name` - Present

#### Twitter Cards

- [ ] `twitter:card` - Set to "summary_large_image"
- [ ] `twitter:title` - Present and under 70 characters
- [ ] `twitter:description` - Present and under 200 characters
- [ ] `twitter:image` - Present and 1200x630px
- [ ] `twitter:creator` - Set to "@itzhakl"

#### Basic Meta Tags

- [ ] `title` - Dynamic per locale
- [ ] `description` - Dynamic per locale
- [ ] `keywords` - Relevant keywords included
- [ ] `canonical` - Proper canonical URLs
- [ ] `hreflang` - All language variants included

### 2. Structured Data

Check structured data using [Google's Rich Results Test](https://search.google.com/test/rich-results):

- [ ] Person schema for Itzhak Leshinsky
- [ ] WebSite schema for the portfolio
- [ ] BreadcrumbList schema for navigation
- [ ] No errors in structured data

### 3. Social Media Platform Testing

#### Facebook

1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Test URLs:
   - `https://itzhak-leshinsky.com/en`
   - `https://itzhak-leshinsky.com/he`
3. Check for:
   - [ ] Correct title and description
   - [ ] Image displays properly
   - [ ] No errors or warnings

#### Twitter/X

1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Test the same URLs
3. Check for:
   - [ ] Card preview displays correctly
   - [ ] Image loads properly
   - [ ] Title and description are appropriate length

#### LinkedIn

1. Go to [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
2. Test the URLs
3. Check for:
   - [ ] Professional appearance
   - [ ] Correct metadata display
   - [ ] Image quality

#### WhatsApp

1. Send URLs to a test contact
2. Check for:
   - [ ] Preview card appears
   - [ ] Image displays correctly
   - [ ] Title and description are readable

### 4. Technical SEO

#### Sitemap

- [ ] Accessible at `/sitemap.xml`
- [ ] Contains all language variants
- [ ] Proper priority and changefreq values
- [ ] Valid XML format

#### Robots.txt

- [ ] Accessible at `/robots.txt`
- [ ] Allows crawling of main content
- [ ] Blocks sensitive areas
- [ ] References sitemap

#### Performance

- [ ] Core Web Vitals scores (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Images optimized and lazy loaded
- [ ] Fonts preloaded
- [ ] No render-blocking resources

### 5. Multilingual SEO

#### Hreflang Implementation

- [ ] `hreflang="en"` for English pages
- [ ] `hreflang="he"` for Hebrew pages
- [ ] `hreflang="x-default"` pointing to English
- [ ] All hreflang URLs are accessible

#### Content Localization

- [ ] All metadata translated properly
- [ ] RTL support for Hebrew
- [ ] Proper language codes in HTML
- [ ] Cultural appropriateness of content

## Testing Tools

### Free Tools

- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Paid Tools (Optional)

- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)
- [Ahrefs Site Audit](https://ahrefs.com/site-audit)
- [SEMrush Site Audit](https://www.semrush.com/siteaudit/)

## Common Issues and Solutions

### Image Not Displaying

- Ensure image is publicly accessible
- Check image dimensions (1200x630px recommended)
- Verify image format (JPG/PNG)
- Clear social media cache

### Metadata Not Updating

- Use "Scrape Again" in Facebook debugger
- Clear browser cache
- Wait for CDN propagation
- Check for caching headers

### Structured Data Errors

- Validate JSON-LD syntax
- Ensure required properties are present
- Check for proper schema.org types
- Test with Google's tool

### Hreflang Issues

- Verify all URLs are accessible
- Check for proper language codes
- Ensure bidirectional linking
- Validate HTML syntax

## Monitoring and Maintenance

### Regular Checks

- [ ] Monthly social media preview tests
- [ ] Quarterly SEO audit
- [ ] Monitor Core Web Vitals
- [ ] Check for broken links
- [ ] Update structured data as needed

### Performance Monitoring

- Set up Google Search Console
- Monitor click-through rates
- Track social media engagement
- Analyze user behavior

### Content Updates

- Update metadata when content changes
- Refresh social media images periodically
- Keep structured data current
- Monitor for new SEO best practices

## Deployment Checklist

Before going live:

- [ ] All tests pass
- [ ] Social media previews work
- [ ] Structured data validates
- [ ] Performance scores meet targets
- [ ] All URLs accessible
- [ ] Analytics configured
- [ ] Search Console verified

## Environment Variables

Ensure these are set in production:

```env
NEXT_PUBLIC_BASE_URL=https://itzhak-leshinsky.com
GOOGLE_SITE_VERIFICATION=your_verification_code
YANDEX_VERIFICATION=your_verification_code
YAHOO_VERIFICATION=your_verification_code
```

## Support

For issues with SEO implementation:

1. Check this guide first
2. Run `npm run test:seo` for automated checks
3. Use browser dev tools to inspect meta tags
4. Test with social media debuggers
5. Validate structured data with Google's tools
