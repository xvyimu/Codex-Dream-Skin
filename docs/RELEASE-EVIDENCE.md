# 发版证据清单（维护者）

产品线版本：`package.json` / publish `-Version` 对齐（当前 **1.3.25**）。不抬版本号 unless intentional。

## 每次发版前

- [ ] `npm test`（themes + store + adapter + deps + freshness）
- [ ] 若改 `packages/runtime/**`：`pwsh scripts/windows/publish-runtime.ps1 -Version <line>`
- [ ] `pwsh scripts/windows/verify-install-matches-repo.ps1 -RepoRoot <repo>` → exit 0
- [ ] `node packages/core/cli.mjs doctor` → `injectorPathFreshness.fresh=true`
- [ ] 可选 probe：见下节 home / conversation（**不进 CI**）
- [ ] 若改 control-plane token：`npm run test:control`（本机 loopback）
- [ ] 可选 TD-02 摘要演练：`pwsh -NoProfile -File scripts/windows/verify-post-update-failure-summary.ps1` → exit 0

## 可选 probe（不进 CI；详表 PROJECT §9.4）

前置：任务栏 Codex、CDP 9335、皮肤已注入。

- [ ] **home**：`node scripts\windows\probe-session-dom.mjs`  
  期望 JSON 关键字：`"ok": true`、`"dreamStyle": true`、`"pass": true`；exit 0  
  （无 page → exit 2）
- [ ] **conversation**：打开任一对话后 **再跑同上**  
  期望：`"conversationPass": true`；exit 0（失败 exit 3）

完整命令与安装树路径见 [PROJECT.md §9.4](./PROJECT.md)。

## 说明

- Quiet post-update exit=2 + soft reattach OK = 正式降级，**不算**发版失败（见 publish 日志 `soft reattach OK` + 失败 check 摘要）
- 链：PROJECT §6 · CONTRIBUTING §C-3/C-4 · §9.4
