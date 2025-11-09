# NPM workspace protocol fix

Your npm is rejecting `workspace:*` versions. This patch switches all internal deps to `file:` paths.

## Apply patch
```bash
unzip -o npm_workspace_protocol_fix.zip -d .
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
npm install
npm run dev
```

## What changed
- apps/web/package.json → all @ac/* deps now use `file:../../packages/...`
- packages/*/package.json → depend on @ac/core via `file:../core`
- root package.json → npm workspaces + dev scripts
