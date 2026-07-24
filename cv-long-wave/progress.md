# Codexveil · cv-long-wave progress

**总控：** `cv-coord` · `xvyimu/cv-coord`  
**红线：** 单 injector · 禁 asar · 禁 vendor · 禁 publish · 禁 push **main** · feature push OK  

SSOT：[`WEEK-BACKLOG.md`](./WEEK-BACKLOG.md) · [`INTEGRATE.md`](./INTEGRATE.md)

---

## 0. 状态（7m 巡检）

| ID | 状态 | tip |
|----|------|-----|
| W1–W6 · W8 · W11 | **ACCEPT** | 见 INTEGRATE 表 · origin |
| **W9** arina-only | **ACCEPT** | `f48255d` origin · catalog-quality/themes **0** · NO-CODE |
| **W10** pain-close | **LIVE** | 仍写中 |
| **W12** long-verify | **ACCEPT** | `40e5796` origin · **npm test 全 0** · doctor 0 |
| **W7** launcher-tray | **LIVE** | 本巡检新开 |
| **W13** INTEGRATE | **DRAFT** | `cv-long-wave/INTEGRATE.md` · 不自动 merge main |

**live 2/3：** W10 · W7  
**findings fix wt：** 无

### 门闩（稳定运行）

| 命令 | exit | 证据 |
|------|------|------|
| `npm test` | **0** | W12 |
| 分项 unit 全表 | **0** | W12 |
| doctor idle | **0** · fresh · `1.3.25-da2adc` | W12 |

---

## 1. orca 名表

| name | status |
|------|--------|
| main | 主 |
| cv-coord | 总控 |
| cv-pain-close-batch | **LIVE W10** |
| cv-launcher-tray-stability | **LIVE W7** |

---

## 2. 本巡检动作

1. 审 W12 PASS · W9 PASS → commit/push feature · stop/rm  
2. 保留 W10  
3. 开 W7 · 起草 W13 INTEGRATE  
4. 无 asar / main push / publish  

---

## 3. 下一巡检

- 收 W10 · W7 → 更新 INTEGRATE tip  
- 人 gate 按 INTEGRATE 合入 docs（可选）  
- publish **另授**  
