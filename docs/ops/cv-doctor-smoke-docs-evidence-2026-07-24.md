# M-CV-doctor-smoke-docs · W4 evidence · 2026-07-24

**MODE：** `cv-doctor-smoke-docs` · **WRITE_POLICY：** `local-commit`（仅 docs + commit；**禁止 push / asar / publish-runtime / check-and-fix 当 CI**）  
**WT / 支：** `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-doctor-smoke-docs` · `xvyimu/cv-doctor-smoke-docs`  
**基线 tip（开工）：** `ebc3568`  
**STACK_SSOT：** [`docs/PROJECT.md`](../PROJECT.md) §1.5  
**Brief：** `cv-coord/cv-long-wave/briefs/w4-doctor-smoke-docs.md`  
**依赖：** W1 scout ACCEPT · [`cv-scout-health-evidence-2026-07-24.md`](./cv-scout-health-evidence-2026-07-24.md)

---

## 总控回执

| 项 | 值 |
|----|-----|
| 模块 | **M-CV-doctor-smoke-docs** · WEEK **W4** |
| Phase | 文档落点 **DONE** |
| workspaceStatus | **in-review**（请总控审 map + 本 evidence） |
| 主产出 | [`cv-doctor-smoke-map-2026-07-24.md`](./cv-doctor-smoke-map-2026-07-24.md) |
| 交叉（最小） | `docs/usage.md` 故障速查 → map；`cv-day-ready` §4 → map |
| 业务码 / injector | **未改** |
| push / publish / asar | **未做** |
| check-and-fix 当验证 | **未做** |
| 本机 `npm run doctor` | **exit 0** · `fresh: true` · runtimeId **`1.3.25-da2adc`** · idle |
| 装态 smoke | **跳过**（Codex 未运行 · CDP 9335 关 · 符合 brief） |
| commit 信息 | `docs(ops): doctor/smoke command map + evidence` |
| 下一步（总控） | 审 map 命令/风险/`npm test` 关系 → 标 W4 DONE；**勿**默认开 publish child |

---

## 1. 验收对照 brief

| 验收项 | 结果 |
|--------|------|
| map 齐：命令 / 何时用 / 风险 / 与 npm test 关系 | **是** · map §1–§2 |
| evidence 总控回执 + exit | **是** · 本文 |
| doctor 只读 · exit + freshness/runtimeId 进 map 或 evidence | **是** · map §3 + 下表 |
| Codex 未运行 → 跳过 smoke 并写明 | **是** |
| 禁 publish / asar / check-and-fix-as-CI | **遵守** |
| commit `docs(ops):` · in-review | **本会话** |

---

## 2. 本机验证记录

| 步骤 | 结果 | exit |
|------|------|------|
| 先读 brief · scout §1 · usage · day-ready · gap 卡 | 完成 | — |
| `npm run doctor`（仓内 worktree） | JSON 诊断完整；见下摘要 | **0** |
| Codex 进程探测 | `NO_CODEX_PROCESS` | — |
| CDP 9335 | `portOpen=false` / Test-NetConnection False | — |
| 装态 `smoke-dream-skin.ps1` | **未执行**（前置 live 不满足） | **n/a · skipped** |
| `check-and-fix` | **未执行** | n/a |
| `publish-runtime` / asar / push | **未执行** | n/a |

### 2.1 doctor 摘要（2026-07-24）

| 字段 | 值 |
|------|-----|
| exit | **0** |
| `appFound` | `true` · Store `OpenAI.Codex_26.715.7063.0` |
| `processRunning` | `false` |
| `portOpen` (9335) | `false` |
| `dreamSkin.summary` | `installed-idle` |
| `injectorAlive` | `false`（idle 预期） |
| `control` | port **9336** · `tokenPresent: true` |
| `themeCount` / `userThemeCount` | **1** / **1** |
| `injectorPathFreshness.fresh` | **true** · `reason: ok` |
| `expectedRuntimeId` / `actualRuntimeId` | **`1.3.25-da2adc`** / **`1.3.25-da2adc`** |
| injectorPath | `…\versions\1.3.25-da2adc\scripts\injector.mjs`（expected = actual） |
| `diagnosis` | `not-running：Codex 未在运行；watch injector 未检测到，请先点任务栏 Codex；injector 路径与 current runtime 对齐` |

与 scout / gap / day-ready 一致：**fresh 且 runtime 对齐**；无皮 = 会话未开 Codex。

---

## 3. 文档 diff 范围（意图）

| 路径 | 动作 |
|------|------|
| `docs/ops/cv-doctor-smoke-map-2026-07-24.md` | **新增** 命令地图 |
| `docs/ops/cv-doctor-smoke-docs-evidence-2026-07-24.md` | **新增** 本回执 |
| `docs/usage.md` | **最小** · 故障速查下链 map |
| `docs/ops/cv-day-ready-2026-07-24.md` | **最小** · §4 链 map |

未改：packages/\* · apps/\* · publish 脚本 · asar。

---

## 4. 风险（一句）

**文档齐仍不能代替 live smoke：** 本机会话 doctor 已证 runtime **fresh**，但 Codex **未开**故 smoke 跳过；用户「有窗无皮」须任务栏 Codex 后再 doctor/smoke，**勿**因 unit 绿或仅 docs 合入就 stamp publish。

---

## 5. 状态

| 项 | 值 |
|----|-----|
| 卡状态 | **DONE** · **in-review** |
| 总控 | 请审 §总控回执 + map |
| Agent 停步 | 不 push、不 publish、不改 runtime |
