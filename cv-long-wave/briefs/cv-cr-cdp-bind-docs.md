# M-CV-cr-cdp-bind-docs · findings CV-CR-001/002 brief

产品：Codexveil  
模块：M-CV-cr-cdp-bind-docs · code-review P1 文档  
源：`D:\orca\.planning\portfolio-stack-policy-2026-07-24\code-review\codexveil-findings.md`

## 边界

- **做（docs only 优先）：**  
  1. 写 `docs/ops/cv-cr-cdp-bind-docs-evidence-2026-07-24.md`  
  2. 最小加固（若缺口存在）：  
     - `docs/SECURITY.md` 运维句：CDP **9335** / control **9336** 仅 loopback；**禁止** 端口转发到局域网  
     - 交叉链：`docs/usage.md` 或 doctor map（若在本支/main 可见）「doctor 见 portOpen 不代表应暴露端口」  
  3. 码侧核对并记入 evidence：`control-plane.mjs` `listen(..., "127.0.0.1")` · `cdp-url-guard` · 可选 `npm run test:cdp-url` / `test:control` 记 exit  
- **不做：** 改 injector 热路径大爆炸 · 第二 injector · asar · publish · push main · ADR0005 壳  
- **若** 发现 control 非 127 绑定 → **最小修** + `test:control` 必须 0（升级为 fix）

## 验收

evidence + 可选最小 docs diff · exit 表 · in-review · feature commit · **可 push feature**

风险一句：本机同用户恶意进程仍同权（SECURITY 已声明）。
