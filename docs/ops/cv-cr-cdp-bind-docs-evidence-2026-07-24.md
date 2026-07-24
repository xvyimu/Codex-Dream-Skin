# M-CV-cr-cdp-bind-docs · evidence · 2026-07-24

**MODE：** `cv-cr-cdp-bind-docs` · **WRITE_POLICY：** docs + optional minimal SECURITY/usage · **in-review**  
**Findings：** [CV-CR-001](file:///D:/orca/.planning/portfolio-stack-policy-2026-07-24/code-review/codexveil-findings.md) (CDP local trust) · [CV-CR-002](file:///D:/orca/.planning/portfolio-stack-policy-2026-07-24/code-review/codexveil-findings.md) (control-plane kick / loopback)  
**Brief：** [`docs/ops/_brief.md`](./_brief.md) · coord brief `cv-coord/cv-long-wave/briefs/cv-cr-cdp-bind-docs.md`  
**WT / branch：** `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-cr-cdp-bind-docs` · `xvyimu/cv-cr-cdp-bind-docs`  
**OUT_OF_SCOPE：** asar · second injector · publish-runtime · push main · ADR-0005 shell · injector hot-path rewrite  

---

## 一句话

**Control plane 已硬绑 `127.0.0.1`；CDP WebSocket 仅 loopback host。** 本轮 **docs-only 加固**（SECURITY 运维句 + usage doctor 交叉链）+ 回归 exit 记录；**无**码侧 bind 修复（非 127 未出现）。

---

## 1. 码侧核对（只读）

| 项 | 路径 | 结论 |
|----|------|------|
| Control listen host | `packages/runtime/scripts/control-plane.mjs` L276 | `s.listen(port, "127.0.0.1", …)` — **硬编码 loopback** |
| Control default port | same · `DEFAULT_PORT = 9336` · scan `PORT_SCAN = 11` → **9336..9346** | 与 `packages/core/constants.mjs` `DEFAULT_CONTROL_PORT = 9336` 对齐 |
| Control log | same L293 | `` control plane on 127.0.0.1:${boundPort} `` |
| CDP default port | `packages/core/constants.mjs` `DEFAULT_CDP_PORT = 9335` | 会话 CDP 默认 |
| CDP URL guard | `packages/runtime/scripts/cdp-url-guard.mjs` | `LOOPBACK_HOSTS = 127.0.0.1 \| localhost \| [::1] \| ::1`；非 loopback / 错端口 / 凭证 / query / hash → throw |
| Mutating auth | `control-plane.mjs` | POST `/kick` `/focus` `/open-healthy` 需 header `x-codex-skin-token`；query token **忽略** |
| Kick path | `packages/core/state/kick-inject.mjs` + dual-open-policy | 热路径经 control；token 防误触，非跨主机认证 |

**升级判定：** control **非** 127 绑定 → **未触发**（无需最小修 / 无 fix 升级）。

---

## 2. Findings 映射

| id | 症状 | 本轮动作 | 状态 |
|----|------|----------|------|
| **CV-CR-001** | 本机任意能连 9335 的进程可经 CDP evaluate 影响渲染 | 文档：勿暴露/转发 CDP；码侧 guard 已存在 + `test:cdp-url` | **docs 收口**（威胁模型诚实：同用户恶意进程同权） |
| **CV-CR-002** | control `/kick` 若非 loopback → 本地 DoS / 乱序主题 | 核对 `listen(..., "127.0.0.1")` + token 门闩 + `test:control` | **已锁 loopback**；docs 重申 |

---

## 3. 测试 exit 表（本机实测 · 2026-07-24）

工作目录：本 worktree 根。Node 经 `npm run`。

| 命令 | 期望 | **exit** | 摘要 |
|------|------|----------|------|
| `npm run test:cdp-url` | 0 | **0** | loopback accept；非 loopback / 错端口 / 凭证 / query / hash reject；browser id 形状 |
| `npm run test:control` | 0 | **0** | 绑 `127.0.0.1:9347+`；GET `/health` 200；POST `/kick` 无 token / 错 header / 仅 query → 401；正确 header → 200 |

> `test:control` **不进 CI**（起 loopback server）；`test:cdp-url` 在 `test:unit` 链内。

未跑（本卡边界外）：`npm test` 全量 · `npm run doctor` 真机 Codex · live CDP 9335 smoke。

---

## 4. Docs diff（最小）

| 文件 | 变更 |
|------|------|
| `docs/SECURITY.md` | 新增 **Loopback ports (ops)**：9335 / 9336 仅 loopback；**禁止** 端口转发到 LAN；链本 evidence + 两测 |
| `docs/usage.md` | 故障速查下 **doctor 与端口（安全）**：`portOpen` ≠ 应暴露；链 SECURITY + dual-open-policy |
| `docs/ops/cv-cr-cdp-bind-docs-evidence-2026-07-24.md` | 本文件 |

**未改：** injector 热路径 · control-plane 逻辑 · asar · publish · main。

既有覆盖（未删）：`docs/SECURITY.md` 威胁模型表已写 127 bind + cdp-url-guard；`docs/dual-open-policy.md` 控制面 token 段已写「仍只绑定 127.0.0.1」。

---

## 5. 风险一句

本机**同用户**恶意进程可读 `control.token`、连 loopback CDP/control，与用户同权——`SECURITY.md` 威胁模型已声明 **out of scope**；本卡只防 **LAN/远程** 与 **误转发**。

---

## 6. DoD / 状态

| 项 | 结果 |
|----|------|
| evidence 落盘 | 本文件 |
| 码侧 127 核对 | pass |
| `test:cdp-url` exit | **0** |
| `test:control` exit | **0** |
| 最小 SECURITY / usage | 已补 |
| asar / 第二 injector / publish / push main | **未做** |
| 工作流状态 | **in-review**（feature commit 后可 push feature 支，不 push main） |
