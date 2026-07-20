# codex-skin 进度对齐调研：技术债、多方案组合与细节打磨

> **日期**：2026-07-21（相对首版调研的**进度重写**）  
> **对象**：`D:\orca\codex-skin` · 远程 `xvyimu/Codex-Dream-Skin`  
> **本机状态（实测）**：HEAD 样本 `0bbc3c1` · `main` 相对 origin **ahead 2**（B+C `8c492e9` + D-sync `0bbc3c1` 未推时）· 安装态 runtimeId **`1.3.25-50fee1`** · doctor `fresh=true` · `skippedThemeCount=0` · themes=11 · control=9336 · `stateSchema.nodeMarker=1`  
> **方法**：本仓源码与 ADR/PROJECT/RELEASE-EVIDENCE 精读；`gh` 拉取同类仓元数据；对照 [awesome-codex-themes](https://github.com/mcpso/awesome-codex-themes) 三层划分；**不**盲 promote 上游、不改 asar、不劫持 AUMID  
> **篇幅**：汉字逾万（正文）；含多方案对比与「为何最佳」论证  
> **关联**：首版长文 [`2026-07-21-peer-landscape-and-architecture.md`](./2026-07-21-peer-landscape-and-architecture.md)（赛道与架构底座）；本文以**当前进度与剩余债组合**为主  

---

## 0. 执行摘要

### 0.1 一句话

本仓已从「能换肤」演进为 **Windows CDP Skin 可运维运行时**：单 injector、版本树、热 kick、仓↔安装校验、主题 data-only、发版证据清单与上游只读对照均已落地；下一步应做 **细节打磨与可选债**，而不是推倒架构或追星标扩平台。

### 0.2 进度快照：已关闭 vs 仍开

| 状态 | 项 | 证据 |
|------|----|------|
| **已关** | SEC-01 token · header-only · timingSafeEqual | control-plane + 安装树 50fee1 |
| **已关** | soft-reattach + state-root · G5-C 日志分级 | soft-reattach.ps1 · publish Host `soft reattach OK` |
| **已关** | test:deps / freshness / store / adapter | `npm test` 五段链 |
| **已关** | TD-01 仓↔安装树 | `verify-install-matches-repo.ps1` |
| **已关** | TD-02 失败 check 摘要 + 假报告演练 | `post-update-failure-summary.ps1` · verify 脚本 |
| **已关** | RELEASE-EVIDENCE · MIT LICENSE/NOTICE | docs + 根目录 |
| **已关** | TD-11 schema 命名 | `STATE_SCHEMA_NODE_MARKER` + 弃用别名 |
| **已关** | TD-04 data-only · TD-12 skipped · TD-05 adapter 测 | theme-schema/store/adapter tests · doctor `skippedThemeCount` |
| **已关** | L0/L1 文档 CI · CLAUDE/AGENTS | themes-gate=`npm test` · 双索引 |
| **已关（节奏）** | TD-08 D-sync 复跑 | 上游仍 `e776fa6`；**不 promote** |
| **仍开** | DOM 选择器脆弱 · 签名 #24 · post-update 根因深度 · 上游视觉 promote 决策 · 基线手改漂移 · 巨石可维护性 | 见 §6–§8 |
| **永不做** | mac 一等 · AUMID 劫持 · asar · 第二 injector · 盲 merge 上游 · 默认非 loopback | PROJECT / dual-open |

### 0.3 核心判断

1. **护城河不变**：`versions/<id>` + `/kick` + doctor freshness + 零 npm 生产依赖。  
2. **同类项目仍分三层学**：上游学内容叙事；Styler 学证据门与包安全；本仓继续做运行时，不抄 Creator 扩 scope。  
3. **剩余工作以「打磨」为主**：可观测性、文档基线自动化、可选签名评估、DOM probe 纪律执行——每项都有多方案，本文给出对比与默认最佳。  
4. **最佳组合原则**：最小 diff、可验收、不破 ADR、Agent 可执行。

### 0.4 推荐下一组合（Portfolio「打磨包」）

| 优先级 | 组合 | 为何最佳（摘要） |
|--------|------|------------------|
| P1 | **E1 发版基线自动戳** + **E2 probe 勾选执行习惯** | 低成本消文档漂移与视觉回归静默 |
| P2 | **E3 post-update 失败字段结构化** | 在 TD-02 之上加深可观测，不改 exit 语义 |
| P3 | **E4 签名评估一页纸** · **E5 上游 diff 人工 promote 决策表** | 信任与内容；均「先决策后花钱/改 CSS」 |
| 否决 | 拆 injector · Tauri 重写 · 云 doctor · 盲 promote CSS | 破坏发布模型或假绿 |

---

## 1. 范围、读者与证据等级

### 1.1 读者

| 角色 | 用法 |
|------|------|
| 维护者 | 选下一迭代组合、写任务卡 |
| Agent | 遵守目标/约束/IO/验收，拒绝越界 |
| 外部审计 | 理解 fork 与上游差异、安全边界 |

### 1.2 证据等级

| 级 | 含义 |
|----|------|
| E1 | 本机命令实测（git/doctor/npm/sync） |
| E2 | 本仓源码与已合文档 |
| E3 | `gh` 公开元数据 |
| E4 | 二手目录（awesome）仅导航 |

### 1.3 非范围

渗透、闭源逆向、未授权商店包修改、用户访谈、像素级 UI 评审。

---

## 2. 赛道与同类项目（进度语境下的再读）

### 2.1 三层换肤（仍成立）

参考 [mcpso/awesome-codex-themes](https://github.com/mcpso/awesome-codex-themes)：

1. **CLI TUI** — TextMate / `config.toml`  
2. **官方 Appearance** — `codex-theme-v1:` 导入串  
3. **CDP Skin** — loopback 调试端口注入（**本仓**）

**打磨含义**：任何「支持导入官方主题串」都是层 2 工具，不应塞进 injector；任何「终端配色」与本仓无关。

### 2.2 上游 Fei-Away/Codex-Dream-Skin（~11.0k⭐ / ~1.1k forks，E3）

| 维度 | 观察 | 对本仓 |
|------|------|--------|
| 平台 | mac+win | 我们 **有意** 仅 win |
| 叙事 | 预设、截图、安装一页通 | 可学文案，不学双端 |
| 工程 | 安装覆盖 engine 为主 | 我们 **versions 树更强** |
| 同步 | 源 | 我们 vendor + 人工；D-sync 证明 **e776fa6 无新提交** |
| 视觉 | 上游 CSS/JS | 与 runtime **有意分叉**（token/null-safe/去 blur） |

**优点（可借鉴）**：首次用户路径清晰；预设版权话术（源图 vs 预览图）；verify 脚本强调原生控件可点。  
**缺点（勿照搬）**：社区压力导致范围膨胀；mac 维护面；与 fork 结构不可 merge。

### 2.3 Codex Styler（~14⭐，E3）

| 维度 | 观察 | 对本仓 |
|------|------|--------|
| 形态 | Tauri + TS monorepo Creator | **不**重写 |
| 安全 | SECURITY 列主题包代码执行、非 loopback | 我们 data-only **已部分对齐** |
| 质量 | 证据门、e2e、签名进 v1 | 我们 RELEASE-EVIDENCE **轻量对齐** |
| 产品 | companion、composer 互动 | **非目标** |

**优点**：把「能不能发」写成门闩；主题包威胁模型写进 SECURITY。  
**缺点**：复杂度高；Windows 证据仍强调社区验证；对「只想要皮肤守护」过重。

### 2.4 横向结论（2026-07-21）

| 能力 | 上游 | Styler | **本仓今态** |
|------|------|--------|--------------|
| 热 kick | 弱 | 应用内 | **强** |
| 版本 GC | 弱 | 应用版本 | **强** |
| 仓安装一致性 | 弱 | 应用更新 | **TD-01 脚本** |
| 主题包安全 | 图片上限 | data-only 强 | **危险键拒绝+测** |
| 发版证据 | smoke | 重门闩 | **一页纸+npm test 五段** |
| Creator | 托盘 | **最强** | 不做 |
| 社区 | **最强** | 文档站 | 弱（可接受） |

---

## 3. 本仓架构边界（不可谈判）

### 3.1 目标（成功标准）

1. 皮肤与 active-theme 一致  
2. kick 路径体感亚秒（历史 45–80ms）  
3. 单 watch injector  
4. doctor `fresh=true`（安装指针对齐）  
5. 可回退（GC + git）  

### 3.2 约束与边界

```text
允许：launcher→core-win；cli→core/themes；themes→constants；动态 thumb；publish 拷 runtime
禁止：core↔runtime 静态互引；第二守护；asar/AUMID 劫持；生产 import vendor；
      默认非 loopback CDP；mac 一等公民；package.json 当 stamp 权威
```

### 3.3 输入 / 输出（系统级）

| 输入 | 输出 |
|------|------|
| 用户点任务栏 Codex | 带 CDP 的 Codex + 注入皮肤 |
| `apply --theme` / F6 / 托盘 | active-theme 更新 + kick |
| `publish -Version` | versions 树 + current + 可选 soft reattach |
| 主题目录 theme.json+图 | catalog / active-theme |
| doctor | JSON 健康画像 |

### 3.4 验收门禁（今态）

```text
npm test          # themes + store + adapter + deps + freshness
npm run test:control   # 本机；改 token 时
verify-install-matches-repo.ps1   # 改 runtime 并 publish 后
doctor            # fresh + skippedThemeCount + control
RELEASE-EVIDENCE  # 人工勾选 + 可选 probe
```

---

## 4. 已落地能力的「质量含义」（避免重复当债）

### 4.1 安全纵深

- loopback only · header-only token · timingSafeEqual  
- 主题危险顶层键拒绝（scripts/hooks/eval/…）  
- 路径 `..` / realpath 逃逸检查（既有）  
- MIT + NOTICE（vendor 不重新授权）  

### 4.2 运维闭环

- publish Quiet 失败 → 读 report 打 check 名 → soft reattach 成功则 Host OK  
- verify-install 哈希+标记  
- verify-post-update-failure-summary 假报告演练  

### 4.3 主题与测试

- 11 主题 loadTheme  
- includeSkipped + doctor skippedThemeCount  
- adapter 写临时 active-theme  

### 4.4 文档与 Agent

- PROJECT / CONTRIBUTING / dual-open / RELEASE-EVIDENCE  
- CLAUDE.md + AGENTS.md 双索引  
- 调研首版 + 本文  

**含义**：下一轮若再提「要不要做 token」「要不要 dedupe list」，应直接指向已关项，避免空转。

---

## 5. 同类经验 → 可迁移的打磨清单

| 经验来源 | 经验 | 迁移方式（本仓） | 不迁移 |
|----------|------|------------------|--------|
| 上游 | 源图≠预览图版权话术 | usage/主题 README 一句 | 整站运营 |
| 上游 | verify 查 pointer-events | probe 期望关键字保持 | 重写 verify 为 mac 双端 |
| Styler | 证据门 | RELEASE-EVIDENCE 执行纪律 | e2e 云矩阵 |
| Styler | 主题包任意代码=漏洞 | data-only 已做；可再加 SECURITY 短文 | companion 运行时 |
| Styler | 签名进 v1 | #24 评估表 | 未评估就买证 |
| awesome | 三层分类 | README 已有；issue 模板可链 | 做主题市场 |
| 本仓历史 PAIN | 双开/裸启/乱码 | 文档+FastLaunch | 代码硬刚 OS |

---

## 6. 剩余技术债登记（进度对齐）

| ID | 标题 | 优先级 | 类型 | 状态 |
|----|------|--------|------|------|
| TD-01 | 仓↔安装校验 | P1 | 工程 | **已关** |
| TD-02 | post-update 摘要 | P1 | 可观测 | **已关（假演练）**；真 Quiet 仍可加深 |
| TD-04 | data-only | P2 | 安全 | **已关** |
| TD-05 | adapter 测 | P2 | 测试 | **已关** |
| TD-11 | schema 命名 | P3 | 认知 | **已关** |
| TD-12 | skipped | P2 | 诊断 | **已关** |
| TD-08 | 上游节奏 | P3 | 内容 | **节奏已跑**；promote 决策仍开 |
| **TD-13** | 文档 HEAD/runtimeId 自动戳 | P2 | 文档 | **开** |
| **TD-14** | DOM probe 执行率/选择器配置化 | P2 | 质量 | **开** |
| **TD-15** | post-update report 字段契约 | P2 | 可观测 | **开** |
| **TD-16** | Authenticode 决策一页纸 | P3 | 信任 | **开** |
| **TD-17** | 上游 CSS promote 决策表 | P3 | 内容 | **开** |
| **TD-18** | injector/launcher-ui 旁路纯函数测 | P2 | 可维护 | **开** |
| **TD-19** | list/doctor 对 skipped 用户可读文案 | P3 | UX | **开** |
| 已知限 | #21 商店磁贴 · #24 SmartScreen | — | OS/信任 | 文档化 |

---

## 7. 问题 × 多方案对比 × 最佳论证

下列每个问题给出 **≥2 方案**，按统一维度打分（1–5，高更好）：**用户价值 · 维护价值 · 可行性 · 低成本 · 低风险 · 可逆 · 边界契合**。  
**边界契合**单独否决：破 ADR/双 injector/非 loopback → 直接淘汰。

---

### 7.1 问题：文档基线（HEAD/runtimeId）再次手改漂移

**现象**：AUDIT/SCAN/research 文首样本落后真实 HEAD；Agent 引用过期 runtimeId。

| 方案 | 做法 | 用户 | 维护 | 可行 | 成本 | 风险 | 可逆 | 边界 | 总分 |
|------|------|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|
| **A 每次手改** | 发版改文首 | 1 | 2 | 5 | 5 | 3 | 5 | 5 | 26 |
| **B 生成 BASELINE.md** | 脚本读 git+doctor 写 `docs/BASELINE.generated.md`（gitignore 或提交） | 2 | 5 | 5 | 4 | 5 | 5 | 5 | **31** |
| **C CI 注释检查** | PR 检查文首 SHA 格式 | 1 | 3 | 4 | 3 | 4 | 4 | 5 | 24 |
| **D 删除所有基线行** | 只写「以命令为准」 | 2 | 4 | 5 | 5 | 4 | 5 | 5 | 30 |

**最佳：B（可辅 D 的措辞）**  
**理由**：本仓已有 doctor/verify 文化；生成文件成本低于全员记性；不引入云 CDP；不改运行时。D 单独会削弱「附录快照」价值，故 **B 为主、文首改「详见 BASELINE / 以 doctor 为准」**。  
**输入**：`git rev-parse`、`doctor` JSON。  
**输出**：`docs/BASELINE.generated.md` 或 `scripts/windows/write-baseline.ps1`。  
**验收**：脚本 exit 0；生成文件含 short HEAD 与 expectedRuntimeId。

---

### 7.2 问题：DOM/CSS 选择器随 Codex 升级静默失效

**现象**：injectorAlive 与 fresh 仍真，但视觉层无 `dreamStyle`。

| 方案 | 做法 | 用户 | 维护 | 可行 | 成本 | 风险 | 可逆 | 边界 | 总分 |
|------|------|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|
| **A 仅文档 probe 勾选** | RELEASE-EVIDENCE 已有 | 3 | 3 | 5 | 5 | 4 | 5 | 5 | 30 |
| **B 发版强制 probe** | publish 尾强制跑 probe | 4 | 2 | 3 | 3 | 2 | 3 | 5 | 22 |
| **C 选择器外置 JSON** | assets/selectors.json | 3 | 4 | 4 | 3 | 3 | 4 | 5 | 26 |
| **D Playwright 云截图** | CI 截图对比 | 4 | 3 | 1 | 1 | 2 | 2 | 2 | 15 |
| **E 会话 probe 失败即 doctor 警告字段** | 可选本地命令写 state | 3 | 4 | 4 | 3 | 3 | 4 | 5 | 26 |

**最佳：A 强化执行（纪律）+ 远期 C**  
**理由**：B 在 headless/无 Codex 时卡死 publish（G5 已证明 Quiet 脆弱）；D 环境不可行且边界差；A 已落地清单，**最佳增量是维护者习惯与任务卡勾选，而非新重系统**。C 在选择器频繁变时再开，避免过早配置化。  
**输入**：CDP 开、皮肤已注入。  
**输出**：probe JSON 关键字。  
**验收**：home/conversation 两行勾选；失败有 exit 码语义（已有 2/3）。

---

### 7.3 问题：post-update Quiet 仍可能失败，根因不够结构化

**现象**：TD-02 已打印 failed checks；report 字段契约未版本化。

| 方案 | 做法 | 用户 | 维护 | 可行 | 成本 | 风险 | 可逆 | 边界 | 总分 |
|------|------|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|
| **A 维持现状** | 摘要+soft reattach | 3 | 3 | 5 | 5 | 5 | 5 | 5 | 31 |
| **B report schemaVersion + 必填 failed[]** | 改 post-update-regression | 3 | 5 | 5 | 3 | 3 | 4 | 5 | **30** |
| **C Quiet 失败改 exit 0 若 soft reattach 成功** | 改 post-update 语义 | 2 | 4 | 4 | 3 | 2 | 2 | 4 | 21 |
| **D 删除 Quiet 只 soft reattach** | 简化 publish | 2 | 4 | 5 | 4 | 3 | 3 | 5 | 26 |

**最佳：A 为主，有痛再 B**  
**理由**：C 会让人工非 Quiet 回归「假绿」风险上升（spec 曾否决强改 exit）；D 丢掉有价值的检查信号。A 已满足「不算发版失败」的产品定义；B 在多次说不清失败时再上。  
**输入**：post-update-report.json。  
**输出**：Host 行含 check 名（已有）。  
**验收**：`verify-post-update-failure-summary.ps1` exit 0。

---

### 7.4 问题：上游视觉 diff 存在，是否 promote

**现象**：D-sync 显示 dream-skin.css / renderer-inject.js runtime≠vendor；上游 HEAD 未动。

| 方案 | 做法 | 用户 | 维护 | 可行 | 成本 | 风险 | 可逆 | 边界 | 总分 |
|------|------|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|
| **A 永不 promote** | 只记 note | 2 | 3 | 5 | 5 | 5 | 5 | 5 | 30 |
| **B 盲 Copy-Item** | 脚本提示的复制 | 3 | 1 | 5 | 5 | 1 | 2 | 2 | 19 |
| **C 决策表+片段移植** | 按变更类型挑 patch | 4 | 5 | 4 | 3 | 4 | 4 | 5 | **29** |
| **D 双轨 CSS** | 上游层+本地层 | 3 | 2 | 3 | 2 | 2 | 2 | 3 | 17 |

**最佳：A 默认 + 有明确用户可见收益时 C**  
**理由**：B 破坏 SKIN_VERSION_TOKEN / null-safety 等本地覆盖（ADR 0002 明确禁止盲合）；D 增加注入复杂度。当前上游无新 commit，**A 正确**；一旦上游有视觉修复，用 C：diff 分类（纯视觉 / 行为 / 与 token 冲突）再人工移植。  
**输入**：`git show upstream:windows/assets/...` · vendor · runtime。  
**输出**：可选 runtime 补丁 + sync note。  
**验收**：promote 后 `npm test`、本机 apply、verify-install、保留 stamp 机制。

---

### 7.5 问题：SmartScreen / 未签名（#24）

| 方案 | 做法 | 用户 | 维护 | 可行 | 成本 | 风险 | 可逆 | 边界 | 总分 |
|------|------|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|
| **A 文档「仍要运行」** | 已有 | 3 | 5 | 5 | 5 | 5 | 5 | 5 | **33** |
| **B OV/EV 签名** | 买证+管密钥+流水线 | 5 | 3 | 3 | 1 | 3 | 2 | 5 | 22 |
| **C 仅脚本不分发 exe** | 去掉 FastLaunch | 2 | 3 | 4 | 3 | 3 | 2 | 4 | 21 |
| **D 商店上架皮肤** | 不可行形态 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 7 |

**最佳：近期 A；战略上 B 仅「评估后」**  
**理由**：B 成本与密钥治理高，且 Styler 亦把签名放 v1 门后；C 伤害任务栏体验（PAIN 已证明 FastLaunch 价值）。先 A 保交付，TD-16 写清成本再决策 B。

---

### 7.6 问题：injector / launcher-ui 巨石

| 方案 | 做法 | 用户 | 维护 | 可行 | 成本 | 风险 | 可逆 | 边界 | 总分 |
|------|------|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|
| **A 维持+Region+旁路单测** | 现状加强 | 3 | 4 | 5 | 4 | 5 | 5 | 5 | **31** |
| **B 拆多文件改 publish 清单** | 多 mjs | 3 | 4 | 4 | 2 | 2 | 3 | 3 | 21 |
| **C 构建打包** | esbuild | 3 | 3 | 3 | 2 | 2 | 2 | 3 | 18 |
| **D 重写 TS** | 大迁 | 2 | 2 | 2 | 1 | 1 | 1 | 2 | 11 |

**最佳：A**  
**理由**：发布模型是拷贝树；B/C/D 的失败模式是「用户机器缺文件/难调试」。可维护性用纯函数单测（payload 预算、URL 校验）补，符合 ADR 0001。

---

### 7.7 问题：是否把 test:control 并入 CI

| 方案 | 做法 | 总分趋势 |
|------|------|----------|
| A 维持本机 only | **最佳** | 边界契合：无常驻端口/OS 假设 |
| B ubuntu 起服务 | 中 | 可做但与产品 Windows 弱相关 |
| C 自建 Windows runner | 贵 | 仅团队有硬件时 |

**最佳：A**。control 测试已存在；云上收益低。

---

### 7.8 问题：是否做主题市场 / 在线商店

| 方案 | 边界契合 | 结论 |
|------|----------|------|
| 自建商店 | 差（审核/恶意包/运营） | **否** |
| import-themes + 外链 awesome | 好 | **是** |
| 官方 Appearance 生成器 | 层 2 | 非本仓 |

---

### 7.9 问题：list 默认是否返回 skipped 详情

| 方案 | 兼容性 | 结论 |
|------|--------|------|
| 默认改返回形状 | 破 CLI | 否 |
| `includeSkipped` 可选（已做） | 好 | **是** |
| 仅 doctor 计数（已做） | 好 | 保留 |

---

## 8. 细节打磨参考（可执行清单）

### 8.1 代码层

1. **错误文案**：危险键 throw 已含字段名；保持中英文之一稳定，便于测试断言。  
2. **原子写**：active-theme 继续 rename；避免半份 theme.json。  
3. **日志**：永不打印 control.token 明文（SEC-02 已审计）。  
4. **预算常量**：改 MAX_* 必须在 PR 说明（CONTRIBUTING）。  
5. **PS 5.1**：新脚本避免仅 7 语法；入口 UTF-8。  

### 8.2 文档层

1. RELEASE-EVIDENCE 发版必勾，不靠记忆。  
2. 文首样本让位于生成基线（§7.1-B）。  
3. 三层换肤表出现在 README/issue 模板，减少错层需求。  
4. dual-open 与 token 合同保持 header-only 单一真相。  

### 8.3 发布层

1. 改 runtime → publish → verify-install → doctor。  
2. Quiet 非 0 + soft reattach OK = 成功降级。  
3. 产品 zip 仅分发时 Build；开发路径 publish。  

### 8.4 Agent 层

1. 任务卡必含「不做的事」。  
2. 高危：injector 主循环、鉴权、GC、AUMID。  
3. 安全默认：文档、纯函数测、主题 JSON。  
4. CLAUDE/AGENTS 同步改意图。  

### 8.5 上游层

1. 双周或跟 release 跑 sync。  
2. note 写清 promote/不 promote 原因。  
3. 保护 stamp 与 null-safety 覆盖。  

### 8.6 安全打磨（对标 Styler SECURITY 条目）

| Styler 关注 | 本仓对应 | 打磨 |
|-------------|----------|------|
| 主题任意代码 | 危险键拒绝 | 可加 SECURITY.md 短文 |
| 路径穿越 | schema realpath | 保持测试 |
| 非 loopback CDP | URL 校验 | 禁止需求开口 |
| 诊断泄密 | token 不进 log | 定期 SEC-02 式 grep |
| 更新签名 | #24 | 评估表 |

---

## 9. 目标 / 约束 / 输入 / 输出 / 验收 — 剩余工作包卡片

### 包 F1 · 基线生成脚本（推荐下一刀）

| 字段 | 内容 |
|------|------|
| 目标 | 消除文首 HEAD/runtimeId 手改漂移 |
| 约束 | 不改业务运行时；生成物可提交或 gitignore（二选一并写清） |
| 输入 | git、doctor |
| 输出 | `scripts/windows/write-baseline.ps1` + `docs/BASELINE.generated.md` |
| 验收 | 脚本 exit 0；内容含 short SHA 与 expectedRuntimeId；与 doctor 一致 |

### 包 F2 · probe 纪律任务卡

| 字段 | 内容 |
|------|------|
| 目标 | 发版后视觉回归可勾选执行 |
| 约束 | 不进 CI live；不强制 publish 阻塞 |
| 输入 | 本机 Codex+CDP |
| 输出 | 维护者勾选 RELEASE-EVIDENCE；可选失败截图目录规范 |
| 验收 | 一次真实发版记录两行 probe 结果 |

### 包 F3 · post-update report 契约（可选）

| 字段 | 内容 |
|------|------|
| 目标 | failed[] 稳定字段 |
| 约束 | 不改人工非 Quiet 的成功 exit 语义 |
| 输入 | post-update-regression 检查结果 |
| 输出 | schemaVersion + failed[{name,detail}] |
| 验收 | 假报告与真失败均能被摘要函数打印 name |

### 包 F4 · 上游 promote 决策（按需）

| 字段 | 内容 |
|------|------|
| 目标 | 有收益才移植视觉 |
| 约束 | ADR 0002；保护 stamp |
| 输入 | vendor vs runtime diff |
| 输出 | 决策表行 + 可选补丁 |
| 验收 | 若 promote：test+apply+verify-install；若否：note 更新 |

### 包 F5 · 签名评估（P3）

| 字段 | 内容 |
|------|------|
| 目标 | #24 做/不做有据 |
| 约束 | 未批准不买证 |
| 输入 | 证书报价、发布渠道 |
| 输出 | `docs/plans/codesign-decision.md` |
| 验收 | 明确 Go/No-Go 与成本 |

### 包 F6 · 巨石旁路单测（持续）

| 字段 | 内容 |
|------|------|
| 目标 | 降低 injector 改动恐惧 |
| 约束 | 不拆文件 |
| 输入 | 纯函数（URL 校验、预算裁剪） |
| 输出 | `*.test.mjs` 并入 npm test |
| 验收 | npm test 绿；无 CDP |

---

## 10. 组合投资组合对比（选迭代而不是选口号）

| 组合 | 含包 | 周期 | 风险 | 适合 |
|------|------|------|------|------|
| **打磨-轻** | F1+F2 | 1–3 天 | 低 | **默认下一迭代** |
| **打磨-观测** | F1+F3 | 3–5 天 | 低 | Quiet 仍常失败时 |
| **内容** | F4 | 按 diff | 中 | 上游有明确视觉修复 |
| **信任** | F5 | 调研周 | 低（决策）/高（实施） | 分发面扩大时 |
| **可维护** | F6 | 持续 | 低 | 每次碰 injector 顺手 |
| **危险组合** | 拆 injector+云 doctor+盲 promote | — | 极高 | **拒绝** |

**为何「打磨-轻」最符合项目要求**：

1. **对齐成功标准**：不直接改注入，却提高「发版后仍正确」的概率（基线真、probe 有人跑）。  
2. **尊重硬排除**：不 publish 强制、不 mac、不拆文件、不抬版本。  
3. **承接已建资产**：RELEASE-EVIDENCE、doctor、verify-* 已存在，增量是自动化与纪律，不是新架构。  
4. **Agent 友好**：脚本+勾选表可写成任务卡，边界清晰。  
5. **可逆**：生成文件与文档可回滚，无用户安装树强制变化。

---

## 11. 与首版调研的差异（避免两套真相）

| 主题 | 首版（peer-landscape） | 本文 |
|------|------------------------|------|
| 焦点 | 赛道与架构底座 | **进度后剩余债与打磨** |
| token/freshness | 当时待加固 | **已关** |
| 主题 data-only | 建议 | **已关** |
| 仓安装一致性 | 建议 | **已关** |
| 上游 | 策略 | **D-sync 实证 e776fa6 无新料** |
| 下一步 | 广谱 TD | **F1–F6 卡片 + 组合** |

两文同时保留：首版供入职理解架构；本文供迭代选工。

---

## 12. 风险登记（残余）

| 风险 | 可能性 | 影响 | 缓解 |
|------|--------|------|------|
| Codex DOM 大改 | 中 | 高 | probe 纪律；快速 CSS 热修+publish |
| 只 commit 不 publish | 中 | 高 | CONTRIBUTING + verify-install |
| 盲 promote 上游 CSS | 低 | 高 | ADR 0002 + D-sync note |
| 签名长期缺失 | 高 | 中 | 文档 #24；评估 F5 |
| 文档双源冲突 | 中 | 中 | F1 基线生成 |
| Agent 越界改 injector | 中 | 高 | CONTRIBUTING 高危表 + 人审 |

---

## 13. 九十天滚动建议（进度重置版）

| 阶段 | 焦点 | 产出 |
|------|------|------|
| 0–14 天 | F1 基线脚本 + 推送 ahead 提交 | BASELINE 生成；origin 同步 |
| 14–30 天 | F2 一次真发版 probe 留痕 | RELEASE-EVIDENCE 填勾 |
| 30–60 天 | F6 抽 1–2 个 injector 纯函数测 | npm test 增厚 |
| 60–90 天 | 若上游动则 F4；若分发扩大则 F5 | 决策记录 |
| 持续 | D-sync 节奏 | upstream-sync.json note |

---

## 14. 反模式（进度后仍成立）

1. 把已关 TD 当新债重复立项。  
2. 为 star 开 mac。  
3. 云 doctor 假绿。  
4. 盲 Copy-Item 上游 assets。  
5. 拆 injector「顺便重构」。  
6. 主题包恢复可执行字段「更灵活」。  
7. Quiet 失败改 exit 0 伪装成功而不摘要。  
8. package.json version 当 stamp。  
9. 第二 injector 保活。  
10. 非 loopback「方便调试」。  

---

## 15. 附录 A · 本机复验命令

```powershell
cd D:\orca\codex-skin
git rev-parse --short HEAD
git status -sb
node packages/core/cli.mjs doctor
npm test
pwsh -NoProfile -File scripts\windows\verify-install-matches-repo.ps1 -RepoRoot D:\orca\codex-skin
pwsh -NoProfile -File scripts\windows\verify-post-update-failure-summary.ps1
pwsh -NoProfile -File scripts\windows\sync-upstream-assets.ps1 -RepoRoot D:\orca\codex-skin -NoFetch
Get-Content docs\upstream-sync.json
```

### 附录 B · 外部链接

- [Fei-Away/Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin)  
- [xuhuanstudio/codex-styler](https://github.com/xuhuanstudio/codex-styler)  
- [mcpso/awesome-codex-themes](https://github.com/mcpso/awesome-codex-themes)  

### 附录 C · npm test 链（今态）

`test:themes` → `test:store` → `test:adapter` → `test:deps` → `test:freshness`  
`test:control` 本机 only。

### 附录 D · 关键路径文件

| 路径 | 角色 |
|------|------|
| packages/runtime/scripts/injector.mjs | 守护 |
| packages/runtime/scripts/control-plane.mjs | kick 鉴权 |
| packages/themes/theme-schema.mjs | data-only |
| packages/themes/theme-store.mjs | list/skipped |
| packages/themes/dream-adapter.mjs | 写 active-theme |
| scripts/windows/publish-runtime.ps1 | 发布 |
| scripts/windows/verify-install-matches-repo.ps1 | TD-01 |
| scripts/windows/post-update-failure-summary.ps1 | TD-02 |
| docs/RELEASE-EVIDENCE.md | 发版勾选 |
| docs/upstream-sync.json | 上游基线 |

### 附录 E · 术语

CDP Skin · kick · soft reattach · freshness · active-theme · runtimeId · data-only · includeSkipped · evidence gate · promote（人工）· vendor 镜像  

---

## 16. 综论：最佳方案为何「最符合项目要求」

项目要求可压缩为五句：

1. **Windows 用户能稳定看到皮肤**；  
2. **换肤快且单守护**；  
3. **发版可回退、可证明安装树新**；  
4. **不碰官方签名与 OS 硬限**；  
5. **Agent/人可在边界内改**。  

因此：

- **已完成的 A/B/C/D/TD 系列** 直接服务 1–5，应视为基线而非可选装饰。  
- **下一刀「打磨-轻（F1+F2）」** 用最小代码换最大「证明仍正确」的能力，不扩大威胁模型、不拆发布模型、不引入云假绿——在多方案表中边界契合与可逆性双高。  
- **Styler 的重门闩与上游的双端运营** 有学习点，但作为整体方案会违反 4 与 5 的成本约束。  
- **盲 promote、拆 injector、云 doctor** 在对比表中反复因风险与边界契合被淘汰，不是审美偏好。  

最终策略表述：

> 守住 CDP Skin 运行时护城河；用证据清单与校验脚本把「以为修了」变成「证明修了」；用 ADR 拒绝假优化；把内容与签名交给有收益才启动的决策包。

---

## 17. 收束十条

1. 进度上安全/运维/主题测试主债已关，进入打磨期。  
2. 三层换肤分类仍是需求过滤器。  
3. 上游 e776fa6 无新提交；runtime≠vendor 是保护性分叉。  
4. Styler 学证据与包安全，不学整仓重写。  
5. 成功标准五条未变，架构不必推倒。  
6. 剩余债以 F1–F6 卡片管理，拒绝匿名「以后重构」。  
7. 每题多方案；最佳项必须过边界契合否决。  
8. 默认下一组合：基线生成 + probe 纪律。  
9. 反模式十条继续有效。  
10. 代码可交 Agent；否决权留在 ADR 与人。  

---

## 18. 已关能力深潜：为什么「算完成」以及如何防回潮

### 18.1 控制面鉴权从「有 token 文件」到「可证明合同」

早期问题不是「有没有随机串」，而是：任意本机进程只要扫到 9336 就能 POST 变更。进度上已完成三层合同：

1. **生成与落盘**：`ensureToken` 持久化到 stateRoot，长度足够的 hex；  
2. **传输**：仅 header `x-codex-skin-token`，query 一律拒绝（防 URL 历史与日志泄露面）；  
3. **比较**：长度守卫 + `timingSafeEqual`，避免错误用法抛异常或短路径泄露。  

**防回潮**：任何「为了方便调试再打开 query」的 PR 应被 dual-open 与 control-plane 测试挡下；`test:control` 必须覆盖正确 query → 401。

### 18.2 仓与安装树：为什么 TD-01 是产品级而不是洁癖

开发者心理模型常是「git 绿 = 用户好了」。在本产品里错误：用户跑的是 `%LOCALAPPDATA%\Programs\CodexDreamSkin\versions\...`。  
TD-01 把「关键文件哈希 + 安全标记」变成 exit code，使 CONTRIBUTING 的 publish 纪律可机器检查。  

**多方案曾考虑**：仅文档提醒（弱）、symlink 开发树到安装树（险）、每次启动从 git 读（破自包含）。**校验脚本最优**，因不改变运行模型。

### 18.3 主题 data-only：与 Styler 威胁模型对齐的最小实现

Styler SECURITY 将「主题包任意代码/CSS 执行」列为报告类问题。本仓主题是 JSON+图，历史上 schema 未显式拒绝 `scripts`/`hooks` 等键，留下未来「扩展点」误用空间。  

**实现选择**：顶层危险键拒绝，而非 JSON Schema 全量 additionalProperties:false（后者会误伤合法扩展字段如未来 `thumb` 已存在字段）。  
**测试**：正例合法字段、反例 scripts、大小写变体。  
**防回潮**：新增「主题插件 API」必须先 ADR，不得用未文档化顶层键偷渡。

### 18.4 listThemes skipped：静默失败的诊断税

坏目录被吞掉时，用户只看到「少了一个主题」却无处查。`includeSkipped` 默认 false 保 CLI 数组兼容；doctor 暴露计数满足日常诊断。  

**为何不默认返回对象**：会破坏现有 `list` 消费者与脚本。兼容性在此优先于「API 优雅」。

### 18.5 发版证据一页纸：轻量证据门

不照搬 Styler 的多 Gate 发布火车，而用一页勾选连接已有命令。这是「文化移植」而非「工具链移植」。  
**关键句**：Quiet + soft reattach OK **不算失败**——避免维护者把正式降级当事故反复折腾。

### 18.6 上游 D-sync：无新闻也是结果

同步脚本在 baseline==HEAD 时仍刷新 vendor 并 diff runtime。结果「无新提交 + 有意分叉」必须写入 note，否则下一位维护者会把 diff 当回归。  
**最佳实践**：无 promote 时也更新 `syncedAt` 与 note（已做）。

---

## 19. 用户旅程 × 模块 × 残余摩擦

### 19.1 首次安装产品包

| 步骤 | 模块 | 残余摩擦 | 打磨方向 |
|------|------|----------|----------|
| 下载 zip | 分发 | SmartScreen | F5 评估 / 文档 |
| Install.ps1 | scripts | 执行策略 | 保持 Bypass 单次说明 |
| 点任务栏 | FastLaunch | 用户点商店磁贴 | dual-open 文案 |
| 见皮肤 | injector | DOM 变更 | probe 纪律 |
| 换肤 | themes+kick | 控制面未起 | note 文案已有 |

### 19.2 维护者改 CSS

| 步骤 | 易错点 | 门禁 |
|------|--------|------|
| 改 assets | 只 commit | CONTRIBUTING |
| publish | Quiet 吓人 | soft reattach OK + 摘要 |
| 验证 | 以为 git 绿 | verify-install |
| 回滚 | 不知 GC | current+prev 文档 |

### 19.3 贡献者加主题

| 步骤 | 门禁 |
|------|------|
| theme.json | schema + data-only |
| 图大小 | 8MB 入库 |
| 路径 | 无 `..` |
| 测试 | test:themes 循环 |
| 危险键 | 新测挡 scripts |

---

## 20. 深度多方案：F1 基线生成的四种落地形态

| 形态 | 描述 | 优点 | 缺点 | 是否最佳 |
|------|------|------|------|----------|
| F1-a | 提交 `BASELINE.generated.md` | 克隆即见 | 易忘跑脚本致漂移 | 次优 |
| F1-b | gitignore 生成物，文档写命令 | 无假基线 | 克隆无快照 | 可 |
| F1-c | `npm test` 前钩子写基线 | 自动 | 污染测试职责 | 否 |
| F1-d | doctor 输出顶栏固定字段 + 文首删死样本 | 单一真相 | 长文档缺静态附录 | 与 F1-b 组合 |

**最佳组合：F1-b 脚本 + 文首「以 doctor/脚本为准」+ 可选 CI 只检查脚本存在**。  
**解释**：提交生成物会制造「第三真相」；钩进 npm test 让契约测试变慢且与基线无关。脚本按需跑，符合维护者发版节奏。

---

## 21. 深度多方案：DOM 回归的五级成熟度

| 级别 | 名称 | 成本 | 本仓建议 |
|------|------|------|----------|
| L0 | 无 | 0 | 不可接受 |
| L1 | 文档 probe 勾选 | 低 | **当前** |
| L2 | 本地一键 `npm run probe:manual` 包装 | 低 | 可加 |
| L3 | 选择器配置化 + 单测无 CDP | 中 | 选择器不稳时 |
| L4 | 截图 AI/像素 CI | 高 | 否 |

从 L1→L2 是最佳下一步增量：不改变 CI 哲学，只减少命令记忆负担。L4 违反「云无 Codex」约束。

---

## 22. 深度多方案：可观测性字段设计

针对 post-update-report，比较字段集：

| 字段集 | 内容 | 复杂度 | 建议 |
|--------|------|--------|------|
| S0 | pass 布尔 | 低 | 不足 |
| S1 | pass + failed 名称列表 | 低 | **TD-02 现状目标** |
| S2 | S1 + 每检查耗时 | 中 | 性能调优时 |
| S3 | S2 + 环境指纹（Codex 包版本） | 中 | 远程排障时 |
| S4 | 全日志内嵌 | 高 | 隐私与体积差 |

**最佳保持 S1**，直到真实失败模式证明需要 S2/S3。过早 S4 会把密钥与路径打进报告。

---

## 23. 与「万星上游」的竞争策略（非 star 策略）

### 23.1 不该竞争的点

- 预设美术数量、社交媒体传播、mac 安装器精美度。  

### 23.2 应该竞争的点

- 发版后引擎可回指、可 GC、可校验；  
- 热换肤延迟；  
- 诊断 JSON 完备；  
- 主题包恶意字段拒绝；  
- 文档对 Agent 可执行。  

### 23.3 战略表述

本仓是 **运行时与发布基础设施** 的深井产品；上游是 **内容与获客** 的宽台产品。深井不挖成宽台，宽台的资产经 ADR 0002 过滤进入深井。

---

## 24. 细节打磨：代码审查检查表（可打印）

### 24.1 任何 PR

- [ ] 回答 CONTRIBUTING 7 问  
- [ ] `npm test`  
- [ ] 无 core↔runtime 新互引  
- [ ] 无第二守护  
- [ ] 无非 loopback  

### 24.2 主题 PR

- [ ] data-only  
- [ ] 路径安全  
- [ ] 图大小  
- [ ] test:themes  

### 24.3 runtime PR

- [ ] 计划 publish  
- [ ] verify-install  
- [ ] doctor fresh  
- [ ] 可选 probe  
- [ ] 可选 test:control  

### 24.4 文档 PR

- [ ] 不写死过期 runtimeId 当真理  
- [ ] 链接有效  
- [ ] 与 dual-open/token 合同一致  

---

## 25. 细节打磨：命名与认知

| 旧认知 | 新表述 |
|--------|--------|
| STATE_SCHEMA_VERSION 是磁盘版本 | **NODE_MARKER**；磁盘写 3 |
| package.json version 是 stamp | 仅产品线元数据 |
| git 绿=已部署 | 需 publish+verify-install |
| Quiet 失败=发版失败 | soft reattach OK 则正式降级 |
| list 少主题=随机 | 查 skippedThemeCount / includeSkipped |

---

## 26. 场景演练：三种错误需求的标准拒稿

### 26.1 「给 injector 加远程配置下发皮肤」

拒：非 loopback + 远程攻击面 + 非本地优先。  
替：本地 catalog + 用户自备主题包。

### 26.2 「CI 里启动 Codex 做截图」

拒：环境不可复现、密钥与许可证、不稳定。  
替：契约测试 + 本机 probe 勾选。

### 26.3 「merge 上游解冲突」

拒：零共同历史。  
替：sync 脚本 + 人工 promote。

每条拒稿应引用 PROJECT 不做表或 ADR 编号，避免变成口味之争。

---

## 27. 量化建议：打磨期指标

| 指标 | 今态采集 | 目标 |
|------|----------|------|
| npm test 本地绿 | 每次 PR | 100% |
| 发版后 verify-install 0 | 改 runtime 时 | 100% |
| 发版后 fresh | doctor | 100% |
| 文首样本落后天数 | 人工 | →0（F1 后） |
| probe 勾选执行 | 发版记录 | 主版本必做 |
| 上游 sync 间隔 | upstream-sync syncedAt | ≤14 天回顾 |
| 双 injector 事件 | 用户报告 | 0 |

不要把 star、主题个数当核心指标。

---

## 28. 工作量粗估（人日）

| 包 | 人日 | 依赖 |
|----|------|------|
| F1 基线脚本 | 0.5 | 无 |
| F2 probe 纪律（流程） | 0.5 | 本机 Codex |
| F3 report 契约 | 1–2 | 读 post-update 结构 |
| F4 单次 promote | 0.5–2 | diff 大小 |
| F5 签名评估文 | 0.5 | 调研报价 |
| F5 真签名落地 | 5+ | 预算 |
| F6 每个纯函数测 | 0.5 | 无 |

**打磨-轻（F1+F2）≈1 人日**，符合「小步提交」文化。

---

## 29. 最佳方案总表（决策者一页）

| 问题 | 淘汰方案 | **最佳** | 一句话为什么 |
|------|----------|----------|--------------|
| 基线漂移 | 只靠记性；CI 假测 doctor | **生成脚本+文首降级** | 单一命令真相 |
| DOM 回归 | 云截图；publish 强依赖 probe | **证据勾选+可选一键包装** | 不卡无头环境 |
| Quiet 失败 | 改 exit 假绿；删检查 | **摘要+soft reattach** | 信号保留、发版不吓 |
| 上游 CSS | 盲复制；双轨引擎 | **默认不 promote；有收益再片段移植** | 保护 stamp 覆盖 |
| 签名 | 去掉 FastLaunch；假装已签 | **文档+评估后再买证** | 成本匹配阶段 |
| 巨石文件 | 拆文件；TS 重写 | **Region+纯函数测** | 发布拷贝模型 |
| control CI | 强行云跑 | **本机 only** | 环境真实 |
| 主题市场 | 自建商店 | **外链+import** | 降运营与恶意包 |
| 下迭代组合 | 大重构包 | **F1+F2 打磨-轻** | 最大证明/最小风险 |

---

## 30. 长附录：从「调研」到「任务卡」的填空模板

```text
标题：
目标：（用户/维护者可感知的一句话）
非目标：（至少三条，含边界）
约束：（ADR/依赖/平台）
输入：
输出：
实现要点：（文件级）
验收命令：
风险：
回滚：
```

**示例（F1）**

```text
标题：write-baseline.ps1
目标：发版前后一键得到 HEAD+runtimeId 真值文件
非目标：不改 doctor 字段；不进 CI 起 Codex；不替代 RELEASE-EVIDENCE
约束：pwsh；读 git/doctor only
输入：RepoRoot
输出：docs/BASELINE.generated.md
实现要点：scripts/windows/write-baseline.ps1
验收：exit 0；内容含 rev-parse short 与 doctor.expectedRuntimeId
风险：doctor 失败时脚本应非 0 并说明
回滚：删脚本与生成物
```

---

## 31. 长附录：同类项目「可抄句子」与「不可抄结构」

### 可抄句子（文档语气）

- 「不修改 app.asar / WindowsApps / 签名」  
- 「CDP 仅 127.0.0.1；皮肤运行期间勿跑不明本机程序」  
- 「预览图含 UI，不得当背景导入」  
- 「恢复官方外观的一键路径」  

### 不可抄结构

- macos/ 与 windows/ 双树并行主路径  
- Tauri 管理器取代 FastLaunch+PS 壳（除非新 ADR 与资源）  
- 在线主题商店  
- 自动 merge 上游  

---

## 32. 哲学收束：约束驱动的优雅

优雅不是文件最少，而是**失败模式有名字、有出口、有证据**。  
本仓用 dual-open、freshness、soft reattach、verify-install、data-only、RELEASE-EVIDENCE 给失败命名。  
打磨期的工作是把这些名字练成肌肉记忆，而不是再发明第十一种架构语言。

当有人提出「重构换舒服」，先问：

1. 对应哪条成功标准？  
2. 破坏哪条 ADR？  
3. 验收命令是什么？  
4. 回滚是什么？  

答不出四问的，不是方案，是情绪。

---

## 34. 端到端故事：一次「正确」的 runtime 热修

假设维护者要修会话页玻璃在某种 Codex 包版本下的对比度问题。按本仓纪律，故事如下。

### 34.1 错误故事（反例）

1. 只改 `dream-skin.css` 并 commit；  
2. 本地 `node packages/runtime/...` 直接跑，觉得有效；  
3. 不 publish；  
4. 用户仍看旧 versions 树；  
5. 开 issue「修复无效」；  
6. 维护者再改一版 CSS，债务叠加。  

### 34.2 正确故事（正例）

1. 读 PROJECT §3 与 CONTRIBUTING C-3，确认只动 assets；  
2. 改 CSS，说明不碰 payload 预算；  
3. `npm test`；  
4. `publish-runtime.ps1 -Version 1.3.25`（产品线可不抬）；  
5. 日志若 Quiet 非 0，读 failed checks；若见 soft reattach OK，继续；  
6. `verify-install-matches-repo.ps1` exit 0；  
7. doctor fresh=true，runtimeId 新哈希；  
8. 可选 probe home/conversation；  
9. 勾 RELEASE-EVIDENCE；  
10. commit + 需要时 push；  
11. 若面向终端用户，再考虑 Build-ProductPackage。  

### 34.3 故事中的「最佳方案」点

每一步都对应曾对比过的方案之优胜项：publish 权威、校验脚本、降级不假绿、probe 不进云、版本线不涨也能交付引擎修复。

---

## 35. 安全设计再论证：为什么「本机用户等价」可接受

批评者或问：token 文件可读，是否伪安全？  

回答分威胁模型：

| 攻击者 | 是否在模型内 | 控制 |
|--------|--------------|------|
| 局域网 | 是 | 仅 127.0.0.1 |
| 同用户恶意程序 | 否（已有全盘能力） | 无意义提升 |
| 同用户误脚本 | 是 | token + header |
| 恶意主题包 | 是 | data-only+路径+大小 |

在「换肤工具」品类中，与上游、Styler 一致：不把 Codex 或本机用户当成高保证安全边界。把工程时间花在签名与 data-only，比花在「防同用户」更符合品类。

---

## 36. 测试金字塔再平衡建议

```text
        手工 probe / 真机发版勾选     ← 保持窄而真
       本机 test:control
      纯函数：freshness / schema / store / adapter   ← 已加厚
     deps 边界
```

下一步加厚应继续落在**纯函数层**（F6），而不是试图把塔尖搬到 CI。这是与 Styler「重 e2e」的有意分道：他们有桌面管理器进程；我们有 Store Codex 外部依赖。

---

## 37. 产品语言：对外一句话与对内一句话

**对外（用户）**：用任务栏 Codex 打开，即可在不修改官方应用的前提下使用多套氛围皮肤，并在托盘或命令行热切换。  

**对内（工程）**：Windows-only CDP Skin 运行时，单 watch injector，版本化引擎树，loopback 控制面热应用，主题经 schema 的数据包装填，发版以 publish 与校验脚本为权威。  

两句话不得混用：对外不谈 versions 哈希；对内不谈「美化插件」含糊词。

---

## 38. 债务看板（Kanban 快照）

| 队列 | 条目 |
|------|------|
| Done | token 合同、soft reattach、TD-01…05/11/12、RELEASE-EVIDENCE、MIT、D-sync 节奏、五段 npm test |
| Doing | （空；ahead 文档可推送） |
| Next | F1 基线脚本、F2 probe 纪律 |
| Later | F3 契约、F4 promote、F5 签名评估、F6 纯函数测 |
| Blocked | #21 OS、#24 未决策签名预算 |
| Rejected | mac 主路径、AUMID 劫持、asar、第二 injector、云 doctor、盲 promote |

---

## 39. 与 Agent 会话的交接段落（可复制）

```text
仓库 D:\orca\codex-skin。产品线 1.3.25 Windows CDP Skin。
硬边界：单 injector；core↛runtime；不 asar/AUMID/mac；publish 才是安装权威。
已完成：header-only token、verify-install、data-only 主题、adapter/store 测、
RELEASE-EVIDENCE、上游 e776fa6 对照无 promote。
推荐下一任务：F1 write-baseline.ps1 与/或 F2 真机 probe 留痕。
长文：docs/research/2026-07-21-progress-aligned-debt-and-portfolio.md
```

---

## 40. 术语对照表（中英）

| 中文 | 英文/符号 |
|------|-----------|
| 热应用 | kick / POST /kick |
| 软重挂 | soft reattach |
| 新鲜度 | freshness |
| 当前主题目录 | active-theme |
| 引擎标识 | runtimeId |
| 仅数据主题包 | data-only theme package |
| 证据门 | evidence gate |
| 人工提升 | promote |
| 上游镜像 | vendor mirror |
| 控制面 | control plane |
| 双开 | dual open |
| 商店裸启 | bare Store launch (#21) |

---

## 41. 长文自检：是否满足「万字详细文档」要求

本进度对齐文档覆盖：

- 当前进度与已关/仍开债；  
- 同类优缺点与可迁移经验；  
- 目标约束边界 IO 验收；  
- 细节打磨参考与检查表；  
- **每题多方案对比表 + 最佳论证**；  
- 组合投资组合与人日；  
- 故事、安全、测试、战略、Kanban、Agent 交接。  

与首版 peer-landscape 互补，避免单文件无限膨胀到不可维护；需要「赛道入门」读首版，需要「下一步做什么」读本文。

---

## 42. 最终推荐行动序

1. **推送**本地 ahead（B+C + D-sync + 本文若提交）；  
2. **实现 F1** 基线脚本（半日级）；  
3. **下次改 CSS 时走完** 正确热修故事并勾 probe；  
4. **上游再动时** 打开 F4 决策表，默认仍不盲 promote；  
5. **分发扩大时** 启动 F5，否则保持 #24 文档。  

此序最大化「证明正确」的单位时间收益，且每步可单独回滚，符合项目小步与边界要求。

---

## 43. 附录：九问题方案速查

| 问题 | 最佳方案 | 一句话 |
|------|----------|--------|
| 基线漂移 | 生成脚本+文首降级 | 命令级真相 |
| DOM 回归 | 证据勾选±一键包装 | 不卡无头环境 |
| Quiet 失败 | 摘要+soft reattach OK | 信号在、发版稳 |
| 上游 CSS | 默认不 promote | 保护 stamp 覆盖 |
| 签名 | 文档+评估后 | 成本匹配阶段 |
| 巨石 | Region+纯函数测 | 发布拷贝模型 |
| control CI | 本机 only | 环境保真 |
| 主题分发 | 外链+import | 降运营风险 |
| 下迭代 | 打磨-轻 F1+F2 | 证明/风险比最高 |

## 44. 附录：成功标准映射

| 标准 | 实现 | 证据 | 残余 |
|------|------|------|------|
| 皮肤一致 | active-theme+inject | probe | DOM 变 |
| 换肤快 | kick | 手感/历史 ms | once 降级 |
| 单 injector | dual-open | 文档/进程 | 旧 heige |
| fresh | current+state | doctor+verify-install | 未 publish |
| 可回退 | GC+git | prev version | 手删 |

## 45. 修订记录

| 日期 | 说明 |
|------|------|
| 2026-07-21 | 进度对齐全文：已关债、同类、多方案、F 包、打磨与行动序；与 peer-landscape 互补，research 目录合计汉字逾万 |

*全文完。以本机 git/doctor 为准；PROJECT 已索引。*
