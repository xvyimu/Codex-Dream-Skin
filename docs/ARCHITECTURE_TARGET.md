# Codexveil / codex-skin — Target 架构（TOOL）

> **角色**：组合侧线 · TOOL 目标页 + 维护边界文书 · 2026-07-22  
> **状态**：Active（侧线交付；**非**旗舰迁移规格）  
> **As-Is**：[`ARCHITECTURE_ASIS.md`](./ARCHITECTURE_ASIS.md)  
> **实现映射**：[`ARCHITECTURE.md`](./ARCHITECTURE.md) · 产品边界：[`PROJECT.md`](./PROJECT.md)  
> **组合 SSOT**：`D:\orca\docs\portfolio-side-track-2026-07-22.md`  
> **架构决策**：`D:\orca\docs\architecture-decision-2026-07-22-approved.md`  
> **Master**：`D:\orca\docs\architecture-stack-refactor-master-2026-07-22.md`  
> **最高目标**：Better-wins-with-evidence — 栈合集是**参考**，不是教条；本仓无强制对齐 Vue/Go/Python 义务。

---

## 1. 一句话目标态

**维持** Windows 本地 CDP 换肤工具：**Node ESM + PowerShell + 极薄 C#**；**不**建 Vue/NaiveUI 面板，**不**引入 Go 网关 / Python AI-Core / SQL 服务，**不**抢 TransitHub 模块二节奏。

| 维度 | Target（TOOL） |
|------|----------------|
| 产品标签 | **TOOL**（开发者/终端本地工具；非 P0/P1/L2/LEGACY/SIDE） |
| 主栈 | **Node ≥20 ESM（`.mjs`）+ pwsh + 薄 C#（FastLaunch）** |
| 面板 | **默认不建** SPA/管理台；交互保持 托盘 / CLI / F6 / 快捷方式 |
| 平台 | **Windows only**（macOS 永久非目标） |
| 对外面 | 本机 CLI JSON + loopback control-plane（9336）+ CDP（9335） |
| 存储 | 本地文件 / JSON；**无** RDBMS、无云多租户 |
| 与旗舰关系 | **正交**；架构级精力投 TransitHub / MindSync |

---

## 2. 与组合 P0 的关系

| 项 | 约定 |
|----|------|
| P0 旗舰 | **TransitHub**（模块二 WP-G / WP-V / WP-S） |
| 本仓 | **不抢** TH 模块二范围；不借「架构重构」开第二战场 |
| 冲突时 | **TH 优先**（portfolio-side-track §约束） |
| cv 微提交 / injector 拆分 | **不默认合 main**（decision #8 · portfolio 汇总：CV theme-load/payload 另议） |
| 计费 / 生产 | **禁止**破坏性操作；本产品本无计费面 |
| push | **不默认** `git push`；不擅自改 `main` |

本仓价值在 **kick 延迟、主题体验、单 watch 纪律、doctor/publish 卫生**，不在语言纯度或「完整栈」对齐。

---

## 3. 目标栈对照（相对 Master 主参考）

| 主参考组件 | Codexveil Target | 证据 / 理由 |
|------------|------------------|-------------|
| TS + Vue3 + NaiveUI | **TS 仅 contracts（开发平面）**；**无 Vue 面板** | 交互面已是托盘/PS/CLI/F6；本地 JSON 做 SPA ROI 负（ASIS §6–7） |
| Go 网关 | **不引入** | 控制面必须 loopback+token；公网化破坏威胁模型（SECURITY / SEC-02） |
| Python AI-Core | **不引入** | 无 LLM 编排职责 |
| C / 嵌入式 | **无关** | SIDE 另线；本仓仅允许 **薄 C# 边车**（任务栏 AUMID） |
| SQL | **不引入** | 文件状态足够 |
| Git + Shell | **一等公民保留** | publish / launcher / tray 全在 pwsh；SSOT 允许 Shell 工具 |

**Better-wins 停损**：若未来有**可度量证据**（例如多机主题商店需远程管理台、且 loopback 模型明确扩展），再开**独立 Console 子项目**决策；**默认路径仍是不建**。证据门槛须书面 ADR，不得借侧线顺手上 Vue。

---

## 4. 维护边界（允许 / 禁止）

### 4.1 允许（仍 TOOL 内 · 小步）

| 类别 | 示例 |
|------|------|
| 文档与边界 | 本文件、ASIS、PROJECT/ADR 对齐用语；overview 索引 |
| 测试与卫生 | `npm test`、触及的 package script、`doctor` / smoke 说明结果 |
| 发版工具链 | `publish-runtime.ps1 -Version`（ADR 0003）；产品 zip 只 stamp payload |
| 安全纪律 | control-plane loopback + `x-codex-skin-token`；token 不进日志明文 |
| 主题资产 | `themes/<id>/` + `packages/themes` 路径内变更 |
| 可选模块化 | **仅**在有独立任务卡 + 验收时；属 TOOL 内聚，**非**栈迁移（见 §4.3） |

### 4.2 禁止（借架构名义也不做）

| 禁止项 | 说明 |
|--------|------|
| 换栈重写 | injector → Go/Python「网关」；PS 启动链整段重写 |
| Vue/React/Next 管理台 | 默认不建；与组合前端选型无关也不得顺带上 |
| 第二 watch / 第二守护 | 违反 dual-open-policy 与 PROJECT 不可谈判项 |
| `core ↔ runtime` 双向依赖 | `test:deps` + ADR 0004 硬边界 |
| contracts/Zod 打进 `versions/` | 双平面：运行时零第三方 npm |
| 新建 `vendor/` / 重建 `upstream` | ADR 0006 独立线 · 仅 `origin` |
| 跨平台 / macOS 主路径 | 永久非目标 |
| 云多租户 / 公网控制面 | 威胁模型外 |
| 无任务改业务 | **无任务不改业务**；禁止 injector 微重构「顺手合主干」冲动 |
| 抢 TH / 改计费 | 组合硬约束 |

### 4.3 Injector 巨石与微重构（战略位置）

- **事实债**：`injector.mjs` 体量大（ASIS / PAIN / 历史 ADR 0004 D4）— 真实工程债。  
- **本 Target 裁定**：属 **TOOL 内聚模块化**，**不是**组合 P0，**不是**栈迁移。  
- **合主干策略**：**不默认**；须独立决策 + 行为零可见变化 + 测试钉死后再议。  
- **侧线纪律**：存在 `docs/plans/injector-split-*.md` 等方案笔记时，**仅作方案 SSOT**，**不**代表当前必须交付或自动合 `main`。  
- **本轮文书**：**只**固化边界；**不**开实现切片、**不**改业务代码。

---

## 5. 包与运行时边界（Target = 巩固 As-Is 硬规则）

```text
L1 交互   apps/launcher · tray · F6 · FastLaunch.exe
L2 调度   packages/core/cli · core-win/launcher-ui · control-plane
L3 状态   state.json / current.json / active-theme · packages/themes
L4 执行   packages/runtime（单 watch injector + assets）
```

| 硬规则 | Target 动作 |
|--------|-------------|
| 单 watch injector | **保持**；kick 降级可用 `--once`，**非**第二守护 |
| 主题写入只经 `packages/themes` + `themes/<id>/` | **保持** |
| `core ↛ runtime` 静态互引 | **保持**（`test:deps`） |
| 版本只认 `publish-runtime.ps1 -Version` | **保持**（ADR 0003） |
| 安装态 runtime 默认零第三方 npm | **保持** |
| 控制面仅 `127.0.0.1` | **保持** |

**不**为「对齐完整栈」新增 Gateway / AI-Core / Console 层于本 monorepo。

---

## 6. 成功标准（TOOL 维护态）

1. 标签与文档一致：对外称 **TOOL**；新人先读 PROJECT → ASIS → **本文件**。  
2. 主栈不变：Node ESM + pwsh + 薄 C#；无 Vue 面板合入默认路径。  
3. 边界测试绿：至少 `npm test`（及触及变更的 script）；动注入/CDP/启动时 `doctor` 或既有 smoke 可说明。  
4. 单 injector 纪律可观测：任意时刻一条 watch；`doctor` 新鲜度可信。  
5. 与 P0 正交：本仓变更不阻塞、不抢占 TransitHub 模块二。  
6. 微重构不静默合主干：无独立任务卡与验收则不进 `main`。

---

## 7. 非目标清单（明确写死）

- 旗舰级绞杀迁移（Vue 面板 / Go API / Python worker）  
- 内容站 / 博客 / 导航（非 L2）  
- 嵌入式 / 固件（非 SIDE 本仓）  
- LEGACY 冻结（本产品仍活跃维护 runtime 线，但是 **TOOL 维护** 而非扩张）  
- 为对齐而对齐的语言重写  

---

## 8. 文档关系

| 文档 | 职责 |
|------|------|
| `ARCHITECTURE_ASIS.md` | 现状测绘（只读快照） |
| **`ARCHITECTURE_TARGET.md`（本文件）** | TOOL 目标态 + 维护边界 + 与组合 P0 关系 |
| `ARCHITECTURE.md` | 目录 / 调用链实现映射 |
| `PROJECT.md` | 产品边界与验收 |
| `adr/*` | 单点决策（版本源、双平面、独立产品线…） |
| `plans/injector-split-*.md` | **可选**内聚方案；**非**本 Target 自动执行令 |

---

## 9. 给协调员的一页结论

**Codexveil Target = 维持 TOOL 栈（Node+PS+薄 C#），默认不建 Vue 面板，不走网关/AI-Core/SQL 迁移。**  
维护范围 = 边界硬化、测试/发布卫生、主题与安全纪律；injector 模块化**另议且不默认合主干**。  
与组合关系 = **不抢 TransitHub P0**；Better-wins 仅在有书面证据时才允许偏离「不建面板」默认。

---

## 10. 变更记录

| 日期 | 说明 |
|------|------|
| 2026-07-22 | 初版：组合侧线 cv-1 交付；固化 TOOL 边界与 P0 正交关系 |
