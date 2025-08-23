const fs = require('fs');
const path = require('path');

// Simple icon generation using canvas (for development)
// In production, you'd use a proper image processing library like sharp

const createSimpleIcon = (size, filename) => {
  // Create a simple colored square as placeholder
  const canvas = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#0b0f14"/>
    <text x="${size / 2}" y="${size * 0.65}" font-family="Arial, sans-serif" font-size="${size * 0.6}" font-weight="bold" text-anchor="middle" fill="#ffffff">IL</text>
  </svg>`;

  fs.writeFileSync(path.join(__dirname, '..', 'public', filename), canvas);
  console.log(`Created ${filename} (${size}x${size})`);
};

// Generate all required icon sizes
const icons = [
  { size: 16, filename: 'favicon-16x16.png' },
  { size: 32, filename: 'favicon-32x32.png' },
  { size: 180, filename: 'apple-touch-icon.png' },
  { size: 192, filename: 'android-chrome-192x192.png' },
  { size: 512, filename: 'android-chrome-512x512.png' },
];

console.log('Generating placeholder icons...');

// For now, create SVG versions (in production you'd convert to PNG)
icons.forEach(({ size, filename }) => {
  const svgFilename = filename.replace('.png', '.svg');
  createSimpleIcon(size, svgFilename);
});

console.log('Icon generation complete!');
console.log(
  'Note: These are SVG placeholders. For production, convert to PNG using a proper image processing tool.'
);
