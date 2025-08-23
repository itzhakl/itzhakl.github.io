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

## Deployment

The portfolio is ready for deployment with optimized production builds:

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="Itzhak Leshinsky - Full-Stack Developer"
NEXT_PUBLIC_EMAIL=itzhak.lesh@gmail.com
NEXT_PUBLIC_GITHUB_USERNAME=itzhakl
NEXT_PUBLIC_LINKEDIN_USERNAME=itzhak-leshinsky
NEXT_PUBLIC_WHATSAPP_NUMBER=+972123456789
```

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment

```bash
# Build and test locally
npm run build
npm start

# Deploy to your platform
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Content Management

All content is managed through JSON files in the `/content` directory:

- `projects.json` - Featured projects and portfolio items
- `timeline.json` - Career timeline and milestones
- `stack.json` - Technical skills and technologies
- `personal.json` - Personal interests and values

Translation files are located in `/i18n/messages/` for English and Hebrew.

## Performance

The build includes several optimizations:

- **Lighthouse Score**: 95+ Performance
- **Image Optimization**: Next.js Image with lazy loading
- **Bundle Analysis**: Run `npm run analyze` to check bundle size
- **Code Splitting**: Automatic code splitting for optimal loading
- **Caching**: Optimized caching headers

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
