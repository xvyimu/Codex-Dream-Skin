# codex-dream-skin 整合调研总册（2026-07-21 · HEAD 7d3519d 冻结）

> **性质**：赛道 · 架构 · 债 · 多方案 · 打磨 · 选代仪表盘（整合 peer / progress / 既有总册 + P2-PROBE/F3/F5/F6plus 落地后进度）  
> **仓库**：`D:\orca\codex-skin` · `xvyimu/Codex-Dream-Skin`  
> **E1 冻结样本**：HEAD **`7d3519d`** · `main==origin/main` · 安装 runtime **`1.3.25-51bdbe`** · doctor `fresh=true` · themes=11 · skipped=0 · control=9336  
> **安装空窗（关键）**：`cdp-url-guard.mjs` **在**安装树；`theme-catalog-budget.mjs` **不在**安装树 → **下次 publish 必带**  
> **BASELINE.generated.md**：样本可能落后 HEAD，以 `write-baseline.ps1` 重跑为准  
> **关联文**：`peer-landscape` · `progress-aligned` · 旧 `integrated-master` · PROJECT · ADR · RELEASE-EVIDENCE · contracts · plans  
> **方法**：源码/文档精读；`gh` 同类元数据；本机 doctor/verify；不盲 promote、不改 asar、不劫持 AUMID  
> **篇幅**：正文汉字目标 ≥10000；多方案对比 + 最佳论证  

---

## 0. 执行摘要

### 0.1 一句话定位

**Windows-only Codex Desktop CDP Skin 运行时**：单 watch injector、版本化引擎树、loopback 热 kick、主题 data-only、发版以 publish+校验为权威——不是 CLI 主题、不是官方 Appearance 串、不是 Tauri 主题 IDE。

### 0.2 阶段判断（2026-07-21 晚）

| 阶段 | 状态 |
|------|------|
| 产品线合并与可用 | 完成 |
| 安全 token / soft reattach / deps | 完成 |
| 主题 data-only / skipped / adapter | 完成 |
| 运维 verify-install / post-update 摘要 / MIT / baseline 脚本 | 完成 |
| 上游 D-sync + 不 promote 表 + 签名 No-Go 表 | 完成 |
| P2-PROBE 真机/诚实 skip 留痕 | **完成** `4b3c256` |
| P2-F3 report schemaVersion=1 | **完成** `556cffa` |
| P3-F5 签名决策一页纸 | **完成** `2179be2` |
| P2-F6plus catalog-budget 纯函数测 | **完成** `7d3519d`（源码） |
| catalog-budget **安装树** | **未 publish → 空窗** |
| DOM 选择器长期 / 签名落地购证 | 仍开/No-Go |

**结论**：主债与调研 §10 四包**源码侧已关**；当前唯一产品级运营缺口是 **安装树缺少 `theme-catalog-budget.mjs`**（与当时 cdp-url-guard 同类问题）。下一刀默认是 **publish 闭环**，不是新架构。

### 0.3 护城河与短板

**护城河**：kick · versions/GC · doctor freshness · verify-install · 六/七段 npm test · evidence 留痕 · 零 npm prod 依赖 · Agent 文档。  
**短板**：star/内容运营、Authenticode、安装相对 git 滞后（纪律问题）、DOM 脆弱、BASELINE 需勤刷。

### 0.4 同类一句话

| 项目 | 学 | 不学 |
|------|----|------|
| Fei-Away/Codex-Dream-Skin ~11k⭐ | 叙事、verify 话术、安全边界句 | merge、为 star 上 mac |
| xuhuanstudio/codex-styler ~14⭐ | 证据门、data-only、SECURITY 思维 | 整仓 Tauri、云 e2e 强依赖 |
| awesome-codex-themes | 三层分类 | 自建商店 |

### 0.5 最佳下一组合（摘要）

**闭环-安装（推荐）**：`publish-runtime.ps1 -Version 1.3.25` → verify-install 0 → doctor fresh → write-baseline → 可选 Run-ReleaseProbes 真机勾选。  
**否决**：拆 injector、云 doctor、盲 promote、mac 主路径、去掉 FastLaunch。

---

## 1. 范围、读者、证据、非目标

### 1.1 读者

| 角色 | 用法 |
|------|------|
| 维护者 | §0 · §7 · §10 · §12 选代 |
| Agent | §3 · §11 · §13 边界与任务卡 |
| 新人 | §2 · §4 · §5 入门 |
| 审计 | §5 · §6 · §8 安全与债 |

### 1.2 证据等级

E1 本机 · E2 仓内文档源码 · E3 gh · E4 目录导航。

### 1.3 非目标

渗透、闭源逆向、未授权改包、用户访谈、像素评审、跨平台 Creator 化。

### 1.4 文档整合关系（防迷路）

| 文档 | 焦距 | 是否仍读 |
|------|------|----------|
| peer-landscape | 赛道底座 | 是（入职） |
| progress-aligned | 打磨卡片史 | 是（过程） |
| integrated-master（旧） | 中期仪表盘 | 可被本文取代为入口 |
| **本文 v2 冻结** | **含四包收口后的总入口** | **选代以本文为准** |
| PROJECT/ADR | 宪法 | 永远优先于 research |

研究文不得凌驾 ADR。冲突时先修 research。

---

## 2. 赛道与问题域

### 2.1 三层换肤

1. CLI TUI（TextMate）  
2. 官方 Appearance（`codex-theme-v1:`）  
3. **CDP Skin（本仓）**  

过滤器：要导入官方色板串、要终端配色 → 错层，拒或外链。

### 2.2 为何 CDP Skin 存在

官方 Appearance 不管壁纸级氛围与多图热切换；社区共识：不改 asar、仅 loopback、可逆、控件可点。

### 2.3 失败模式 → 机制（全谱）

| 失败 | 机制（今态） |
|------|----------------|
| 双产品线 | ADR 0001 |
| 换肤慢 | `/kick` |
| 路径漂移 | versions + freshness + verify-install |
| 误 kick | token header-only + timingSafeEqual |
| 商店裸启 | #21 文档 |
| SmartScreen | #24 文档 + F5 No-Go 购证 |
| 恶意主题键 | data-only 拒绝 |
| git≠用户 | publish 纪律 + TD-01 |
| Quiet 吓人 | 摘要 + soft reattach OK |
| 样本假 | write-baseline |
| DOM 静默坏 | P2-PROBE evidence |
| report 形状漂 | P2-F3 schemaVersion=1 |
| CDP URL 回潮 | cdp-url-guard 测 |
| catalog 预算回潮 | theme-catalog-budget 测 |
| 盲合上游 | F4 不 promote |
| **安装缺新模块** | **publish 拷贝清单纪律** |

---

## 3. 目标 · 约束 · 边界 · IO · 验收

### 3.1 成功标准（宪法）

1. 皮肤与 active-theme 一致  
2. kick 亚秒体感  
3. 单 watch injector  
4. doctor fresh=true  
5. 可回退（GC+git）  

### 3.2 硬约束

```text
允许：launcher→core-win；cli→core/themes；themes→constants；动态 thumb；publish 拷 runtime
禁止：core↔runtime 静态互引；第二守护；asar/AUMID；生产 import vendor；
      非 loopback 默认；mac 一等；package.json 当 stamp；盲 promote
```

### 3.3 做 / 不做

| 做 | 不做 |
|----|------|
| watch+kick+versions | 改官方包 |
| 主题 catalog | 主题商店 |
| doctor/verify/evidence | 云 doctor |
| Windows 产品线 | mac 一等 |
| 人工上游 | git merge upstream |

### 3.4 系统 IO

| 输入 | 输出 |
|------|------|
| 任务栏 Codex | 带 CDP 会话+皮肤 |
| apply/F6 | active-theme+kick |
| publish -Version | 新 runtimeId+current |
| theme 目录 | catalog 或 schema 错 |
| doctor/baseline | JSON/MD 样本 |
| Run-ReleaseProbes | evidence JSON（本地） |

### 3.5 验收门禁（今态命令）

```text
npm test
  = themes + store + adapter + deps + freshness + cdp-url + catalog-budget
npm run test:control
npm run probe:session / Run-ReleaseProbes.ps1
write-baseline.ps1
verify-install-matches-repo.ps1
verify-post-update-failure-summary.ps1
doctor
RELEASE-EVIDENCE 勾选（status=ran 才算真机）
```

---

## 4. 架构与实现因果链

### 4.1 四层

L1 交互 · L2 调度（cli/control-plane）· L3a 状态 · L3b 主题 · L4 runtime（injector + guards + assets）。

### 4.2 冷启动

FastLaunch（独立 AUMID）→ open → current.json → injector --watch --theme-dir --state-root → CDP 9335 → control-plane 9336 → evaluate。

### 4.3 热换肤

themes 写 active-theme → POST /kick + header token → 失败则同树 --once 单次。

### 4.4 发布

拷 runtime（**必须含** cdp-url-guard **与** theme-catalog-budget）→ stamp → current 翻页 → GC → Quiet 或 soft reattach → verify-install → baseline。

### 4.5 纯函数抽离纪律（F6 模式）

1. 新小文件只含纯逻辑  
2. injector import  
3. `*.test.mjs` 进 npm test  
4. publish Copy-Item 强制  
5. verify-install Required  
6. **未 publish 前安装树必空窗——写进 RELEASE-EVIDENCE**  

### 4.6 架构评分（四包后）

| 维 | 分 | 注 |
|----|---:|----|
| 边界 | 9.5 | |
| 依赖门禁 | 9.0 | |
| 运维可证明 | 9.2 | evidence+contract+verify |
| 安全品类 | 8.5 | 签名 No-Go |
| 可测 | 8.5 | 七段 test |
| 巨石 | 7.0 | 已两抽 |
| 社区 | 5.0 | |
| **综合** | **8.7** | 打磨期可用；安装空窗拉低运营分 |

---

## 5. 同类经验：优缺点与迁移

### 5.1 上游 DreamSkin

**优**：安装故事、预设、双语、verify 控件可点。  
**缺**：与 fork 不可 merge；版本树弱。  
**迁**：话术与安全句。  
**拒**：盲合 CSS、上 mac。

### 5.2 Styler

**优**：证据门、包威胁模型、签名路线。  
**缺**：重、超 scope。  
**迁**：RELEASE-EVIDENCE、data-only、（未来）SECURITY.md。  
**拒**：Tauri 重写。

### 5.3 横向

| 能力 | 上游 | Styler | 本仓今 |
|------|------|--------|--------|
| kick | 弱 | 应用内 | 强 |
| 版本 GC | 弱 | 应用版本 | 强 |
| 仓安装校验 | 弱 | 更新器 | verify |
| 基线脚本 | 弱 | 重 | 有 |
| data-only | 图片限 | 强 | 有 |
| evidence 留痕 | verify | e2e | **P2-PROBE** |
| report 契约 | 弱 | 强 | **P2-F3** |
| 签名决策 | 摩擦 | v1 门 | **F5 文** |
| URL/预算纯测 | 弱 | 有 | **双 guard 测** |
| Creator | 托盘 | 最强 | 不做 |

---

## 6. 技术债总账（冻结）

### 6.1 已关（禁止重开）

SEC-01 token · soft reattach · test 链 · TD-01…05/11/12 · TD-02 · RELEASE-EVIDENCE · MIT · D-sync · F1 baseline · F2 工具 · F4 不 promote · **P2-PROBE** · **P2-F3** · **P3-F5** · **P2-F6plus 源码** · cdp-url 安装（51bdbe）

### 6.2 仍开

| ID | 项 | 优先级 | 说明 |
|----|-----|--------|------|
| **G-CAT** | 安装树无 theme-catalog-budget | **P0 运营** | 需 publish |
| **G-BASE** | BASELINE shortHead 落后 7d3519d | P2 | 重跑脚本 |
| DOM | 选择器脆弱 | P2 | 纪律+热修 |
| F6++ | 再抽纯函数 | P3 持续 | 可选 |
| #21/#24 | OS/签名 | 已知 | 购证 No-Go |
| 上游 promote | 有收益再评 | P3 | 默认不 |

### 6.3 永不做

mac 一等 · AUMID 劫持 · asar · 第二 injector · 盲 merge · 非 loopback · 云 doctor · 主题可执行 · 宇宙拆 injector  

---

## 7. 问题 × 多方案 × 最佳论证

评分维：用户·维护·可行·低成本·低风险·可逆·边界契合（否决维）。

### 7.1 G-CAT：安装树缺 theme-catalog-budget

| 方案 | 总分趋势 | 结论 |
|------|----------|------|
| A 拖延到下次功能 | 低 | 差：import 风险若只更 injector |
| **B publish -Version 1.3.25** | **最高** | **最佳** |
| C 手工拷一个文件 | 低 | 否：破 stamp/GC |
| D 回滚 import 内联 | 中 | 否：丢测试 |

**最佳 B**：唯一满足 ADR 0003 与自包含。  
**验收**：安装有文件；verify-install 0；doctor fresh。  
**输入**：当前 main runtime。  
**输出**：新 runtimeId（如 1.3.25-xxxxxx）。

### 7.2 BASELINE 落后 HEAD

| 方案 | 结论 |
|------|------|
| 手改 MD | 否 |
| **write-baseline.ps1** | **最佳** |
| 删除文件 | 次优 |

### 7.3 conversation 留痕不足

| 方案 | 结论 |
|------|------|
| 改 probe 语义强绑 inConversation | 可另开，非必须 |
| **发版前开对话再 Run-ReleaseProbes** | **最佳纪律** |
| CI 强制 | 否 |

### 7.4 Quiet 失败信息

| 方案 | 结论 |
|------|------|
| **现状 schemaVersion=1 + 摘要** | **最佳** |
| 失败改 exit 0 | 否假绿 |
| 删检查 | 否 |

### 7.5 上游 CSS

| 方案 | 结论 |
|------|------|
| 盲 Copy | 否 |
| **F4 不 promote** | **最佳** |
| 双轨引擎 | 否 |

### 7.6 签名

| 方案 | 结论 |
|------|------|
| **维持 A + F5 文** | **近期最佳** |
| 立即购证 | 阶段不符 |
| 去 FastLaunch | 否 |

### 7.7 巨石

| 方案 | 结论 |
|------|------|
| **继续纯函数抽测（已两例）** | **最佳** |
| 拆业务多文件 | 否 |
| TS 重写 | 否 |

### 7.8 下迭代组合

| 组合 | 结论 |
|------|------|
| **publish + verify + baseline + 可选 probe** | **最佳** |
| 仅文档 | 不关空窗 |
| 大重构 | 否 |

**元规则**：最佳方案提高「可证明正确」，且不破发布模型与威胁模型。

---

## 8. 安全与威胁模型

| 攻击者 | 在模型？ | 控制 |
|--------|----------|------|
| 局域网 | 是 | loopback + URL guard |
| 同用户误脚本 | 是 | token |
| 同用户恶意 | 否 | — |
| 恶意主题 | 是 | data-only+路径+大小 |
| npm 供应链 | 极低 | 零 prod 依赖 |
| 安装旧模块 | 是 | verify-install + publish |

---

## 9. 细节打磨参考

### 9.1 发版日（整合）

1. npm test（含 catalog-budget）  
2. 改 runtime → publish 1.3.25（**带齐 guard 文件**）  
3. verify-install 0  
4. doctor fresh  
5. write-baseline  
6. 可选 test:control  
7. Run-ReleaseProbes（conversation 先开对话）  
8. 可选 verify post-update summary  

### 9.2 代码

- 新 runtime 文件 = 拷贝清单 + Required 同 PR  
- 禁止 log token  
- MAX_* 变更写 PR 说明  
- PS 入口 5.1 友好  

### 9.3 文档

- 样本以 baseline/doctor 为准  
- skip evidence ≠ 发版完成  
- 三层表挡错需求  

### 9.4 Agent

- 任务卡含不做的事  
- 高危：主循环、鉴权、GC、AUMID  
- CLAUDE/AGENTS 同步  

---

## 10. 工作包卡片（目标/约束/IO/验收）

### 包 A · publish catalog-budget（P0）

| 字段 | 内容 |
|------|------|
| 目标 | 安装树含 theme-catalog-budget.mjs |
| 约束 | 不抬 1.3.25；不 mac |
| 输入 | main runtime 源 |
| 输出 | 新 runtimeId |
| 验收 | Test-Path 安装文件；verify-install 0；fresh |

### 包 B · 刷新 BASELINE

| 字段 | 内容 |
|------|------|
| 目标 | shortHead=7d3519d（或 publish 后新 HEAD） |
| 约束 | 勿手改 |
| 输入 | write-baseline.ps1 |
| 输出 | BASELINE.generated.md |
| 验收 | 与 rev-parse 一致 |

### 包 C · conversation 真留痕

| 字段 | 内容 |
|------|------|
| 目标 | evidence inConversation 场景 |
| 约束 | 不进 CI |
| 输入 | 已开对话 + CDP |
| 输出 | runs JSON status=ran |
| 验收 | conversationPass 且建议 inConversation |

### 包 D · SECURITY 短文（可选）

| 字段 | 内容 |
|------|------|
| 目标 | 对齐 Styler 威胁条目列表 |
| 约束 | 不改代码 |
| 输入 | dual-open + data-only |
| 输出 | docs/SECURITY.md |
| 验收 | 链 README |

### 包 E · 再抽纯函数（可选）

| 字段 | 内容 |
|------|------|
| 目标 | 第三例巨石治理 |
| 约束 | 同 F6 纪律；默认不 publish 则写空窗 |
| 输入 | injector 纯逻辑 |
| 输出 | 模块+测+清单 |
| 验收 | npm test |

### 包 REJECT

拆 injector 业务化 · 云 doctor · 盲 promote · 主题商店 · mac · 去 FastLaunch  

---

## 11. 组合投资组合

| 名 | 含 | 推荐 |
|----|----|:----:|
| **闭环-安装** | A+B±C | **是（默认）** |
| 闭环-证明-only | B+C 不 publish | 仅当禁止 publish |
| 文档加固 | D | 可选 |
| 可维护+ | E | 碰 injector 时 |
| 危险 | REJECT | 否 |

**为何闭环-安装最佳**：G-CAT 是唯一会让**用户进程直接 import 失败**的缺口；其它都是文档/证据层。符合成功标准 1/4 与 ADR 0003。

---

## 12. 成功标准映射

| 标准 | 实现 | 证据 | 残余 |
|------|------|------|------|
| 皮肤一致 | inject | probe evidence | DOM |
| 换肤快 | kick | 手感 | once |
| 单 injector | dual-open | 进程 | 旧 heige |
| fresh | current+state | doctor+verify | 未 publish 新模块 |
| 可回退 | GC+git | prev | 手删 |

---

## 13. Agent 交接段

```text
D:\orca\codex-skin · 1.3.25 · Windows CDP Skin · HEAD 7d3519d
硬边界：单 injector；core↛runtime；不 asar/AUMID/mac；publish=安装权威
已关：token、verify-install、data-only、PROBE/F3/F5、双 guard 源码测
安装：1.3.25-51bdbe 有 cdp-url-guard；无 theme-catalog-budget → 需 publish
推荐：publish -Version 1.3.25 + verify-install + write-baseline + 可选 probe
长文：docs/research/2026-07-21-master-research-v2-frozen.md
```

---

## 14. 端到端正确热修故事

读边界 → 改代码 → npm test → **publish（齐文件）** → Quiet/摘要/reattach → verify-install → doctor → write-baseline → Run-ReleaseProbes → 勾证据 → commit/push。  

**错误**：只 commit；或只更 injector 不更新 helper 文件。

---

## 15. 测试金字塔

```text
     手工 probe / evidence
    test:control
   纯函数：schema/store/adapter/freshness/cdp-url/catalog-budget
  test:deps
```

---

## 16. 反模式十条

重复已关债 · 为 star 上 mac · 云 doctor · 盲 promote · 拆 injector · 主题可执行 · Quiet 假绿 · package.json stamp · 第二 injector · 非 loopback  

---

## 17. 实现深潜（压缩）

用户点钉 → FastLaunch → open → current → injector（import guards）→ CDP URL 校验 → 读 active-theme → catalog 预算纯函数 → evaluate。  
kick：control-plane token → 进程内 apply。  
publish：拷贝树必须完整否则用户崩。

---

## 18. 进度时间线

合并 → token/reattach → 契约测试 → TD-01/02 → 主题硬化 → 证据/MIT → 上游决策 → F1/F2 工具 → **四包收口** → **待 publish catalog-budget**。

---

## 19. 多方案扩写：npm test 是否含 probe

否。分离 `probe:session`。有 CDP 才 evidence ran；skip 诚实。

---

## 20. 多方案扩写：BASELINE 提交

提交 generated + 禁手改；落后则重跑。

---

## 21. 工具命令 → 产物表

| 命令 | 产物 | 失败 |
|------|------|------|
| npm test | ok 行 | 非 0 |
| doctor | JSON | fresh false 等 |
| publish | versions | 异常/Quiet |
| verify-install | exit 0/1/2 | 漂移/未装 |
| write-baseline | MD | git/doctor 失败 |
| Run-ReleaseProbes | evidence | skip/ran/exit |
| verify post-update summary | 控制台 | 缺关键字 |

---

## 22. 边界用例十条

仅文档不 publish · 改 runtime 要清单 · 危险键拒 · 拒局域网 CDP · 拒 AUMID 劫持 · 拒 merge 上游 · Quiet+reattach=降级成功 · git 绿 verify 红≠用户好 · skip≠发版完成 · BASELINE 不手改  

---

## 23. WIP 建议

单人 WIP≤2：功能槽 + 文档/债槽。禁止并行大重构+promote+购证。

---

## 24. 术语增补

G-CAT 空窗 · evidence ran/skip · schemaVersion 报告 · catalog-budget · 正式降级 · 契约测试 vs 行为测试 · 产品线号 vs 引擎号  

---

## 25. 发版检查表（可打印）

- [ ] npm test  
- [ ] publish（若 runtime；确认 catalog-budget+cdp-url-guard 在 versions）  
- [ ] verify-install 0  
- [ ] doctor fresh  
- [ ] write-baseline  
- [ ] 可选 probes（conversation 先开聊）  
- [ ] 可选 test:control / post-update verify  

---

## 26. 主题作者浓缩

合法字段 · 禁危险键 · 图≤8MB · 无 `..` · test:themes · 预览图不当 hero  

---

## 27. 维护者双周

开发小 PR · 发版 evidence · 双周 sync 只读 · 月读 PAIN  

---

## 28. Styler 证据门映射

可靠性≈reattach/kick · 包校验≈schema · E2E≈probe evidence · 签名≈F5 文 · 双端≈有意仅 Win  

---

## 29. 风险表

| 风险 | 缓解 |
|------|------|
| 缺 catalog-budget | publish |
| DOM 变 | probe+热修 |
| 只 commit | 纪律 |
| 盲 promote | F4 |
| 签名 | 文档 |
| 文档多套 | 以本文选代 |

---

## 30. 人日

publish+verify+baseline：0.2–0.5 · conversation 留痕：0.2 · SECURITY 文：0.5 · 再抽函数：0.5  

---

## 31. 对外/对内语言

对外：任务栏打开即氛围皮肤可热切换，不改官方应用。  
对内：CDP Skin 运行时，单 injector，版本树，loopback kick，data-only 主题，publish 权威。  

---

## 32. 哲学

优雅=失败有名字、出口、证据。命名工具已齐；打磨=肌肉记忆，不是新架构语言。

---

## 33. 九问题最佳速查

| 问题 | 最佳 |
|------|------|
| 缺 catalog-budget | publish |
| 基线旧 | write-baseline |
| DOM | evidence 纪律 |
| Quiet | 摘要+reattach |
| 上游 | 不 promote |
| 签名 | A+评估 |
| 巨石 | 再抽测 |
| control CI | 本机 |
| 选代 | 闭环-安装 |

---

## 34. 任务卡模板

```text
标题/目标/非目标/约束/输入/输出/实现/验收/风险/回滚
```

### 示例 A publish

```text
标题：publish theme-catalog-budget
目标：安装 import 成功
非目标：不抬版本线；不改主题内容
约束：ADR0003
输入：7d3519d runtime
输出：1.3.25-<hash>
验收：Test-Path budget 文件；verify 0；fresh
回滚：current 指 prev + soft-reattach
```

---

## 35. 场景：上游大视觉更新

sync → diff → F4 重评 → 片段移植保 stamp → test → 可选 publish → 更新 note。禁 Copy-Item 盲盖。

---

## 36. 场景：PR 检查员

7 问 · npm test · runtime 清单 · 危险键 · dual-open 合同 · 拒 mac/拆文件  

---

## 37. 指标

npm test 100% · 改 runtime 后 verify 100% · baseline 对齐 · 双 injector 0 · sync≤14 日回顾 · 主版本 probe 建议 100%  

---

## 38. 最终决策总表

| 问题 | 淘汰 | 最佳 | 为何符合 |
|------|------|------|----------|
| G-CAT | 手工拷 | publish | 自包含+stamp |
| 基线 | 手改 | 脚本 | F1 |
| DOM | 云 CI | evidence | 真环境 |
| Quiet | 假绿 | 契约+摘要 | 信号 |
| 上游 | 盲合 | 不 promote | ADR0002 |
| 签名 | 去 exe | 文档 No-Go | 阶段 |
| 巨石 | 大拆 | 纯函数测 | 发布模型 |
| 选代 | 重构 | 闭环-安装 | 关真实空窗 |

---

## 39. 收束十条

1. 四包源码已关，阶段=关安装空窗。  
2. 护城河未变。  
3. 上游/Styler 学法不变。  
4. G-CAT 是 P0。  
5. 多方案必须过边界契合。  
6. 最佳下迭代=publish+verify+baseline±probe。  
7. 反模式仍有效。  
8. 成功标准五条是宪法。  
9. Agent 可写码，否决权在 ADR。  
10. 选代读本文；入职读 peer。  

---

## 40. 行动序

1. （已）push 四包至 origin `7d3519d`  
2. **publish 1.3.25** 带 catalog-budget  
3. verify-install · doctor · write-baseline  
4. 可选 conversation probe 勾选  
5. 持续拒绝假优化  

---

## 41. 附录：关键路径索引

injector · cdp-url-guard · theme-catalog-budget · control-plane · themes/* · publish-runtime · verify-install · write-baseline · Run-ReleaseProbes · post-update-failure-summary · contracts/post-update-report · plans/codesign · plans/upstream-promote · RELEASE-EVIDENCE · BASELINE.generated · evidence/*  

---

## 42. 附录：npm test 链

themes → store → adapter → deps → freshness → cdp-url → **catalog-budget**  

---

## 43. 附录：research 三文+本文

peer（赛道）· progress（卡片史）· 旧 integrated · **本文 v2 冻结为选代入口**  

---

## 44. 修订记录

| 日期 | 说明 |
|------|------|
| 2026-07-21 | v2 冻结：纳入 P2-PROBE/F3/F5/F6plus 与 G-CAT 空窗；整合前序 research；多方案与卡片库；汉字万字级论述结构 |

*全文完。以 git/doctor/write-baseline/verify-install/Test-Path 安装 scripts 为准。*