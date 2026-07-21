# codex-skin 整合调研总册 v4（U3/U4 落地后 · 产品收口与下一刀）

> **日期**：2026-07-21  
> **origin HEAD**：`eff1170`（`main==origin/main`）  
> **工作区**：U3/U4 + baseline **已装本机、未 commit**（9 文件 / +298 行量级）  
> **安装态**：runtimeId **`1.3.25-c44358`** · doctor `fresh=true` · injectorAlive · themes=11 · skipped=0 · control=9336 · CDP 9335  
> **BASELINE.generated.md**：shortHead=`eff1170` · expectedRuntimeId=`1.3.25-c44358`  
> **前序总册**：peer-landscape · progress-aligned · integrated · **v2 frozen** · **v3 UX/视觉**  
> **方法**：E1 本机 doctor/publish/verify/apply · E2 仓源码/ADR/PROJECT · E3 同类公开元数据；不改 asar、不 AUMID 劫持、不盲 promote  
> **篇幅目标**：≥10000 汉字可执行总册（进度 + 市场 + 架构 + 规范 + 路线图 + API + 多方案评分）  
> **读法**：选代读 §0 / §11 / §18；五件套读 §12–§16；执行读 §19–§20

---

## 0. 执行摘要（3 分钟）

### 0.1 一句话

**Windows-only Codex Desktop CDP Skin**：单 watch injector、versions 翻页、loopback 热 kick、主题 data-only、publish+verify 为权威；v3 提出的 **U3/U4 已在本机落地**，下一刀从「能不能换上」转为 **「可证明交付 + 主题质量门 + 可选视觉克制升级」**。

### 0.2 进度仪表盘（相对 v3 的 delta）

| 域 | v3 时 | **现在（v4 冻结样本）** |
|----|-------|-------------------------|
| 工程主债 / 双 guard / token header-only | 完成 | **维持** · 装 `c44358` |
| U1 design-tokens / U2 可读性清单 / U5 evidence / U6 baseline 脚本 | 文档包已合 `dbc5982` | **维持** · baseline 已刷 `eff1170` |
| **U3 换肤成功轻反馈** | 待做 | **本机 SHIP**（prefs + 托盘/面板/CLI）· **入库中** |
| **U4 首次入口提示** | 部分存在 | **文案+文档收口** · flag 一次性 · **入库中** |
| **B 主题 text/surface 对比度门** | 仅清单 | **`assertReadableTextSurface` ≥4.5 进 validate** |
| conversationCovered 真留痕 | 完成 | 维持 RUN-LOG |
| 签名购证 | No-Go | 维持 |
| 上游 e776fa6 promote | 否 | 维持 |
| F6 窗内 catalog toast 与 1.2 证据对齐 | 历史通过 | **需再探**（renderer 三参 + catalog 注入位） |
| U7 性能模式 | 二期 | 仍二期 |

### 0.3 本机硬证据（E1）

```text
git:        main...origin/main @ eff1170 · dirty 9 files
install:    1.3.25-c44358 · current.json 指向 versions/1.3.25-c44358
doctor:     fresh=true · injectorAlive · themeCount=11 · skipped=0
verify:     ok=True（control-plane markers + required scripts hash）
apply:      genshin-night · kick watch 53ms · feedbackQueued=true
prefs:      ui-prefs.json 存在 · first-run-shown.flag 存在（升级机不再弹 U4）
npm test:   themes+store+adapter+deps+freshness+cdp-url+catalog-budget 全绿
```

### 0.4 战略判断

| 阶段 | 状态 |
|------|------|
| 能装、能开、能热换、能证明 | **完成** |
| 入口误解 / 换肤无感 | **U3/U4 代码关 · 交付未入库** |
| 主题可读性可强制 | **清单有 · 自动化弱** |
| 社区获客 / Creator IDE | **非本仓主线** |
| 签名消除 SmartScreen | **决策 No-Go** |

**结论**：不要开新架构；先 **commit +（可选）push** 把 U3/U4 变成可复现交付；下一产品刀优先 **主题可读性门（轻自动化）或会话视觉证据纪律**，而非重写 injector。

### 0.5 最佳下一组合（摘要）

| 组合 | 内容 | 推荐 |
|------|------|:----:|
| **交付-收口** | commit U3/U4 · 文档索引 · 托盘重启手测 | **是（默认）** |
| **质量-门禁** | theme 对比度脚本/清单硬化 · RELEASE-EVIDENCE 联勾 | 高杠杆次刀 |
| **体验-深** | U7 性能模式 · F6 toast 对齐 | 二期 |
| **危险** | 盲 promote · Companion · 第二 injector · 购证实施 | **否** |

---

## 1. 范围、读者、证据、非目标

### 1.1 读者

| 角色 | 先读 | 再读 |
|------|------|------|
| 维护者选代 | §0 · §11 · §18 | §19 执行 |
| Agent 开工 | §3 · §13 · §16 | CLAUDE + PROJECT |
| 新人 | §2 · §4 · §12 | usage · dual-open |
| 审计 / 安全 | §5 · §8 · §14 | SECURITY |
| 产品 / 市场 | §12 | §2 同类 |

### 1.2 证据等级

| 级 | 含义 |
|----|------|
| E1 | 本机 git / doctor / publish / apply / verify |
| E2 | 仓内源码与已入库文档 |
| E3 | GitHub 公开 star/README（时点快照） |
| E4 | 目录/命名推断 |

### 1.3 非目标（永久 / 本册）

- 修改 Codex `.asar` / WindowsApps / 代码签名绕过  
- 劫持商店 AUMID（#21 OS 硬限）  
- macOS 一等公民  
- 盲 `Copy-Item` 合上游 CSS  
- 第二套 watch injector  
- 主题商店 / 云 doctor / 默认非 loopback  
- 本册不做用户访谈与像素终审  

### 1.4 文档族谱（防迷路）

| 文档 | 焦距 | 是否仍读 |
|------|------|----------|
| peer-landscape | 赛道与同类 | 赛道细节 |
| progress-aligned | 债卡与组合史 | 历史卡片 |
| master-v2 | 工程四包后冻结 | 工程债回看 |
| **master-v3** | UX/视觉立项 | UX 方案库 |
| **master-v4（本文）** | **U3/U4 后进度 + 五件套 + 下一刀** | **选代入口** |
| PROJECT / ARCHITECTURE / ADR | 约束权威 | 实现前必对 |

---

## 2. 当前进度编写（以代码与本机为准）

### 2.1 产品线与版本

| 项 | 值 | 权威 |
|----|-----|------|
| 产品线 | 1.3.25 | ADR 0003 · publish `-Version` |
| 安装 runtimeId | 1.3.25-c44358 | current.json / doctor |
| origin 提交 | eff1170 | git |
| 未入库变更 | U3/U4 等 9 文件 | git status |

**纪律**：产品线号不因 UX 小改自动抬升；runtime 后缀随 publish 哈希变。

### 2.2 已关闭工程债（勿当仍开）

- control-plane：**header-only** token + `timingSafeEqual`；query 401  
- soft reattach：`--theme-dir` + `--state-root`；Quiet 失败 → 摘要 + soft reattach OK  
- TD verify-install / post-update report schemaVersion=1  
- 主题 data-only 危险键拒绝 · listThemes includeSkipped · doctor skippedThemeCount  
- F1 baseline 脚本 · F2 probe 留痕 · conversationCovered 防 vacuous  
- F4 上游 **不 promote** · F5 签名 **No-Go 购证**  
- F6 cdp-url-guard · catalog-budget · 双 guard 已装  
- SECURITY.md · MIT LICENSE · RUN-LOG  

### 2.3 UX 包状态

| ID | 名 | 状态 |
|----|-----|------|
| U1 | design-tokens.md | **已合** origin |
| U2 | CONTRIBUTING 可读性清单 | **已合** origin |
| U3 | 换肤成功轻反馈 | **本机 SHIP · 未 commit** |
| U4 | 首次入口提示 | **收口 SHIP · 未 commit** |
| U5 | 会话视觉进 RELEASE-EVIDENCE | **已合** origin |
| U6 | baseline 刷新纪律 | **脚本有 · 本机已刷** |
| U7 | 性能模式 | **未立项实施** |

### 2.4 U3 实现要点（E2）

| 构件 | 路径 | 行为 |
|------|------|------|
| prefs | `%LOCALAPPDATA%\CodexDreamSkin\ui-prefs.json` | `applyBalloonEnabled` 默认 true |
| API | `Get/Set-CodexSkinUiPrefs` · `Test-CodexSkinApplyBalloonEnabled` | launcher-ui.ps1 |
| 成功气泡 | `Show-CodexSkinApplyFeedback` | Success 尊重 prefs；错误类仍可走 UserFeedback |
| 托盘 | tray-dream-skin.ps1 | 切换 → kick → 气泡；菜单「换肤气泡：开/关」 |
| 面板 | switch-theme-ui.ps1 | Show-StatusBalloon 尊重 prefs |
| CLI | cli.mjs apply | 非阻塞 spawn show-feedback · `feedbackQueued` |
| 文档 | usage.md · CHANGELOG Unreleased | 可关路径写明 |

**验收已观测**：`apply --theme genshin-night` → kick ok · `feedbackQueued: true`。

### 2.5 U4 实现要点（E2）

| 构件 | 路径 | 行为 |
|------|------|------|
| flag | `first-run-shown.flag` | 存在则不再显示 |
| 引导 | `Show-CodexSkinFirstRunGuide` | open 健康路径调用 |
| 文案 | 任务栏 Codex · **勿商店磁贴** · 换肤入口 · 修复 | 强化 #21 诚实预期 |
| 约束 | **不**劫持 AUMID | G4-C 永久否决 |

**注意**：本机已有 flag → 升级用户默认看不到 U4；验收需临时删除 flag。

### 2.6 残留与观测缺口

1. **git 未 commit** → 他机/明日会话可能丢叙事  
2. **托盘进程**可能仍跑旧脚本 → 需退出托盘再 open  
3. **F6 窗内 toast**：1.2 有 cycleTheme 证据；当前 renderer-inject 状态对象偏 ensure/cleanup，catalog 由 injector 注入第四参位——需 E1 再探是否回归  
4. **主题对比度**仍靠清单，无 CI 数字门  
5. **SmartScreen #24** 仍摩擦（决策不购证）  

---

## 3. 目标 · 约束 · 边界 · 输入输出 · 验收标准

### 3.1 产品目标（不变）

1. Codex 运行时皮肤与 active-theme 一致  
2. kick 热路径体感亚秒（实测数十 ms 级）  
3. 任意时刻 **一条** watch injector  
4. `injectorPathFreshness.fresh=true`  
5. 可回退（GC 保留 current+上一版 · git 可审）  

### 3.2 UX 目标（v3 提案 · 部分已达）

6. 新用户理解「钉任务栏 Codex、勿商店磁贴」—— **U4 路径**  
7. 换肤后 2s 内可感知成功—— **U3 路径**  
8. 会话正文可读—— **U2 清单 · 待硬化**  
9. 失败可解释（中文 note / doctor / soft reattach）—— **已有**  

### 3.3 硬约束

| ID | 约束 |
|----|------|
| C1 | 单 watch injector |
| C2 | core ↔ runtime **禁止**静态互引 |
| C3 | 主题只经 packages/themes + themes/ |
| C4 | 版本只认 publish-runtime.ps1 -Version |
| C5 | 上游只 vendor + 人工 promote |
| C6 | 默认 loopback only |
| C7 | 不改 asar / 不 AUMID 劫持 |
| C8 | 新 runtime 小文件：Copy-Item 清单 + verify Required 同 PR |
| C9 | conversation 勾选须 conversationCovered=true |

### 3.4 边界（做 / 不做）

| 做 | 不做 |
|----|------|
| CDP 注入氛围层 | 改官方包身份 |
| 托盘 / F6 / CLI / 换肤面板 | 第二守护 |
| 控制面 /kick | 默认非 loopback API |
| publish 自包含 versions | 自动 merge 上游 |
| 文档与 Agent 卡 | 云端全量 doctor |

### 3.5 输入 / 输出（系统级）

| 输入 | 输出 |
|------|------|
| 用户点任务栏 Codex | FastLaunch → open → watch + 托盘 + 可选 first-run |
| active-theme 变更 | injector 热 apply /kick |
| theme.json + 图 | 校验后 catalog / active |
| control.token + POST /kick | 会话 CSS 更新 |
| publish -Version | versions/\<id\> + current.json |
| ui-prefs.applyBalloonEnabled | 是否弹 U3 成功气泡 |

### 3.6 验收标准模板

```powershell
cd D:\orca\codex-skin
npm test
node packages/core/cli.mjs doctor          # fresh=true, injectorAlive
pwsh -File scripts/windows/verify-install-matches-repo.ps1 -RepoRoot D:\orca\codex-skin
node packages/core/cli.mjs apply --theme genshin-night   # kick.ok · feedbackQueued
# U3 关：托盘关气泡后再 apply，应无成功气球，菜单 ✓ 仍更新
# U4：删 first-run-shown.flag 后 open，应一次性引导
# 会话发版：Run-ReleaseProbes + conversationCovered=true
```

---

## 4. 同类项目经验（优缺点 · 可迁移）

### 4.1 三层换肤（学错对象是最大浪费）

| 层 | 机制 | 代表 | 与本仓 |
|----|------|------|--------|
| CLI TUI | TextMate / config.toml | 官方 32 套 | **无关** |
| 官方 Appearance | theme JSON 串 | DexThemes 等 | **互补** |
| **CDP Skin** | remote-debugging-port 注入 | DreamSkin / Styler / **本仓** | **主战场** |

### 4.2 Fei-Away/Codex-Dream-Skin（上游 · ~11k⭐）

| 维 | 优 | 缺 | 本仓策略 |
|----|----|----|----------|
| 获客 | 截图与叙事强 | 工程分叉 | 学话术不 merge |
| 安装 | 一页通 | versions 弱 | 我们 versions 强 |
| 视觉 | 社区预设多 | 质量参差 | 11 主题 + schema |
| UX | 托盘换图直觉 | 双端复杂 | Windows only 深做 |

### 4.3 xuhuanstudio/codex-styler（~14⭐ · Apache-2.0）

| 维 | 优 | 缺 | 本仓策略 |
|----|----|----|----------|
| Creator | 最强 | 重 | **不抄整仓** |
| 证据门 | 强 | 成本高 | 轻量 PROBE 已对齐 |
| data-only | 模型清晰 | — | 已硬边界 |
| Companion | 趣味 | 干扰编码 | 默认不做 |

### 4.4 awesome-codex-themes

学：**三层分类**进 README/usage；不学：自建商店。

### 4.5 可迁移原则（跨项目）

1. **可逆**：暂停/恢复官方外观  
2. **不挡字**：pointer-events + 对比度  
3. **首触达清晰**：钉哪颗 · 勿商店磁贴  
4. **失败可解释**：doctor / evidence / soft reattach  
5. **主题=数据**：作者不写脚本  
6. **仓≠安装态**：改 runtime 必 publish  
7. **诚实 OS 硬限**：#21 #24 不装成 bug  

---

## 5. 架构优化（维持四层 · 局部加深）

### 5.1 现行四层（权威映射）

```text
L1 交互   launcher · FastLaunch · 托盘 · F6 · CLI 用户面 · 换肤面板
L2 调度   cli.mjs · launcher-ui · control-plane
L3a 状态  state.json · current.json · active-theme · paused · control.* · ui-prefs · first-run flag
L3b 主题  packages/themes · themes/*
L4 执行   runtime injector · assets · CDP · catalog budget
```

### 5.2 本轮架构增量（U3/U4）

| 增量 | 落点 | 原则 |
|------|------|------|
| ui-prefs | L3a 文件 | 用户 UX 开关，不进主题 schema |
| ApplyFeedback | L1/L2 共享 helper | 成功可关；错误不可被「安静」吞没 |
| CLI feedbackQueued | L2 非阻塞 | 不挡 kick 返回 |
| tray kick | L1→L2 control | 与 switch-theme 同路径 |

**未改变**：注入算法、payload 预算常量、core↔runtime 边界。

### 5.3 优化建议（按风险排序）

| 优先级 | 建议 | 风险 | 收益 |
|--------|------|------|------|
| P0 | commit U3/U4 交付 | 低 | 可复现 |
| P1 | 主题可读性轻脚本 | 低 | 质量门 |
| P1 | F6/catalog E1 复测 | 低 | 防回归 |
| P2 | launcher-ui 切分（仅当真痛） | 中 | 可维护 |
| P3 | U7 性能 token | 中 | 弱机 |
| 否 | 拆 injector 微服务 | 高 | 假架构 |

### 5.4 明确否决的「架构优化」

- monorepo 炫技重写 / Nest / 微服务  
- Tauri Creator 整仓  
- 第二 injector「保险」  
- 默认开放非 loopback「方便调试」  
- 把业务修进 vendor/  

---

## 6. 技术债清单（2026-07-21）

### 6.1 已关（记录防回流）

见 §2.2；G1–G5 residual 组合已关；G4-C AUMID 永久否决。

### 6.2 仍开 / 新开

| ID | 债 | 严重度 | 建议 |
|----|-----|--------|------|
| D-GIT | U3/U4 未 commit | 高（交付） | **交付-收口** |
| D-TRAY | 旧托盘进程可能无新菜单 | 中 | 退出托盘 relaunch |
| D-F6 | 窗内 cycleTheme/toast 与历史证据 | 中 | E1 probe |
| D-CONTRAST | 可读性仅清单 | 中 | 轻脚本 |
| D-SIGN | SmartScreen #24 | 低（已决策） | 维持文档 |
| D-DOM | Store 改 class | 长期 | fixture + adaptive probe |
| D-LOC | launcher-ui ~1.1k+ 行 | 低 | 痛时再拆 |
| D-STAR | 远程 0 star 叙事 | 产品 | 非工程阻塞 |

### 6.3 债管理原则

- 债卡必须带 **不做清单**  
- 关闭债写 CHANGELOG / handoff，避免重复开工  
- 安装空窗类债（漏 Copy-Item）优先级高于「再抽函数」  

---

## 7. 细节打磨参考

### 7.1 文案

- 统一「任务栏 Codex」「不要微软商店磁贴」  
- kick 失败 note 短、可行动（先 open / restore / 一键修复）  
- SmartScreen：更多信息 → 仍要运行（非安装失败）  
- soft reattach OK = 正式降级，非发版失败  

### 7.2 视觉（S1 工具优先）

| 方向 | 说明 |
|------|------|
| S1 默认 | 编码优先：侧栏可读、慎 blur、accent 驱动 |
| S2 可选 | 演示向氛围主题，不改默认 |
| token | 改 CSS 变量优先于硬编码色 |
| 会话 | 改 bubble 相关必 conversationCovered |

### 7.3 主题作者

- palette 语义固定（见 design-tokens）  
- art focus 不压 composer  
- thumb 服从 catalog 预算（entries/bytes/member）  
- 无 scripts/hooks 顶层键  

### 7.4 无障碍（务实）

- 不宣称宿主 DOM WCAG 全站  
- 主题门禁关注 text/surface  
- 状态不只靠颜色（✓ 菜单、托盘 tip 文案）  

### 7.5 性能

- catalog 预算已测  
- open 路径 thumbs 6h 节流  
- U7：弱机降 ambient（二期）  

---

## 8. 用户体验升级优化（旅程）

### 8.1 首次安装 → 第一次见皮肤

1. zip / Install → **可能 SmartScreen（#24）**  
2. 钉任务栏 Codex → FastLaunch  
3. 若点商店磁贴 → **裸启（#21）** · U4 教育 + reattach  
4. injector 注入 → hero/品牌  
5. U4 一次性：入口 + 换肤 + 修复  

### 8.2 日常编码 1h

1. 再点任务栏 → 聚焦  
2. 对比度 / 动效是否烦 → S1 + 未来 U7  
3. 换肤 → U3 气泡或菜单 ✓  
4. 暂停皮肤 → 托盘可逆  

### 8.3 换肤路径对比

| 路径 | 反馈 | prefs |
|------|------|-------|
| 换肤面板 | 文案 + 气球 | 尊重 |
| 托盘切换 | kick + 气球 + tip | 尊重 |
| CLI apply | JSON note + 可选气球 | 尊重 |
| F6 | 窗内 toast（若可用） | 历史行为 |

### 8.4 故障体验

| 现象 | 用户动作 |
|------|----------|
| 无皮肤 | 任务栏 Codex / 一键修复 |
| 商店裸启 | 换钉 · 勿重装皮肤 |
| apply 无气球 | 查换肤气泡开关 / ui-prefs |
| 想再看 U4 | 删 first-run-shown.flag |

---

## 9. 视觉风格立场

### 9.1 品牌层 vs 内容层

- **品牌/氛围**：CDP 皮肤（背景、accent、侧栏氛围）  
- **内容/高亮**：可与官方 Appearance 叠层；冲突时托盘暂停 30s 验证  

### 9.2 默认视觉宪法（S1）

1. 工具优先于壁纸秀  
2. 对比度优先于玻璃  
3. 动效可选、默认可关或克制  
4. 主题差异靠 palette + art，不靠危险脚本  

### 9.3 与 design-tokens 关系

`docs/design-tokens.md` 为调色 SSOT 文档面；实现仍以 `dream-skin.css` + theme palette 为准。改 token 文档不替代手测会话。

---

## 10. 安全与威胁模型（摘要）

| 攻击者 | 在范围 | 控制 |
|--------|--------|------|
| 远程 LAN | 是 | 仅 127.0.0.1 · URL guard |
| 同用户误脚本 | 是 | header token · 拒 query |
| 同用户恶意 | 否 | 已有用户权限 |
| 恶意主题包 | 是 | data-only · 路径 · 图尺寸 |
| npm 供应链 | 低 | 零 prod 依赖 |

详见 `docs/SECURITY.md`。

---

## 11. 多方案对比评分（当前问题）

### 11.1 问题定义

**当前主问题**不是「能不能换肤」，而是：

1. **交付完整性**：U3/U4 是否进入 git 历史  
2. **体验闭环是否可复制**：他机会否复现 prefs/气泡  
3. **下一质量杠杆**：主题可读 / 会话证据 / F6  
4. **是否错误扩张**：Creator、mac、签名采购  

### 11.2 评分维度（1–5）

| 维 | 含义 |
|----|------|
| 用户价值 | 降误用/无感投诉 |
| 维护成本 | 越低越好（分高=成本低） |
| 边界契合 | 符合 C1–C9 |
| 可逆性 | 可回退 |
| 证据可证 | 可 doctor/probe/测 |
| 风险 | 越高分=风险越低 |

Σ 满分 30。

### 11.3 方案池

| ID | 方案 | 描述 |
|----|------|------|
| A | **交付-收口** | commit U3/U4+docs+baseline；可选 push；托盘 relaunch 手测 |
| B | **质量-门禁** | 主题对比度/可读脚本或硬化 CI 钩 + RELEASE-EVIDENCE 联勾 |
| C | **F6-对齐** | 复测 cycleTheme/toast；缺则补 renderer catalog 路径 |
| D | **U7-性能** | 弱机降装饰 token |
| E | **上游 promote** | 整文件合 e776fa6 CSS |
| F | **购证签名** | OV/EV 落地 |
| G | **Styler 化** | Creator/companion 大扩 |
| H | **只文档不动码** | 再写一万字不 commit |

### 11.4 评分表

| 方案 | 用户 | 维护 | 边界 | 可逆 | 证据 | 风险低 | **Σ** |
|------|:----:|:----:|:----:|:----:|:----:|:------:|:-----:|
| **A 交付-收口** | 5 | 5 | 5 | 5 | 5 | 5 | **30** |
| **B 质量-门禁** | 4 | 4 | 5 | 5 | 5 | 5 | **28** |
| **C F6-对齐** | 4 | 3 | 5 | 4 | 4 | 4 | **24** |
| **D U7-性能** | 3 | 3 | 5 | 4 | 3 | 4 | **22** |
| **E promote** | 2 | 2 | 2 | 2 | 2 | 1 | **11** |
| **F 购证** | 3 | 1 | 4 | 3 | 2 | 2 | **15** |
| **G Styler 化** | 3 | 1 | 1 | 1 | 2 | 1 | **9** |
| **H 只文档** | 1 | 5 | 5 | 5 | 1 | 5 | **22** |

### 11.5 为何 A 最佳且最符合项目

1. **符合「先验证后合并」**：代码已本机 publish+verify+apply 证明，缺的是 **git 可复现**。  
2. **零新架构风险**：不碰 injector 算法、不碰 AUMID、不购证。  
3. **解锁后续**：B/C 应基于已入库的 U3/U4 prefs 语义，避免分叉工作区。  
4. **handoff 诚实**：记忆与远程不一致是协作第一毒药。  
5. **H 得分虚高**：维护「轻松」但用户价值与证据差；违反本轮「必须可执行」意图。  
6. **E/G** 直接撞 ADR 与编码场景。  
7. **F** 决策卡已 No-Go，重开需触发条件。  

**组合推荐**：默认 **A**；若一次做两刀 → **A+B**；F6 客诉强 → **A+C**。

### 11.6 组合投资组合

| 名 | 含 | 周期 | 推荐 |
|----|----|------|:----:|
| **交付-收口** | A | 0.5h–2h | **默认** |
| **交付+质量** | A+B | 1–2 日 | 主题 PR 多时 |
| **交付+F6** | A+C | 1 日 | F6 回归时 |
| 体验-深 | +D | 2+ 日 | 二期 |
| 停 | H / E / G / F | — | 否 |

---

## 12. 市场需求调研报告

### 12.1 市场定义

**可服务市场**：已安装 OpenAI Codex Desktop（Windows Store/包）并愿意用 **非官方 CDP 皮肤** 的个人开发者与小团队。  
**非市场**：要官方 Appearance 导入串的用户（应导层 B）；要 CLI 主题的用户（层 A）。

### 12.2 需求层次

| 层 | 需求 | 强度 | 本仓响应 |
|----|------|------|----------|
| 功能 | 背景/氛围/多主题 | 高 | 11 主题 + kick |
| 可靠 | 更新后不丢皮肤 | 高 | soft reattach · post-update |
| 信任 | 不改官方包 | 高 | SECURITY · 不 asar |
| 入口 | 第一次找对钉 | 高 | U4 · dual-open |
| 反馈 | 换上了吗 | 中高 | **U3** |
| 美观 | 演示级 | 中 | 主题库 · 不默认 S2 |
| 工具链 | Creator | 中低 | 不做 IDE |
| 跨平台 | mac | 低（本仓） | 永久非目标 |

### 12.3 竞品与替代

| 替代 | 满足 | 缺口 |
|------|------|------|
| 不用皮肤 | 零风险 | 无氛围 |
| 官方 Appearance | 安全 | 无壁纸级 |
| 上游 DreamSkin | 品牌强 | 本机工程/版本树 |
| Styler | Creator | 重 · 小众 |
| 本仓 | 守护+多主题+证据 | 叙事/star 弱 |

### 12.4 定价与商业

当前：**个人工具 / fork 维护**，非 SaaS。签名证书是成本中心非收入。结论：**不靠订阅驱动架构**。

### 12.5 风险与合规感知

- 用户担心「会不会封号/破坏安装」→ 文档强调不改 asar、仅 loopback  
- 企业环境 SmartScreen → #24 诚实  
- 主题版权图 → 贡献规范提醒源图≠可再分发  

### 12.6 市场结论

1. 需求真实但 **窄且 Windows 偏置**（与边界一致）。  
2. 增长靠 **可靠与诚实**，不靠扩平台。  
3. U3/U4 直接打「误用/无感」这两类工单，是正确产品刀。  
4. 下一市场感提升：README 三层图 + 主题截图规范，而非新守护。  

---

## 13. 架构设计文档（浓缩权威）

### 13.1 系统上下文

```text
[用户] → FastLaunch/Lnk → open-codex-dream-skin.ps1
                         → watch injector (CDP 9335)
                         → control-plane 9336
[CLI/托盘/面板] → write active-theme → POST /kick
[Codex Electron] ← CSS/JS evaluate（氛围层）
```

### 13.2 包职责

| 包 | 职责 | 禁止 |
|----|------|------|
| core | 发现/CDP 客户端/CLI/doctor/kick 编排 | 写 CSS 内容 |
| themes | schema/store/adapter | CDP |
| runtime | injector/assets/control-plane | 被 core 静态 import |
| core-win | PS 共享库 | 业务散落路径 |
| apps/launcher | 薄入口 | 复制大段逻辑 |
| vendor/dreamskin | 上游镜像 | 生产 import（kick once 例外见 dual-open） |

### 13.3 状态文件

| 文件 | 含义 |
|------|------|
| current.json | 安装 runtime 指针 |
| state.json | schema 3 · pid/port/browserId |
| control.port / control.token | 控制面 |
| active-theme/ | 当前皮肤 |
| themes/ | catalog |
| paused | 暂停 |
| ui-prefs.json | UX 开关（U3） |
| first-run-shown.flag | U4 |

### 13.4 关键序列：apply

1. listThemes 解析 id  
2. writeActiveThemeFromHeige  
3. touchThemesCatalog  
4. kickThemeInjectNow → POST /kick 或 --once 降级  
5. （U3）queueApplyFeedbackBalloon 非阻塞  
6. 返回 JSON envelope  

### 13.5 失败与降级

| 失败 | 降级 |
|------|------|
| control 不可达 | injector --once |
| Quiet post-update | soft reattach OK |
| 裸 Codex | reattach / 重启带 CDP |
| 主题危险键 | skip + skippedThemeCount |

### 13.6 架构质量属性

| 属性 | 策略 |
|------|------|
| 可维护 | 四层 · 7 问 PR |
| 可观测 | doctor · open-status · evidence |
| 安全 | loopback · token · data-only |
| 可回退 | versions GC · git |
| 性能 | kick 热路径 · catalog 预算 |

---

## 14. 开发规范与编码标准

### 14.1 语言与运行时

- Node ≥20 ESM  
- PowerShell：**维护脚本用 pwsh**；安装态兼容 5.1 入口需小心  
- 零 production npm 依赖  

### 14.2 命名

- 新 PS：`Verb-CodexSkinNoun`  
- 旧 DreamSkin 前缀：**不批量改名**（WIN-02）  
- 主题 id：kebab-case 目录名  

### 14.3 PR 必答 7 问（摘要）

改了哪个包 · 新 import · core↔runtime · 注入旁路 · 路径 helper · active-theme · 版本源。  
详见 CONTRIBUTING C-1。

### 14.4 测试门

| 命令 | 何时 |
|------|------|
| npm test | 默认 |
| test:control | 本机 loopback |
| probe:session | 会话 DOM · 不进 CI |
| doctor / verify-install | 动注入/发布 |

### 14.5 主题 PR

schema · test:themes · 无路径逃逸 · 图大小 · **可读性清单** · 可选 apply。

### 14.6 runtime PR

doctor + npm test · 手测 apply · **必 publish** · SKIN_VERSION 只经 publish stamp。

### 14.7 安全编码

- 控制面：header token · timingSafeEqual  
- CDP URL：cdp-url-guard  
- 主题：拒 scripts/hooks  
- 日志：不写全量 token  

### 14.8 文档

- 产品约束写 PROJECT/ADR  
- 进度写 research / handoff  
- BASELINE **禁止手改**  

### 14.9 提交信息建议

```text
feat(ux): U3 apply balloon prefs + U4 first-run tip
docs: refresh BASELINE after publish 1.3.25-c44358
```

---

## 15. 开发路线图

### 15.1 已完成（里程碑回放）

| 里程碑 | 内容 |
|--------|------|
| M-merge | 单产品线 |
| M-guard | token / soft reattach / data-only |
| M-evidence | PROBE / conversationCovered |
| M-docs-UX | U1 U2 U5 U6 |
| **M-feedback** | **U3 U4 本机**（待入库） |

### 15.2 近端（0–14 日）

| 日 | 项 | 验收 |
|----|-----|------|
| 0 | **A commit U3/U4** | git 干净或 PR 开 |
| 0–1 | 托盘 relaunch 手测开关 | 菜单可见 |
| 1–3 | 可选 B 可读性脚本 | 示例主题过 |
| 3–7 | F6 E1 复测 | 有结论卡 |
| 任意 | 上游新 commit → F4 重评 | 决策一页 |

### 15.3 中期（14–45 日）

- 主题截图规范（home+conversation）  
- DOM fixture 最小集  
- U7 评估  

### 15.4 长期（45–90 日）

- 签名触发条件再评（仍不自动采购）  
- 内容生态链 awesome（不做商店）  

### 15.5 永不

mac 一等 · AUMID 劫持 · asar · 第二 injector · 盲 promote · 云 doctor  

---

## 16. API 接口文档

### 16.1 CLI（`node packages/core/cli.mjs`）

输出默认 **JSON**（stdout）。

| 命令 | 作用 | 主要字段 |
|------|------|----------|
| `help` | 帮助 | commands · notes（含 U3/U4 说明） |
| `list` | 主题列表 | count · themes[] |
| `create --image --name` | 单图建主题 | 写入 devThemesRoot |
| `import-themes` | 导入内置 | importedCount · failed |
| `apply --theme ID` | 写 active + kick | themeId · kick · note · **feedbackQueued** |
| `pause` / `restore` | 暂停文件 | paused |
| `status` | 运行态摘要 | dream · port |
| `doctor` | 诊断 | fresh · injectorAlive · themeCount · control |

**apply 成功示例字段**：

```json
{
  "mode": "hot-active-theme",
  "themeId": "genshin-night",
  "name": "原神 · 星夜",
  "kick": { "ok": true, "mode": "watch-kick", "ms": 53, "applied": 1 },
  "note": "已写入 active-theme 并经守护进程即时注入",
  "feedbackQueued": true
}
```

### 16.2 控制面 HTTP（loopback only）

**基址**：`http://127.0.0.1:<controlPort>`（默认尝试 9336，见 control.port）  
**Token**：`%LOCALAPPDATA%\CodexDreamSkin\control.token`  
**头**：`x-codex-skin-token: <token>`（mutating POST **仅 header**；query 无效）

| 方法 | 路径 | Auth | 说明 |
|------|------|------|------|
| GET | `/health` | 否 | FastLaunch/探活 |
| POST | `/kick` | 是 | 热 apply active-theme |
| POST | `/focus` | 是 | 聚焦 Codex 窗 |
| POST | `/open-healthy` | 是 | 健康打开/聚焦编排 |

**kick 成功（概念）**：`{ ok, mode: "watch-kick", applied, sessions, fingerprint, ms, ... }`

**安全**：仅 127.0.0.1；token 防同用户误触，非多用户隔离。

### 16.3 CDP（非本仓「开放 API」，但契约存在）

- 端口默认 **9335**  
- 仅 loopback WebSocket；`cdp-url-guard` 校验 shape  
- 业务 payload 为 evaluate 字符串（CSS/JS），不对外稳定版本化  

### 16.4 文件系统「API」

| 路径 | 读写者 | 契约 |
|------|--------|------|
| active-theme/theme.json | themes + injector | 双格式 manifest |
| ui-prefs.json | launcher-ui | schemaVersion=1 · applyBalloonEnabled |
| first-run-shown.flag | launcher-ui | 存在即 U4 完成 |
| current.json | publish | runtimeId · relativeEnginePath |

### 16.5 PowerShell 用户可调用入口

| 脚本 | 用途 |
|------|------|
| open-codex-dream-skin.ps1 | 日常打开（-ShowReady 可选） |
| switch-theme-ui.ps1 | 图形换肤 |
| show-feedback.ps1 | Code=first-run \| apply-ok \| apply-fail \| 错误码 |
| check-and-fix.ps1 | 一键修复 |
| kick-theme-now.ps1 | 即时 kick |
| publish-runtime.ps1 | 维护者发版 |

### 16.6 错误码映射（用户向）

| Code | 含义 | CTA |
|------|------|-----|
| cdp-closed | 无调试口 | 任务栏 Codex |
| bare-codex | 裸启 | 重启带皮肤 |
| first-run | 引导 | 一次性 |
| apply-ok/fail | U3 | 气泡 |

---

## 17. 测试与证据策略

| 层 | 工具 | CI? |
|----|------|-----|
| 单元 | theme/store/adapter/deps/freshness/cdp-url/budget | 是（themes-gate 等） |
| 本机控制面 | test:control | 否 |
| 安装一致性 | verify-install | 发版 |
| 会话 DOM | probe / Run-ReleaseProbes | 否 · 主版本建议 |
| UX | 手测气泡/prefs/flag | 否 |

**禁止**：`conversationPass=true` 且 `inConversation=false` 勾 conversation。

---

## 18. 交互选代说明（给表单）

用户将在会话内选择：

1. **主组合**：A / A+B / A+C / 仅 B / 仅调研不再动码  
2. **是否 commit**：是（需用户明确） / 否仅保留工作区  
3. **是否 push**：默认否，需明示  
4. **是否现在手测 U4**（删 flag）：是 / 否  

执行时仍遵守：高风险（push/删远程）先确认；commit 仅在用户选「是」后做。

---

## 19. 执行手册（选项映射）

### 19.1 若选 A 交付-收口

1. `git status` / `git diff` 复查  
2. 用户确认后 commit（不含密钥）  
3. `npm test` 再确认  
4. 提示退出托盘 relaunch  
5. 更新 handoff  

### 19.2 若选 A+B

在 A 后：设计最小对比度检查（读 palette hex → 相对亮度启发式）或强化 CONTRIBUTING 门禁脚本；不进重视觉重写。

### 19.3 若选 A+C

在 A 后：CDP evaluate 探 `cycleTheme` / catalog；缺则开小卡修 renderer，**必 publish**。

### 19.4 若选仅调研

停止改码；本文即交付。

---

## 20. 附录

### 20.1 关键路径速查

| 路径 | 用途 |
|------|------|
| docs/PROJECT.md | 边界权威 |
| docs/ARCHITECTURE.md | 调用链 |
| docs/design-tokens.md | 视觉 token |
| docs/usage.md | 用户说明（含 U3/U4） |
| docs/SECURITY.md | 威胁模型 |
| packages/core/cli.mjs | CLI |
| packages/runtime/scripts/control-plane.mjs | HTTP API |
| packages/core-win/launcher-ui.ps1 | prefs/气球/first-run |
| vendor/dreamskin/scripts/tray-dream-skin.ps1 | 托盘（publish 拷贝） |

### 20.2 本机验收记录（样本）

| 检查 | 结果 |
|------|------|
| npm test | pass |
| verify-install | ok=True |
| doctor fresh | true |
| apply genshin-night | kick 53ms · feedbackQueued |
| runtimeId | 1.3.25-c44358 |

### 20.3 与 v3 差异清单

- 进度：U3/U4 从「待做」→「本机完成待 commit」  
- 新状态面：ui-prefs · feedbackQueued  
- 评分：默认组合从「体验-文档」切到 **「交付-收口」**  
- 五件套：市场/架构/规范/路线图/API 专章齐  

### 20.4 术语

见 `docs/GLOSSARY.md`；新增口语：**换肤气泡** = applyBalloonEnabled 控制的 U3 成功提示。

### 20.5 风险登记

| 风险 | 缓解 |
|------|------|
| 未 commit 丢失 | 选 A |
| 旧托盘无菜单 | relaunch |
| 气泡被 Win 策略抑 | 面板文案/✓ 仍在 |
| 误 push | 默认不 push |

### 20.6 Agent 开工检查单

- [ ] 读本文 §0 + PROJECT §1–3  
- [ ] doctor runtimeId 对齐  
- [ ] 脏树是否含他人改动  
- [ ] 改 runtime/core-win/tray → publish  
- [ ] 不碰 vendor 业务修  
- [ ] 不勾 vacuous conversation  

### 20.7 长文自检

- 进度有 E1 数字  
- 同类有优缺与「不学」  
- 目标约束 IO 验收齐全  
- 五件套独立成章  
- 多方案有 Σ 与论证  
- 否决项明确  

---

## 21. 深度补章：调用链与故障树（可执行）

### 21.1 冷启动完整链（成功路径）

用户点击任务栏「Codex」快捷方式时，操作系统并不直接启动商店包身份，而是启动本产品的 **CodexFastLaunch.exe**（独立 AUMID）。该原生入口在约百毫秒量级内把控制权交给安装态脚本链：解析 `current.json` 指向的 `versions/<runtimeId>`，确认 node 与 injector 路径，探测是否已有带 `--remote-debugging-port=9335` 的 Codex 进程。若已有健康会话且控制面可达，则走 **open-healthy / focus** 快路径，避免无意义重启；若检测到「进程在但无 CDP」的裸启形态，则进入 reattach 或带调试端口的重启策略。成功后确保 **唯一** watch injector 存活，托盘进程按 mutex 去重拉起，并在首次运行时尝试展示 U4 引导。整条链的设计意图是：**日常再点 = 聚焦与自愈，而不是每次冷启动重装皮肤**。

### 21.2 换肤完整链（U3 之后）

无论入口是换肤面板、托盘菜单还是 CLI `apply`，写入面都应收敛到 **active-theme** 目录，而不是各自偷偷 CDP evaluate 一套旁路 CSS。写入完成后优先 **POST /kick**：由已驻留的 watch 进程在进程内热加载指纹变化并 apply 到已连接会话。控制面不可达时，才降级为同 runtime 的 `injector --once`。U3 在成功或失败后追加 **非阻塞** 用户反馈：成功气泡可关；失败 note 应保留可行动语义。CLI 额外返回 `feedbackQueued`，方便自动化判断「是否已尝试提示用户」，但不把气泡成败当作 apply 成败。

### 21.3 故障树（用户语言 → 系统原因）

| 用户怎么说 | 更可能根因 | 系统侧证据 | 首选动作 |
|------------|------------|------------|----------|
| 「皮肤没了」 | 裸启 / injector 死 / paused | doctor · open-status · 托盘状态 | 任务栏 Codex 或一键修复 |
| 「换了没反应」 | 未 kick / CDP 关 / 看错窗口 | kick 返回 · control.port | 先 open 再 apply；看 note |
| 「只有商店能开」 | 钉错入口 | 包激活 vs FastLaunch | 重钉任务栏 Codex |
| 「一打开就被 Windows 拦」 | 未签名 SmartScreen | #24 | 更多信息→仍要运行 |
| 「气泡烦」 | U3 默认开 | ui-prefs | 托盘关换肤气泡 |
| 「修不好还报成功」 | Quiet 漂移后 soft reattach | publish 日志 | 认 soft reattach OK，再点任务栏 |

### 21.4 发布故障树

publish 末段 Quiet 回归失败并不自动等于「版本坏了」。历史上常见原因是 Codex 商店包版本与 state 中记录不一致、CDP 瞬时不可用、smoke 在无会话环境退出非零。产品策略已固定为：**超时或失败 → soft reattach → 明确打印 OK/警告**；发版人应跑 verify-install 与 doctor，而不是无限等待 Quiet。

### 21.5 安全故障树

若有人把 control-plane 绑到非回环或接受 query token，则同网段误触或脚本扫端口风险上升——这与现行实现相反，属于回归缺陷，应用 control-plane 测试与 verify marker 拦住。主题包若夹带 `scripts`/`hooks`，必须在 schema 层拒绝，不能「先导入再人工看」。

---

## 22. 深度补章：模块契约与反例

### 22.1 packages/core 契约

**允许**：发现 Codex 安装与进程、探测 CDP 端口、doctor 汇总、CLI 编排、kick 编排、读 control.token 调控制面。  
**禁止**：解析主题危险逻辑的第二套实现、在 core 内拼大段 CSS、静态 import runtime。  
**反例**：在 `cli.mjs` 里直接 `spawn(injector)` 且绕过 active-theme 写盘——会破坏「主题写入唯一入口」并制造双 injector 心智。

### 22.2 packages/themes 契约

**允许**：list/load/validate、heige↔DreamSkin 适配、写 active-theme、导入 bundled。  
**禁止**：发起 CDP、启动进程守护、读 control 端口做业务。  
**反例**：主题目录放 `.ps1` 钩子并在导入时执行——直接违反 data-only。

### 22.3 packages/runtime 契约

**允许**：watch/once 注入、control-plane、catalog 预算、URL guard、assets。  
**禁止**：被 core 静态依赖、默认监听 0.0.0.0、在 evaluate 中拉取远程脚本。  
**反例**：为「方便远程调试」打开非 loopback——威胁模型升级到不可接受。

### 22.4 packages/core-win 与 launcher 契约

**允许**：安静 UI、托盘 ensure、焦点、路径、UTF-8、prefs、first-run、用户错误映射。  
**禁止**：复制 injector 业务、在多个脚本各写一套 kick。  
**反例**：switch-theme 自己拼 HTTP 而不走 `Invoke-CodexSkinControl`——token 头与超时策略会漂移。

### 22.5 vendor 契约

vendor 是上游镜像与对照，不是热修通道。生产路径应使用 packages 与 apps 已产品化的副本；publish 从 vendor 拷 tray 等脚本时，**产品行为补丁必须可追踪**（本轮 U3 托盘 kick 即落在 vendor 树源，需知会维护者：改 tray 必 publish）。

---

## 23. 深度补章：主题与视觉工程

### 23.1 双格式并存的理由

历史合并把 heige 风格 manifest 与 DreamSkin catalog 字段同时纳入。适配层负责把 hero/colors/copy 与 image/palette/brand 对齐，避免「从用户 catalog 再 apply 时冲空 palette」。这不是优雅的学院派模型，但是 **迁移成本最低的诚实模型**。新主题应优先一种格式写全，并跑 `test:themes`。

### 23.2 Catalog 预算为什么是产品问题

F6 与托盘缩略图若无字节与条目上限，payload 会拖垮 CDP evaluate 或造成间歇失败，用户感知为「皮肤坏了」。`theme-catalog-budget` 把策略收成纯函数并单测，是把「运维经验」变成「可回归规则」。调大预算必须写 PR 理由，不能因为「我想塞 30 套高清」就改常量。

### 23.3 可读性为什么不能只靠审美

编码场景下用户连续阅读模型输出。灰字灰底的「高级感」会直接伤害主业。U2 清单把主观审美收成可勾选项；B 方案的轻脚本则进一步把部分规则变成机器可拒。两者都服从 S1：**工具优先**。

### 23.4 会话页为什么单独证据

首页 hero 好看不等于对话气泡可读。conversationCovered 强制「真的进过会话再勾」，是对发版自欺的防抖。主版本发版若只跑首页截图，等于在最大使用面上裸奔。

### 23.5 视觉风格决策树（维护者）

```text
是否影响默认主题观感？
  ├─ 是 → 必须手测首页+会话；倾向 token 微调
  └─ 否（仅新主题）→ test:themes + 可读性清单 + 可选 apply
是否引入 blur/重动画？
  ├─ 是 → 默认关或仅 S2 主题；证明不挡点击
  └─ 否 → 常规审
是否需要改选择器？
  ├─ 是 → 高风险；准备 Store 更新后失效；补 probe
  └─ 否 → 优先 class/token
```

---

## 24. 深度补章：发布、安装态与 GC

### 24.1 为什么「改了源码却没变化」

安装态运行的是 `versions/<runtimeId>` 下的拷贝，不是 git 工作树。忘记 publish 是本项目最高频的假 bug。规则写成：**改 packages/runtime 或会被 publish 拷贝的 launcher/tray/core-win → 必须 publish + verify-install**。U3/U4 本轮已执行 publish，runtimeId 变为 `1.3.25-c44358`，与 origin 文档中的旧 id 不同，属预期。

### 24.2 current.json 的角色

它是安装树的「HEAD」。doctor 的 freshness 比较 expected（current）与 actual（state 中 injector 路径）。两者不一致时，用户可能跑着旧 injector，表现为「修了不生效」。soft reattach 与 open 路径会尽量拉齐。

### 24.3 GC 策略

publish 保留当前与上一版，删除更旧 runtime，控制磁盘与误用旧引擎概率。维护者若需回滚，应显式指回旧 `relativeEnginePath`，而不是手动拼路径。

### 24.4 产品包 vs 开发 publish

`Build-ProductPackage` / `Install` 面向分发；`publish-runtime` 面向开发机写回。两者都不应成为「改 asar」的借口。产品包 stamp 不得偷偷抬产品线号绕过 ADR 0003。

---

## 25. 深度补章：市场与用户心理（扩写）

### 25.1 用户真正买的是什么

用户不是在买「又一个 CSS 文件」，而是在买：**我仍然用官方 Codex，但环境更像我的工位**。因此信任边界（不破坏官方安装）与可逆性（暂停皮肤）和功能清单同样重要。任何听起来像「劫持商店应用」的方案，即使技术上有灰区，也会摧毁信任。

### 25.2 为什么 star 不是 KPI

上游高 star 证明赛道存在，不证明本 fork 应合并上游。本仓价值在可维护的守护与发布。运营可以做截图与三层说明，但工程路线不能被 star 绑架去 mac 或 Creator。

### 25.3 工单类型与产品刀映射

| 工单类型 | 产品刀 |
|----------|--------|
| 入口找错 | U4 · usage · dual-open |
| 换肤无感 | U3 |
| 更新后失效 | soft reattach · post-update · 一键修复 |
| 难看挡字 | U2 · tokens · 主题门 |
| 怕安全 | SECURITY · loopback · data-only |
| 想签名 | F5 No-Go 或触发条件再评 |

### 25.4 与官方路线的共存

若未来官方桌面提供更强 Appearance，本仓应收缩为「壁纸/品牌层补充」，而不是对抗。现在的叠层决策树（§ 视觉）已预留「暂停皮肤验证」路径。

---

## 26. 深度补章：规范细则（编码标准扩写）

### 26.1 JavaScript

- 仅 ESM；错误信息面向维护者可中英混合，但 CLI 用户 note 保持中文短句。  
- 禁止引入生产依赖；开发依赖若新增需说明必要性。  
- 异步：kick/apply 不得因 UI 反馈阻塞主结果。  
- 字符串：主题名切片防超长气球。  

### 26.2 PowerShell

- 点源顺序敏感；`launcher-ui` 已加载守卫防重复。  
- UI 脚本注意 STA；托盘与气球需要 Forms 程序集。  
- 文件写 UTF-8 **无 BOM** 优先，避免 theme.json 被默认 ANSI 弄坏。  
- 错误：用户可见走映射函数；日志走 stateRoot 文本。  

### 26.3 测试命名与诚实

- 单测文件与实现同目录或邻接 `*.test.mjs`。  
- 允许 skip，但必须诚实（PROBE 模式）。  
- 禁止把「环境没有会话」写成 conversation 通过。  

### 26.4 文档变更纪律

- 改行为必改 usage 或 CHANGELOG Unreleased。  
- 调研长文不替代 PROJECT 约束。  
- BASELINE 只允许脚本生成。  

### 26.5 代码评审关注点（审查员清单）

1. 是否新增第二注入路径？  
2. 是否漏 publish 清单？  
3. 是否把成功反馈做成不可关且刷屏？  
4. 是否在 vendor 修业务却忘产品树？  
5. 是否触碰 AUMID/asar？  
6. 是否降低 token 校验强度？  

---

## 27. 深度补章：路线图甘特叙事

### 27.1 第 0 周（当前）

目标：工作区与安装态与文档叙事一致。动作：选 A commit；托盘 relaunch；可选删 flag 看 U4。退出标准：origin 或至少本地 HEAD 含 U3/U4；doctor 仍 fresh。

### 27.2 第 1–2 周

目标：质量可拦。动作：B 轻对比度或清单自动化；主题 PR 模板截图位。退出标准：至少一主题被机器或清单拒绝过一次（证明门牙存在）。

### 27.3 第 3–4 周

目标：F6 真相。动作：C 复测；若回归则最小补丁 + publish。退出标准：usage 中 F6 描述与真机一致。

### 27.4 第 2 月

目标：弱机与演示分轨。动作：评估 U7；S2 主题不进默认。退出标准：开关可逆、probe 不崩。

### 27.5 第 3 月

目标：信任与内容。动作：签名触发条件回顾；awesome 链接与截图规范。退出标准：决策纸更新，而非一定花钱。

---

## 28. 深度补章：API 示例与契约测试建议

### 28.1 curl 风格（本机）

```text
# 读端口
type %LOCALAPPDATA%\CodexDreamSkin\control.port
# 读 token（勿粘贴到公开 issue）
type %LOCALAPPDATA%\CodexDreamSkin\control.token

# health（无 token）
GET http://127.0.0.1:9336/health

# kick（有 token）
POST http://127.0.0.1:9336/kick
Header: x-codex-skin-token: <token>
```

PowerShell 维护者更推荐 `Invoke-CodexSkinControl -Action kick`，避免漏头。

### 28.2 CLI 契约测试建议（未强制）

- `help` notes 含 U3/U4 关键字  
- `apply` 在假 installRoot 时 `feedbackQueued` 可为 false 但不抛  
- `doctor` 含 `injectorPathFreshness.fresh` 布尔  

### 28.3 ui-prefs 契约

```json
{
  "schemaVersion": 1,
  "applyBalloonEnabled": true,
  "updatedAt": "2026-07-21T00:00:00.000Z"
}
```

未知字段应忽略；缺省文件 = 气球开。关闭成功气球不得关闭错误气球与 first-run（除非未来显式扩展 schema 并写迁移）。

### 28.4 show-feedback 契约

| Code | 行为 |
|------|------|
| first-run | FirstRunGuide（写 flag） |
| apply-ok / apply-fail | ApplyFeedback（尊重 prefs） |
| 其他 | UserFeedback 错误映射 |

---

## 29. 深度补章：方案 A/B/C 的任务拆解

### 29.1 方案 A 工作分解结构

1. 复查 diff：无密钥、无本地绝对路径误提交（repo 路径可）。  
2. 确认 `docs/research/v4` 与 usage/CHANGELOG/BASELINE 一并纳入。  
3. commit message 清晰。  
4. 本地 `npm test`。  
5. 提示用户 relaunch 托盘。  
6. 更新 memory handoff：origin 是否仍 behind。  

### 29.2 方案 B 工作分解结构

1. 定义对比度启发式（相对亮度差阈值，保守）。  
2. 只对 palette hex 生效；无法解析则 skip 并警告。  
3. 接入 `npm run test:themes` 或独立 script。  
4. 文档写「启发式非 WCAG 全保证」。  
5. 用一套故意低对比主题夹具证明会失败。  

### 29.3 方案 C 工作分解结构

1. 在已登录会话上跑 probe-f6 或等价 evaluate。  
2. 记录 hasCycleTheme / catalog 长度 / toast DOM。  
3. 若缺失：最小补 renderer，保留预算。  
4. publish + verify + 手测 F6。  
5. 更新 usage 与 CHANGELOG。  

### 29.4 方案组合的依赖

B/C 不依赖 A 才能写代码，但 **依赖 A 才能避免双线维护**。若坚持不 commit，B/C 的补丁将叠在脏树上，冲突与 handoff 成本上升。

---

## 30. 深度补章：验收矩阵（打勾用）

| 编号 | 场景 | 期望 | 通过? |
|------|------|------|-------|
| V1 | doctor | fresh · injectorAlive · themes≥11 | |
| V2 | verify-install | ok=True | |
| V3 | apply 主题 | kick.ok · 皮肤变 | |
| V4 | U3 开 | 有成功气泡或面板文案 | |
| V5 | U3 关 | 无成功气泡 · 功能仍在 | |
| V6 | U4 删 flag 后 open | 一次性引导 | |
| V7 | U4 再 open | 不再引导 | |
| V8 | 裸启再点任务栏 | 恢复皮肤或明确 note | |
| V9 | pause/restore | 可逆 | |
| V10 | 主版本会话 | conversationCovered | |

---

## 31. 深度补章：与历史调研的引用关系

阅读顺序建议：先 v4 §0 定阶段 → 需要赛道细节回 peer → 需要债卡史回 progress → 需要 UX 方案库回 v3 → 需要工程四包细节回 v2。**不要**并行把所有长文当 SSOT；**约束 SSOT 永远是 PROJECT + ADR + SECURITY**。调研文负责「为什么」与「下一刀」，不负责覆盖硬约束。

v3 推荐「体验-文档」时，U1–U6 文档尚未合完；现在文档包已合、U3/U4 本机已成，目标函数从「补标准」变为「固化交付」。这是阶段迁移，不是自我打脸。

---

## 32. 深度补章：运维 Runbook（短）

**皮肤突然全无**：doctor → 看 paused/injectorAlive/portOpen → 一键修复 → 仍无则看是否商店入口。  
**publish 后旧行为**：确认 current.json runtimeId → 杀旧 injector → 任务栏 Codex → verify-install。  
**控制面 401**：查 token 文件与 header；确认不是 query。  
**主题导入失败**：看 failed 列表与危险键；unlock 状态。  
**气球异常**：查 ui-prefs 与托盘进程是否新脚本。  

---

## 33. 深度补章：产品叙事建议（README 级）

一句话：**给 Windows 上的 Codex Desktop 换壁纸级皮肤，不改官方安装包。**  
三步：**安装 → 钉任务栏 Codex → 托盘或 Codex 换肤切换。**  
三不要：**不要商店磁贴当日常入口；不要并行旧注入器；不要改 WindowsApps。**  
一诚实：**SmartScreen 可能出现；点仍要运行。**

---

## 34. 深度补章：目标—约束—IO—验收 全量卡片库

下列卡片可直接裁成任务卡。每张含目标、约束、输入、输出、验收，避免 Agent 只抄标题不抄边界。

### 34.1 卡片 A0 · 交付入库 U3/U4

| 字段 | 内容 |
|------|------|
| 目标 | 工作区 U3/U4 与文档进入 git 历史，安装态叙事可复现 |
| 约束 | 不抬产品线号；不 push 除非明示；不含密钥 |
| 输入 | 当前脏树 9+ 文件 · 已 publish 的 c44358 |
| 输出 | commit（及可选 PR）· 更新 handoff |
| 验收 | `git status` 干净或仅 co-authored 文档；`npm test` 绿；doctor 仍 fresh |

### 34.2 卡片 B0 · 主题可读性轻门禁

| 字段 | 内容 |
|------|------|
| 目标 | 明显不可读的 palette 在测试中失败 |
| 约束 | 启发式即可；不宣称 WCAG 全站；不改宿主 DOM |
| 输入 | theme.json palette hex |
| 输出 | 脚本或 test:themes 扩展 · CONTRIBUTING 一句 |
| 验收 | 夹具低对比主题失败；正常 11 套通过 |

### 34.3 卡片 C0 · F6 真相复测

| 字段 | 内容 |
|------|------|
| 目标 | usage 中 F6/toast 描述与真机一致 |
| 约束 | 单 injector；catalog 预算不放飞；改 renderer 必 publish |
| 输入 | 已登录 Codex 会话 · CDP 9335 |
| 输出 | 复测记录 · 若缺则最小补丁 |
| 验收 | evaluate 见 cycleTheme 或明确「已移除/降级」并改文档 |

### 34.4 卡片 D0 · U7 性能模式（二期）

| 字段 | 内容 |
|------|------|
| 目标 | 弱机可降 ambient 装饰 |
| 约束 | 默认 S1；可逆；不第二 injector |
| 输入 | 用户开关或扩展 paused 语义 |
| 输出 | token/CSS 降级路径 |
| 验收 | 开关往返 · probe 不崩 · kick 仍可用 |

### 34.5 卡片 R0 · 托盘进程刷新

| 字段 | 内容 |
|------|------|
| 目标 | 用户看到「换肤气泡」菜单与 kick 后反馈 |
| 约束 | mutex 单托盘；不双开 |
| 输入 | 已 publish 的 tray 脚本 |
| 输出 | 用户操作说明或自动 ensure 路径 |
| 验收 | 菜单文案存在；切换主题有 kick |

### 34.6 卡片 E0 · 上游 promote 重评（事件驱动）

| 字段 | 内容 |
|------|------|
| 目标 | 上游有价值 CSS 时做**差分**决策 |
| 约束 | 禁止盲 Copy-Item；保留 stamp/null-safe/de-blur |
| 输入 | 上游 commit · 本仓 diff |
| 输出 | 一页 promote/不 promote 决策 |
| 验收 | 有「合/不合」结论与手测项；默认仍可不合 |

### 34.7 卡片 S0 · 签名触发再评（事件驱动）

| 字段 | 内容 |
|------|------|
| 目标 | 判断是否仍 No-Go 购证 |
| 约束 | 不自动采购；不删 FastLaunch |
| 输入 | 分发范围 · SmartScreen 主诉数据 · 预算 |
| 输出 | 更新 codesign-decision |
| 验收 | 触发条件表更新；非必须进入实施 |

---

## 35. 深度补章：架构权衡记录（ADR 风格短述）

### 35.1 为何成功反馈用气泡而不是模态框

模态框打断编码流，与「工具优先」冲突。气泡可忽略、可关、失败可降级到面板文案。代价是 Windows 版本对 BalloonTip 支持不一致——故 **✓ 菜单与 hint 文案是主反馈，气泡是增强**。

### 35.2 为何 prefs 用 JSON 文件而不是注册表

与 stateRoot 其他文件一致，便于备份/卸载清理/Agent 读写；无额外权限。代价是多一个文件契约，需 schemaVersion。

### 35.3 为何 CLI 反馈要非阻塞

CLI 常被脚本调用；若同步等气球显示，会引入 STA/桌面会话耦合与超时。`feedbackQueued` 表达「已尝试」，符合自动化。

### 35.4 为何不在 injector 内弹窗

injector 是无 UI 的 node 守护，弹窗会破坏 headless 假设并可能多实例打架。反馈留在 L1/L2。

### 35.5 为何 U4 只做一次

重复教育会变骚扰，导致用户关通知或卸产品。一次 + 可删 flag 重看，平衡教育与安静默认。

---

## 36. 深度补章：竞品功能对照矩阵（扩展）

| 能力 | 上游 DreamSkin | Styler | 本仓 v4 |
|------|----------------|--------|---------|
| Windows CDP 皮肤 | 有 | 有 | 有 |
| mac 路径 | 有 | 视版本 | **永久非目标** |
| 多主题 catalog | 有 | 强 | 11 + 预算 |
| 版本化 runtime 树 | 弱/无 | 中 | **强** |
| control-plane kick | 弱/无 | 中 | **强** |
| doctor freshness | 弱 | 中 | **强** |
| 证据门发版 | 弱 | **强** | 中（PROBE） |
| Creator GUI | 弱 | **强** | 不做 |
| 主题 data-only | 中 | **强** | **强** |
| 首次入口教育 | 中 | 中 | **U4** |
| 换肤成功反馈 | 中 | 中 | **U3+prefs** |
| 签名 | 视上游 | 视项目 | **No-Go 购证** |
| 零 prod npm 依赖 | 视树 | 否 | **是** |

**解读**：本仓应继续打「守护与发布」差异化，用 U3/U4 补齐体验短板，而不是在 Creator 列跟 Styler 正面硬刚。

---

## 37. 深度补章：输入输出总表（系统接口一览）

| 接口名 | 方向 | 协议 | 稳定性 |
|--------|------|------|--------|
| 任务栏 Codex | 入 | Shell/lnk | 高（产品承诺） |
| CLI JSON | 出 | stdout | 中高（字段可增） |
| control HTTP | 双向 | HTTP loopback | 中（本机工具） |
| active-theme 文件 | 双向 | FS | 高 |
| ui-prefs | 双向 | FS | 中（新） |
| first-run flag | 出/入 | FS | 中 |
| CDP evaluate | 出 | WS | 低（宿主变） |
| evidence JSON | 出 | FS gitignore | 低（本机） |

稳定性含义：宿主 DOM 变则 CDP 相关最脆；任务栏入口与 active-theme 目录是对用户最稳定的契约。

---

## 38. 深度补章：验收标准的「反验收」（什么不算过）

1. 只改了文档声称 U3 完成，但安装树仍是旧 launcher-ui → **不算过**。  
2. `feedbackQueued: true` 但 prefs 关闭时仍强弹且无法关 → **不算过**（可关是验收项）。  
3. first-run 每次 open 都弹 → **不算过**。  
4. conversation 证据在未进会话时勾选 → **不算过**。  
5. publish 后 doctor `fresh=false` 却宣称发版成功 → **不算过**。  
6. 为做 U3 引入第二 injector → **直接否决**。  

---

## 39. 深度补章：团队/Agent 协作协议

1. **开场**：读 v4 §0 + git status + doctor runtimeId。  
2. **改前**：能映射到卡片 A0/B0/C0 之一；否则先写卡。  
3. **改中**：小步；碰 runtime/tray 就准备 publish。  
4. **改后**：npm test；相关则 doctor/verify；更新 CHANGELOG Unreleased。  
5. **收工**：handoff 写 HEAD/runtime/脏树；记忆索引一行。  
6. **禁止**：未确认 push；未确认删 flag 以外的用户数据；把调研当代码。  

---

## 40. 方案 B 落地记录（本会话执行后）

用户在交互表单选择 **A+B** 后，B 门禁已写入实现而非停留在清单：

1. **`relativeLuminance` / `contrastRatio` / `assertReadableTextSurface`** 导出在 `theme-schema.mjs`。  
2. **`validateThemeManifest`** 在 normalizeColors 之后强制 `text` 对 `surface` 对比度 ≥ **4.5**（启发式，约等于 WCAG AA 正文，**不是**全页面无障碍认证）。  
3. **accent 不硬失败**：装饰色与表面对比可低（如部分主题 accent/surface ≈3），避免误杀氛围色。  
4. **夹具**：`theme-schema.test.mjs` 增加低对比 `#818181` on `#808080` 必须抛错；白/黑比 >20 自检。  
5. **11 套内置主题**实测 text/surface 最低约 **8.03**（deepspace-dawn），全部通过。  
6. **CONTRIBUTING C-2** 可读性条目标注机器门 + 目视项并存。  

**为何 4.5 而不是 7**：7 是增强级，会把部分合法浅色主题逼向「只有黑白」，伤害皮肤产品差异化；4.5 拦住「几乎融为一体」的事故主题即可。若未来主题 PR 仍出现「清单勾了但难读」，可再加 muted 规则或人工截图门，而不是先把阈值拉满。

**与 U2 清单关系**：U2 仍要求作者目视 composer 焦点与 muted；B 只自动化 **可机读的 hex 对**。两者叠加才接近「主题质量门」。

---

## 41. 本会话执行结果摘要（A+B）

| 步骤 | 结果 |
|------|------|
| v4 万字总册 | `docs/research/2026-07-21-master-research-v4-u3u4-product.md` · PROJECT 已索引 |
| 交互选择 | **A+B** · **commit=是** · **push=否** · **U4 flag=不动** |
| U3/U4 代码 | 已在安装态 `1.3.25-c44358` 验证 · 随 commit 入库 |
| B 门禁 | schema + test 绿 · 11/11 主题过 |
| npm test | 全绿 |
| push | **未执行**（遵选择） |
| 删 first-run flag | **未执行** |

---

## 42. 给维护者的「一周后回看」问题

1. commit 之后是否还有人报告「换肤没反应」？若有，是 prefs 关了还是 kick 失败？  
2. 主题 PR 是否被对比度门挡住过？挡住是否误伤？  
3. F6 是否仍与 usage 一致？若否，启动 C0 卡。  
4. 托盘菜单是否普遍看到「换肤气泡」？若否，检查旧进程与 publish 拷贝。  
5. soft reattach 日志是否仍被误读为发版失败？若是，再打磨文案。  

这些问题用来防止「写了万字却不观察现实」。

---

## 43. 收束

工程已从「证明能运维」走到「体验可感知」；**U3/U4 是正确的高杠杆刀且本机已验证**；**B 门禁把可读性从清单推进到机器可拒**。  
默认执行路径 **A+B** 已按用户选择落地：交付入库 + 对比度启发式。  
未 push、未删 first-run flag，符合风险最小化。  
下一步若无新客诉，保持观察；有 F6 疑问再开 C。

本文五件套位置索引：

| 件套 | 章节 |
|------|------|
| 市场需求调研报告 | §12 · §25 |
| 架构设计文档 | §5 · §13 · §21–§24 · §35 |
| 开发规范与编码标准 | §14 · §26 · §40 |
| 开发路线图 | §15 · §27 · §34 · §41–§42 |
| API 接口文档 | §16 · §28 · §37 |

**下一会话口令**：`继续 codex-skin` · 读 `docs/research/2026-07-21-master-research-v4-u3u4-product.md` · 先看 `git log -1` 与 doctor runtimeId。

---

## 44. 附：字数与完整性声明

本文目标为可执行的万字级总册。结构上覆盖：当前进度编写、同类经验与优缺点、架构优化、技术债、目标/约束/边界/输入输出/验收、细节打磨、用户体验、视觉风格、**市场需求调研报告（§12/§25）**、**架构设计文档（§5/§13 等）**、**开发规范与编码标准（§14/§26/§40）**、**开发路线图（§15/§27/§34）**、**API 接口文档（§16/§28）**、多方案对比评分与最佳方案论证、交互选代后的真实执行记录。  

约束声明再次强调：本仓永远以 **不改 asar、不劫持 AUMID、单 injector、loopback、publish 权威版本** 为底线；任何「为了文档好看」而放松底线的建议，应直接否决。用户选择 A+B 后，工程上完成了「可感知体验入库」与「主题正文可读机器门」两件实事，比再开一篇空调研更符合项目阶段。

若后续需要把汉字统计卡在严格 ≥10000：优先扩写「真实故障案例」与「主题 PR 复盘」两类经验材料，而不是重复粘贴表格。质量优先于凑字。

---

*文终 · codex-skin master research v4 · 2026-07-21 · §0–§44*
