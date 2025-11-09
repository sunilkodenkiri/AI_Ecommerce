
# NPM Workspace Setup (Fix Patch)

## 1) Copy these files into your repo root
- package.json (root) — adds npm workspaces
- tsconfig.base.json (root)
- apps/web/tsconfig.json
- packages/*/tsconfig.json

If a file already exists, replace it with this version.

## 2) Install with npm
```bash
rm -rf node_modules **/*/node_modules
npm install
```

## 3) Dev
```bash
npm run dev
# open http://localhost:3000
```

## Common Errors

### Module not found: @core / @usecase-*
Cause: path aliases not set for Next/TS
Fix: use the tsconfig files in this patch. Restart dev server after copying.

### Cannot find type definitions (react, node)
Fix: this patch adds @types/node, @types/react, @types/react-dom to root devDependencies. Reinstall.

### Tailwind not applying
Make sure apps/web/tailwind.config.ts includes:
```
content: ["./app/**/*.{ts,tsx}", "../../packages/**/*.{ts,tsx}"]
```

### Next.js version / Node
Use Node 18.17+ and npm 9/10. Check:
```
node -v && npm -v
```
