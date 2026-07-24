# M-CV-cdp-url-guard · W5 evidence-only · 2026-07-24

**MODE：** `cv-cdp-url-guard` · **WRITE_POLICY：** `local-commit`（仅本 evidence + 本地 commit；**禁止 push / asar / publish-runtime / 第二 injector / 扩 CDP 端口默认**）  
**WT / 支：** `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-cdp-url-guard` · `xvyimu/cv-cdp-url-guard`  
**基线 tip：** `ebc3568`（≡ main · `docs(ops): CV tip vs install runtime gap card`）  
**STACK_SSOT：** [`docs/PROJECT.md`](../PROJECT.md) §1.5  
**Brief：** `cv-coord/cv-long-wave/briefs/w5-cdp-url-guard.md`  
**依赖：** W1/W2 **ACCEPT** · unit 基线绿

---

## 总控回执

| 项 | 值 |
|----|-----|
| 模块 | **M-CV-cdp-url-guard** |
| Phase | WEEK **W5** · evidence-only **DONE** |
| workspaceStatus | **in-review**（请总控审 exit 表 → ACCEPT） |
| 产出 | 本文 `docs/ops/cv-cdp-url-guard-evidence-2026-07-24.md` |
| 业务码 | **未改**（全 exit 0 → **NO-CODE**） |
| push / publish / asar | **未做** |
| 第二 injector / 扩 CDP 端口默认 | **未做** |
| 本机复核 | 见 §1 命令表 · 全部 **exit 0** |
| **结论** | **NO-CODE · PASS** |
| 下一步（总控） | 审本卡 → W5 **ACCEPT**；无红不驱动 `cdp-url-guard*` / `state-freshness*` 修码 child |

---

## 1. 命令表 + exit（本 WT 复跑 · 2026-07-24）

环境：Node `v24.16.0` · 支 `xvyimu/cv-cdp-url-guard` @ `ebc3568` · 时刻约 `2026-07-24 13:39 +08:00`。

| 命令 | exit | 覆盖要点 / 输出摘要 |
|------|------|---------------------|
| `npm run test:cdp-url` | **0** | LOOPBACK（`127.0.0.1` / `localhost` / `[::1]`）· browser path · 拒非 loopback / 错端口 / userinfo / query/hash / 错 path · `BROWSER_ID_PATTERN` · `isValidBrowserId` · `cdp-url-guard.test: pass` |
| `npm run test:freshness` | **0** | path+id 匹配 → fresh · runtimeId-drift · injector-path-drift · expected/actual missing 优先序 · `all passed` |
| `npm run test:deps` | **0** | core 17 / runtime 20 文件扫描 · core↔runtime **无**静态互引 · themes 无非 thumb runtime 静态/动态 import · `check-package-deps: all passed` |

**brief 必跑：** test:cdp-url · test:freshness → **全 0**  
**brief 建议：** test:deps → **0**

### 1.1 失败策略（未触发）

| 条件 | 动作 |
|------|------|
| 全 exit **0** | **NO-CODE** · 仅 evidence（本卡） |
| 非 0 | 最小修 `packages/runtime/scripts/cdp-url-guard*` / `packages/core/state/*freshness*` + 触及面 unit |

---

## 2. 业务码 / 边界声明

| 项 | 状态 |
|----|------|
| `packages/runtime/scripts/cdp-url-guard*` | **未改** |
| `packages/core/state/*freshness*` | **未改** |
| injector 热路径 / CDP 端口默认 | **未改** |
| `packages/**` · `apps/**` · `themes/**` | **未改** |
| 第二 injector · vendor · asar · publish-runtime · `git push` | **未做** |
| 仅新增 | 本 evidence（+ 本地 `docs(ops):` commit） |

---

## 3. 覆盖盲区（不归本卡修）

| 盲区 | 说明 | 本卡动作 |
|------|------|----------|
| 无 live CDP 会话 | unit 不证真连 9335 / 真页 target | **不修码**；live 归 doctor/smoke / probe |
| 装态 vs tip | 不测 `versions/<id>/` 字节与 current 对齐 | 已有 gap 卡 / day-ready；本卡不 stamp |
| freshness 仅 state 契约 | 不替代 doctor 装机读盘 | doctor 另路径 |
| deps 静态边界 | 不证动态 import 热路径 | 与 ADR 分层一致即可 |

---

## 4. 验证记录

| 步骤 | 结果 | exit |
|------|------|------|
| 先读 brief · PROJECT §1.5 边界 | 完成 | — |
| `npm run test:cdp-url` | pass | **0** |
| `npm run test:freshness` | all passed | **0** |
| `npm run test:deps` | all passed | **0** |
| 业务码 diff | **无** | — |
| push / publish / asar / 第二 injector | **未做** | n/a |

---

## 风险（一句）

**cdp-url / freshness / deps unit 全绿仍 ≠ 用户机 CDP 安全或皮已注入：** 本卡只钉 loopback URL 守卫与 state 新鲜度契约 + 包边界；live 会话、装态字节、注入成功路径仍须 doctor/smoke 或受权 publish，**勿**因本卡 PASS 扩端口或开第二 injector。

---

## 状态

| 项 | 值 |
|----|-----|
| 卡状态 | **DONE** · **in-review** |
| 结论 | **NO-CODE · PASS** |
| 总控 | 请审 §总控回执 + §1 exit 表 |
| Agent 停步 | 不 push、不 publish、不改 cdp-url-guard / freshness / injector 业务码 |
