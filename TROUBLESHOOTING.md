# Troubleshooting Guide

## Common Issues and Solutions

### 1. Vendor Chunk Errors (Cannot find module './vendor-chunks/...')

**Symptoms:**

- Error: `Cannot find module './vendor-chunks/next.js'`
- Error: `Cannot find module './vendor-chunks/framer-motion.js'`
- Build or dev server fails to start

**Causes:**

- Stale build cache in `.next` directory
- Corrupted webpack chunks
- Version mismatches after dependency updates

**Solutions:**

#### Quick Fix:

```bash
npm run clean
npm run dev
```

#### Full Reset:

```bash
npm run reset
```

#### Manual Steps:

```bash
# Stop development server (Ctrl+C)
# Remove build cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies (if needed)
rm -rf node_modules
npm install

# Rebuild
npm run build
npm run dev
```

### 2. Accessibility Warnings (aria-hidden)

**Symptoms:**

- Console warning: "Blocked aria-hidden on an element because its descendant retained focus"

**Solution:**

- Use `inert` attribute instead of `aria-hidden` for hidden interactive elements
- Add `tabIndex={-1}` to focusable elements when they should not be accessible

### 3. Build Failures

**Symptoms:**

- Build fails with module resolution errors
- TypeScript compilation errors
- Missing dependencies

**Solutions:**

#### Type Check:

```bash
npm run type-check
```

#### Clean Build:

```bash
npm run build:clean
```

#### Validate Content:

```bash
npm run validate-content
```

### 4. Development Server Issues

**Symptoms:**

- Hot reload not working
- Changes not reflecting
- Memory leaks

**Solutions:**

#### Clean Development Start:

```bash
npm run dev:clean
```

#### Check File Watchers:

- Ensure file system watchers are not exhausted
- Close unnecessary applications
- Restart IDE if needed

### 5. Dependency Issues

**Symptoms:**

- Package version conflicts
- Missing peer dependencies
- Installation errors

**Solutions:**

#### Clean Install:

```bash
npm run clean:all
```

#### Check for Updates:

```bash
npm outdated
npm update
```

## Prevention Best Practices

### 1. Regular Maintenance

- Run `npm run clean` before important builds
- Update dependencies regularly
- Clear cache after major changes

### 2. Development Workflow

- Use `npm run dev:clean` when switching branches
- Run `npm run type-check` before commits
- Validate content after changes

### 3. Git Hooks

- Pre-commit hooks run automatically
- Ensure all checks pass before pushing
- Use `git commit --no-verify` only in emergencies

### 4. Environment Management

- Keep Node.js version consistent across team
- Use `.nvmrc` file for version management
- Document required versions in README

## Useful Commands

| Command                    | Description                       |
| -------------------------- | --------------------------------- |
| `npm run clean`            | Remove build cache                |
| `npm run clean:all`        | Full reset (cache + node_modules) |
| `npm run dev:clean`        | Clean start development           |
| `npm run build:clean`      | Clean build                       |
| `npm run reset`            | Complete project reset            |
| `npm run type-check`       | TypeScript validation             |
| `npm run validate-content` | Content validation                |

## Getting Help

1. Check this troubleshooting guide first
2. Look at console errors for specific issues
3. Try clean commands before complex solutions
4. Document new issues and solutions here
