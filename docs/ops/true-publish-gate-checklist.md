# Codexveil · true publish gate checklist (wave7/wave8)

> **Do not run this as automation.** Operator-only after Dual-B / wave8 tip is green.  
> **真 publish 默认不执行** — 总控 + 人 gate（VERSION + 「现在 publish」）后才跑 `publish-runtime.ps1`。

## Preconditions (automated — tip / CI / agent)

| Check | Command | Expected |
| --- | --- | --- |
| Tip publish whitelist + staged ESM | `pwsh -NoProfile -File scripts/windows/verify-publish-runtime-payload.ps1` | `VERIFY OK` · exit **0** |
| Unit / contracts | `npm test` | exit **0** |
| Theme-load present in repo | `Test-Path packages/runtime/scripts/theme-load.mjs` | true |
| Control-plane + fs-io present | `Test-Path packages/runtime/scripts/control-plane.mjs` · `fs-io.mjs` | true |

### What `verify-publish-runtime-payload.ps1` covers (agent-safe)

- Static: `publish-runtime.ps1` `$requiredRuntimeScripts` names (incl. **theme-load**, **control-plane**, **fs-io**)
- Repo files exist under `packages/runtime/scripts/`
- Temp stage + Node import: `theme-load` + `control-plane` (resolves `./fs-io.mjs`)
- Injector edges: static `./theme-load.mjs` · dynamic `import("./control-plane.mjs")`
- **Does not** write `%LOCALAPPDATA%\Programs\CodexDreamSkin` or flip `current.json`

### What `npm run doctor` covers (live machine)

| Surface | Source | Notes |
| --- | --- | --- |
| Codex discovery / CDP | `packages/core` | Needs running Desktop or historical ports |
| DreamSkin runtime | `detectDreamSkinRuntime` | state.json / injector pid / control.port |
| Injector path freshness | `inspectInjectorPathFreshness` | install `current.json` vs state |
| Themes list | `packages/themes` | user + bundled |

Doctor **does not** replace publish-whitelist dry-run. Sequence for humans:

1. `verify-publish-runtime-payload.ps1` → tip closed  
2. (optional) `npm test`  
3. **人 gate** → `publish-runtime.ps1 -Version …`  
4. (optional) `verify-install-matches-repo.ps1` · `npm run doctor` · smoke

## Human-only steps (when you choose to publish)

1. Confirm version string (e.g. continues `1.3.25` line or next stamp) — matches product policy.
2. Close running Codex DreamSkin / injector watch if install dir is locked.
3. From repo root (main checkout or authorized worktree):

```powershell
pwsh -NoProfile -File scripts/windows/publish-runtime.ps1 -Version <VERSION>
```

4. Post-publish proofs:

```powershell
# replace <id> with versions folder name printed by publish
$ver = "$env:LOCALAPPDATA\Programs\CodexDreamSkin\versions\<id>"
Test-Path "$ver\scripts\theme-load.mjs"      # must be True
Test-Path "$ver\scripts\control-plane.mjs"   # must be True
Test-Path "$ver\scripts\fs-io.mjs"           # must be True
Test-Path "$ver\scripts\injector.mjs"
pwsh -NoProfile -File scripts/windows/verify-install-matches-repo.ps1
npm run doctor   # optional live
```

5. Smoke: start DreamSkin, switch a theme, confirm no `ERR_MODULE_NOT_FOUND` for `theme-load` / `control-plane` / `fs-io`; kick/apply still works.

## Explicit non-actions for agents

- Do **not** run `publish-runtime.ps1` without user “publish now” + VERSION.
- Do **not** force-push, delete install backups, or touch unrelated Programs paths.
- Dry-run / `verify-publish-runtime-payload.ps1` is enough for CI/agent evidence.

## Related

- Wave8 report: `docs/ops/wave8-codexveil-claude.md` (this dual branch)
- Dual-B report: `docs/ops/wave6-dual-b-codexveil-claude.md`
- ADR 0003 version stamp discipline
- Closed-loop scan: `docs/ops/closed-loop-scan-2026-07-22.md`
