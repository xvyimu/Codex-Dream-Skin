# Codexveil · doctor / smoke 命令地图 · 2026-07-24

**MODE：** `cv-doctor-smoke-docs` · **WRITE_POLICY：** `local-commit`（docs + 本地 commit；**禁止 push / asar / publish-runtime / 改 injector**）  
**WT / 支：** `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-doctor-smoke-docs` · `xvyimu/cv-doctor-smoke-docs`  
**基线 tip：** `ebc3568`（≡ main · gap 卡后）  
**STACK_SSOT：** [`docs/PROJECT.md`](../PROJECT.md) §1.5  
**Brief：** `cv-coord/cv-long-wave/briefs/w4-doctor-smoke-docs.md`  
**前序：** [`cv-scout-health-evidence-2026-07-24.md`](./cv-scout-health-evidence-2026-07-24.md) §1 · [`cv-day-ready-2026-07-24.md`](./cv-day-ready-2026-07-24.md) · [`cv-runtime-gap-card-2026-07-25.md`](./cv-runtime-gap-card-2026-07-25.md) · [`usage.md`](../usage.md)  
**OUT_OF_SCOPE：** publish-runtime · asar · check-and-fix 当 CI · 第二 injector · 改业务码

---

## 一句话

**装机健康 = `doctor`（只读）→ 可选装态 smoke（需 live Codex）→ 再考虑 check-and-fix。**  
`npm test` 绿只证明 unit/contracts，**不**证明用户机有皮。

---

## 1. 命令表（裁自 scout §1 · 运维向）

| 命令 | 何时用 | 进 `npm test`？ | 需 live CDP / 装态？ | 风险 |
|------|--------|-----------------|----------------------|------|
| `npm run doctor` / `node packages/core/cli.mjs doctor` | **首选诊断**；故障树入口；确认 `fresh` / runtimeId / idle vs live | **否** | 读装态 `state`/`current`；CDP 可选（未开也 exit 0 + diagnosis） | **低**（只读） |
| `npm run status` / `cli.mjs status` | 运行态摘要（与 doctor 同族） | **否** | 同 doctor | **低** |
| `npm run list` / `cli.mjs list` | 列仓内 + 用户 catalog | **否** | 读 themes/ + stateRoot | **低** |
| `npm run help` | 子命令帮助 | **否** | 否 | **无** |
| `npm run probe:session` | live CDP DOM 会话探针 | **否** | **是** · Codex+CDP | **中**（触 DOM；不进 CI） |
| 装态 `…\smoke-dream-skin.ps1`（源 `apps/launcher/smoke-dream-skin.ps1`） | 装态冒烟：runtimeId、catalog、CDP 身份、injector alive、`--verify` | **否** | **是** · programRoot + live CDP | **中**（写日志；verify 触 CDP） |
| 装态 `…\check-and-fix.ps1` | 一键修复：CDP/injector/catalog；可 reattach | **否** | **是** · 可起/杀 injector | **高** — **禁当 CI / 默认验证** |
| 装态 `open-codex-dream-skin.ps1` | 日常 open | **否** | 起 Codex + injector | **中高** |
| 装态 `post-update-regression.ps1` | 商店更新后回归 | **否** | live | **中高** |
| `npm run test:control` | control-plane loopback | **否**（不进 unit 门） | 本机 loopback | **低** |
| `npm test`（unit + contracts） | 合并前门闩 | **是** | **否** | **低** |
| `test:freshness` / `test:cdp-url` / `test:catalog-budget` / … | 分项 unit | **是**（经 unit） | **否** | **低** |
| `cli.mjs apply [--theme]` | 写 active-theme + kick | **否** | 需 injector 才见皮 | **中**（写盘） |
| `publish-runtime.ps1 -Version` | stamp `versions/` | **否** | 写装态 | **极高** · **本波禁** · 见 gap 卡 |

### 与 `npm test` 的关系

```text
npm test          →  仓内源码 / 契约 / 依赖图（无 live CDP）
doctor            →  本机装态指针 + 可选 CDP 画像（只读）
smoke-dream-skin  →  装态 + live 注入路径（可选，需 Codex 已开）
check-and-fix     →  修复动作（人工；非证据默认）
```

**CI 绿 ≠ 机子健康。** 体验门在 doctor（+ 可选 smoke）。

---

## 2. 何时用哪条

| 场景 | 先跑 | 再跑 | 勿做 |
|------|------|------|------|
| 「没皮 / 不知道坏哪」 | **`npm run doctor`** | 按 diagnosis：开任务栏 Codex → 再 doctor；仍坏 → 皮肤修复 | 改 asar；商店磁贴裸启（#21） |
| 合并 PR / 改 core·runtime·themes | **`npm test`**（至少触及 script） | 动注入/CDP 时再 doctor | 用 smoke/check-and-fix 当 CI |
| 发布后 / 怀疑装态旧 | doctor 看 **`injectorPathFreshness.fresh`** | 可选 smoke（Codex 已开） | 无 gate 就 `publish-runtime` |
| tip vs 装态字节 | 读 [`cv-runtime-gap-card-2026-07-25.md`](./cv-runtime-gap-card-2026-07-25.md) | 人 + VERSION 才 publish | 用 tip SHA ≠ runtimeId 后缀判 re-publish |
| 确认 F6 / 真注入 | Codex 已开 + smoke 或 probe:session | — | 只靠 unit 绿宣称「窗内 OK」 |
| 双 injector / 僵死 | doctor + 进程列表 | **人工** check-and-fix | 并行第二守护 |

---

## 3. doctor 字段速读

前置：

```powershell
cd D:\orca\Codexveil   # 或本 worktree
npm run doctor
# 等价：node packages/core/cli.mjs doctor
```

| 字段 | 健康期望（live） | idle 常见 |
|------|------------------|-----------|
| `appFound` | `true` | `true`（仅发现路径） |
| `processRunning` / `portOpen`（CDP 9335） | `true` / `true` | `false` / `false` |
| `dreamSkin.summary` | 非 idle；injector 在 | `installed-idle` |
| `dreamSkin.injectorAlive` | `true` | `false`（idle 预期；state 可残留旧 pid） |
| `control.port` / `tokenPresent` | **9336** / `true` | 同左（文件在 stateRoot） |
| `themeCount` / `userThemeCount` | ≥1（arina-only 产品线常为 1/1） | 同左 |
| **`injectorPathFreshness.fresh`** | **`true`** · `reason: ok` | **与是否开 Codex 无关** — 指 current↔state↔injectorPath |
| `expectedRuntimeId` / `actualRuntimeId` | 一致（例 `1.3.25-da2adc`） | 同左 |
| `diagnosis` | 无 not-running / 无路径撕裂 | `not-running：…请先点任务栏 Codex；…路径对齐` |

**认 fresh 顺序**（与 day-ready / gap 一致）：

```text
current.json.runtimeId
  → state.json.runtimeId / injectorPath
  → doctor.injectorPathFreshness.fresh === true
  → （可选）smoke / SKIN_VERSION
```

git tip **alone ≠** 用户机已升级。`runtimeId` 后缀是 publish 随机 6 hex，**不是** git short SHA。

### 本机快照（只读 · 2026-07-24 · 本 WT）

| 字段 | 值 |
|------|-----|
| **exit** | **0** |
| `appFound` | `true`（Store Codex `OpenAI.Codex_26.715.7063.0`） |
| `processRunning` / `portOpen` | `false` / `false` |
| `dreamSkin.summary` | `installed-idle` |
| `injectorAlive` | `false` |
| control | **9336** · `tokenPresent: true` |
| themes | `themeCount=1` · `userThemeCount=1` |
| **fresh** | **`true`** · expected/actual runtimeId **`1.3.25-da2adc`** |
| `diagnosis` | not-running + 路径对齐 |

→ **装态 runtime 齐；无皮因 Codex 未运行，非 versions 撕裂。**

---

## 4. 可选装态 smoke

**源：** `apps/launcher/smoke-dream-skin.ps1`  
**装态：** `%LOCALAPPDATA%\Programs\CodexDreamSkin\smoke-dream-skin.ps1`

```powershell
# 仅当 Codex 已由任务栏 FastLaunch 拉起、CDP 9335 可连时再跑
powershell -NoProfile -ExecutionPolicy RemoteSigned -File `
  "$env:LOCALAPPDATA\Programs\CodexDreamSkin\smoke-dream-skin.ps1"
# 期望：SMOKE_PASS · 记 exit
```

| 条件 | 本会话 |
|------|--------|
| Codex 进程 / CDP 9335 | **未运行 / 未开** → **跳过 smoke 实跑** |
| 跳过原因 | brief：未运行则写明跳过，不强制开窗 |

**不要**用 smoke 代替 doctor；**不要**把 smoke 失败当 unit 红项修 themes。

---

## 5. 红线（本卡与日常）

1. **禁止** 把 `check-and-fix` / smoke 当默认 CI 或「合并前必跑」  
2. **禁止** `publish-runtime` / asar / 第二 injector（除非人 gate + VERSION）  
3. **禁止** 用商店磁贴入口当健康标准（#21 硬限）  
4. **禁止** 密钥 / `control.token` 进库或日志全文  
5. doctor **只读** — 本卡验证上限

用户向故障表：[`docs/usage.md`](../usage.md)「故障速查」。  
DAY 故障树：[`cv-day-ready-2026-07-24.md`](./cv-day-ready-2026-07-24.md) §4。  
证据回执：[`cv-doctor-smoke-docs-evidence-2026-07-24.md`](./cv-doctor-smoke-docs-evidence-2026-07-24.md)。

---

## 6. 状态

| 项 | 值 |
|----|-----|
| 卡 | **DONE** · **in-review** |
| 业务码 | **未改** |
| push / publish / asar | **未做** |
| Agent 停步 | 文档 + commit；总控审 map + evidence |
