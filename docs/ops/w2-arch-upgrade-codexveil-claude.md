# W2 · Codexveil 架构/栈升级报告 · Claude

| 字段 | 值 |
|------|-----|
| **波次** | portfolio-arch-upgrade-2026h2 · **W2** |
| **产品** | Codexveil（GitHub `xvyimu/Codexveil`） |
| **工作树** | `C:\Users\yuanjia\orca\workspaces\Codexveil\w2-cv-claude` |
| **分支** | `xvyimu/w2-cv-claude` |
| **开工 HEAD** | `88c91bb`（W1 tip · V2 arina + stack-matrix） |
| **装态** | **1.3.25-eee7c8**（本波 **不** re-publish） |
| **Agent** | solo Claude · 2026-07-23 |
| **对照** | `prompts/w2-shared.md` · `prompts/w2-cv.md` · `repos/cv.md` · `docs/plans/injector-split-2026-07-22.md` |

---

## 1. 交付摘要

| # | 题单项 | 结果 |
|---|--------|------|
| 1 | contracts 扩大一圈（inject/theme 公共面） | **已做** `packages/contracts/src/inject.ts` + 导出/测 |
| 2 | injector-split 下一刀（可测小步） | **S3**：`payload-builder.mjs` 抽出 + 离线测 + publish **required** 白名单 |
| 3 | 主题质量门 | **catalog-quality** 测 + CONTRIBUTING C-2 **真机 H1–H7** 纪律一句 |
| 4 | `npm test` · `verify-publish-runtime-payload.ps1` | **exit 0** / **exit 0** |
| 5 | 报告 | 本文件 |
| 6 | 真 publish / push | **未做**（禁止） |

---

## 2. 可审 diff 要点

### 2.1 contracts（开发态 · 不进 versions/）

新增 `packages/contracts/src/inject.ts`：

| 符号 | 对齐 |
|------|------|
| `kickResultSchema` / `parseKickResult` | injector watch-kick：`ok/mode/applied/sessions/fingerprint/ms/errors/note` |
| `themeInjectConfigSchema` | `__DREAM_THEME_JSON__` 子集 + `bubbleStyle` |
| `themeCatalogEntrySchema` | F6 catalog entry（key/name/config/artDataUrl） |
| `EARLY_GENERATION_KEY` / `EARLY_APPLIED_KEY` | `earlyPayloadFor` 标记 |

`index.ts` 再导出；`index.test.ts` +6 例；README 一句 W2 面。

### 2.2 injector-split S3

| 路径 | 动作 |
|------|------|
| `packages/runtime/scripts/payload-builder.mjs` | **NEW** · `loadPayload(runtimeRoot, themeDir, candidate)` + `earlyPayloadFor` |
| `packages/runtime/scripts/payload-builder.test.mjs` | **NEW** · 稳定 fingerprint · bubbleStyle 变 fingerprint · placeholder 替换 · early 字面量 |
| `packages/runtime/scripts/injector.mjs` | import payload-builder；薄包装 `loadPayload`；re-export `earlyPayloadFor`；**行数 ~1139 → ~1048** |
| `scripts/windows/publish-runtime.ps1` | `payload-builder.mjs` 进 **$requiredRuntimeScripts**（不再仅 optional） |
| `scripts/windows/verify-publish-runtime-payload.ps1` | required 名单 + `injector:imports-payload-builder` |
| `package.json` | `test:payload-builder` · `test:catalog-quality` 进 `test:unit` |
| `docs/plans/injector-split-2026-07-22.md` | DoD 勾选 S3 / 修订行 |

依赖方向：`payload-builder` → `theme-load` → (budget | image-metadata)；**无** core↔runtime 新边。

### 2.3 主题质量门

| 项 | 内容 |
|----|------|
| `packages/themes/theme-catalog-quality.test.mjs` | 11 个 bundled：surface/text/art 在盘；budget 常量源码钉死；inject 含 setTheme/catalog；**不**静态 import runtime |
| `docs/CONTRIBUTING.md` §C-2 | 真机预览纪律 H1–H7 + `test:catalog-quality` |

### 2.4 stack-matrix

`docs/ops/stack-matrix-2026-07.md` 增 **W2 已做** 列。

---

## 3. 验证证据

```text
npm test
→ npm_test_exit=0
  (themes / themes-contracts / store / adapter / deps / freshness /
   cdp-url / catalog-budget / stamp / theme-load / payload-builder /
   catalog-quality / probe-kit / contracts)

pwsh -NoProfile -File scripts/windows/verify-publish-runtime-payload.ps1
→ verify_payload_exit=0
  VERIFY OK publish runtime payload closed
  (theme-load + payload-builder + control-plane + required ESM graph)
```

---

## 4. 明确不做（本波遵守）

| 禁止 | 遵守 |
|------|------|
| push / 合默认分支 | 是 |
| 再 publish-runtime | 是（装态 1.3.25-eee7c8） |
| vendor / asar / 默认 Gothic | 是 |
| V3 整换 css/inject | 是 |
| CdpSession 外提 / stamp 接线 | 是（backlog） |
| D7 / 生产 CSP | N/A（他仓） |

---

## 5. 风险与残留

| 风险 | 缓解 / 残留 |
|------|-------------|
| 装态尚未含 payload-builder（装态 tip 仍 eee7c8） | 下次 **人 gate** publish 会拷 required；verify 已绿 |
| `loadPayload` 签名对内加 `runtimeRoot` | injector 薄包装保持 call-site 不变 |
| catalog-quality 只读源码钉 budget | 与 `test:catalog-budget` 双保险；避免 themes→runtime 静态边 |
| 真机 H1–H7 | 纪律文档化；本波无 publish 不跑装态手测 |
| injector 仍 ~1k 行 | 下一刀 backlog：CdpSession / Apply 分区 |

---

## 6. 产出路径

| 路径 | 角色 |
|------|------|
| `docs/ops/w2-arch-upgrade-codexveil-claude.md` | 本报告 |
| `docs/ops/stack-matrix-2026-07.md` | 栈矩阵 W2 列 |
| `packages/contracts/src/inject.ts` | inject/kick 契约 |
| `packages/runtime/scripts/payload-builder.mjs` | S3 抽出 |
| `packages/runtime/scripts/payload-builder.test.mjs` | S3 回归 |
| `packages/themes/theme-catalog-quality.test.mjs` | 主题质量门 |
| `scripts/windows/publish-runtime.ps1` | required 白名单 |
| `scripts/windows/verify-publish-runtime-payload.ps1` | 闭包校验 |
| `docs/CONTRIBUTING.md` | C-2 真机纪律 |
| `docs/plans/injector-split-2026-07-22.md` | SSOT DoD |

---

## 7. 建议下一刀（W3 / 人）

1. 人审 diff → merge 本分支（非本 agent push）  
2. 人 gate `publish-runtime` → 装态跟上 tip（含 payload-builder）  
3. W3：可选薄壳 ADR 0005 · 装态 H1–H7  
4. injector backlog：CdpSession 外提 / stamp shadow  

**状态：** W2 enact **完成**（自动门绿 · 无 publish · 无 push）。
