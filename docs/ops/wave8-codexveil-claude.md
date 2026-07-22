# Wave8 · Codexveil · claude

| 项 | 值 |
|----|-----|
| **agent** | claude |
| **worktree** | `C:\Users\yuanjia\orca\workspaces\Codexveil\wave8-cv-claude` |
| **branch** | `xvyimu/wave8-cv-claude` |
| **baseline tip (start)** | `d480b4e` · `docs(ops): true publish gate checklist (wave7 human gate)` |
| **dirty at start** | clean |
| **策略** | TOOL · wave8 dual · 闭包/清单加固；**真 publish 不执行** |
| **日期** | 2026-07-22 |

> 路径以本 worktree 为准；**不是**主 checkout `D:\orca\Codexveil`。  
> 合入 / push / 真 publish → **总控 + 人 gate**。

---

## 1. 做了什么（一刀）

### 1.1 白名单再钉一层：`control-plane` + `fs-io` → required

`injector.mjs` watch 路径 **dynamic** `import("./control-plane.mjs")`，`control-plane` 再 `from "./fs-io.mjs"`。  
Dual-B 只把 static graph（theme-load 等）抬进 `$requiredRuntimeScripts`；control-plane / fs-io 仍在 **optional** 环——源文件缺时 publish **静默跳过**，装态 kick/focus 会 `ERR_MODULE_NOT_FOUND`。

**改动：**

| 文件 | 变更 |
|------|------|
| `scripts/windows/publish-runtime.ps1` | `$requiredRuntimeScripts` 增加 `control-plane.mjs`、`fs-io.mjs`；optional 去掉二者 |
| `scripts/windows/verify-publish-runtime-payload.ps1` | required 同步；edge 检查 dynamic import + fs-io；staged `import` control-plane |
| `scripts/windows/verify-install-matches-repo.ps1` | `scripts\fs-io.mjs` **Required** hash 对齐 |
| `docs/ops/true-publish-gate-checklist.md` | 交叉链 doctor / verify / 装态证明；写明 **真 publish 默认不跑** |

### 1.2 清单 ↔ doctor / verify 交叉链

- **verify-publish-runtime-payload**：agent/CI 安全闭包（不写 Programs）  
- **doctor**：本机 CDP / DreamSkin / injector 新鲜度（不替代白名单 dry-run）  
- 人 gate 序列写进 checklist §Preconditions / Human-only

### 1.3 报告

本文件。

---

## 2. 没做什么

| 项 | 原因 |
|----|------|
| 真 `publish-runtime.ps1 -Version` stamp / 装机 | **wave8 题单禁**；总控等人 gate + VERSION |
| D7 / 生产 CSP·RLS / ISS | 题单硬禁 |
| `payload-builder.mjs` 抽出（injector-split S3） | 非本刀；optional 仍预留 |
| `git push` / 合 main / 开 PR | 总控 |
| 改 `SKIN_VERSION` / 业务运行时行为 | 仅 publish 白名单 + 文档 |

---

## 3. 验证命令 + exit code

在 worktree 根：

| 命令 | exit |
|------|------|
| `pwsh -NoProfile -File scripts/windows/verify-publish-runtime-payload.ps1` | **0** |
| `npm test`（unit + contracts） | **0** |

未跑（装机 / 人确认）：

- 真 `publish-runtime.ps1 -Version …`
- `verify-install-matches-repo.ps1`（依赖本机已装 + re-publish）
- `npm run doctor` / `probe:session`（需 Desktop/CDP）

### 复现 dry-run

```powershell
cd C:\Users\yuanjia\orca\workspaces\Codexveil\wave8-cv-claude
pwsh -NoProfile -File scripts/windows/verify-publish-runtime-payload.ps1
# expect: VERIFY OK … (theme-load + control-plane + required ESM graph) + exit 0
```

真 publish（**人 gate · 本切片未执行**）：

```powershell
pwsh -NoProfile -File scripts/windows/publish-runtime.ps1 -Version 1.3.25
# then:
# Test-Path "$env:LOCALAPPDATA\Programs\CodexDreamSkin\versions\<id>\scripts\control-plane.mjs"
# Test-Path "...\fs-io.mjs"
```

---

## 4. 变更清单

| 路径 | 动作 |
|------|------|
| `scripts/windows/publish-runtime.ps1` | required 白名单 +control-plane +fs-io |
| `scripts/windows/verify-publish-runtime-payload.ps1` | 闭包与 edge/import 加固 |
| `scripts/windows/verify-install-matches-repo.ps1` | fs-io Required |
| `docs/ops/true-publish-gate-checklist.md` | doctor/verify 交叉链 + 装态证明行 |
| `docs/ops/wave8-codexveil-claude.md` | 本报告 |

---

## 5. 残留风险

- 装机目录在 **人工 re-publish 前** 若曾靠 optional 拷贝，仍可能与 tip 不完全一致；本刀只收 **tip 脚本闭包**。  
- `payload-builder` 仍 optional；S3 抽出且被 injector import 后须再抬 required。  
- dry-run **不**执行完整 publish 副作用（GC / post-update / stamp 写回）——有意隔离。

---

## 6. 判定（自检）

| 项 | 状态 |
|----|------|
| 清单 ↔ doctor / verify 交叉链 | **PASS** |
| 白名单再钉 control-plane + fs-io | **PASS** |
| `verify-publish-runtime-payload.ps1` exit 0 | **PASS** |
| 报告含 worktree / tip / 验证 | **PASS** |
| **真 publish 未执行** | **PASS** |
| 无 push / 无 D7 / 无生产 CSP | **PASS** |

**停止 · 等人 gate / 总控合入。**
