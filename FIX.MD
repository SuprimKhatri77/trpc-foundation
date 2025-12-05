# Monorepo TypeScript Build Fix - Complete Solution

## The Problem

- Apps couldn't find workspace packages after build
- tRPC type errors when `declaration: true` was enabled
- Red squiggles everywhere due to missing `.d.ts` files

## The Solution

### 1. Fix ALL lib tsconfig.json files

Apply this to **EVERY** lib package (`trpc-server`, `trpc-client`, `db`, `auth`, etc.):

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": ".",
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true,
    "skipLibCheck": true,
    "composite": true
  },
  "include": ["src/**/*"]
}
```

**Key additions:**

- `"declaration": true` - Generates `.d.ts` files (required for proper imports)
- `"declarationMap": true` - Helps IDE navigation
- `"skipLibCheck": true` - Silences non-portable type warnings from tRPC/external libs
- `"composite": true` - Enables TypeScript project references (better monorepo support)

---

### 2. Fix ALL lib package.json files

Make sure **EVERY** lib has proper entry points:

```json
{
  "name": "@foundation-trpc/your-lib-name",
  "version": "1.0.0",
  "main": "./dist/src/index.js",
  "types": "./dist/src/index.d.ts",
  "scripts": {
    "build": "rm -rf ./dist && tsc"
  }
}
```

**Critical:** `"types"` field must point to the generated `.d.ts` file.

---

### 3. Fix Import Paths in Apps

**❌ WRONG (breaks production):**

```typescript
import { something } from '@foundation-trpc/trpc-server/src'
import { db } from '@foundation-trpc/db/src'
```

**✅ CORRECT (works in dev AND production):**

```typescript
import { something } from '@foundation-trpc/trpc-server'
import { db } from '@foundation-trpc/db'
```

**Why:** The `/src` path works in dev (tsx/ts-node sees source) but fails in production (Node.js only sees compiled `dist` files).

---

### 4. Fix Root package.json Build Order

```json
{
  "scripts": {
    "build:libs": "nx run-many --target=build --projects=@foundation-trpc/trpc-server,@foundation-trpc/trpc-client,@foundation-trpc/auth,@foundation-trpc/db",
    "build:apps": "nx run-many --target=build --projects=@foundation-trpc/api,@foundation-trpc/web",
    "build": "pnpm build:libs && pnpm build:apps"
  }
}
```

**Critical:** Libs MUST build before apps. Apps need the `.d.ts` files from libs.

---

### 5. Clean Build Process

Whenever you change tsconfig or package.json:

```bash
# From root
find . -name "dist" -type d -exec rm -rf {} +  # Delete all dist folders
pnpm build  # Rebuild everything in correct order
```

Or per-package:

```bash
cd libs/trpc-server
rm -rf dist
pnpm build
```

---

## Getting Rid of Red Squiggles

### Option 1: Build libs first (Recommended)

```bash
cd libs/trpc-server && pnpm build
cd ../trpc-client && pnpm build
cd ../db && pnpm build
cd ../auth && pnpm build
```

Once `.d.ts` files exist, red squiggles disappear.

### Option 2: VS Code TypeScript project references

Add to root `tsconfig.json`:

```json
{
  "references": [
    { "path": "./libs/trpc-server" },
    { "path": "./libs/trpc-client" },
    { "path": "./libs/db" },
    { "path": "./libs/auth" },
    { "path": "./apps/api" },
    { "path": "./apps/web" }
  ]
}
```

Then reload VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

---

## Development Workflow

### First time setup:

```bash
pnpm install
pnpm build  # Build everything once
```

### Daily development:

```bash
# Terminal 1 - API
cd apps/api
pnpm dev  # Uses tsx watch, no build needed

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

### After changing a lib:

```bash
cd libs/your-lib
pnpm build  # Rebuild just that lib

# Restart your app's dev server to pick up changes
```

---

## Deployment Checklist

### Railway/Render/VPS (API):

- **Build Command:** `pnpm build`
- **Start Command:** `cd apps/api && pnpm start`
- **Root Directory:** Keep as project root (not apps/api)

### Vercel (Next.js):

- **Framework Preset:** Next.js
- **Build Command:** `pnpm build`
- **Root Directory:** `apps/web`
- **Install Command:** `pnpm install`

---

## Why This All Works

1. **`declaration: true`** - TypeScript generates `.d.ts` files alongside `.js` files
2. **Proper package.json entries** - Node.js knows where to find both JS and types
3. **skipLibCheck** - TypeScript doesn't complain about tRPC's internal complex types
4. **Correct import paths** - Apps import from package root, not `/src`
5. **Build order** - Libs build first, creating the `.d.ts` files apps need

---

## Common Issues

### "Cannot find module '@foundation-trpc/X'"

→ Did you build the lib? Run `cd libs/X && pnpm build`

### Red squiggles in imports

→ Missing `.d.ts` files. Build the lib or restart TS server.

### "The inferred type of 'X' cannot be named..."

→ Normal with `declaration: true`. Ignored by `skipLibCheck: true`. Won't break builds.

### Server starts then stops

→ Check for syntax errors (like `console.log\`` instead of `console.log(`)

---

## Pro Tips

1. **Always build libs after pulling code** - Others might have changed them
2. **Use `pnpm -r build`** - Recursively builds all packages
3. **Add `.d.ts` to .gitignore?** - NO! Commit them for faster CI/CD
4. **Monorepo = build order matters** - Libs → Apps, always

---
