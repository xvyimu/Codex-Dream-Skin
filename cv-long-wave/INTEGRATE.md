# Codexveil · W13 INTEGRATE · 合入计划 · 2026-07-24

**MODE：** 总控合入计划 · **WRITE_POLICY：** feature 支文档；**禁止** 自动 merge `main` · **禁止** `publish-runtime` · **禁止** asar / D7 / 生产 CSP  
**总控 tip：** `xvyimu/cv-coord`（随 progress 更新）  
**产品 base：** `main` @ `ebc3568`（合入前再 `fetch` 校准）

---

## 一句话

本周长波以 **docs/ops 证据 + 门闩全绿** 为主；业务码 **零必合补丁**（全 NO-CODE）。合入策略：**可选** 把 ops 证据支 squash/merge 进 `main`（**人 gate**），**不** stamp 装态。

---

## 1. Feature 支清单（origin tip）

| W | branch | tip（写卡时） | 内容 | 合入优先级 |
|---|--------|---------------|------|------------|
| W1 | `xvyimu/cv-scout-health` | `9e2ba87` | Phase0 scout evidence | P1 docs |
| W2 | `xvyimu/cv-themes-contracts` | `65c38a3` | themes 门闩 NO-CODE | P1 docs |
| W4 | `xvyimu/cv-doctor-smoke-docs` | `2aa2b0b` | doctor/smoke map | **P0 docs**（运维 SSOT） |
| W5 | `xvyimu/cv-cdp-url-guard` | `5032a98` | cdp/freshness | P1 docs |
| W6 | `xvyimu/cv-catalog-budget` | `fb9f4d4` | catalog budget | P1 docs |
| W7 | `xvyimu/cv-launcher-tray-stability` | `a2d03c0` | 单 open→单 watch 审计 | P1 docs |
| W8 | `xvyimu/cv-core-runtime-boundary` | `f08112c` | deps 审计 | P1 docs |
| W9 | `xvyimu/cv-theme-arina-only-docs` | `f48255d` | arina-only 对齐 | P1 docs |
| W10 | `xvyimu/cv-pain-close-batch` | `908ca42` | PAIN 关单审计（脚注） | **P0 docs** |
| W11 | `xvyimu/cv-adr0005-onepager` | `b4cbc94` | ADR0005 DEFER | **P0 docs** |
| W12 | `xvyimu/cv-long-verify` | `40e5796` | npm test 全 exit 0 | **P0 docs** |
| coord | `xvyimu/cv-coord` | 进度 SSOT | long-wave / backlog / INTEGRATE | 可选 |

**无代码冲突预期：** 各支几乎只加 `docs/ops/cv-*-*.md`（W4 可能触 usage/day-ready 交叉链 — 合入前 `git log --stat` 复核）。

---

## 2. 门闩证据（稳定运行）

| 门闩 | exit | 证据 |
|------|------|------|
| `npm test`（unit+contracts） | **0** | W12 `cv-long-verify-evidence-2026-07-24.md` |
| themes / store / adapter / contracts | **0** | W2 |
| cdp-url / freshness / deps | **0** | W5 · W8 |
| catalog-budget / quality | **0** | W6 · W9 |
| doctor（idle 装态） | **0** · fresh · `1.3.25-da2adc` | W1 · W4 · W12 |
| core↔runtime 双向 | **0 违规** | W8 |

**装机体验：** Codex 需用户点任务栏启动；unit 绿 **≠** 有皮（W1 风险句）。smoke 可在 Codex 运行后再记（W4 已 skip idle）。

---

## 3. 建议合入序（人 gate）

```text
1) 人确认：仅 docs 合入 main，不 publish
2) 从 main 开 integrate 支或逐 PR：
   - 优先：W4 map · W12 verify · W11 DEFER · W1 scout
   - 然后：W2 W5 W6 W8 W9（+ W10 若 ACCEPT）
3) 每 PR：CI themes-gate / npm test（若有）· 无密钥
4) merge main 后：可选删远程 feature 支
5) publish-runtime：另授 + VERSION + true-publish checklist
```

**不要：** 把多支 force 推 main；不要在 integrate 时改 asar。

---

## 4. 明确不做（本 integrate）

| 项 | 状态 |
|----|------|
| `publish-runtime` / 装态 stamp | **另授** |
| ADR0005 壳实现 | **DEFER**（W11） |
| PAIN #25 F6 装态 | 需 publish 另路径 |
| D7 / 生产 CSP | **禁**（非本产品） |
| 改 Codex asar | **禁** |

---

## 5. 总控回执位

| 项 | 值 |
|----|-----|
| 卡 | W13 INTEGRATE 计划 **DRAFT · 周实现项 ACCEPT 齐** |
| 自动 merge main | **否** |
| 下一动作 | **人 gate** 按 §3 合入 docs；publish 另授 |

**风险一句：** 多 feature 支并行只含 docs 时 merge 冲突低，但 **main 前进后** 须 rebase；装态 fresh 不随 docs merge 自动变。
