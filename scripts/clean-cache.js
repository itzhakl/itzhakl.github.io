#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const { execSync } = require('child_process');

const CACHE_DIRS = ['.next', 'node_modules/.cache', '.cache', '.parcel-cache'];

const TEMP_FILES = ['*.tsbuildinfo', 'next-env.d.ts'];

const removeDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Removing ${dirPath}...`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Removed ${dirPath}`);
    } catch (error) {
      console.error(`❌ Failed to remove ${dirPath}:`, error.message);
    }
  } else {
    console.log(`⏭️  ${dirPath} doesn't exist, skipping...`);
  }
};

const cleanCache = () => {
  console.log('🧹 Starting cache cleanup...\n');

  // Remove cache directories
  CACHE_DIRS.forEach(removeDirectory);

  // Remove temp files
  TEMP_FILES.forEach((pattern) => {
    try {
      const files = execSync(
        `find . -name "${pattern}" -not -path "./node_modules/*"`,
        { encoding: 'utf8' }
      ).trim();
      if (files) {
        files.split('\n').forEach((file) => {
          if (fs.existsSync(file)) {
            console.log(`🗑️  Removing ${file}...`);
            fs.unlinkSync(file);
            console.log(`✅ Removed ${file}`);
          }
        });
      }
    } catch (error) {
      // Ignore errors for temp files cleanup
    }
  });

  console.log('\n🎉 Cache cleanup completed!');
  console.log('\n💡 You can now run:');
  console.log('   npm run dev    - Start development server');
  console.log('   npm run build  - Build for production');
};

// Run if called directly
if (require.main === module) {
  cleanCache();
}

module.exports = { cleanCache };
