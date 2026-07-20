# Contract: post-update-report.json

On-disk Quiet / post-update regression report for Codex DreamSkin on Windows.

**schemaVersion:** `1` (current producer write). Consumers treat a **missing** `schemaVersion` as legacy and still read known fields (best-effort).

Readers may treat `finishedAt` or `startedAt` as the generated moment. There is **no** separate `generatedAt` field.

## Paths / roles

| Role | Path / entry |
|------|----------------|
| On-disk | `%LOCALAPPDATA%\CodexDreamSkin\post-update-report.json` |
| Producer | `apps/launcher/post-update-regression.ps1` |
| Consumers | `Write-CodexSkinPostUpdateFailureSummary` in `scripts/windows/post-update-failure-summary.ps1`; `publish-runtime.ps1` (summary + stamp fields) |
| Drill | `scripts/windows/verify-post-update-failure-summary.ps1` |

## schemaVersion

| | |
|--|--|
| Type | int |
| Producer writes | `1` |
| Missing | Legacy / unversioned — consumers **continue** (do not reject) |
| Unknown larger | Still best-effort v1 field read; do not throw |

## Required fields (v1)

Producers should include these on both success and failure disk writes when possible:

| Field | Type | Notes |
|-------|------|-------|
| `schemaVersion` | int | `1` |
| `pass` | bool | `true` only when all checks passed |
| `checks` | array | Elements below |
| `startedAt` | string | ISO-8601 UTC (`o` format) |
| `finishedAt` | string | ISO-8601 UTC; write on error path too |

### `checks[]` elements

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Check id; if missing/empty, summary prints `(unnamed)` |
| `pass` | bool | Whether the check passed |
| `detail` | string | Optional detail (may be empty string) |

## Optional / common extensions

Unknown extra fields must not cause consumers to fail.

| Field | Notes |
|-------|-------|
| `error` | Top-level exception message (catch path) |
| `port` | CDP port |
| `repaired` | Whether repair path ran |
| `recommendations` | string[] |
| `codex` | Object: executable / packageRoot / … |
| `runtimeId` / `currentRuntimeId` / `publishedRuntimeId` | Runtime pointers |
| `stale` | bool; publish stamp often sets `false` |
| `smokeExit` | smoke process exit code |
| `savedState` | Summarized state fields |

## Semantics

- `pass=true` ⇒ no failed checks (producer uses failed-count).
- `pass=false` with failed items in `checks` ⇒ summary prints failed names.
- `pass=false` with no failed per-check detail ⇒ summary fallback line: `post-update report: pass=false (no per-check detail)`.
- Non-empty `error` ⇒ summary prints `post-update report error: …` (may coexist with failed checks).
- **Producer exit codes:** `0` pass / `2` failed check(s) / `1` top-level exception. Quiet still writes the report and uses the same exits.
- **Publish:** Quiet failure + soft reattach is an intentional degrade path. The summary is **observability only** and does **not** alone decide publish failure (G5-C / PAIN #11).

### Summary consumer soft rules

- Missing report file → silent return.
- Bad JSON → catch and ignore (no throw).
- `checks` null/missing → empty list.
- Single-object `checks` from `ConvertFrom-Json` → wrap with `@(...)`.
- Missing/empty check `name` → `(unnamed)`.
- Missing check `detail` → no parenthetical segment.
- Missing check `pass` → treated as failed (falsey) is acceptable.

## Minimal failure example (fictional)

```json
{
  "schemaVersion": 1,
  "startedAt": "2026-07-20T12:00:00.0000000Z",
  "finishedAt": "2026-07-20T12:00:05.0000000Z",
  "pass": false,
  "checks": [
    {
      "name": "smoke-dream-skin.ps1",
      "pass": false,
      "detail": "exit=1"
    }
  ],
  "repaired": false,
  "recommendations": []
}
```

Legacy reports **without** `schemaVersion` remain readable the same way for `checks` / `error` / `pass`.

## Evolution

- New fields are additive only.
- Do not change the meaning of `checks[].name|pass|detail` without a version bump.
- Breaking changes require `schemaVersion` increment plus updates to summary, this document, and verify.
