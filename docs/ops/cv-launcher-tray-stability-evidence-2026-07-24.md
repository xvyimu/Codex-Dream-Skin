# M-CV-launcher-tray-stability · evidence · 2026-07-24

**MODE：** `launcher-tray-stability` · **WRITE_POLICY：** `local-commit`（docs only；**禁止** push / asar / vendor / publish / 第二 injector）  
**WT / 支：** `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-launcher-tray-stability` · `xvyimu/cv-launcher-tray-stability`  
**基线 tip：** `ebc3568`（审计前 HEAD）  
**STACK_SSOT：** [`docs/PROJECT.md`](../PROJECT.md) §1.5  
**策略 SSOT：** [`docs/dual-open-policy.md`](../dual-open-policy.md)  
**Brief：** [`docs/ops/_brief.md`](./_brief.md)  
**OUT_OF_SCOPE：** 第二守护 · asar · vendor · `publish-runtime` · push main · ADR0005 壳 · 大重构  

---

## 一句话

日常 **单 open 路径** 起 **一条** `injector.mjs --watch`；tray / restore / kick **不**另起常驻守护；本周 **NO-CODE**。

---

## 1. 范围与方法

| 维 | 内容 |
|----|------|
| 读 | `apps/launcher/*` tray/launch/open/restore/start/kick/check-and-fix · `packages/core-win/*` common/launcher-ui/runtime |
| 对标 | PROJECT §1.2/§1.5 单 watch · dual-open-policy · CLAUDE 不可谈判 #1 |
| 改码 | **无**（未发现须当场修的明确小 bug） |
| 活测 | 本会话未跑 doctor/smoke（只读审计；装机态非本 WT 权威） |

---

## 2. 路径表（第一方源）

### 2.1 用户可见入口 → 进程

| 入口 | 脚本 / 二进制 | 是否 spawn `injector --watch` | 备注 |
|------|----------------|-------------------------------|------|
| 日常任务栏/开始菜单 Codex | FastLaunch → 安装态 open | **是（唯一冷启主路径）** | dual-open-policy 规则 1 |
| 托盘常驻 | `apps/launcher/launch-dream-skin.ps1` → `tray-dream-skin.ps1` | **否** | 只起 STA tray；菜单再调 open/start/restore/kick |
| 托盘「打开/聚焦」 | → `open-codex-dream-skin.ps1`（缺则 `start-dream-skin.ps1`） | 经 open/start | open 优先 |
| 托盘「修复」 | → `check-and-fix.ps1` | 条件重挂 **一条** watch 或调 open | 有 peer 拒绝 |
| 托盘「换肤」 | 写 active-theme + control `/kick` | **否** | kick 失败不在 tray 内 spawn watch |
| 托盘「恢复」 | → `restore-dream-skin.ps1` | **否** | 只 stop tray + stop recorded injector |
| 即时 kick | `kick-theme-now.ps1` | **否**（仅 `--once` 降级） | 与 dual-open-policy「kick 降级」一致 |
| 开发/遗留 start | `start-dream-skin.ps1` | **是** | 同 `injector.mjs --watch`；非第二产品线 |

### 2.2 源码映射（watch 谁起、谁杀）

| 角色 | 路径 | 行为 |
|------|------|------|
| **唯一 injector 实现** | `packages/runtime/scripts/injector.mjs`（安装态 `versions/<id>/scripts/injector.mjs`） | `--watch` 常驻 · `--once` 单次 · `--verify` 探针 |
| **日常 open（主）** | `apps/launcher/open-codex-dream-skin.ps1` | 健康则只 focus；否则 stop recorded → sweep → `Start-Process node … --watch` → peer exclude → 写 state |
| **修复 reattach** | `apps/launcher/check-and-fix.ps1` | Case B 同款单实例门闩后起一条 watch；Case C 转 open |
| **遗留/工具 start** | `apps/launcher/start-dream-skin.ps1` | `Stop-DreamSkinRecordedInjector` 后起 `--watch`（前台或后台） |
| **单实例门闩** | `packages/core-win/common-windows.ps1` | `Stop-DreamSkinWatchInjectors` / `Stop-DreamSkinRecordedInjector` / `Test-DreamSkinWatchInjectorCommandLine`（**必须**含 `--watch`） |
| **托盘壳** | `apps/launcher/tray-dream-skin.ps1` + `launch-dream-skin.ps1` | 不启 node injector；健康态只读 state |
| **Ensure tray** | `packages/core-win/launcher-ui.ps1` `Ensure-CodexSkinTray` | 只 spawn `launch-dream-skin.ps1`，不启 injector |
| **restore** | `apps/launcher/restore-dream-skin.ps1` | stop tray → stop Codex(可选) → `Stop-DreamSkinRecordedInjector` → 清 state；可选 relaunch **裸** Codex exe（**无** CDP、**无** watch） |
| **kick 降级** | `apps/launcher/kick-theme-now.ps1` | 先 `/kick`；失败才 `injector.mjs --once`（短命，非守护） |

### 2.3 核对清单（brief 验收）

| 检查项 | 结果 | 证据锚点 |
|--------|------|----------|
| 单 open 日常路径 | **PASS** | dual-open-policy §规则1；`open-codex-dream-skin.ps1` 为健康/冷启主路径 |
| 无第二 injector 启动 | **PASS** | launcher 内 `--watch` 仅 open / start / check-and-fix 三处，且均指向同一 `injector.mjs` |
| restore 不另起 watch | **PASS** | `restore-dream-skin.ps1` 仅 stop + 可选 `Start-Process` 官方 Codex exe |
| kick 不是第二产品线 | **PASS** | 仅 control-plane 或 `--once`（dual-open-policy §kick 降级） |
| core-win 无平行守护 | **PASS** | core-win 只提供 stop/sweep/tray/focus/state 助手，不 `Start-Process` watch |

---

## 3. 调用链（简图）

```text
用户钉 / FastLaunch
  └─ open-codex-dream-skin.ps1
       ├─ control open-healthy / healthy session → focus + Ensure tray  (no new watch)
       └─ cold / bare → Stop-DreamSkinRecordedInjector
                      → Stop-DreamSkinWatchInjectors (refuse if Left≠0)
                      → node injector.mjs --watch   ← 唯一常驻
                      → peer sweep (Exclude new PID)
                      → Ensure-CodexSkinTray → launch-dream-skin.ps1 → tray

tray 菜单
  ├─ open / start / check-and-fix  → 同上（最多一条 watch）
  ├─ kick / 换肤                   → /kick 或 kick-theme-now --once
  └─ restore                       → stop only（不启 watch）
```

---

## 4. 残留观察（不修 · NO-CODE）

| ID | 观察 | 为何不修 |
|----|------|----------|
| R1 | `start-dream-skin.ps1` 仍可起 watch，且**无** open 同级的「启动后 peer exclude」硬门（依赖 `Stop-DreamSkinRecordedInjector` 预扫） | 非第二产品线；日常入口是 open；改 start 属加固非明确 bug |
| R2 | tray 在 open 缺失时回退 `start-dream-skin.ps1` | 安装态 open 应在；属兜底，非双守护 |
| R3 | restore 成功后可 relaunch **裸** Codex（无 CDP） | 产品语义：卸皮肤后回官方；用户再走日常钉才 reattach |
| R4 | open 与 check-and-fix 并发时理论竞态 | 双方均 sweep + refuse peer；无证据显示稳定双开 |
| R5 | `Test-DreamSkinInjectorAlive` 只验 PID=node，不解析 cmdline | 误报可能，但不制造第二 watch |

**明确小 bug：** 无（不触发最小修）。

---

## 5. 风险一句

**残余风险：并发 open/check 或走 start 遗留入口时，单实例依赖 stop/sweep 时序，极端竞态仍可能短暂双 PID，但无第二产品线/第二 injector 源码路径。**

---

## 6. DoD

| 项 | 状态 |
|----|------|
| evidence 路径表 | 本文 §2 |
| 风险一句 | §5 |
| NO-CODE | 是 |
| doctor/smoke | 未跑（只读；可选后续） |
| 禁区 | 未触 asar / vendor / publish / push main / 第二 injector |
| 本地 commit | 见同会话 git log（本文件 + brief） |
| in-review | 本卡交付后标 in-review |

---

## 7. 相关

- [`docs/PROJECT.md`](../PROJECT.md) §1.2 / §1.5  
- [`docs/dual-open-policy.md`](../dual-open-policy.md)  
- [`docs/ops/cv-day-ready-2026-07-24.md`](./cv-day-ready-2026-07-24.md)  
- 根 `CLAUDE.md` 不可谈判 #1（单 watch injector）  
