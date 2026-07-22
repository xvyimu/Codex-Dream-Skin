# U3 MVP checklist (spike)

## In
- list themes via core CLI surface
- doctor.fresh boolean slice
- POST /kick with x-codex-skin-token
- single watch injector only

## Out
- Tauri UI / installer / codesign
- second CDP injector
- theme import wizard / marketplace
- window F6 (tracked as PAIN #25, separate slice)
- ADR 0005 remains Proposed until real shell

## Prove
```text
node scripts/windows/shell-probe-client.mjs all
# expect: themes count > 0 when installed; fresh boolean present; kick ok when injector alive
```
