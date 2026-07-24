# M-CV-launcher-tray-stability · W7 brief

产品：Codexveil · WEEK W7  
模块：M-CV-launcher-tray-stability

## 边界

- **做：** launcher/tray **第一方源**小稳审计（只读为主）  
  - 范围：`apps/launcher/` · `packages/core-win/` 中 tray/launch/restore 相关  
  - 写 `docs/ops/cv-launcher-tray-stability-evidence-2026-07-24.md`  
  - 核对：单 open 路径、无第二 injector 启动、restore 不另起 watch  
  - **仅当**发现明确小 bug：最小修 + 相关 doctor/smoke 说明；否则 **NO-CODE**  
- **禁：** 第二守护 · asar · vendor · publish · push main · 大重构 · ADR0005 壳  

## 先读

PROJECT · ARCHITECTURE 调用链 · dual-open-policy · doctor-smoke-map · CLAUDE 不可谈判

## 验收

evidence · 路径表 · 风险一句 · 若改码则说明 diff · exit 相关（doctor 可选只读）· in-review · feature commit
