# M-CV-long-verify · W12 evidence · 2026-07-24

**MODE：** `long-verify` · **WRITE_POLICY：** `local-commit`（docs only；**禁止** push main / asar / publish / 第二 injector）  
**WT / 支：** `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-long-verify` · `xvyimu/cv-long-verify`  
**基线 tip：** `ebc3568`（docs(ops): CV tip vs install runtime gap card）  
**Brief：** `cv-coord/cv-long-wave/briefs/w12-long-verify.md`  
**STACK_SSOT：** [`docs/PROJECT.md`](../PROJECT.md) §1.5  
**OUT_OF_SCOPE：** asar · publish · 第二 injector · push main · 为冲绿放松测试

---

## 一句话

`npm test`（unit + contracts）及 brief 建议分项 **全 exit 0** → **PASS**。可选 `doctor` 只读 **exit 0**（装态 idle：Codex 未跑、injector 路径与 current runtime 对齐 `1.3.25-da2adc`）。

---

## 环境

| 项 | 值 |
|----|-----|
| 日期 | 2026-07-24 |
| Node | ≥20（engines） |
| 产品线 version | 1.3.25 |
| CWD | `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-long-verify` |
| Shell | pwsh 7 · `npm run <script>` |

---

## Exit 表（权威）

| # | 命令 | exit | 结果 |
|---|------|------|------|
| 0 | `npm test`（= test:unit && test:contracts） | **0** | PASS |
| 1 | `npm run test:themes` | **0** | PASS |
| 2 | `npm run test:themes-contracts` | **0** | PASS |
| 3 | `npm run test:store` | **0** | PASS |
| 4 | `npm run test:adapter` | **0** | PASS |
| 5 | `npm run test:deps` | **0** | PASS |
| 6 | `npm run test:freshness` | **0** | PASS |
| 7 | `npm run test:cdp-url` | **0** | PASS |
| 8 | `npm run test:catalog-budget` | **0** | PASS |
| 9 | `npm run test:stamp` | **0** | PASS |
| 10 | `npm run test:theme-load` | **0** | PASS |
| 11 | `npm run test:payload-builder` | **0** | PASS |
| 12 | `npm run test:catalog-quality` | **0** | PASS |
| 13 | `npm run test:probe-kit` | **0** | PASS |
| 14 | `npm run test:contracts` | **0** | PASS（14/14） |
| 15 | `npm run doctor`（可选只读） | **0** | PASS（诊断 `not-running` / idle） |

**汇总：** 15/15 命令 exit **0** · 无红项 · 无需 fix wt。

---

## 关键观察（非失败）

| 源 | 说明 |
|----|------|
| `test:payload-builder` | `skip: arina theme.json is not DreamSkin image/ shape`（预期 skip，非 fail） |
| `doctor.diagnosis` | `not-running`：本机 Codex 未起；`injectorPathFreshness.fresh === true` · runtimeId **`1.3.25-da2adc`** |
| `doctor.themeCount` | **1**（arina-only 与仓内 SSOT 一致） |

---

## 边界遵守

- [x] 未改测试门槛冲绿  
- [x] 未 asar / publish  
- [x] 未第二 injector  
- [x] 未 push main  
- [x] 仅 docs(ops) 证据 + local commit  

---

## 验收

| 项 | 状态 |
|----|------|
| 完整 exit 表 | ✅ 上表 |
| 全 0 → PASS | ✅ |
| commit docs(ops) | 本会话 commit |
| status in-review | ✅ |

**Verdict：PASS · in-review**
