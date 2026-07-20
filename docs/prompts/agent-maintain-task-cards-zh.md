# 维护 Agent 任务卡提示词（2026-07-21）

> 用法：复制对应 **C-xx** 整块代码围栏内容，粘贴给维护 Agent 执行。  
> 任务卡正文：[`../plans/task-cards-2026-07-21.md`](../plans/task-cards-2026-07-21.md)  
> 规范：[`../CONTRIBUTING.md`](../CONTRIBUTING.md)  
> 基线：执行前用 `git rev-parse HEAD` + `node packages/core/cli.mjs doctor` 复验；撰写时 HEAD=`c390d4e` runtimeId=`1.3.25-107b0e`。

**统一绝对约束**（每份提示词已内嵌摘要；完整见 PROJECT / ADR / CONTRIBUTING §C-8）：

1. 不重新设计；不恢复双 injector / heige 第二产品线  
2. 不 core↔runtime 静态互引  
3. 不绕过 active-theme 直连 CDP 注入主题  
4. 不劫持 Store AUMID / 不改 .asar / 不把 macOS 做一等公民  
5. 版本只认 `publish-runtime.ps1 -Version`（ADR 0003）  
6. 路径走 `resolveStudioPaths` / `Get-CodexSkin*`  
7. `--once` 仅 kick 降级，非第二守护  
8. 小步提交；验证命令必须跑通再 commit  

**建议顺序**：DOC-01 → DOC-02 → FRAME-01 → TEST-02 → DOC-03 → CODE-01 → WIN-02 → SEC-02 → CODE-03/04/05/06。

---

## C-1 · DOC-01 文档 HEAD/runtimeId 对齐（P1）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：DOC-01 文档基线对齐。

【项目上下文】
- 仓库：D:\orca\codex-skin
- 执行前：git rev-parse HEAD · node packages/core/cli.mjs doctor（记下 HEAD 与 expectedRuntimeId）
- AUDIT / SCAN 文档头可能仍写旧 HEAD/runtimeId（漂移）

【任务】
1. docs/AUDIT-2026-07-20.md §16 后续修订表追加一行：日期 | HEAD | runtimeId | 「文档基线校准（维护任务 DOC-01）」
2. docs/SCAN-OPTIMIZE-2026-07-20.md 尾部追加「修订记录」段，同上声明
3. 两份文档顶部基线字段附近追加：
   > **当前基线校准**（日期）：HEAD=<实测> runtimeId=<实测>

【约束】
- 仅改上述两份 docs，不改代码
- 不重写主体结论
- 遵守 docs/CONTRIBUTING.md §C-6 小步提交

【验收】
- 文档声明的 HEAD/runtimeId 与实测一致
- git diff 仅涉 docs/AUDIT* 与 docs/SCAN*

【验证命令】
git rev-parse HEAD
node packages/core/cli.mjs doctor
git diff --stat

【输出】
完成后提交（message 可改日期）：
git commit -m "Align AUDIT/SCAN baselines (DOC-01)

Append calibration rows so HEAD and runtimeId match repo actual state.

Refs: docs/plans/task-cards-2026-07-21.md DOC-01"
```

---

## C-2 · DOC-02 PAIN-POINTS 补 SmartScreen（P1）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：DOC-02 补 SmartScreen 条目。

【项目上下文】
- 仓库：D:\orca\codex-skin
- 产品 FastLaunch / 入口未签名，用户首次可能遇 Windows SmartScreen
- docs/PAIN-POINTS.md 当前到 #23，无 SmartScreen

【任务】
1. docs/PAIN-POINTS.md 追加 #24：
   - 现象：首次运行入口时 SmartScreen「Windows 保护了你的电脑」
   - 原因：本产品 exe/入口未 OV 签名（成本高，P3）
   - 应对：更多信息 → 仍要运行
   - 长期：评估 OV 签名（非目标 macOS 不涉及）
2. docs/usage.md 合适位置交叉引用 PAIN-POINTS #24

【约束】
- 仅 docs/PAIN-POINTS.md 与 docs/usage.md
- 不承诺立即签名；不写长教程；不碰 macOS

【验收】
- Grep SmartScreen docs/PAIN-POINTS.md 命中
- usage 引用 #24

【验证命令】
git diff --stat

【输出】
git commit -m "Add SmartScreen pain point #24 (DOC-02)

Document first-run interception and workaround. OV signing deferred to P3.

Refs: docs/plans/task-cards-2026-07-21.md DOC-02"
```

---

## C-3 · FRAME-01 规范入库与索引（P1）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：FRAME-01 规范入库与索引。

【项目上下文】
- 仓库：D:\orca\codex-skin
- docs/CONTRIBUTING.md 可能已存在（§C-1–C-9）；若缺则按扫描报告/任务卡补齐
- PROJECT.md / CLAUDE.md / README.md 需链入 CONTRIBUTING 与 task-cards

【任务】
1. 确认 docs/CONTRIBUTING.md 含 §C-1 至 §C-9 + PR 模板
2. docs/PROJECT.md 相关文档索引表追加 CONTRIBUTING + task-cards 链接
3. CLAUDE.md 约定段链入 CONTRIBUTING
4. README.md 文档列表链入 CONTRIBUTING + task-cards
5. （可选）.github/pull_request_template.md 采用 CONTRIBUTING 中 PR 模板

【约束】
- 以文档为主；不改业务注入路径
- 不重写 PROJECT 主体；不改 ADR

【验收】
- Grep「模块依赖 PR 必答 7 问」docs/CONTRIBUTING.md 命中
- PROJECT / CLAUDE / README 均能点到 CONTRIBUTING

【验证命令】
git diff --stat
node packages/core/cli.mjs doctor

【输出】
git commit -m "Link CONTRIBUTING and task-cards in indexes (FRAME-01)

Ensure PR specs and task cards are discoverable from PROJECT/CLAUDE/README.

Refs: docs/plans/task-cards-2026-07-21.md FRAME-01"
```

---

## C-4 · TEST-02 control-plane token 测试（P2）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：TEST-02 新增 control-plane token 测试。

【项目上下文】
- 仓库：D:\orca\codex-skin
- SEC-01 已落地：control-plane 对非 health 的 POST 强制 token；GET /health 免 token
- npm test = test:themes + test:deps；本测试不强制进 CI

【任务】
新增 packages/runtime/scripts/control-plane.test.mjs：
1. GET /health 无 token → 200
2. POST /kick 无 token → 401 reason token-required
3. POST /kick 错 token → 401
4. POST /kick 正确 token（header x-codex-skin-token 或 query）→ 200/202

【实现要求】
- 端口 9347+；tmp stateRoot；测完关服清目录
- 无新依赖（node:http/fs/os/path + assert）
- 参考 packages/themes/theme-schema.test.mjs 风格

【约束】
- 尽量只新增 test 文件；不进 themes-gate.yml
- 不测 CDP 真注入
- 遵守 CONTRIBUTING §C-1 / §C-6

【验收】
node packages/runtime/scripts/control-plane.test.mjs
npm test

【输出】
git commit -m "Add control-plane token regression test (TEST-02)

Cover health open + kick token required/wrong/ok. Port 9347+ and tmp
stateRoot. Not in CI.

Guards: SEC-01
Refs: docs/plans/task-cards-2026-07-21.md TEST-02"
```

---

## C-5 · DOC-03 GLOSSARY 扩展（P2）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：DOC-03 扩展 GLOSSARY。

【项目上下文】
- 仓库：D:\orca\codex-skin
- docs/GLOSSARY.md 已有基础术语；需补 soft reattach、token 头、路径函数、命名冻结、schema 三件套等

【任务】
扩展 docs/GLOSSARY.md，每条一句话定义 + 源路径引用。至少覆盖：
soft reattach · control.token · x-codex-skin-token · resolveStudioPaths · Get-CodexSkin* · Verb-DreamSkinNoun（冻结）· Verb-CodexSkinNoun · STATE_SCHEMA_VERSION vs state.json.schemaVersion · dual-open-policy · dreamskin-guard · test:deps · FastLaunch（若缺则补齐）

【约束】
- 仅 docs/GLOSSARY.md
- 不写教程；定义与 ARCHITECTURE/CONTRIBUTING 一致

【验收】
关键术语齐全；无与 CONTRIBUTING §C-9 矛盾

【验证命令】
git diff --stat

【输出】
git commit -m "Expand GLOSSARY terms (DOC-03)

Add soft reattach, token header, path resolvers, naming freeze, schema triple.

Refs: docs/plans/task-cards-2026-07-21.md DOC-03"
```

---

## C-6 · CODE-01 injector.mjs TOC 注释（P2）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：CODE-01 injector.mjs TOC。

【项目上下文】
- 仓库：D:\orca\codex-skin
- packages/runtime/scripts/injector.mjs 单文件 1400+ 行，ADR 0001 保持单守护文件

【任务】
1. 文件顶部加 TOC（区域名 + 用 Grep 定位的近似行号）
2. 各逻辑区起点加 // === Region: <name> ===
建议区：Constants · StateRoot · Theme load · Watch loop · CDP evaluate · Control-plane · Signals · Payload budget

【约束】
- 仅注释；不改逻辑；不拆文件
- 行号实测，禁止编造

【验收】
npm test · node packages/core/cli.mjs doctor（fresh=true）

【输出】
git commit -m "Add TOC and region markers to injector.mjs (CODE-01)

Comments only. Improves navigation of single-file daemon (ADR 0001).

Refs: docs/plans/task-cards-2026-07-21.md CODE-01"
```

---

## C-7 · WIN-02 冻结表写入 README（P3）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：WIN-02 README 冻结表。

【项目上下文】
- packages/core-win/common-windows.ps1 保留大量 Verb-DreamSkinNoun，不可批量改名
- 新函数用 Verb-CodexSkinNoun（CONTRIBUTING §C-5）

【任务】
README.md 增加「已知债务」段：冻结表声明 + 示例函数名 + 链 CONTRIBUTING §C-5

【约束】
- 仅 README.md；不改 common-windows.ps1；不 alias 双前缀

【验收】
Grep Verb-DreamSkinNoun / WIN-02 README 命中

【输出】
git commit -m "Document common-windows.ps1 DreamSkin freeze list (WIN-02)

Refs: docs/plans/task-cards-2026-07-21.md WIN-02"
```

---

## C-8 · SEC-02 日志脱敏审计（P3）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：SEC-02 日志 token 脱敏审计。

【项目上下文】
- control.token 32 hex；header x-codex-skin-token
- 日志：injector.log / open-codex-dream-skin.log 等

【任务】
1. Grep Write-OpenLog / Write-CodexSkinLog / console.log 等日志点
2. 周边 5 行查 token 明文
3. 有泄露 → redactToken(前4+***) 并改写入点；无泄露 → PAIN-POINTS 记「SEC-02 已审计」

【约束】
- 不改 token 生成；不引入 vault
- 改代码则 doctor + npm test

【验收】
无明文泄露记录或已 redact

【输出】
按结果二选一 commit message（见 task-cards SEC-02）
Refs: docs/plans/task-cards-2026-07-21.md SEC-02
```

---

## C-9 · CODE-03 doctor 顶层 control 字段（P3）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：CODE-03 doctor 顶层 control 摘要。

【项目上下文】
- dreamSkin 子对象已有 controlPort / controlTokenPresent
- 运维希望顶层一眼可见

【任务】
packages/core/cli.mjs doctor 顶层追加：
control: { port, tokenPresent }
从现有 dreamSkin 提取；缺省 null；不删旧字段

【约束】
- 仅 cli.mjs；不改 dreamskin-guard / control-plane 主体

【验收】
node packages/core/cli.mjs doctor 顶层含 control 且与 dreamSkin 一致
npm test

【输出】
git commit -m "Expose control summary at doctor top level (CODE-03)

Refs: docs/plans/task-cards-2026-07-21.md CODE-03"
```

---

## C-10 · CODE-04 theme-store dedupe 注释（P3）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：CODE-04 theme-store dedupe 注释。

【任务】
Read packages/themes/theme-store.mjs listThemes：
- dedupe / priority / 形状守卫 旁加注释
- MAX_SOURCE_IMAGE_BYTES 与 injector MAX_ART_BYTES 差异说明

【约束】
仅注释；不改逻辑

【验收】
npm run test:themes

【输出】
git commit -m "Document listThemes dedupe policy (CODE-04)

Refs: docs/plans/task-cards-2026-07-21.md CODE-04"
```

---

## C-11 · CODE-05 SKIN_VERSION_TOKEN 注释（P3）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：CODE-05 stamp 注释澄清。

【任务】
在 packages/runtime/assets/renderer-inject.js 与 packages/runtime/scripts/injector.mjs
SKIN_VERSION_TOKEN 旁注释追加：
repo 源在 publish -Version 后也会被 stamp；dev 仅未 publish working copy。

【约束】
仅注释；不改 token 字面量；ADR 0003

【验收】
doctor fresh=true · npm test

【输出】
git commit -m "Clarify SKIN_VERSION_TOKEN stamp comment (CODE-05)

Refs: docs/plans/task-cards-2026-07-21.md CODE-05
ADR: 0003"
```

---

## C-12 · CODE-06 residual G5-C 反向链接（P3）

```
你是 Codex Dream Skin 项目的维护 Agent。当前任务：CODE-06 residual G5-C 行号反向链接。

【任务】
1. Grep scripts/windows/publish-runtime.ps1 中 WaitForExit / soft-reattach / soft-reattach.ps1
2. docs/plans/residual-g1-g3-g4-g5-2026-07-20.md G5-C 段追加实测行号反向链接

【约束】
仅 residual 文档；不改 PS 逻辑；行号实测

【验收】
Grep residual 文档命中 publish-runtime.ps1 行号

【输出】
git commit -m "Link G5-C to publish-runtime soft reattach lines (CODE-06)

Refs: docs/plans/task-cards-2026-07-21.md CODE-06"
```

---

## 批量执行提示（可选）

若用户说「按任务卡执行 P1」：

```
你是 Codex Dream Skin 维护 Agent。按 docs/plans/task-cards-2026-07-21.md 执行全部 P1：
DOC-01 → DOC-02 → FRAME-01。
每卡单独 commit；遵守 docs/CONTRIBUTING.md；每卡后跑验证命令。
禁止改注入主路径与 ADR。先 doctor + git status，再动手。
```

P2 / P3 同理，替换 ID 列表即可。
