# Codexveil — 文档索引

> **日常只读**：根目录 `CLAUDE.md` / `AGENTS.md` → [`PROJECT.md`](./PROJECT.md) → [`ARCHITECTURE.md`](./ARCHITECTURE.md)。  
> 本页 = **归档与长文入口**；不替代 PROJECT 约束。

## 0. 当前真相（2026-07-22）

| 项 | 值 |
|----|-----|
| GitHub | [xvyimu/Codexveil](https://github.com/xvyimu/Codexveil) · **非 fork** · 仅 `origin` |
| 产品线 | ADR **0006** 独立 · 安装名 **CodexDreamSkin** |
| 主线 runtime | **1.3.25** · publish 权威见 ADR 0003 |
| 装机脚本 | tray / launch / restore ∈ `apps/launcher/`（不读 vendor） |
| U1 | themes↔contracts 交叉测已合 main（PR #12） |
| 选代入口 | 工程债/U1 以 ADR 0004 + [`plans/u1-u3-two-week-plan`](./plans/u1-u3-two-week-plan-2026-07-21.md) 为准；research v7 及以前为**冻结考古** |

## 1. 核心文档（常读）

- [PROJECT.md](./PROJECT.md) — 边界 · 分层 · 依赖 · 验收 · 身份
- [ARCHITECTURE.md](./ARCHITECTURE.md) — 实现映射
- [CHANGELOG.md](./CHANGELOG.md) · [PAIN-POINTS.md](./PAIN-POINTS.md) · [CONTRIBUTING.md](./CONTRIBUTING.md)
- [GLOSSARY.md](./GLOSSARY.md) · [SECURITY.md](./SECURITY.md) · [usage.md](./usage.md) · [dual-open-policy.md](./dual-open-policy.md)
- [RELEASE-EVIDENCE.md](./RELEASE-EVIDENCE.md) · [BASELINE.generated.md](./BASELINE.generated.md)（`write-baseline.ps1` 生成）
- [design-tokens.md](./design-tokens.md) · [contracts/post-update-report.md](./contracts/post-update-report.md)

## 2. ADR

| ID | 状态 | 摘要 |
|----|------|------|
| [0001](./adr/0001-merge-product-line.md) | Accepted | 单产品线 |
| [0002](./adr/0002-upstream-sync-policy.md) | **Superseded by 0006** | 旧在线同步（已废止） |
| [0003](./adr/0003-single-version-source.md) | Accepted | 单一版本源 |
| [0004](./adr/0004-engineering-modernization-u1.md) | Accepted · 实施中 | 双平面 · contracts |
| [0005](./adr/0005-thin-product-shell-u3.md) | Proposed | 薄产品壳 |
| [0006](./adr/0006-independent-product-line.md) | Accepted | 独立产品线 · first-party 装机脚本 |

排期：[u1-u3-two-week-plan-2026-07-21](./plans/u1-u3-two-week-plan-2026-07-21.md)（历史分支名 `feat/u1-workspace` 已删；工作在 `main`）

## 3. 计划与决策（有效 / 历史）

- [task-cards-2026-07-21](./plans/task-cards-2026-07-21.md) — 任务卡（多数已完成）
- [codesign-decision-2026-07-21](./plans/codesign-decision-2026-07-21.md) — 签名 No-Go
- [residual-g1-g3-g4-g5-2026-07-20](./plans/residual-g1-g3-g4-g5-2026-07-20.md) — 残差加固（已落地）
- [upstream-promote-decision-2026-07-21](./plans/upstream-promote-decision-2026-07-21.md) — **历史**：promote 决策；现以 0006 为准（无在线 sync）

## 4. 调研归档（只读 · 最新在前）

| 版本 | 链接 | 要点 |
|------|------|------|
| **v7** | [v7-gate-hygiene-and-ux](./research/2026-07-21-master-research-v7-gate-hygiene-and-ux.md) | 门禁/探针断言化 · RELEASE-EVIDENCE |
| v6 | [v6-palette-root-and-hd-bubble](./research/2026-07-21-master-research-v6-palette-root-and-hd-bubble.md) | 闪白根因 · HD art · 气泡 |
| v5–v1 | [v5](./research/2026-07-21-master-research-v5-visual-sync-and-next.md) · [v4](./research/2026-07-21-master-research-v4-u3u4-product.md) · [v3](./research/2026-07-21-master-research-v3-ux-visual.md) · [v2](./research/2026-07-21-master-research-v2-frozen.md) · [v1](./research/2026-07-21-integrated-master-research.md) | 迭代考古 |
| peer | [github-peer-matrix](./research/2026-07-21-github-peer-matrix.md) · [peer-landscape](./research/2026-07-21-peer-landscape-and-architecture.md) · [progress-aligned-debt](./research/2026-07-21-progress-aligned-debt-and-portfolio.md) | 同类对照 |

## 5. 审计 / 扫描 / 报告（归档）

- [AUDIT-2026-07-20](./AUDIT-2026-07-20.md) · [SCAN-OPTIMIZE-2026-07-20](./SCAN-OPTIMIZE-2026-07-20.md)
- [audit/v6-advance](./audit/2026-07-21-v6-advance.md) · [audit/v6-review](./audit/2026-07-21-v6-review.md)
- [reports/five-layer-internal-opt](./reports/2026-07-21-five-layer-internal-opt-report.md)

## 6. Agent 提示词 / 证据脚手架

- [prompts/](./prompts/) — maintain / full-scan / continue-five-layer（粘贴用，非规范）
- [evidence/](./evidence/) — 发版探针脚手架；`runs/*.json` gitignore

## 7. 退役工件

| 路径 | 状态 |
|------|------|
| `scripts/windows/sync-upstream-assets.ps1` | exit 2 · ADR 0006 |
| `docs/upstream-sync.json` | `status: retired` |
| `vendor/dreamskin/` | 冻结快照 · 不 ship（NOTICE） |
| ad-hoc `probe-dom*.mjs` / `probe-f6` / `start-watch-now` | **已删**（hygiene）；用 `probe-session-dom` / `probe-white-flash` / `probe-project-hd` |
