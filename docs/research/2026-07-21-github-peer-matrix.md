# GitHub 同类项目矩阵 · Codex Desktop 换肤赛道

> **日期**：2026-07-21  
> **方法**：`gh search repos` + `gh api repos/...` 元数据 + 关键仓 README 抽读（E1/E2）  
> **对象**：与本仓 [`xvyimu/Codex-Dream-Skin`](https://github.com/xvyimu/Codex-Dream-Skin) 同赛道的公开项目  
> **非目标**：渗透、装第三方二进制、宣称「已审计其源码安全」  
> **前序**：[`peer-landscape-and-architecture.md`](./2026-07-21-peer-landscape-and-architecture.md) · v6/v7 报告同类节  
> **星标等数字**：拉取时刻快照，会变；以仓库页为准

---

## 0. 一句话

赛道在 2026-07 爆炸：**CDP 注入引擎**、**Tauri/桌面编辑器**、**主题包/Skill**、**目录/标准** 四层并存。本仓护城河仍是 **Windows 单守护 + versions 发布 + control-plane kick + doctor 证据**，不是 star 数或 Mac Studio GUI。

---

## 1. 赛道分层（先分清再学）

| 层 | 机制 | 用户感知 | 代表 | 本仓 |
|----|------|----------|------|------|
| **A. CLI / 色板** | `config.toml` / 导入串 / 终端主题 | 语法高亮、语义色 | 各类 `codex-themes` 转换器 | **无关** |
| **B. 官方 Appearance** | `codex-theme-v1:{json}` | 官方支持的色板/字体 | 部分 gallery / share string | **互补** |
| **C. CDP Skin** | `--remote-debugging-port` + 本机注入 CSS/图 | 壁纸级 UI、玻璃、英雄图 | 上游 Dream Skin、heige、Styler、本仓 | **主战场** |
| **D. 安装树镜像/植入** | 复制 MSIX/应用树再改资源 | 「一键换壁纸」但占 GB 级镜像 | 个别 Windows 脚本仓 | **明确不做**（改分发面大） |
| **E. 目录 / 标准 / Skill** | 规范、画廊、Agent Skill 装皮 | 发现与一键装 | awesome-codex-skins、各类 skill | **可借鉴标准，不建商店** |

> 分层参考精神同 [mcpso/awesome-codex-themes](https://github.com/mcpso/awesome-codex-themes)。  
> **Law-Of-Cycles** 类「mirror ~2GB + implant」属 **D 层**，与 C 层「不改官方安装包」叙事不同——对照时不可混称「都是 CDP」。

---

## 2. 总矩阵（引擎 / 编辑器 / 运行时）

图例：**平台** W=Windows · M=macOS · **改 asar/安装包** 以 README 自述为准（未做二进制审计）。

| 仓库 | ★ | 语言 | 许可 | 平台 | 类型 | 机制（自述） | 改官方包? | 可借鉴 | 不要抄 | 与本仓匹配 |
|------|--:|------|------|------|------|--------------|-----------|--------|--------|------------|
| [Fei-Away/Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin) | ~11388 | JS | （页未统一 SPDX） | W+M | 上游引擎+内容 | CDP 注入；不改 `.app`/asar/WindowsApps | 否（自述） | 安装心智、社区内容、赞助叙事 | `git merge` 上游（零共同历史） | **高 · 上游** |
| [HeiGeAi/heige-codex-skin-studio](https://github.com/HeiGeAi/heige-codex-skin-studio) | ~298 | JS | MIT | W+M | 一键换肤+预设 | CDP；主题中心；一张图一套主题 | 否（自述） | 预设体验、取色、主题中心 UX | 第二产品线 / `--once` 旁路守护 | **高 · 已合并源** |
| [JasonSTong/codex-theme-studio](https://github.com/JasonSTong/codex-theme-studio) | ~112 | JS | - | **M** | Studio 编辑器 | 浏览器设计 + 受限 CDP 热应用 | 否（自述） | 本地优先编辑、预览工作流 | 默认做 macOS 一等公民 | 中 · 方法 |
| [Wangnov/awesome-codex-skins](https://github.com/Wangnov/awesome-codex-skins) | ~28 | CSS | MIT | C 层生态 | **标准+画廊** | `.codexskin` SPEC；CDP；质量门 Actions | 否（自述） | **资产标准、画廊质量门、真机预览纪律** | 立刻自建主题商店审核流 | 中高 · 标准 |
| [slovx2/Codex-NN](https://github.com/slovx2/Codex-NN) | ~22 | Rust | MIT | W+M | 可视化管理器 | Tauri 2；兼容 Dream Skin 包 | 否（自述） | 可视化切换、包兼容 | 为 GUI 重写本仓为 Tauri monorepo | 中 · 产品形态 |
| [ZhjGo/codex-skin-manager](https://github.com/ZhjGo/codex-skin-manager) | ~22 | CSS | - | ? | 管理器 | （描述空，需再读） | 未知 | 待补读 | 盲依赖 | 低 · 待核实 |
| [xuhuanstudio/codex-styler](https://github.com/xuhuanstudio/codex-styler) | ~14 | TS | Apache-2.0 | W+M | Creator 编辑器 | Tauri+React；伴侣；一键恢复；**v1 证据门+签名门闩** | 否（自述） | **evidence-gated 发布话语**、语义表面系统 | 重依赖栈、未签名当「已支持企业」 | 中 · 方法 |
| [codecnmc/codex-theme-inject](https://github.com/codecnmc/codex-theme-inject) | ~13 | Rust | - | **W** | 注入+面板 | CDP；窗内主题库/AI 工作台 | 否（自述 CDP） | 窗内面板、主题导入导出 | AI 生成链扩大攻击面；范围膨胀 | 中 · Win CDP |
| [lntomF/codexskin](https://github.com/lntomF/codexskin) | ~10 | Rust | MIT | ? | Desktop | 「Codex Skin Desktop」 | 未知 | 待读 | 盲合并 | 低 · 待核实 |
| [charmber/codex-skin](https://github.com/charmber/codex-skin) | ~6 | JS | - | M 重（dmg） | 安装向 | 背景/主题/配色；Mac dmg | 需核实 | 安装包装 | 默认 Mac 优先 | 低 |
| [jiarong0423/codex-dream-skin-workflow-engine](https://github.com/jiarong0423/codex-dream-skin-workflow-engine) | ~6 | JS | MIT | **M** | 工作流引擎 | 零改包 CDP；Build Week | 否（自述） | workflow 拆分 | macOS scope | 低-中 · 方法 |
| [bytefer/codex-skin-switcher](https://github.com/bytefer/codex-skin-switcher) | ~5 | JS | MIT | 跨平台 | 切换 App | 切换皮肤/主题 | 未知 | 轻切换 UX | 再造切换器分叉 | 低 |
| [fantuan-lab/codex-skin-market](https://github.com/fantuan-lab/codex-skin-market) | ~5 | Shell | NOASSERTION | W+M | lab/市场 | 基于 Dream Skin | 未知 | 分发实验 | 许可不清就 vendoring | 低 |
| [houyuhang915-sudo/Codex-Skin-Manager](https://github.com/houyuhang915-sudo/Codex-Skin-Manager) | ~4 | CSS | MIT | W+M | 管理器+Skill | 创建导入 + Skill | 未知 | Skill 入口 | 未审 Skill 供应链 | 低-中 |
| [codex-dream-skin/codex-dream-skin](https://github.com/codex-dream-skin/codex-dream-skin) | ~3 | PS | Apache-2.0 | ? | 另一 Dream Skin 叙事 | 玻璃拟态；不侵入（自述） | 否（自述） | 命名冲突意识 | 名称撞车导致用户装错 | 低 · 易混 |
| [CCDawn/Codex-Dream-Skin-Enhanced](https://github.com/CCDawn/Codex-Dream-Skin-Enhanced) | ~1 | JS | MIT | W+M | 增强版 | Win manager + Mac Studio；live wallpaper | 否（自述 CDP） | 双端分工 | 动壁纸性能债 | 低-中 |
| [Law-Of-Cycles/codex-desktop-theme](https://github.com/Law-Of-Cycles/codex-desktop-theme) | ~1 | PS | MIT | **W** | 壁纸+毛玻璃 | **镜像官方包再植入**；跟踪更新 | **是（镜像树）** | 更新跟踪脚本思路 | **镜像 2GB 分发面**；勿当纯 CDP | 低 · 机制不同 |
| [xvyimu/Codex-Dream-Skin](https://github.com/xvyimu/Codex-Dream-Skin) **本仓** | 0 | PS+JS | MIT | **W only** | 产品线守护 | watch injector · versions · control-plane · doctor · 11 主题 | 否 | — | — | **自身** |

---

## 3. 目录 / 标准 / 非 CDP 层

| 仓库 | ★ | 类型 | 要点 | 本仓动作 |
|------|--:|------|------|----------|
| [mcpso/awesome-codex-themes](https://github.com/mcpso/awesome-codex-themes) | ~3 | 目录 | CLI / Appearance / CDP 分层列表 | 发现入口；不抄清单当实现 |
| [rwang23/awesome-codex-theme](https://github.com/rwang23/awesome-codex-theme) | ~2 | 标准+注册表 | code-free 标准、validator、gallery | 对照 schema 验证思路 |
| [Wangnov/awesome-codex-skins](https://github.com/Wangnov/awesome-codex-skins) | ~28 | **规格+画廊** | `.codexskin` SPEC + quality gate | **优先读 SPEC** 对照 heige/DreamSkin schema |
| 各类 `*-codex-skin` Skill / 主题包 | 0–数 | 内容 | 一键装皮、二次创作 | 可作主题灵感；**不**自动 promote 进 vendor |

---

## 4. 机制对照（深）

### 4.1 纯 CDP（C 层）— 本仓同类

| 维度 | 上游 Dream Skin | heige | Styler | Jason Studio | 本仓 |
|------|-----------------|-------|--------|--------------|------|
| 注入 | CDP | CDP | CDP（编辑器驱动） | CDP 热应用 | **watch CDP** |
| 守护 | 脚本向 | 偏 --once/会话 | App 生命周期 | Studio 会话 | **单 watch + soft reattach** |
| 多主题 | 有 | 强（预设+中心） | Creator 向 | 库+预览 | **11 + catalog 预算** |
| 热切换 | 有 | 菜单/中心 | 编辑器 | 热重载 | **control-plane `/kick` + token** |
| 发布 | 安装脚本 | 安装+官网 | 签名门闩 Beta | 本地 | **versions + publish-runtime + doctor fresh** |
| 平台 | W+M | W+M | W+M | M | **W only（永久）** |
| 依赖 | 相对轻 | 相对轻 | Tauri/React 重 | Node | **零 npm 生产依赖** |

### 4.2 安装树镜像（D 层）— 本仓禁止路径

[Law-Of-Cycles/codex-desktop-theme](https://github.com/Law-Of-Cycles/codex-desktop-theme) README 明确：检测官方更新后 **mirror 进 themed copy（约 2GB）** 再植入 CSS/壁纸，并做桌面快捷方式。  
优点：更新跟踪自动化、可 restore。  
风险：磁盘、签名/完整性叙事、与 Store 包关系复杂。  
**本仓 ADR/硬边界：不修改/不镜像官方签名包为产品主路径。**

### 4.3 编辑器 / Tauri（产品形态分叉）

| 项目 | 栈 | 发布诚实度亮点 |
|------|-----|----------------|
| codex-styler | Tauri + React + Rust | README 写明 **未公证/未 Authenticode**；v1 要 evidence + 签名 |
| Codex-NN | Tauri 2 | 强调不改官方包；兼容 Dream Skin 包 |
| Jason Theme Studio | Node + 浏览器 UI | macOS；本地优先；独立实现叙事 |

本仓 **不** 为追 GUI 引入 Tauri 重栈（演进式 only + 零生产 npm 依赖）。可学的是 **发布门闩话术** 与 **包兼容**，不是仓库形态。

---

## 5. 优缺点合成（按类型）

### 5.1 上游 Dream Skin

| 优点 | 缺点 |
|------|------|
| 心智占领、star 与 fork 规模、内容与赞助位 | 与本仓 **零共同 git 历史**；守护/版本 GC 不如产品线完整 |
| 「不改官方包」叙事清晰 | 社区 fork 爆炸 → 用户装错源 |

### 5.2 heige studio

| 优点 | 缺点 |
|------|------|
| 预设与主题中心 UX 强；MIT；Win/Mac | 历史 `--once` 双开问题（本仓已用 watch-only 吸收教训） |
| 一张图做主题 | 与 Dream Skin 双线曾分裂（本仓 ADR 0001 合并） |

### 5.3 Styler / Studio / NN

| 优点 | 缺点 |
|------|------|
| Creator 路径、预览、证据门（Styler） | 重依赖、签名债、范围易胀（伴侣/AI 生成） |
| 可视化降低脚本门槛 | 与「最小守护运行时」目标不同 |

### 5.4 标准与画廊（awesome-codex-skins）

| 优点 | 缺点 |
|------|------|
| SPEC + 质量门 + 真机预览纪律 | 不是完整守护产品 |
| 资产化主题可迁移 | 标准多套并存可能分裂 |

### 5.5 主题 Skill / 二次皮

| 优点 | 缺点 |
|------|------|
| 内容丰富、传播快 | 供应链与「装了哪个 runtime」不透明 |
| 垂直审美（二游/IP） | 易绑定脆弱 DOM，官方一改即碎 |

---

## 6. 对本仓的可执行建议（不扩 scope）

| 优先级 | 建议 | 来源启发 | 非目标 |
|--------|------|----------|--------|
| P1 保持 | 单 watch + kick token + doctor fresh 文档化对比表 | 全赛道对照 | 第二 injector |
| P1 保持 | 主题 data-only + 对比度门 + 探针断言 | Styler 证据门 · skins quality gate | 云端假视觉 CI |
| P2 可选 | 读 `.codexskin` SPEC，对照 heige/DreamSkin 字段映射表（文档） | awesome-codex-skins | 立即换包格式 |
| P2 可选 | usage 增加「勿装镜像型 2GB 方案/勿改 asar」对照一句 | Law-Of-Cycles 反例 | 实现镜像 |
| P3 | 主题作者示例对齐「真机预览非效果图」 | skins 画廊纪律 | 自建市场 |
| No-Go | macOS Studio、Tauri 重写、自动 merge 上游、主题商店审核 | 多数 GUI 仓 | — |

---

## 7. 本仓定位句（对外可用）

> **Windows-only、零生产 npm 依赖、单 watch CDP 守护、版本化 runtime 与 loopback 鉴权 kick 的 Codex Desktop 皮肤产品线**——兼容 heige/DreamSkin 主题资产思路，不走安装包镜像，不做 macOS 一等公民，不与上游 git 强行合并。

---

## 8. 检索词与复现命令

```text
gh search repos "codex skin" --sort stars
gh search repos "Codex-Dream-Skin" --sort stars
gh search repos "codex theme studio"
gh search repos "codex-styler"
# 元数据
gh api repos/<owner>/<name> --jq '{stars:.stargazers_count,lang:.language,license:.license.spdx_id,topics}'
```

Topics 常见：`codex-desktop` · `codex-theme` · `codex-skin` · `cdp` · `tauri`

---

## 9. 证据等级与过时风险

| 等级 | 本文件用法 |
|------|------------|
| E1 | `gh api` 星标/语言/许可/topics；本仓 doctor/架构已知 |
| E2 | README 自述平台、CDP、是否改包 |
| 非 E | 未克隆构建、未动态验证其注入是否仍适配当前 Codex 版本 |

**过时点**：星标、许可 SPDX、某仓是否 archived、Codex 大版本 DOM 破坏。  
刷新节奏：分发扩大或上游大改时再跑 §8 命令；不必每周全表。

---

## 10. 与 peer-landscape 文档关系

| 文件 | 角色 |
|------|------|
| `2026-07-21-peer-landscape-and-architecture.md` | 架构评估长文 + 早期三对照 |
| **本文件** | **2026-07-21 晚间 GitHub 矩阵刷新**（更多仓、分层、D 层反例） |
| v7 报告同类节 | 门禁回合语境下的短对照 |

冲突时：**机制以 README/源码为准**；定位以本仓 ADR/PROJECT 硬边界为准。

---

## 11. 来源（URL）

- https://github.com/Fei-Away/Codex-Dream-Skin  
- https://github.com/HeiGeAi/heige-codex-skin-studio  
- https://github.com/xuhuanstudio/codex-styler  
- https://github.com/Wangnov/awesome-codex-skins  
- https://github.com/slovx2/Codex-NN  
- https://github.com/JasonSTong/codex-theme-studio  
- https://github.com/codecnmc/codex-theme-inject  
- https://github.com/Law-Of-Cycles/codex-desktop-theme  
- https://github.com/mcpso/awesome-codex-themes  
- https://github.com/rwang23/awesome-codex-theme  
- https://github.com/xvyimu/Codex-Dream-Skin  

---

**完。** 矩阵用于选型与边界教育，不用于 star 攀比。
