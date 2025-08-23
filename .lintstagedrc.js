module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    // Type check only changed files
    () => 'tsc --noEmit',
  ],
  '*.{json,css,md}': ['prettier --write'],
  // Validate content when content files change
  'content/**/*.json': ['npm run validate-content'],
};
