# M-CV-core-runtime-boundary · W8 证据 · 2026-07-24

| 项 | 值 |
|----|-----|
| **模块** | M-CV-core-runtime-boundary · WEEK W8 |
| **agent** | claude |
| **worktree** | `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-core-runtime-boundary` |
| **branch** | `xvyimu/cv-core-runtime-boundary` |
| **baseline tip (start)** | `ebc3568` · `docs(ops): CV tip vs install runtime gap card` |
| **dirty at start** | clean |
| **策略** | `test:deps` + 只读审计 core↔runtime · **绿 → NO-CODE** |
| **日期** | 2026-07-24 |
| **状态** | **in-review** |

> 路径以本 worktree 为准。合入 / push / 真 publish → 总控 + 人 gate。  
> **禁区遵守：** 无 asar · 无第二 injector · 无 vendor · 无双向依赖「临时允许」。

---

## 1. 一句话

`npm run test:deps` **exit 0**；`packages/core` ↔ `packages/runtime` **静态互引违规 = 0**；themes 仅允许的动态 `thumb.mjs`。绿 → **NO-CODE**（未改业务源码）。

---

## 2. 门闩命令

```powershell
cd C:\Users\yuanjia\orca\workspaces\Codexveil\cv-core-runtime-boundary
npm run test:deps
# → node scripts/check-package-deps.mjs
```

| 命令 | exit | 结果摘要 |
|------|------|----------|
| `npm run test:deps` | **0** | core 17 · runtime 20 · 互引 0 · themes 非-thumb 0 |

完整 stdout：

```text
ok: scanned packages/core (17 files)
ok: scanned packages/runtime (20 files)
ok: core has no static import of runtime
ok: runtime has no static import of core
ok: themes has no non-thumb static/dynamic runtime import (thumb.mjs allowed)

check-package-deps: all passed
```

---

## 3. 依赖方向表（PROJECT §3.2 / CLAUDE 不可谈判 #2）

### 3.1 允许 vs 禁止（契约）

```text
允许：
  packages/core/cli    → packages/core/* · packages/themes/*
  packages/themes      → packages/core/constants
  packages/themes      → packages/runtime/scripts/thumb.mjs（动态，仅缩略图）
  publish              → 复制 packages/runtime → versions/<id>/

禁止：
  packages/core        → packages/runtime     （破坏 runtime 自包含）
  packages/runtime     → packages/core        （发布后 versions/ 无 core）
```

### 3.2 本轮扫描结果

| 边 | 规则 | 扫描范围 | 违规数 | 判定 |
|----|------|----------|--------|------|
| `core` → `runtime` | 禁止静态/相对跨包 | 17 个 `.mjs/.js` | **0** | PASS |
| `runtime` → `core` | 禁止静态/相对跨包 | 20 个 `.mjs/.js` | **0** | PASS |
| `themes` → `runtime` 非 thumb | 禁止 | `packages/themes/**` | **0** | PASS |
| `themes` → `runtime/thumb.mjs` | 动态允许 | `dream-adapter.mjs` | 1（允许） | OK |

**违规合计：0（零）。**

### 3.3 允许边（抽样钉死）

| 文件 | 边 | 形态 |
|------|-----|------|
| `packages/themes/dream-adapter.mjs` | → `../core/constants.mjs` | 静态 `import`（允许） |
| `packages/themes/dream-adapter.mjs:196` | → `../runtime/scripts/thumb.mjs` | **动态** `await import(...)`（允许） |
| `packages/core/cli.mjs` | → `../themes/index.mjs` | 静态（允许：cli → themes） |
| `packages/runtime/scripts/fs-io.mjs` | 注释明示 *MUST NOT import packages/core*；仅 `node:fs/promises` | 自包含 |

### 3.4 手扫复核（不依赖 gate  alone）

对 `packages/core` / `packages/runtime` 全量相对 `from`/`import`/`require` 规格再扫一次：

- 离开 `core` 且命中 `runtime|packages/` 的相对 spec：**空**
- 离开 `runtime` 且命中 `core|packages/` 的相对 spec：**空**

`runtime` 内部边（同包，合规）：

- `injector.mjs` → `./cdp-url-guard.mjs` · `./theme-load.mjs` · `./payload-builder.mjs` · 动态 `./control-plane.mjs`
- 无跨出到 `packages/core`

`core` 内部边（同包，合规）：

- `cli.mjs` → `./index.mjs` · `./constants.mjs` · `./state/*` · `../themes/index.mjs`
- 无跨出到 `packages/runtime`

### 3.5 非 import 的路径字符串（不计入 deps 违规）

测试/质量脚本用 `join(repoRoot, "packages", "runtime", …)` **读文件路径**（非 ESM import），例如：

- `packages/themes/theme-schema.test.mjs` → runtime `assets/theme.json`
- `packages/themes/theme-contracts-align.test.mjs` → runtime `theme-load.mjs` 路径
- `packages/themes/theme-catalog-quality.test.mjs` → 源码文本 pin budget（注释：no static import of runtime）

这些 **不** 构成模块依赖，也不被 `check-package-deps.mjs` 计为跨包 import。

---

## 4. 为何绿 = NO-CODE

| 条件 | 本轮 |
|------|------|
| `test:deps` exit 0 | 是 |
| core↔runtime 违规数 | **0** |
| 需最小拆边 / 抽公共 | 否 |
| 改业务 / injector / publish | **未做** |
| asar / 第二 injector / vendor | **未引入** |

结论：边界已由 `scripts/check-package-deps.mjs` 与源码形状共同满足；**本模块交付 = 证据文档 + 绿门闩**，不扩 scope。

---

## 5. 没做什么

| 项 | 原因 |
|----|------|
| 改 `packages/core` / `packages/runtime` 源码 | 绿 → NO-CODE |
| 真 `publish-runtime.ps1` | brief 禁 publish |
| `git push` / 合 main / 开 PR | 总控 |
| 第二 injector / asar / vendor | 硬禁 |
| 大重构 / 抽 shared-io | 无违规驱动 |

---

## 6. 残留风险（一句）

`check-package-deps` 只拦 **相对路径** 静态/动态 `from|import|require` 形态；若未来用 package name alias、字符串拼接 `import(var)` 或非 `.mjs/.js` 入口绕过，需补规则——当前树无此形态。

---

## 7. 验收对照（brief）

| 验收项 | 状态 |
|--------|------|
| evidence 文档 | 本文件 |
| `exit deps=0` | **0** |
| 依赖方向表 · 违规零/非零 | **零** |
| in-review | 本会话 status |
| commit | 本 evidence 提交 |
| 绿 NO-CODE | 是 |

---

## 8. 复现

```powershell
cd C:\Users\yuanjia\orca\workspaces\Codexveil\cv-core-runtime-boundary
npm run test:deps
# expect: check-package-deps: all passed · $LASTEXITCODE -eq 0
```
