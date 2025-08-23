/**
 * Social Media Validation Utilities
 *
 * This file contains utilities to help validate and test social media
 * preview cards across different platforms.
 */

export interface SocialMediaPlatform {
  name: string;
  debugUrl: string;
  requirements: {
    imageSize: string;
    imageFormat: string[];
    titleLength: number;
    descriptionLength: number;
    additionalNotes?: string;
  };
}

export const socialMediaPlatforms: SocialMediaPlatform[] = [
  {
    name: 'Facebook',
    debugUrl: 'https://developers.facebook.com/tools/debug/',
    requirements: {
      imageSize: '1200x630px (recommended)',
      imageFormat: ['JPG', 'PNG'],
      titleLength: 100,
      descriptionLength: 300,
      additionalNotes: 'Minimum image size: 600x315px. Aspect ratio: 1.91:1',
    },
  },
  {
    name: 'Twitter/X',
    debugUrl: 'https://cards-dev.twitter.com/validator',
    requirements: {
      imageSize: '1200x630px (summary_large_image)',
      imageFormat: ['JPG', 'PNG', 'WEBP', 'GIF'],
      titleLength: 70,
      descriptionLength: 200,
      additionalNotes:
        'Maximum file size: 5MB. For summary card: 120x120px minimum',
    },
  },
  {
    name: 'LinkedIn',
    debugUrl: 'https://www.linkedin.com/post-inspector/',
    requirements: {
      imageSize: '1200x627px (recommended)',
      imageFormat: ['JPG', 'PNG'],
      titleLength: 150,
      descriptionLength: 300,
      additionalNotes: 'Minimum image size: 1200x627px. Aspect ratio: 1.91:1',
    },
  },
  {
    name: 'WhatsApp',
    debugUrl: 'No specific debug tool - uses Open Graph tags',
    requirements: {
      imageSize: '1200x630px',
      imageFormat: ['JPG', 'PNG'],
      titleLength: 65,
      descriptionLength: 155,
      additionalNotes:
        'Uses Open Graph meta tags. Image should be at least 300x200px',
    },
  },
  {
    name: 'Discord',
    debugUrl: 'No specific debug tool - uses Open Graph tags',
    requirements: {
      imageSize: '1200x630px',
      imageFormat: ['JPG', 'PNG', 'GIF'],
      titleLength: 256,
      descriptionLength: 2048,
      additionalNotes: 'Supports video embeds. Uses Open Graph meta tags',
    },
  },
  {
    name: 'Slack',
    debugUrl: 'No specific debug tool - uses Open Graph tags',
    requirements: {
      imageSize: '1200x630px',
      imageFormat: ['JPG', 'PNG', 'GIF'],
      titleLength: 100,
      descriptionLength: 160,
      additionalNotes: 'Uses Open Graph meta tags. Supports unfurling',
    },
  },
];

export interface MetadataValidation {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export const validateMetadataForPlatform = (
  metadata: MetadataValidation,
  platform: SocialMediaPlatform
): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Validate title length
  if (metadata.title.length > platform.requirements.titleLength) {
    warnings.push(
      `Title exceeds recommended length for ${platform.name}: ${metadata.title.length}/${platform.requirements.titleLength} characters`
    );
  }

  // Validate description length
  if (metadata.description.length > platform.requirements.descriptionLength) {
    warnings.push(
      `Description exceeds recommended length for ${platform.name}: ${metadata.description.length}/${platform.requirements.descriptionLength} characters`
    );
  }

  // Validate image URL
  if (!metadata.imageUrl) {
    errors.push(`Missing image URL for ${platform.name}`);
  } else {
    const imageExtension = metadata.imageUrl.split('.').pop()?.toUpperCase();
    if (
      imageExtension &&
      !platform.requirements.imageFormat.includes(imageExtension)
    ) {
      warnings.push(
        `Image format ${imageExtension} may not be supported by ${platform.name}. Supported formats: ${platform.requirements.imageFormat.join(', ')}`
      );
    }
  }

  // Validate URL
  if (!metadata.url) {
    errors.push(`Missing URL for ${platform.name}`);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

export const validateAllPlatforms = (metadata: MetadataValidation) => {
  return socialMediaPlatforms.map((platform) => ({
    platform: platform.name,
    debugUrl: platform.debugUrl,
    validation: validateMetadataForPlatform(metadata, platform),
  }));
};

export const generateTestUrls = (baseUrl: string) => {
  const testUrls = [
    `${baseUrl}/en`,
    `${baseUrl}/he`,
    `${baseUrl}/en#projects`,
    `${baseUrl}/he#contact`,
  ];

  return socialMediaPlatforms.map((platform) => ({
    platform: platform.name,
    debugUrl: platform.debugUrl,
    testUrls: testUrls.map((url) => ({
      url,
      debugLink:
        platform.debugUrl !== 'No specific debug tool - uses Open Graph tags'
          ? `${platform.debugUrl}?q=${encodeURIComponent(url)}`
          : null,
    })),
  }));
};

/**
 * Instructions for testing social media previews:
 *
 * 1. Facebook:
 *    - Go to https://developers.facebook.com/tools/debug/
 *    - Enter your URL and click "Debug"
 *    - Check for any errors or warnings
 *    - Use "Scrape Again" if you've made changes
 *
 * 2. Twitter/X:
 *    - Go to https://cards-dev.twitter.com/validator
 *    - Enter your URL and click "Preview card"
 *    - Note: You need to be logged in to Twitter
 *
 * 3. LinkedIn:
 *    - Go to https://www.linkedin.com/post-inspector/
 *    - Enter your URL and click "Inspect"
 *    - Check the preview and any issues
 *
 * 4. WhatsApp:
 *    - Send the URL to yourself or a test contact
 *    - Check how the preview appears
 *
 * 5. Discord:
 *    - Paste the URL in a Discord channel
 *    - Check the embed preview
 *
 * 6. Slack:
 *    - Paste the URL in a Slack channel
 *    - Check the unfurled preview
 */
