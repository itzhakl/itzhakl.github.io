#!/usr/bin/env node

/**
 * SEO Testing Script
 *
 * This script helps test and validate SEO implementation
 * Run with: node scripts/test-seo.js
 */

const fs = require('fs');
const path = require('path');

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://itzhak-leshinsky.com';
const locales = ['en', 'he'];

console.log('🔍 SEO Implementation Test\n');

// Test 1: Check if required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'app/sitemap.ts',
  'app/robots.ts',
  'app/manifest.ts',
  'lib/metadata.ts',
  'lib/social-media-validation.ts',
  'public/browserconfig.xml',
];

requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Test 2: Validate metadata structure
console.log('\n🏷️  Validating metadata structure...');
try {
  const metadataPath = path.join(process.cwd(), 'lib', 'metadata.ts');
  const metadataContent = fs.readFileSync(metadataPath, 'utf8');

  const requiredExports = ['generateMetadata', 'generateStructuredData'];
  requiredExports.forEach((exportName) => {
    if (metadataContent.includes(`export const ${exportName}`)) {
      console.log(`✅ ${exportName} function exported`);
    } else {
      console.log(`❌ ${exportName} function - MISSING`);
    }
  });

  // Check for required metadata fields
  const requiredFields = [
    'openGraph',
    'twitter',
    'alternates',
    'robots',
    'keywords',
    'description',
  ];

  requiredFields.forEach((field) => {
    if (metadataContent.includes(field)) {
      console.log(`✅ ${field} metadata field`);
    } else {
      console.log(`❌ ${field} metadata field - MISSING`);
    }
  });
} catch (error) {
  console.log(`❌ Error reading metadata.ts: ${error.message}`);
}

// Test 3: Check structured data
console.log('\n📊 Checking structured data...');
try {
  const metadataPath = path.join(process.cwd(), 'lib', 'metadata.ts');
  const metadataContent = fs.readFileSync(metadataPath, 'utf8');

  const structuredDataTypes = [
    '"@type": "Person"',
    '"@type": "WebSite"',
    '"@type": "BreadcrumbList"',
    'schema.org',
  ];

  structuredDataTypes.forEach((type) => {
    if (metadataContent.includes(type)) {
      console.log(`✅ ${type} structured data`);
    } else {
      console.log(`❌ ${type} structured data - MISSING`);
    }
  });
} catch (error) {
  console.log(`❌ Error checking structured data: ${error.message}`);
}

// Test 4: Validate social media requirements
console.log('\n📱 Social media validation...');
const testMetadata = {
  title:
    'Itzhak Leshinsky - Full-Stack Developer | GIS & Web Systems | Tech Leader',
  description:
    'Experienced Full-Stack Developer specializing in GIS systems, team leadership, and AI-powered automation tools. Expert in React, Node.js, Next.js, and Python.',
  imageUrl: `${baseUrl}/assets/og-image.jpg`,
  url: `${baseUrl}/en`,
};

// Simulate platform validation
const platforms = [
  { name: 'Facebook', titleLimit: 100, descLimit: 300 },
  { name: 'Twitter', titleLimit: 70, descLimit: 200 },
  { name: 'LinkedIn', titleLimit: 150, descLimit: 300 },
];

// Use shorter Twitter title for testing
const twitterTitle =
  'Itzhak Leshinsky - Full-Stack Developer | GIS & Tech Leader';

platforms.forEach((platform) => {
  const titleToTest =
    platform.name === 'Twitter' ? twitterTitle : testMetadata.title;
  const titleOk = titleToTest.length <= platform.titleLimit;
  const descOk = testMetadata.description.length <= platform.descLimit;

  console.log(
    `${titleOk ? '✅' : '⚠️'} ${platform.name} title: ${titleToTest.length}/${platform.titleLimit} chars`
  );
  console.log(
    `${descOk ? '✅' : '⚠️'} ${platform.name} description: ${testMetadata.description.length}/${platform.descLimit} chars`
  );
});

// Test 5: Generate test URLs
console.log('\n🔗 Test URLs for social media debugging:');
console.log('\nFacebook Debugger:');
locales.forEach((locale) => {
  const url = `${baseUrl}/${locale}`;
  console.log(
    `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`
  );
});

console.log('\nTwitter Card Validator:');
locales.forEach((locale) => {
  const url = `${baseUrl}/${locale}`;
  console.log(`https://cards-dev.twitter.com/validator (paste: ${url})`);
});

console.log('\nLinkedIn Post Inspector:');
locales.forEach((locale) => {
  const url = `${baseUrl}/${locale}`;
  console.log(`https://www.linkedin.com/post-inspector/ (paste: ${url})`);
});

// Test 6: Check hreflang implementation
console.log('\n🌐 Hreflang implementation:');
try {
  const layoutPath = path.join(process.cwd(), 'app', '[locale]', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  if (layoutContent.includes('hrefLang')) {
    console.log('✅ Hreflang attributes implemented');
  } else {
    console.log('❌ Hreflang attributes - MISSING');
  }

  locales.forEach((locale) => {
    if (layoutContent.includes(`href={\`\${baseUrl}/${locale}\`}`)) {
      console.log(`✅ ${locale} hreflang link`);
    } else {
      console.log(`❌ ${locale} hreflang link - MISSING`);
    }
  });
} catch (error) {
  console.log(`❌ Error checking layout.tsx: ${error.message}`);
}

console.log('\n✨ SEO test complete!');
console.log('\n📝 Next steps:');
console.log(
  '1. Create actual social media images (og-image.jpg, og-image-square.jpg)'
);
console.log('2. Test URLs in social media debuggers');
console.log('3. Verify structured data with Google Rich Results Test');
console.log('4. Check sitemap.xml and robots.txt after deployment');
console.log('5. Monitor Core Web Vitals and SEO performance');

console.log('\n🔧 Useful commands:');
console.log('- Test build: npm run build');
console.log('- Check sitemap: curl http://localhost:3000/sitemap.xml');
console.log('- Check robots: curl http://localhost:3000/robots.txt');
