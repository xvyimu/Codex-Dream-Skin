# @codex-skin/contracts

Shared **Zod** schemas for cross-layer fields (ADR 0004).

- Dev-plane only — **not** copied into `versions/<id>/`
- Keep CSS color regex aligned with `packages/runtime/scripts/theme-load.mjs`
- W2 surface: palette · doctor slice · control error · **inject/kick** (`inject.ts`: kick result, theme inject config, catalog entry, early-apply keys)

```bash
pnpm --filter @codex-skin/contracts test
# = tsc + node --test dist/index.test.js
pnpm --filter @codex-skin/contracts build
```
