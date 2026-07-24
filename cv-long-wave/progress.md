# Codexveil · cv-long-wave progress

**总控：** `cv-coord` · `xvyimu/cv-coord`  
**红线：** 单 injector · 禁 asar · 禁 vendor · 禁 publish · 禁 push **main** · feature push OK  

SSOT：[`WEEK-BACKLOG.md`](./WEEK-BACKLOG.md) · [`INTEGRATE.md`](./INTEGRATE.md)

---

## 0. 状态（7m 巡检 · W7/W10 收口）

| ID | 状态 | tip (origin) |
|----|------|--------------|
| W1 scout | **ACCEPT** | `9e2ba87` |
| W2 themes | **ACCEPT NO-CODE** | `65c38a3` |
| W3 fix | **SKIP** | — |
| W4 doctor-smoke | **ACCEPT** | `2aa2b0b` |
| W5 cdp-url | **ACCEPT NO-CODE** | `5032a98` |
| W6 catalog-budget | **ACCEPT NO-CODE** | `fb9f4d4` |
| **W7** launcher-tray | **ACCEPT NO-CODE** | `a2d03c0` · 单 open→单 watch · tray/restore 不另起守护 |
| W8 core-runtime | **ACCEPT NO-CODE** | `f08112c` |
| W9 arina-only | **ACCEPT NO-CODE** | `f48255d` |
| **W10** pain-close | **ACCEPT** | `908ca42` · 不假关 #21/#24/#25 · doctor **0** · PAIN 脚注 |
| W11 adr0005 | **ACCEPT** | `b4cbc94` |
| W12 long-verify | **ACCEPT** | `40e5796` · **npm test 全 0** |
| **W13** INTEGRATE | **DRAFT** | 本目录 · **merge main / publish 另授** |

**live 0/3**（实现 child 全收）  
**findings fix wt：** CV 无；CH 历史 findings 非本仓本波（见下）

### 门闩（可稳定运行 · 文档+unit）

| 命令 | exit | 证据 |
|------|------|------|
| `npm test` | **0** | W12 |
| doctor idle | **0** · fresh · `1.3.25-da2adc` | W10/W12 |
| deps / cdp / catalog / themes | **0** | W2/W5/W6/W8/W9 |

**装机有皮：** 仍需用户点任务栏 Codex（unit≠live 会话）。

---

## 1. orca 名表

| name | status |
|------|--------|
| main | 主 @ `ebc3568` |
| cv-coord | 总控 · 仅此 live 元 wt |

全部 `cv-*` 实现 wt **已 rm**；branch 在 origin。

---

## 2. 本巡检动作

1. 审 W7 PASS · W10 PASS（rebase 清 origin WIP 分歧 · 删 `_brief.md`）  
2. feature push · stop/rm  
3. 更新 INTEGRATE tip · backlog 全 ACCEPT  
4. **未**开新 live（队列实现项已尽；等人 gate 合入）  
5. **未** push main / publish / asar  

### CH 注（非 CV 执行）

`Chronicle/ch-coord/docs/superpowers/runs/**/findings.md` 为历史 superpowers 跑次，**非**本会话 CV findings 落盘；CH 消化由 CH 总控负责。本 CV 会话 **不开** CH fix wt。

---

## 3. 下一动作（等人 / 总控）

1. 人 gate：按 [`INTEGRATE.md`](./INTEGRATE.md) 合入 docs → `main`（可选多 PR）  
2. publish-runtime **另授**  
3. 可选：Codex 运行后补 live smoke / F6 体感（#25）  
