# Codexveil · cv-long-wave progress

**总控：** `cv-coord` · `xvyimu/cv-coord`  
**产品：** `D:\orca\Codexveil` · base `main` @ `ebc3568`  
**红线：** 单 injector · 禁 asar · 禁 vendor · 禁 publish · 禁 push **main** · feature push OK  

SSOT：[`WEEK-BACKLOG.md`](./WEEK-BACKLOG.md)

---

## 0. 状态机（强制续航巡检）

| ID | 状态 | tip / 注 |
|----|------|----------|
| W1 scout | **ACCEPT** | `9e2ba87` origin |
| W2 themes | **ACCEPT NO-CODE** | `65c38a3` origin |
| W3 fix | **SKIP** | 无红 |
| W4 doctor-smoke | **ACCEPT** | `2aa2b0b` origin |
| W5 cdp-url | **ACCEPT NO-CODE** | `5032a98` origin · exit cdp/fresh/deps **0** |
| W6 catalog-budget | **ACCEPT NO-CODE** | `fb9f4d4` origin · budget+quality **0** |
| W7 launcher | QUEUED | 后置 |
| W8 core-runtime | **ACCEPT NO-CODE** | `f08112c` origin · deps **0** · 互引 0 |
| **W9** arina-only docs | **LIVE** | |
| **W10** pain-close | **LIVE** | |
| W11 adr0005 | **ACCEPT** | `b4cbc94` origin · 零壳 |
| **W12** long-verify | **LIVE** | |
| W13 INTEGRATE | QUEUED | 等 W12 · **publish 另授** |

**live 3/3：** W9 · W10 · W12  
**code-review findings 路径：** 本轮未发现待消化 P0/P1 文件；无 fix wt。

### 0.1 本轮动作

1. list/ps：W5/W6/W8 evidence DONE · origin 已齐  
2. 总控审 PASS → stop/rm 三 wt  
3. 开 W9/W10/W12  
4. feature 支 origin 保留 tip；**未** push main  

### 0.2 门闩累计（evidence 已记 exit）

| 面 | exit |
|----|------|
| themes / store / adapter / contracts | **0**（W2） |
| doctor（idle） | **0**（W1/W4） |
| cdp-url / freshness / deps | **0**（W5/W8） |
| catalog-budget / quality | **0**（W6） |
| `npm test` 全量 | **待 W12** |

---

## 1. orca 名表

| displayName | branch | status |
|-------------|--------|--------|
| main | main | 主 |
| cv-coord | xvyimu/cv-coord | 总控 |
| cv-theme-arina-only-docs | xvyimu/cv-theme-arina-only-docs | **LIVE W9** |
| cv-pain-close-batch | xvyimu/cv-pain-close-batch | **LIVE W10** |
| cv-long-verify | xvyimu/cv-long-verify | **LIVE W12** |

---

## 2. 下一批

W9–W12 收齐 → 可选 W7 launcher 小稳 → **W13 INTEGRATE.md**（合入计划 · 不自动 merge main · publish 另授）

---

## 3. 红线

- [x] 无 asar / 第二 injector / vendor / publish / push main  
- [x] evidence 含 exit  
- [x] live ≤3  
