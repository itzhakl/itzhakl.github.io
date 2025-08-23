# Modern Portfolio Website

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🌍 Internationalization (English/Hebrew)
- 🎨 Modern design with dark/light theme support
- 📱 Fully responsive
- ♿ Accessibility compliant
- 🚀 Optimized performance
- 📊 Content validation
- 🔧 Developer-friendly tooling

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Available Scripts

| Command                    | Description                       |
| -------------------------- | --------------------------------- |
| `npm run dev`              | Start development server          |
| `npm run dev:clean`        | Clean start development           |
| `npm run build`            | Build for production              |
| `npm run build:clean`      | Clean build                       |
| `npm run clean`            | Remove build cache                |
| `npm run clean:all`        | Full reset (cache + node_modules) |
| `npm run reset`            | Complete project reset            |
| `npm run type-check`       | TypeScript validation             |
| `npm run validate-content` | Content validation                |
| `npm run lint`             | Run ESLint                        |
| `npm run format`           | Format code with Prettier         |

## Troubleshooting

If you encounter build issues or vendor chunk errors, try:

1. **Quick fix**: `npm run clean && npm run dev`
2. **Full reset**: `npm run reset`
3. **Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)** for detailed solutions

## Development

- Built with Next.js 15 App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Next-intl for internationalization
- Content validation with Zod schemas

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
├── content/              # Content files (JSON)
├── i18n/                 # Internationalization
├── lib/                  # Utilities and hooks
├── scripts/              # Build and utility scripts
├── types/                # TypeScript type definitions
└── TROUBLESHOOTING.md    # Troubleshooting guide
```
