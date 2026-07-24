# Codexveil · cv-long-wave progress

**总控：** `cv-coord` · `xvyimu/cv-coord`  
**红线：** 单 injector · 禁 asar · 禁 vendor · 禁 publish · 禁 push **main** · feature push OK  

SSOT：[`WEEK-BACKLOG.md`](./WEEK-BACKLOG.md) · [`INTEGRATE.md`](./INTEGRATE.md) **READY_FOR_HUMAN_GATE**

---

## 0. 状态 — **DONE-ALL**（2026-07-24 · 7m#6）

| 层 | 状态 |
|----|------|
| W1–W12 | **全部 ACCEPT**（W3 SKIP） |
| W13 INTEGRATE | **READY_FOR_HUMAN_GATE** · findings §6 已并入 · **不**自动合 main |
| code-review | 源 `…/code-review/codexveil-findings.md` · **无新 P0** · 栈锁健康 |
| **cv-cr-cdp-bind-docs** | **ACCEPT** `2991838` · origin push · wt rm · CV-CR-001/002 loopback docs |
| findings 其余 P1 | 003–006 **已由长波证据覆盖** · 不单开 wt |
| P2 | 不单开 |
| **live 实现 wt** | **0**（仅 `cv-coord` 总控） |

### 门闩（长波 · 全绿）

| 命令 | exit |
|------|------|
| `npm test` | **0**（W12） |
| doctor idle | **0** · fresh · `1.3.25-da2adc` |
| control-plane bind | 码侧 `listen(port,"127.0.0.1")`（CR-002） |
| `test:cdp-url` / `test:control` | **0 / 0**（CR wt） |

### DONE-ALL 判据

- [x] WEEK W1–W12 勾完（W3 SKIP 合理）
- [x] CR findings P0=0 · P1 全消化（001/002 docs · 003–006 覆盖）
- [x] doctor idle **0** · fresh 对齐 · 门闩全绿
- [x] 全 feature 支 push origin · **未** push main · **未** publish/asar
- [x] live child = 0 · 卫生干净

### 等人（唯一出口）

1. 按 [`INTEGRATE.md`](./INTEGRATE.md) §2 合 docs→main（人 gate）
2. `publish-runtime` **另授** + VERSION + true-publish checklist
3. 可选 live smoke（#25 F6 · 需开 Codex）— 人授权后

**总控保持在线**；无新 findings / 无人 gate 前不再开 child。

---

## 1. orca 名表

| name | status |
|------|--------|
| main | `D:/orca/Codexveil` @ `ebc3568` |
| cv-coord | 总控 · INTEGRATE 等人 |
| **cv-cr-cdp-bind-docs** | **LIVE** · findings P1 docs |

## 2. findings 处置摘要

| id | 处置 |
|----|------|
| P0 | **无** |
| CV-CR-001/002 | docs wt LIVE · 码侧 loopback 已有 |
| CV-CR-003–006 | 长波 W5/W6/W4/W7/W11 已覆盖 → 合入即可 |
| P2 | 不单开 |

## 3. 等人 / 下一巡检

1. 人 gate：INTEGRATE §2 合 docs→main  
2. 收 `cv-cr-cdp-bind-docs` DONE → push feature → rm  
3. publish **另授**  
