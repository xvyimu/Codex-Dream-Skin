# U1+U3 两周排期 · 2026-07-21

> **依据**：交互表单 — 主包 U1+U3 · 长期放宽需 ADR · U1 四组件全选 · 交付 ADR+排期  
> **ADR**：[`0004`](../adr/0004-engineering-modernization-u1.md) · [`0005`](../adr/0005-thin-product-shell-u3.md)  
> **基线仓**：main @ 写文档时以 `git rev-parse --short HEAD` 为准（起草参考 `cb2a2e6`）  
> **原则**：两周内 **可合并的垂直切片**；不做 injector 大爆炸重写；不做 macOS；不镜像 asar  

---

## 0. 目标与非目标

### 目标（DoD）

| ID | 交付 | 验收 |
|----|------|------|
| W-A | ADR 0004/0005 入库并在 overview 挂链 | 文件可点；状态 Proposed |
| W-B | `packages/contracts` 初版 + palette/doctor 子集测试 | vitest 或等价绿 |
| W-C | `test:deps` 语义对齐「runtime 发布图」或文档过渡方案 | CI 不假绿 |
| W-D | probe-kit 最小模块 + white-flash 或 project-hd 之一迁移 | 本机 CDP 断言仍红可绿 |
| W-E | stamp 函数 + 单测（可尚未接入 injector 热路径） | 纯函数测试 |
| W-F | 两周回顾：U3 尖兵结论（调 list/doctor 的最小客户端，**允许**仍是 Node CLI 尖兵而非完整 Tauri） | 书面 go/no-go |

### 非目标

- 完整 Tauri UI 美工与安装器  
- runtime 全量 TS 化  
- `.codexskin` 完整互操作  
- 自托管 Windows runner  
- 改默认产品线版本号 1.3.25  

---

## 1. 角色与节奏

| 角色 | 职责 |
|------|------|
| 实现 | 按日卡片提交；每 PR 可回滚 |
| 审核 | 对照 0004 D6 硬底线；拒第二 injector |
| 用户 | 日末/周末 Accept 0004 或打回 |

节奏：**工作日 1 个可合并 PR 优先于周五巨型 PR**。

---

## 2. 第 1 周 — U1 骨架（contracts · 工具链 · 禁互引）

### Day 1 · 决策固化与仓库脚手架

- [ ] 合并本排期 + ADR 0004/0005 到 main（docs PR）  
- [ ] 开分支 `feat/u1-workspace`  
- [ ] 引入 pnpm workspace（或 npm workspaces）骨架：`packages/*`  
- [ ] 根 `tsconfig.base.json`（strict）  
- [ ] 文档：`PROJECT.md` 增「依赖双平面」指向 0004（短段落）  

**验收**：`pnpm -r` 或 npm 能列出 packages；CI 仍跑通旧 `npm test`（可双轨一天）。

### Day 2–3 · `@codex-skin/contracts`

- [ ] 包：`packages/contracts`  
- [ ] Schema：`palette`（accent/secondary/surface/text）· CSS color 正则与现 injector 对齐  
- [ ] Schema：`doctorControl` / `doctorFreshness` 子集  
- [ ] Schema：control-plane 错误体 `{ ok:false, reason }`  
- [ ] 单测：合法 genshin-night 色通过；缺 surface 失败；非法 color 失败  
- [ ] 导出：`parsePalette` / `assertDoctorSlice`  

**验收**：contracts 包测试全绿；**尚未**强制 injector 运行时调用（可先导出供后续）。

### Day 4 · Vitest + lint 禁互引

- [ ] Vitest 配置；迁移 **1–2** 个现有小测试（如 freshness 或 catalog-budget 纯函数）作样板  
- [ ] ESLint/oxlint 规则或 `scripts/check-package-deps.mjs` 增强：失败信息含 ADR 0004  
- [ ] CI：`themes-gate` 增加 typecheck（contracts）步骤（失败即红）  

**验收**：CI 红能解释；本地 `pnpm test` 文档写入 CONTRIBUTING 草稿段。

### Day 5 · 缓冲与 contracts 接入点设计

- [ ] 设计 `dream-adapter` / `loadTheme` 调用 contracts 的 **最小 PR 接口**（可仅 themes 包）  
- [ ] 写 `docs/plans/u1-injector-split-sketch.md` 一页纸（模块边界，不写大码）  
- [ ] 回顾：0004 是否改 **Accepted**（用户点头）  

**风险**：CI 时长 → 缓存 node_modules。

---

## 3. 第 2 周 — probe-kit · stamp · U3 尖兵

### Day 6–7 · probe-kit

- [ ] `packages/probe-kit` 或 `scripts/windows/lib/probe-kit.mjs`（若暂缓包，须注明迁移路径）  
- [ ] API：`connectCdp({port})` · `evaluate` · `buildReport()` · `finalizePass(required[])`  
- [ ] 迁移 **`probe-project-hd.mjs`** 到 kit（优先：已是 assert 型）  
- [ ] 本机：CDP 上 pass；断 CDP exit 1  

**验收**：与迁移前行为一致或更严；exitCode 语义不变。

### Day 8 · stamp 纯函数

- [ ] `packages/runtime/scripts/stamp.mjs`（或 contracts 旁）：`computeSkinStamp({engine,css,themeId,themeHash,rendererRev})`  
- [ ] 单测：改 themeHash → stamp 变；稳定输入 → 稳定输出  
- [ ] **可选尖兵**：injector 日志打印 stamp（不改变注入决策）以便对照  

**验收**：纯函数绿；热路径默认仍旧逻辑（安全）。

### Day 9 · Reconciler 只读接线（可选高难度）

- [ ] 若 Day 8 顺利：Reconciler **shadow mode**（计算 shouldInject 但不跳过旧路径，只打 log）  
- [ ] 否则：跳过，改为 themes 包 `validateThemeManifest` 调用 contracts.palette  

**验收**：无用户可见回归；doctor fresh 仍 true。

### Day 10 · U3 尖兵 + 回顾

- [ ] **最小客户端**（二选一，写进回顾）：  
  - A：Node 脚本 `scripts/windows/shell-probe-client.mjs` 调 list/doctor/kick（token 头）  
  - B：空 Tauri 窗只显示 doctor.fresh + 主题名列表（只读）  
- [ ] 文档：`docs/plans/u3-mvp-checklist.md`（功能 In/Out）  
- [ ] 回顾会：U1 完成度 % · 0004 Accept? · U3 是否开 `feat/u3-shell` 正式双周  

**验收**：尖兵证明「壳→核」不需要第二 injector；形成下一迭代 backlog。

---

## 4. PR 切片建议

| PR | 内容 | 合并策略 |
|----|------|----------|
| PR-docs | ADR 0004/0005 + 本排期 + overview | squash |
| PR-workspace | pnpm/tsconfig 骨架 | squash |
| PR-contracts | contracts + tests | squash |
| PR-vitest-lint | 样板迁移 + CI typecheck | squash |
| PR-probe-kit | kit + project-hd | squash · 需本机手测笔记 |
| PR-stamp | stamp 纯函数 | squash |
| PR-u3-spike | 客户端尖兵 + checklist | squash |

---

## 5. 风险与熔断

| 风险 | 熔断 |
|------|------|
| injector 热路径回归闪白 | stamp 仅 shadow；立刻回滚热路径 PR |
| CI 过脆 | typecheck 仅 contracts 包 |
| 范围胀成完整 Tauri | Day 10 只允许尖兵；完整 UI 下一迭代 |
| 依赖争议 | 任何 **runtime 安装态** 第三方依赖 → 停工开子 ADR |

---

## 6. 资源与命令（预告）

```text
# 文档落地后
git checkout -b docs/adr-0004-0005-u1-u3-plan

# 后续实现期（示例，以 PR 为准）
pnpm install
pnpm --filter @codex-skin/contracts test
node scripts/windows/probe-project-hd.mjs
node packages/core/cli.mjs doctor
```

---

## 7. 两周后 backlog（不进本排期承诺）

- injector 真正按 stamp 跳过重复 inject  
- white-flash / session 全迁 probe-kit  
- themes 全面走 contracts  
- U3 Tauri MVP 窗口（apply + 缩略图）  
- `.codexskin` 映射表  
- Windows self-hosted CDP job  

---

## 8. 表单回执（冻结）

| 项 | 选择 |
|----|------|
| 主包 | **U1+U3 产品壳** |
| 硬边界 | **长期放宽（需 ADR）** → 0004/0005 |
| U1 组件 | contracts · probe-kit · stamp · Vitest+lint **全选** |
| 本轮交付 | **ADR + 两周排期**（无大代码） |

---

**维护**：完成后在 CHANGELOG Unreleased 记「ADR 0004/0005 Proposed + U1/U3 排期」；Accept 后改 ADR 状态并开 feat 分支。
