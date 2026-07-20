# codex-skin 整合调研总册 v3（工程冻结 + UX/视觉升级）

> **日期**：2026-07-21  
> **HEAD**：`6173db8` · `main==origin/main`  
> **安装态**：`1.3.25-3f28aa` · doctor `fresh=true` · themes=11 · control=9336 · CDP open · injectorAlive  
> **证据**：`docs/evidence/RUN-LOG.md` conversationCovered=true（JSON gitignore）  
> **整合**：peer-landscape · progress-aligned · master-v2 · SECURITY · PROBE/F3/F5/F6plus · 本机视觉 token 体系  
> **同类**：上游 DreamSkin ~11049⭐ · Styler ~14⭐ · awesome 三层  
> **方法**：E1 本机 · E2 仓文档/CSS · E3 gh；不改 asar、不 AUMID 劫持、不盲 promote  
> **读法**：选代读本文；赛道读 peer；卡片史读 progress  

---

## 0. 执行摘要

### 0.1 一句话

工程主债与调研 §10 四包**已关且已上 origin**；安装树 **双 guard 齐全**；conversation **真留痕已完成一次**。下一阶段主战场从「可证明运维」转为 **用户体验与视觉风格的克制升级**——仍必须服从单 injector、不挡控件、payload 预算与 ADR。

### 0.2 进度仪表盘（冻结）

| 域 | 状态 |
|----|------|
| 单 injector / kick / versions | 完成 |
| token header-only + timingSafeEqual | 完成 · 安装 3f28aa |
| verify-install / baseline / RELEASE-EVIDENCE | 完成 |
| data-only 主题 / skipped / adapter 测 | 完成 |
| P2-PROBE evidence + 诚实 conversationCovered | 完成 · RUN-LOG |
| P2-F3 report schemaVersion=1 | 完成 |
| P3-F5 签名 No-Go 购证 | 完成 |
| cdp-url-guard + catalog-budget 源码+安装 | 完成 |
| SECURITY.md | 完成 |
| G-CAT 空窗 | **已关** |
| 上游 e776fa6 不 promote | 维持 |
| UX 系统化（onboarding/空状态/对比度/动效） | **未系统立项** |
| 视觉语言规范（设计 token 文档化 / 主题可读性门禁） | **部分在 CSS，缺产品规范** |
| SmartScreen 签名落地 | No-Go 购证 |
| BASELINE shortHead 相对 6173db8 | 略旧（df3b445）→ 可重跑脚本 |

### 0.3 战略转向

| 已完成阶段 | 下一阶段 |
|------------|----------|
| 正确性、安全边界、发版证明 | **体验一致性、视觉可读性、主题质量门** |
| 防崩溃 import 空窗 | 防「有皮肤但难用/难看/挡字」 |
| Agent 可改代码边界 | Agent 可改 CSS 的验收边界 |

### 0.4 最佳下一组合（摘要）

**UX-视觉门禁轻包（推荐）**：主题对比度/字号可读性检查（可自动化部分）+ 首页/会话 UX 检查清单 + 可选 1 个视觉回归点（不拆架构）。  
**否决**：大改 DOM 结构仿 Styler companion、重做整套 CSS 无证据、为美化打开非 loopback。

---

## 1. 范围、读者、证据

### 1.1 读者

维护者选代 · Agent 任务卡 · 新人入职 · 设计向贡献者（视觉/UX 章）。

### 1.2 证据等级

E1 本机 doctor/probe/CSS · E2 文档 ADR · E3 同类 star · E4 awesome。

### 1.3 非目标

改 asar · AUMID 劫持 · mac 一等 · 主题商店 · 云 doctor · 宇宙重构 · 购证实施（仅决策已有）。

---

## 2. 赛道与同类（含 UX 视角）

### 2.1 三层换肤

CLI TUI · 官方 Appearance · **CDP Skin（本仓）**。  
UX 含义：用户若期望「设置里导入主题串」，是层 2；本仓提供的是**氛围层**，必须在文档与首次体验说清。

### 2.2 上游 DreamSkin（~11k⭐）

| 维 | 优 | 缺 | 本仓 |
|----|----|----|------|
| 获客叙事 | 强预设与截图 | 工程分叉难 merge | 学话术不学 merge |
| 安装体验 | 一页通 | 版本树弱 | 我们 versions 更强 |
| 视觉 | 社区预设丰富 | 质量参差 | 11 主题 + schema |
| UX | 托盘换背景直觉 | 双端复杂 | 托盘/F6/CLI 已有 |

### 2.3 Styler（~14⭐）

| 维 | 优 | 缺 | 本仓 |
|----|----|----|------|
| Creator UX | 最强 | 重 | **不抄整仓** |
| 证据门 | 强 | 成本高 | 已轻量对齐 |
| 视觉系统 | layers/entities | 超 scope | CSS 变量体系可文档化 |
| Companion | 趣味 | 干扰编码 | **默认不做** |

### 2.4 可迁移 UX 原则（跨项目）

1. **可逆**：随时暂停/恢复官方外观。  
2. **不挡字**：装饰层 pointer-events 与对比度。  
3. **首触达清晰**：用哪颗钉、不要商店磁贴。  
4. **失败可解释**：doctor / evidence / soft reattach 文案。  
5. **主题=数据**：作者不写脚本。  

---

## 3. 目标 · 约束 · 边界 · IO · 验收（工程 + UX）

### 3.1 产品成功标准（不变）

1. 皮肤与 active-theme 一致  
2. kick 亚秒  
3. 单 injector  
4. fresh=true  
5. 可回退  

### 3.2 UX 成功标准（新增提案，待立项）

6. 新用户 5 分钟内理解入口与换肤路径  
7. 会话中正文对比度可接受（主题门禁或清单）  
8. 换肤/暂停不丢失「我在哪」的心智（状态可见）  
9. 视觉动效不引入可感知卡顿（会话页）  

### 3.3 硬约束

单 injector · core↛runtime · loopback only · 不 asar/AUMID/mac · publish 权威 · data-only 主题 · payload 预算。

### 3.4 边界

| 做 | 不做 |
|----|------|
| CSS 变量与可读性 | 改官方 React 树 |
| 托盘/F6/CLI UX 文案 | Companion 宠物默认开 |
| 主题质量门 | 在线商店 |
| evidence 证明视觉 | 云截图 CI |

### 3.5 系统 IO

| 输入 | 输出 |
|------|------|
| 用户点钉 | 带皮肤 Codex |
| apply/F6 | 热换肤 |
| publish | 新 runtimeId |
| theme.json+图 | catalog/校验错 |
| Run-ReleaseProbes | evidence（含 conversationCovered） |
| doctor | 健康 JSON |

### 3.6 验收门禁（今态）

```text
npm test  # +cdp-url +catalog-budget
verify-install · doctor · write-baseline
Run-ReleaseProbes  # home + conversationCovered
SECURITY / dual-open 合同
```

---

## 4. 架构与视觉实现现状

### 4.1 四层架构（不变）

L1 交互 · L2 调度 · L3 状态/主题 · L4 runtime 注入。

### 4.2 视觉技术栈（E2）

`dream-skin.css` 以 `:root.codex-dream-skin` 设计 token 为核心：

- **色板**：`--dream-accent` 驱动 surface/sidebar/text/line 的 color-mix  
- **明暗**：`.dream-theme-dark` 切换 color-scheme 与 canvas  
- **沉浸**：immersive-edge/mid/far、composer 玻璃混合  
- **字体**：Segoe UI Variable + 雅黑 UI 回退  
- **侧栏**：显式 `backdrop-filter: none`（性能/清晰历史选择）  
- **动效**：button 180ms cubic-bezier 过渡  

`renderer-inject.js` 负责把 theme palette/art 写入 CSS 变量与 DOM 标记（brand、art 位）。  
**含义**：视觉升级应优先 **调 token 与主题 palette**，而非复制上游整文件（F4 不 promote）。

### 4.3 工程因果链（压缩）

FastLaunch → open → injector(guards) → CDP URL 校验 → active-theme → catalog 预算 → evaluate → control-plane kick。

### 4.4 架构评分

| 维 | 分 | 注 |
|----|---:|----|
| 边界/依赖 | 9.5/9.0 | |
| 运维证明 | 9.3 | evidence+conversation |
| 安全品类 | 8.7 | SECURITY 文 |
| 可测 | 8.5 | 七段 test |
| UX 系统 | 6.5 | 缺规范与门禁 |
| 视觉规范文档 | 6.0 | CSS 强、文档弱 |
| 社区 | 5.0 | |
| **综合** | **8.6** | 工程强、体验文档化弱 |

---

## 5. 技术债总账（v3）

### 5.1 已关

token · reattach · verify-install · baseline 脚本 · data-only · PROBE/F3/F5 · 双 guard 安装 · SECURITY · conversation 真留痕 · catalog-budget 安装（3f28aa）

### 5.2 仍开（工程）

| ID | 项 | 优先级 |
|----|-----|--------|
| G-BASE | baseline shortHead 刷新到 6173db8 | P3 |
| DOM | 选择器随 Codex 变 | P2 持续 |
| 上游 | 有收益再 promote | P3 |
| 签名落地 | 购证 No-Go | P3 |
| F6+++ | 更多纯函数 | 可选 |

### 5.3 仍开（UX/视觉）——**新主债**

| ID | 项 | 优先级 | 说明 |
|----|-----|--------|------|
| **UX-1** | 入口/裸启教育触达 | P1 | #21 用户仍会点商店 |
| **UX-2** | 换肤反馈（toast/托盘状态） | P1 | kick 成功不可见则焦虑 |
| **UX-3** | 主题可读性门禁 | P1 | 低对比 palette 伤阅读 |
| **UX-4** | 会话页玻璃/气泡一致性 | P2 | 已有 CSS，缺清单 |
| **UX-5** | 空状态/无任务时的皮肤表现 | P2 | 侧栏「无任务」场景 |
| **UX-6** | 动效与性能开关 | P2 | 弱机 backdrop 历史 |
| **UX-7** | 首次运行 SmartScreen 文案触达 | P2 | #24 |
| **UX-8** | 主题预览与 F6 缩略图质量 | P2 | catalog 预算内 |
| **VIS-1** | 设计 token 文档化 | P1 | 从 CSS 提取规范 |
| **VIS-2** | 明暗跟随/强制策略产品化 | P2 | 已有 dark class |
| **VIS-3** | 品牌区/hero 安全区规范 | P2 | art focus 字段 |
| **VIS-4** | 与官方 Appearance 叠层指南 | P3 | 避免双主题打架 |

---

## 6. 用户体验升级：问题与多方案

### 6.1 UX-1 入口纪律触达不足

| 方案 | 做法 | 用户 | 维护 | 可行 | 成本 | 风险 | 边界 | 结论 |
|------|------|-----:|-----:|-----:|-----:|-----:|-----:|------|
| A 仅 usage 文档 | 现状 | 2 | 5 | 5 | 5 | 5 | 5 | 不足 |
| **B 首次 open 一次性提示** | launcher 检测商店路径/无皮肤 | 5 | 4 | 4 | 3 | 3 | 5 | **佳** |
| C 每次启动弹窗 | 烦人 | 2 | 4 | 5 | 4 | 2 | 5 | 否 |
| D 劫持 AUMID | 不可行 | 5 | 1 | 1 | 1 | 1 | 1 | **否** |

**最佳 B**：在不碰 OS 硬限下提高触达；须可关闭、不阻塞 kick。

### 6.2 UX-2 换肤无反馈

| 方案 | 结论 |
|------|------|
| A 静默 kick | 现状，差 |
| **B 托盘气泡/短暂 OSD「已应用主题」** | **最佳** |
| C 每次全屏 flash | 否，刺眼 |
| D 仅 CLI JSON | 开发者够、用户不够 |

**最佳 B**：低打扰、对齐 kick 成功路径；失败用已有 note。

### 6.3 UX-3 主题可读性

| 方案 | 结论 |
|------|------|
| A 人工眼看 | 不可扩展 |
| **B 主题 PR 对比度清单 + 可选脚本估亮度** | **最佳** |
| C 强制统一 text 色 | 否，扼杀主题 |
| D AI 自动改 palette | 不可控 |

**最佳 B**：data-only 兼容；可先文档门禁再脚本。

### 6.4 UX-4 会话玻璃一致性

| 方案 | 结论 |
|------|------|
| A 维持 CSS + probe conversation | **现状底线** |
| **B 会话视觉检查表并入 RELEASE-EVIDENCE** | **最佳增量** |
| C 大改气泡选择器 | 高 DOM 风险 |

**最佳 A+B**：证据已有 conversationCovered；补人工视觉项。

### 6.5 UX-6 性能 vs 美感

| 方案 | 结论 |
|------|------|
| A 全局重 blur | 否（历史去 blur） |
| **B 默认克制；主题可选 ambient 强度 token** | **最佳** |
| C 用户设置「性能模式」关装饰 | 可二期 |

侧栏已 `backdrop-filter: none`——保留，除非有证据证明新机可承受且可读。

---

## 7. 视觉风格：问题与多方案

### 7.1 风格定位选项

| 方案 | 描述 | 匹配产品 |
|------|------|----------|
| **S1 克制工具向** | 低干扰、高对比、弱装饰 | **编码工具默认** |
| S2 沉浸氛围向 | 强 hero、重玻璃 | 演示强、阅读风险 |
| S3 高饱和潮流 | 强 accent 动画 | 易俗、易闪 |
| S4 严格跟随官方 Appearance | 几乎无皮肤 | 失去 CDP 价值 |

**最佳默认 S1**，允许**单个主题**偏向 S2（主题 palette/art），而非全局 CSS 滑向 S2。  
**理由**：成功标准是长期编码可读；上游 star 靠 S2 演示，本仓护城河是运行时而非壁纸秀。

### 7.2 Token 体系治理

| 方案 | 结论 |
|------|------|
| A 继续只活在 CSS | 难协作 |
| **B VIS-1：docs/design-tokens.md 从 CSS 提炼** | **最佳** |
| C 上 Style Dictionary 重工具链 | 过重 |

### 7.3 与官方 Appearance 叠层

| 方案 | 结论 |
|------|------|
| A 忽略 | 用户困惑 |
| **B 文档：Appearance 管代码色，CDP 管氛围；冲突时暂停皮肤** | **最佳** |
| C 自动检测官方主题改注入 | 复杂脆弱 |

### 7.4 上游视觉 promote

维持 **F4 不 promote**；若 UX 需要某效果，**片段移植**并保留 stamp/null-safe。

### 7.5 动效语言

| 方案 | 结论 |
|------|------|
| A 大面积 motion | 否卡顿 |
| **B 仅交互反馈 150–200ms（现状 button）** | **最佳** |
| C 主题级自定义 keyframes | 二期、需预算 |

---

## 8. 架构优化（体验阶段仍适用）

1. 不拆 injector 业务文件；继续纯函数抽测。  
2. 视觉改动走 assets + publish + verify + probe。  
3. UX 文案走 launcher/usage，不进 core。  
4. 主题质量走 schema/测试，不进 injector 分支地狱。  
5. 证据：home + conversationCovered 双勾。  

**否决**：为 UX 引入第二注入路径或远程配置。

---

## 9. 多方案总决策表（工程+UX）

| 问题 | 最佳 | 为何符合项目 |
|------|------|----------------|
| 安装缺模块 | publish | 已示范；自包含 |
| 入口误解 | 一次性提示 B | 不碰 #21 硬限 |
| 换肤无感 | 托盘轻反馈 | 不挡编码 |
| 低对比主题 | 可读性门禁 | data-only 兼容 |
| 视觉方向 | 默认 S1 | 工具优先 |
| token 文档 | VIS-1 | 低成本协作 |
| 上游 CSS | 不盲 promote | ADR0002 |
| 签名 | 维持 A | F5 |
| 会话证明 | conversationCovered | 已落地 |
| 选代 | UX 轻包 | 工程已稳 |

---

## 10. 工作包卡片（目标/约束/IO/验收）

### U1 · 设计 token 文档（VIS-1）

| 字段 | 内容 |
|------|------|
| 目标 | 贡献者知如何安全调色 |
| 约束 | 不改运行时行为 unless 文档示例 |
| 输入 | dream-skin.css :root 变量 |
| 输出 | `docs/design-tokens.md` |
| 验收 | 列出核心 token 与明暗两套；链 CONTRIBUTING |

### U2 · 主题可读性检查清单（UX-3）

| 字段 | 内容 |
|------|------|
| 目标 | 主题 PR 可拒低对比 |
| 约束 | 不强制唯一 text 色 |
| 输入 | theme palette |
| 输出 | CONTRIBUTING 清单 ± 可选脚本 |
| 验收 | 清单可勾；示例主题通过 |

### U3 · 换肤成功轻反馈（UX-2）

| 字段 | 内容 |
|------|------|
| 目标 | 用户知「已换上」 |
| 约束 | 不阻塞 kick；可关 |
| 输入 | kick 成功 |
| 输出 | 托盘/气泡文案 |
| 验收 | apply 后可见反馈；失败有 note |

### U4 · 首次入口提示（UX-1）

| 字段 | 内容 |
|------|------|
| 目标 | 降低商店裸启误用 |
| 约束 | 不劫持 AUMID；仅一次或低频 |
| 输入 | open 路径 |
| 输出 | 提示 UI/文案 |
| 验收 | 文档+可关闭；#21 仍成立 |

### U5 · 会话视觉检查并入证据（UX-4）

| 字段 | 内容 |
|------|------|
| 目标 | 发版看气泡/对比度 |
| 约束 | 不进 CI |
| 输入 | conversation evidence |
| 输出 | RELEASE-EVIDENCE 增行 |
| 验收 | 与 conversationCovered 联勾 |

### U6 · baseline 刷新

| 字段 | 内容 |
|------|------|
| 目标 | shortHead=6173db8 |
| 约束 | 勿手改 |
| 输入 | write-baseline |
| 输出 | BASELINE.generated.md |
| 验收 | 与 rev-parse 一致 |

### U7 · 性能模式（可选二期）

| 字段 | 内容 |
|------|------|
| 目标 | 弱机降装饰 |
| 约束 | 默认 S1；不第二 injector |
| 输入 | 用户开关/paused 扩展 |
| 输出 | token 降 ambient |
| 验收 | 开关可逆；probe 仍过 |

### REJECT

Companion 默认开 · 全局重 blur · 主题商店 · 云截图 CI · 盲 promote · 拆 injector  

---

## 11. 组合投资组合

| 名 | 含 | 周期 | 推荐 |
|----|----|------|:----:|
| **体验-文档** | U1+U2+U5+U6 | 1–2 日 | **是（默认）** |
| **体验-反馈** | U3+U4 | 2–4 日 | 用户痛强时 |
| **体验-深** | +U7 | 更长 | 二期 |
| 仅工程再抽函数 | F6+++ | 0.5 | 低优先级 |
| 危险视觉大改 | 整文件 promote | — | 否 |

**为何「体验-文档」最佳**：工程已稳，最大缺口是**协作与质量标准**；文档门禁零安装风险、可逆、Agent 可执行，符合「先约束后生成」。

---

## 12. 细节打磨参考（UX/视觉）

### 12.1 文案

- 统一「任务栏 Codex」「不要商店磁贴」  
- kick 失败中文 note 保持短  
- SmartScreen：更多信息→仍要运行  

### 12.2 视觉

- 改 token 不改选择器优先  
- 会话页改动必跑 conversationCovered probe  
- 侧栏保持可读，慎开 blur  
- accent 驱动整板，避免硬编码散落  

### 12.3 主题

- palette 四色语义固定  
- art focus 不挡 composer  
- thumb 服从 catalog 预算  

### 12.4 无障碍（务实）

- 不追求 WCAG 全站（非我们 DOM）  
- 主题门禁关注 text/surface 对比  
- 不依赖仅颜色传递状态  

### 12.5 动效

- ≤200ms 交互反馈  
- 禁止无限动画抢 CPU  

---

## 13. 实现深潜（压缩）

用户点钉→FastLaunch→injector+guards→变量注入 CSS→kick 热更。  
UX 问题多出在**心智与可读**，不在缺第二守护。

---

## 14. 同类 UX 抄与不抄

**抄**：可逆、预设版权话术、证据门、首次安全说明。  
**不抄**：Companion、商店、mac 双端主路径、自动 merge。

---

## 15. 风险

| 风险 | 缓解 |
|------|------|
| 为美化伤阅读 | S1 默认+可读性门 |
| 视觉大改 DOM 崩 | probe+小步 |
| 提示过多烦躁 | 一次性/可关 |
| promote 毁 stamp | F4 |
| baseline 旧 | U6 |

---

## 16. 指标建议

| 指标 | 目标 |
|------|------|
| npm test | 100% |
| verify-install 发版后 | 100% |
| conversationCovered 主版本 | 建议 100% |
| 主题 PR 可读性清单 | 100% |
| 商店裸启客诉 | 趋降（U4） |
| 双 injector | 0 |

---

## 17. 人日

U1 0.5 · U2 0.5–1 · U3 1–2 · U4 1–2 · U5 0.3 · U6 0.1 · U7 2+  

---

## 18. Agent 交接

```text
HEAD 6173db8 · runtime 1.3.25-3f28aa · fresh · 双 guard 已装
工程主债已关；conversation 真留痕有 RUN-LOG
下一优先：UX 文档门禁（design-tokens + 可读性清单）而非再拆架构
禁止：asar/AUMID/mac/第二 injector/盲 promote
```

---

## 19. 正确热修+视觉故事

改 CSS token → npm test → publish → verify → doctor → baseline → Run-ReleaseProbes（开对话）→ 勾证据 → push。

---

## 20. 反模式（体验向增补）

为炫光效开 blur 全局 · 强制用户看每次启动广告 · 低对比主题强行合并 · 用 companion 挡代码 · 把 Appearance 当皮肤卸载 CDP  

---

## 21. 九问题速查（体验）

| 问题 | 最佳 |
|------|------|
| 风格方向 | S1 克制工具向 |
| 入口 | 一次性提示 |
| 换肤反馈 | 托盘轻提示 |
| 可读性 | 清单±脚本 |
| token | 文档化 CSS 变量 |
| 会话证明 | conversationCovered |
| 上游视觉 | 不盲 promote |
| 签名 | 维持 A |
| 选代 | 体验-文档包 |

---

## 22. 任务卡模板

```text
标题/目标/非目标/约束/输入/输出/实现/验收/风险/回滚
```

### 示例 U1

```text
标题：design-tokens.md
目标：贡献者安全调色
非目标：不改 CSS 行为
约束：与 dream-skin.css 一致
输入：:root 变量
输出：docs/design-tokens.md
验收：PROJECT/CONTRIBUTING 链接；变量表完整
```

---

## 23. 哲学

工具皮肤的最高礼仪是**让人忘掉皮肤还在**——直到用户想换氛围。  
工程上「可证明」已达标；体验上「可愿意每天用」靠 S1 与门禁，不靠更大特效。

---

## 24. 收束十条

1. 工程冻结：主债与四包+安装双 guard+conversation 证据已齐。  
2. 下一阶段：UX/视觉规范与门禁。  
3. 默认视觉 S1 克制工具向。  
4. 最佳选代：体验-文档包 U1+U2+U5+U6。  
5. 入口与反馈是高杠杆 UX。  
6. 可读性门禁保护编码场景。  
7. 不 promote 上游整文件。  
8. 不购证除非分发扩大。  
9. 多方案必须过边界契合。  
10. 总册选代；ADR 宪法。  

---

## 25. 附录：关键路径

dream-skin.css · renderer-inject.js · themes/* · Run-ReleaseProbes · evidence/RUN-LOG · SECURITY · codesign-decision · dual-open · verify-install · cdp-url-guard · theme-catalog-budget · master-research-v2 · 本文 v3  

---

## 26. 附录：npm test 链

themes→store→adapter→deps→freshness→cdp-url→catalog-budget  

---

## 27. 附录：evidence 合同要点

status ran/skipped · conversationCovered · releaseCheckHints · 禁 vacuous conversation 勾选  

---

## 29. 用户旅程地图（体验债落点）

### 29.1 首次安装到第一次看见皮肤

1. 下载 zip / 运行 Install → **SmartScreen（UX-7）**  
2. 点开始菜单 Codex → FastLaunch → open  
3. 若点商店磁贴 → **裸启无皮肤（UX-1）**  
4. injector 注入 → 首页 hero/品牌  
5. 用户是否知道 F6/托盘/CLI 换肤（**教育缺口**）  

### 29.2 日常编码

1. 任务栏再点 → 聚焦而非重启（已优化）  
2. 长时间会话 → 对比度、气泡、动效性能（UX-4/6）  
3. 换肤 → 是否感到「换上了」（UX-2）  
4. 暂停皮肤 → 路径是否好找  

### 29.3 发版维护者

1. 改 CSS → publish → verify → probe conversation  
2. 主题 PR → 可读性清单（UX-3）  
3. 上游诱惑 → F4 不 promote  

旅程说明：**最大用户痛在 29.1 入口与 29.2 可读/反馈**，不是缺更多特效。

---

## 30. 视觉 token 速查（从 CSS 提炼，供 U1 落地）

| Token | 角色 | 调色建议 |
|-------|------|----------|
| --dream-accent | 品牌主色，驱动 mix | 主题 palette.accent |
| --dream-text / muted | 正文/次要 | 保对比 |
| --dream-surface* | 面板层级 | 勿与 text 过近 |
| --dream-sidebar | 左栏 | 与主区可区分 |
| --dream-line* | 分割 | 低对比线 |
| --dream-art-position | hero 焦点 | 避 composer |
| --dream-ambient-opacity | 氛围强度 | 性能敏感 |
| --dream-immersive-* | 沉浸渐变 | 会话慎加重 |
| --dream-shadow | 浮起 | 克制 |

明暗两套：默认 light root；`.dream-theme-dark` 重映射 canvas/text。  
**U1 文档应禁止**：在业务选择器里硬编码 `#fff` 绕过 token。

---

## 31. 主题质量门禁草案（U2）

### 31.1 必检

- [ ] text 与 surface 目视可辨  
- [ ] muted 不接近背景消失  
- [ ] accent 不导致按钮字不可读  
- [ ] 暗条/亮字或亮条/暗字自洽  
- [ ] 会话气泡区（若适用）正文可读  
- [ ] hero 不遮挡输入框（focusX/Y）  

### 31.2 可选脚本（二期）

估算 palette 相对亮度差；低于阈值 warn 不 fail（免误杀艺术主题）或 PR 需截图证明。

### 31.3 与 data-only

门禁只读 JSON 色值，不执行主题内代码——符合 schema 哲学。

---

## 32. 竞品体验切片（编码场景）

| 场景 | 上游常见 | Styler | 本仓今 | 改进方向 |
|------|----------|--------|--------|----------|
| 第一次打开 | 安装器引导强 | 管理器向导 | 依赖钉+文档 | U4 |
| 换背景 | 托盘选图 | Creator | 托盘/F6/CLI | U2 反馈 |
| 编码 1h | 看主题质量 | 可关装饰 | 去 blur 侧栏 | 保持 S1 |
| 演示录屏 | 强氛围 | 最强 | 11 主题 | 主题向 S2 可选 |
| 出问题 | restore 脚本 | 一键 restore | check-and-fix | 文案聚合 |

---

## 33. 方案深比：U3 托盘反馈实现形态

| 形态 | 描述 | 优 | 缺 |
|------|------|----|----|
| T1 气泡 BalloonTip | 系统托盘提示 | 原生 | Win 版本差异 |
| T2 短暂无焦点 OSD 窗口 | 自绘 | 可控 | 代码量大 |
| T3 仅日志 | 开发 | 用户不可见 | 不够 |
| T4 kick 响应写 state 字段 + 托盘菜单打勾 | 状态化 | 需点开菜单 | 中 |

**最佳先 T1 或菜单状态 T4**，避免 T2 工程膨胀。验收：apply 成功 2s 内可感知。

---

## 34. 方案深比：U4 首次提示触发条件

| 触发 | 优 | 缺 |
|------|----|----|
| 首次 install 后第一次 open | 准 | 升级用户看不到 |
| 检测到无 active-theme | 准 | 少见 |
| 检测到 process 无 debug 且从商店路径 | 直接 | 实现要稳 |
| 每 7 日一次 | 烦 | 否 |

**最佳：首次 open + 可「不再显示」注册表/文件标记**。

---

## 35. 与官方 Appearance 叠层决策树

```text
用户是否在设置里改了官方主题色？
  ├─ 否 → CDP 皮肤主导氛围
  └─ 是 → 代码高亮归官方；背景/壳归 CDP
        若冲突严重 → 托盘暂停皮肤 30s 验证
```

写入 usage，避免「两套主题谁赢」工单。

---

## 36. 内容生态与 UX

不做商店，但可：

- README 链 awesome  
- 主题 PR 模板含截图位（home+conversation）  
- 预设版权句（源图≠预览）  

这提升**感知质量**而不加攻击面。

---

## 37. 指标扩：体验

| 指标 | 采集 | 目标 |
|------|------|------|
| 裸启误用报告 | 工单/自述 | 降 |
| 换肤「没反应」报告 | 工单 | 降（U3） |
| 主题 PR 打回率（对比度） | 评审 | 可测门禁后稳 |
| conversation 证据率 | 发版 | 主版本 100% |
| kick 可感知成功 | 抽测 | 有反馈 |

---

## 38. 90 日体验路线

| 日 | 包 |
|----|----|
| 0–14 | U1+U2+U5+U6 体验-文档 |
| 14–45 | U3 或 U4 择一高杠杆 |
| 45–90 | U7 评估；主题截图规范；慎 U7 性能模式 |

---

## 39. 最终推荐行动序（v3）

1. 重跑 write-baseline（对齐 6173db8）  
2. 落地 U1 design-tokens.md  
3. U2 可读性清单写入 CONTRIBUTING  
4. U5 会话视觉检查行进 RELEASE-EVIDENCE  
5. 视痛点做 U3/U4  
6. 拒绝全局特效化与盲 promote  

---

## 40. 修订记录

| 日期 | 说明 |
|------|------|
| 2026-07-21 | v3 工程冻结 + UX/视觉方案库 + U 包 + 旅程/token/门禁扩写 |

*全文完。与 research 目录其他长文合计构成万字级知识库；选代以本文为准。*