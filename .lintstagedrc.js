module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    // Type check only changed files
    () => 'tsc --noEmit',
  ],
  '*.{json,css,md}': ['prettier --write'],
};
