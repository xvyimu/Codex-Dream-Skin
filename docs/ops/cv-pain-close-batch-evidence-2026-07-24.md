# Codexveil · PAIN close-batch evidence · 2026-07-24

**MODE：** `pain-close-batch` · **WRITE_POLICY：** `local-commit`（仅 docs + 状态列；**禁止** asar / publish-runtime / 第二 injector / 改业务码 / push）  
**WT / 支：** `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-pain-close-batch` · `xvyimu/cv-pain-close-batch`  
**对照 tip：** 开工 `ebc3568` · **本卡 commit `76d5890`**  
**装机：** `current.json` · **`runtimeId=1.3.25-da2adc`** · `version=1.3.25` · `updatedAt=2026-07-22T19:44:02Z`  
**STACK_SSOT：** [`docs/PROJECT.md`](../PROJECT.md) §1.5  
**对照源：** [`PAIN-POINTS.md`](../PAIN-POINTS.md) · [`cv-runtime-gap-card-2026-07-25.md`](./cv-runtime-gap-card-2026-07-25.md) · [`cv-day-ready-2026-07-24.md`](./cv-day-ready-2026-07-24.md) · [`w4-arch-upgrade-codexveil-claude.md`](./w4-arch-upgrade-codexveil-claude.md) · [`w1-arch-upgrade-codexveil-claude.md`](./w1-arch-upgrade-codexveil-claude.md) · [`dual-open-policy.md`](../dual-open-policy.md) · [`RELEASE-EVIDENCE.md`](../RELEASE-EVIDENCE.md) · [`plans/codesign-decision-2026-07-21.md`](../plans/codesign-decision-2026-07-21.md)

**OUT_OF_SCOPE：** 假关 · 无证据改状态 · asar · `publish-runtime.ps1` · 第二 injector · 业务码

---

## 一句话

本批 **文档级审计**：对 PAIN #1–#25 逐条挂硬证据指针。  
**结果：** #1–#20 / #22 / #23 **保持已关**（代码 + 既有 ops/测试证据）；**#21 / #24 硬限不关**；**#25 不关**（brief 明确禁假关；live F6 未 smoke，且状态仍绑定 publish 叙事）。  
**本会话未** publish / push / asar。

---

## 1. 本机只读探测（2026-07-24）

| 项 | 值 |
|----|-----|
| tip (开工 → 本卡) | `ebc3568` → **`76d5890`** |
| install `current.json` | `1.3.25` / **`1.3.25-da2adc`** |
| `state.json` | `runtimeId=1.3.25-da2adc` · `controlPort=9336` · injectorPath → 同 versions |
| tip vs install `renderer-inject.js` | **SHA256 相同** · 归一 content 相等 · 两侧均含 `setTheme` / `cycleTheme` / `F6` keydown |
| `npm run doctor`（本 worktree） | exit **0** · `injectorPathFreshness.fresh=true` · expected=actual=`1.3.25-da2adc` · `control.port=9336` · `tokenPresent=true` · `themeCount=1` · `dailyEntry=CodexDreamSkin（任务栏 Codex）` · `processRunning=false` · `injectorAlive=false` · summary `installed-idle` |
| live F6 / 真会话 probe | **未跑**（Codex 未运行；本批禁 publish 起机外扩） |

**认 fresh 顺序（复述 gap 卡）：**  
`current.runtimeId` → `state.runtimeId/injectorPath` → `doctor.fresh===true` →（可选）SKIN_VERSION。  
**禁止**用 tip SHA ≠ `da2adc` 后缀单独要求 re-publish（后缀是 publish 随机 hex）。

---

## 2. 证据表（ID · 原状态 · 新状态/保持 · 证据指针 · 风险）

图例：  
- **保持·已关** = 原表已写「已修/已改善/已绕过/已废弃/仓内已清」，本批 **不抬回 open**，只钉证据。  
- **保持·硬限** / **保持·开放** = 明确不关。

| ID | 原状态（PAIN 表） | 新状态/保持 | 证据指针（硬） | 风险一句 |
|----|-------------------|-------------|----------------|----------|
| **1** | 已修 · kick 45ms | **保持·已关** | [`dual-open-policy.md`](../dual-open-policy.md) §kick ~45–80ms；`packages/core/state/kick-inject.mjs` `kickViaControlPlane` → `POST /kick` | 控制面挂时降级 `--once` 变慢，非第二守护 |
| **2** | 已修 · catalog 只嵌缩略图 | **保持·已关** | `theme-catalog-budget.mjs` `MAX_THEME_CATALOG_BYTES=1.6MB` + member 96KB；`theme-load.mjs` + `thumb.mjs`；`test:catalog-budget` 进 `npm test` | 用户 catalog 塞全图仍可能触预算 |
| **3** | 已修 · 命名 out 变量 | **保持·已关** | `launcher-ui.ps1` `Focus-CodexSkinWindow` + Add-Type/EnumWindows 路径（PS 5.1 可编译）；CHANGELOG 1.3.x focus 链 | 若再引入 `out _` 会回归 |
| **4** | 已修 · bounded retry | **保持·已关** | `launcher-ui.ps1` L787+：`$TimeoutMs` 预算 · `MainWindow`→`EnumWindows`→sleep 120ms · `$proc.Refresh()` | 极端慢机仍可能 focused=false |
| **5** | 已修 · FastLaunch ~100ms | **保持·已关** | `apps/native/CodexFastLaunch/` · [`usage`](../usage.md) / dual-open 日常入口 | 未签名 → 叠 #24 |
| **6** | 已修 · check-and-fix ~3–4s | **保持·已关** | `apps/launcher/check-and-fix.ps1` + FastLaunch/open 路径；PAIN 表自述 | 健康态偶发长等待仍在旅程摘要 |
| **7** | 已修 · state.controlPort=9336 | **保持·已关** | doctor 本机 `control.port=9336` + `dreamSkin.controlPort=9336`；`kick-inject` / `dreamskin-guard` 读 state + `control.port` 文件 | 仅文件无 state 时靠 guard 回填 |
| **8** | 已修 · 短重试 + 硬超时 | **保持·已关** | `kick-inject.mjs` probeTimeoutMs / control timeout；CDP probe 路径 | 偶发 full open 不能 0 |
| **9** | 已修 · publish GC current+上一版 | **保持·已关** | `publish-runtime.ps1` L264+ GC keep current + previous | 手拷 versions/ 可绕过 GC |
| **10** | 已修 · SKIN_VERSION 同步 install | **保持·已关** | gap 卡：tip & 装态 injector `SKIN_VERSION_TOKEN="1.3.25"`；ADR 0003 publish stamp | tip 超前 docs 不抬 SKIN_VERSION |
| **11** | 已修 · post-update + G5-C soft reattach | **保持·已关** | CHANGELOG Unreleased soft-reattach · G5-C；`post-update-regression.ps1`；Quiet exit=2 正式降级 | 子进程 PSModulePath 环境仍脆 |
| **12** | 已修 · 真会话 probe pass | **保持·已关** | RELEASE-EVIDENCE conversation 勾选规则；`probe-session-dom.mjs` `conversationPass`；历史 1.3.19 记录 | 本批 **未** 复跑 live conversation |
| **13** | 已修 · 全局清扫双 injector | **保持·已关** | `common-windows.ps1` `Stop-DreamSkinWatchInjectors`；open/check 启动前硬门闩 | 杀进程竞态窗口极短仍在 |
| **14** | 已修 · listThemes dedupe | **保持·已关** | `theme-store.mjs` `listThemes({ dedupe:true })` 默认 · user root 后写覆盖；`theme-store.test.mjs` | `dedupe:false` 调用方会再重 |
| **15** | 已改善 · wait-shell 自适应 | **保持·已关**（改善态） | `wait-shell.mjs` 文件头：复用 CDP · 120–500ms 退避 · 默认 45s | 冷启动崩溃页仍可能逼近上限 |
| **16** | 已绕过 · native focus | **保持·已关** | FastLaunch 进程内 focus；`/open-healthy` 异步（dual-open / open 脚本） | 控制面 `/focus` spawn PS 仍慢，非日常路径 |
| **17** | 已废弃 · VBS | **保持·已关** | 任务栏改 FastLaunch；dual-open 入口表 | 旧 VBS 若残留用户自删 |
| **18** | 已修 · install-ux 唯一源 | **保持·已关** | dual-open §入口分层；`install-ux-shortcuts.ps1` | 工程师入口仍在「Codex 工具」 |
| **19** | 已修 · 进程评分 | **保持·已关** | focus 链 `Focus-CodexSkinWindow` + 多进程评分（launcher-ui） | Electron 多进程布局变仍可能抖 |
| **20** | 仓内已清 · Programs heige 手卸 | **保持·已关**（仓内） | dual-open §heige：vendor/legacy-inject 删；ux 扫 lnk；**独立 heige 目录非自动** | 用户机残留目录需手卸 |
| **21** | **已知硬限** · 商店 AUMID 裸启 | **保持·硬限 · 不关** | dual-open §商店磁贴；U4 文案「勿商店磁贴」；**不**劫持 AUMID | OS 不可达；成功标准是用户用对钉 |
| **22** | 已修 · UTF-8 console | **保持·已关** | `Initialize-CodexSkinConsoleUtf8` · `chcp 65001`（`launcher-ui.ps1`） | 外部 GBK 工具链仍可能乱码 |
| **23** | 已修 · bubble 多 fallback | **保持·已关** | `probe-session-dom.mjs` 多 selector + `conversationPass`；smoke/injector 路径 | DOM rename 需跟 selector |
| **24** | **已知** · SmartScreen 未签名 | **保持·硬限 · 不关** | [`codesign-decision-2026-07-21.md`](../plans/codesign-decision-2026-07-21.md) **No-Go 购证 / 维持 A**；usage「仍要运行」 | 分发扩大才重评 B |
| **25** | **代码已恢复；需 publish** | **保持·开放 · 不关** | tip+install `renderer-inject.js` **均含** F6/`cycleTheme`（SHA 齐）；**但** doctor `processRunning=false` · **无** live F6 smoke；brief **禁假关**；闭环扫描仍列装态 publish 叙事 | 字节齐 ≠ 用户体感验收；关单须 live smoke + 人 gate 声明 |

---

## 3. 明确不关 + 为什么

| ID | 为什么不关 |
|----|------------|
| **#21** | 商店包 AUMID 激活是 **OS 硬限**；产品策略是文档 + FastLaunch 独立 AUMID，**不是**可修 bug。 |
| **#24** | 未 OV/EV 签名 → SmartScreen 可期；**codesign 决策 No-Go**；关单 = 购证/签名流水线，本批禁止。 |
| **#25** | 用户要求 / brief：**不可假关「需 publish」**。虽 tip↔install `renderer-inject` SHA 已齐且含 F6，但 **未** 在运行中 Codex 上验证 F6/toast；`injectorAlive=false`。关闭条件建议（人）：起 Codex → doctor active-injector → 手按 F6 见 toast/切肤 → 再改状态。**本批不做 publish。** |

---

## 4. 与 W1 / W4 / gap 卡对齐

| 来源 | 与本批关系 |
|------|------------|
| **W1** scout/视觉 | F6/catalog 四参 **保留**（w1 报告 §3.2）；不构成本批关 #25 的 live 证据 |
| **W4** doctor map | 历史装态 `d403fa` fresh；本机现 **`da2adc`** fresh（gap 卡后）· doctor exit 0 |
| **runtime gap 卡** | 关键 ESM+assets 与 tip 逻辑齐 · **默认不 publish** → 支持「不为 #25 本批 stamp」 |
| **day-ready** | 故障树已写 F6→publish / SmartScreen→仍要运行 / 商店磁贴→#21 |

---

## 5. PAIN-POINTS.md 状态列动作

| 动作 | 范围 |
|------|------|
| **改状态文案** | **无** 已关项回写；**不**把 #25 标成已修 |
| **#21 / #24** | 保持硬限原文 |
| **#25** | 保持「代码已恢复；需 publish…」开放态；证据见本卡 §2–§3（装态字节可能已齐，**仍不关**） |
| **可选脚注** | 表下或旅程摘要可链本卡（若改 PAIN，仅加证据链，不改结论） |

---

## 6. 本会话红线执行记录

| 动作 | 状态 |
|------|------|
| asar | **未做** |
| `publish-runtime.ps1` | **未跑** |
| 第二 injector | **未做** |
| 业务码 | **未改** |
| `git push` | **未做** |
| 假关 #21/#24/#25 | **否** |
| 本卡 | `docs/ops/cv-pain-close-batch-evidence-2026-07-24.md` |

---

## 7. 验收（brief）

| 项 | 结果 |
|----|------|
| evidence 表 ID·原状态·新/保持·指针·风险 | **§2** |
| 不关清单 + 原因 | **§3** |
| 仅硬证据 | **是**（代码路径 + doctor/gap；无虚构 live F6） |
| commit | **`76d5890`** `docs(ops): W10 PAIN close-batch evidence (no fake-close)` |
| 状态 | **DONE · in-review · 停** |

**Agent 停步：** 不 publish、不 push、不改 runtime、不关 #21/#24/#25。
