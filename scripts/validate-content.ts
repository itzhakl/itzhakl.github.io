#!/usr/bin/env tsx

import { validateAllContent } from '../lib/content';

/**
 * Build-time content validation script
 * This script validates all content files against their Zod schemas
 * and provides detailed error reporting for any validation failures.
 */

const main = async () => {
  console.log('🔍 Validating content files...\n');

  try {
    const content = validateAllContent();

    console.log('✅ All content files are valid!\n');

    // Log summary statistics
    console.log('📊 Content Summary:');
    console.log(
      `   Projects: ${content.projects.length} (${content.projects.filter((p) => p.featured).length} featured)`
    );
    console.log(`   Tech Stack Categories: ${content.stack.length}`);
    console.log(`   Timeline Items: ${content.timeline.length}`);
    console.log(
      `   Personal Fun Facts: ${content.personal.funFacts.en.length} (EN), ${content.personal.funFacts.he.length} (HE)`
    );
    console.log(
      `   Personal Interests: ${content.personal.interests.en.length} (EN), ${content.personal.interests.he.length} (HE)`
    );
    console.log(
      `   Personal Values: ${content.personal.values.en.length} (EN), ${content.personal.values.he.length} (HE)`
    );

    // Validate that all required translations exist
    const missingTranslations: string[] = [];

    content.projects.forEach((project, index) => {
      if (!project.title.en || !project.title.he) {
        missingTranslations.push(
          `Project ${index + 1} (${project.slug}): missing title translations`
        );
      }
      if (!project.summary.en || !project.summary.he) {
        missingTranslations.push(
          `Project ${index + 1} (${project.slug}): missing summary translations`
        );
      }
    });

    content.stack.forEach((category, index) => {
      if (!category.category.en || !category.category.he) {
        missingTranslations.push(
          `Stack category ${index + 1}: missing category translations`
        );
      }
    });

    content.timeline.forEach((item, index) => {
      if (!item.title.en || !item.title.he) {
        missingTranslations.push(
          `Timeline item ${index + 1}: missing title translations`
        );
      }
      if (!item.summary.en || !item.summary.he) {
        missingTranslations.push(
          `Timeline item ${index + 1}: missing summary translations`
        );
      }
    });

    if (missingTranslations.length > 0) {
      console.log('\n⚠️  Translation Warnings:');
      missingTranslations.forEach((warning) => console.log(`   ${warning}`));
    }

    console.log('\n🎉 Content validation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Content validation failed:\n');

    if (error instanceof Error) {
      console.error(error.message);

      // If it's a validation error, provide more detailed information
      if (error.message.includes('validation failed')) {
        console.error('\n💡 Tips for fixing validation errors:');
        console.error('   • Check that all required fields are present');
        console.error('   • Ensure URLs are properly formatted');
        console.error('   • Verify that enum values match the schema');
        console.error('   • Make sure all translations (en/he) are provided');
      }
    } else {
      console.error('Unknown error occurred during validation');
    }

    process.exit(1);
  }
};

// Run the validation
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
