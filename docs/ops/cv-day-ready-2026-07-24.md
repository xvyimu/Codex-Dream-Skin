# Codexveil · DAY 装机就绪 runbook · 2026-07-24

**MODE：** `day-ready-docs` · **WRITE_POLICY：** `local-commit`（可补丁 + 本地 commit；**禁止 push / asar**）  
**WT / 支：** `C:\Users\yuanjia\orca\workspaces\Codexveil\cv-day-ready-docs` · `xvyimu/cv-day-ready-docs`  
**基线 tip：** `435dac7`（`xvyimu/cv-oss-ready` 对齐 · arina-only 纠偏后）  
**STACK_SSOT：** [`docs/PROJECT.md`](../PROJECT.md) §1.5  
**前序：** [`cv-oss-gap-2026-07-23.md`](./cv-oss-gap-2026-07-23.md)（L0–L2 矩阵）  
**OUT_OF_SCOPE：** asar 重打 · glass 默认开 · 未授权 push · 第二 injector · catalog 膨胀 · 本会话 publish

---

## 一句话

DAY 就绪 = **OSS L1 门闩齐** + **装机版本/主题/自启可复述** + **故障树可按 doctor 走** + **`npm test` 绿**。  
本机实测（2026-07-23）：产品线 **1.3.25** · runtimeId **`1.3.25-da2adc`** · active **`preset-arina-hashimoto`** · Startup **OFF**。

---

## 1. 版本号来源（ADR 0003）

| 层 | 权威 | 本机例 |
|----|------|--------|
| 产品线 semver | 根 `package.json` `"version"` | **1.3.25** |
| **唯一 stamp 源** | `scripts/windows/publish-runtime.ps1 -Version <x.y.z>` | 写入 `SKIN_VERSION_TOKEN` + `versions/<runtimeId>/` |
| 装机指针 | `%LOCALAPPDATA%\Programs\CodexDreamSkin\current.json` | `version=1.3.25` · **`runtimeId=1.3.25-da2adc`** · `relativeEnginePath=versions/1.3.25-da2adc` · `updatedAt=2026-07-22T19:44:02Z` |
| 运行态 | `%LOCALAPPDATA%\CodexDreamSkin\state.json` | `runtimeId` / `injectorPath` 应对齐 current |
| git tip | `git rev-parse HEAD` | **≠** 装机字节权威；tip 超前时须人 gate 再 publish |

**认 fresh 的顺序：**

```text
current.json.runtimeId
  → state.json.runtimeId / injectorPath
  → doctor.injectorPathFreshness.fresh === true
  → （可选）SKIN_VERSION 与 expected 一致
```

**不要**用「git tip  alone」判定用户机已升级。  
**产品 zip**（`Build-ProductPackage.ps1`）只 stamp 包内/安装态，**不是**第二版本权威（ADR 0003 补充）。

### 快速读装机

```powershell
$root = "$env:LOCALAPPDATA\Programs\CodexDreamSkin"
Get-Content "$root\current.json" -Raw
# 期望：version 1.3.25 · runtimeId 形如 1.3.25-<hash6>
$rel = (Get-Content "$root\current.json" -Raw | ConvertFrom-Json).relativeEnginePath
Test-Path (Join-Path $root $rel 'scripts\injector.mjs')
```

---

## 2. 主题 preset（arina-only）

| 项 | 值 |
|----|-----|
| 产品决议 | **arina-only**（扩 catalog 须 ADR） |
| 仓内 `themes/` | **仅** `preset-arina-hashimoto/`（`theme.json` + `hero.jpg`） |
| CLI 默认 | `DEFAULT_THEME_ID = "preset-arina-hashimoto"`（`packages/core/constants.mjs`） |
| runtime 模板 | `packages/runtime/assets/theme.json` → 同 id |
| 装态 active | `%LOCALAPPDATA%\CodexDreamSkin\active-theme\` · id 同 arina |
| 装态 catalog | `%LOCALAPPDATA%\CodexDreamSkin\themes\preset-arina-hashimoto\`（用户可另增 schema 主题；F6 循环**本机 catalog**） |
| palette（源） | accent `#E8A0BF` · surface `#1A1218` · text `#FFF0F5` · secondary `#C9A0DC` |
| glass | injector `glass()` = DOM 探测 helper；**非** 默认开 MS glass（V3 矩阵 forbidden default-on） |

```powershell
node packages/core/cli.mjs list
node packages/core/cli.mjs apply   # 省略 --theme → arina
# 或
node packages/core/cli.mjs apply --theme preset-arina-hashimoto
```

历史文档「11 套」仅在 AUDIT/旧 ops 长文；入口 README / usage / PROJECT **已纠偏**。

---

## 3. Auto-launch / Startup 默认

| 检查 | 期望 | 本机 2026-07-23 |
|------|------|-----------------|
| `install-ux-shortcuts.ps1` | **删除** `Codex Dream Skin - Auto Launch.lnk`，**不重建** | 源码 L189–195 明文 disabled |
| `%APPDATA%\…\Programs\Startup` | **无** Codex/DreamSkin auto-launch lnk | `Test-Path …Auto Launch.lnk` → **False** |
| `HKCU\…\Run` | **无** CodexDreamSkin / codex-skin 值 | 无相关键 |
| 文档 | usage / PRODUCT-LAYERS：**默认关闭** | 一致 |

需要开机自启时：**用户**在「设置 → 应用 → 启动」或 Startup 文件夹自行添加 `CodexFastLaunch.exe`（安装根下）；**不要**让 publish 静默写 Startup。

```powershell
$startup = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
Test-Path "$startup\Codex Dream Skin - Auto Launch.lnk"   # expect False
Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' |
  Select-Object *codex*,*Codex*,*Dream* -ErrorAction SilentlyContinue
```

---

## 4. 故障树（先 doctor，再动手）

运维命令地图（何时 doctor / smoke / 勿当 CI）：[`cv-doctor-smoke-map-2026-07-24.md`](./cv-doctor-smoke-map-2026-07-24.md)。

前置：

```powershell
cd D:\orca\Codexveil   # 或本 worktree
node packages/core/cli.mjs doctor
node packages/core/cli.mjs status
```

| 现象 | 先看 | 动作 | 勿做 |
|------|------|------|------|
| **无皮肤** | `appFound` · `processRunning` · CDP 9335 · `injectorAlive` | 任务栏 **Codex**（FastLaunch）再开；或「Codex 工具 → 皮肤修复」 | 改 asar；用商店磁贴裸启（#21） |
| **商店磁贴裸启** | 入口是否 AUMID | 改用任务栏钉的 Codex lnk | 劫持 Store 包身份 |
| **换肤无效** | active-theme 时间戳 · `controlPort` 9336 · kick 200 | `apply --theme …`；确认 POST `/kick` 带 token | 手写 active-theme 绕 themes 包 |
| **双 injector** | `state.injectorPid` · 进程列表 | `check-and-fix` / 全局清扫留一条 | 并行第二守护 |
| **版本错乱 / 不 fresh** | `current.json` vs `state.runtimeId` vs injectorPath | 人 gate：`publish-runtime.ps1 -Version 1.3.25` 后 doctor | 手改 versions/ 半份拷贝 |
| **F6 无感** | tip 已修、装态 payload 旧（#25） | 维护者 publish 对齐；或 dev `--watch` | 当用户机 bug 盲改 renderer |
| **SmartScreen** | 未 OV 签名（#24） | 「更多信息 → 仍要运行」 | 当安装失败重装 |
| **payload / 注入失败** | catalog 是否塞全图 | catalog 只嵌缩略图 | 超 4MB evaluate |
| **无背景图** | art 通道 / theme image 路径 | 对照 active-theme `hero` + art 字段 | 改 core 写皮肤 |
| **控制面 401** | `control.token` 仅 stateRoot | kick-inject / launcher 自动带头；勿把 token 提交 git | 日志打印 token |

### 健康画像（参考）

```text
appFound: true
dreamSkin.injectorAlive: true
injectorPathFreshness.fresh: true
themeCount / userThemeCount: ≥ 1（arina）
paused/locked: false
control: { port: 9336, tokenPresent: true }
```

### 红线（本 runbook 会话与日常）

1. **禁止** 修改 / 重打 Codex `.asar`  
2. **禁止** 未授权 `git push`  
3. **禁止** 第二 injector / 第二守护路径  
4. **禁止** 默认写 Startup  
5. **禁止** 密钥 / `control.token` 进库  

---

## 5. OSS L1 门闩（加深 · 对照）

| 项 | 状态 | 路径 |
|----|------|------|
| LICENSE MIT | OK | `LICENSE` |
| NOTICE | OK | `NOTICE` |
| README hub | OK | `README.md` |
| CONTRIBUTING | OK | 根短 + `docs/CONTRIBUTING.md` |
| SECURITY | OK | 根 + `docs/SECURITY.md` |
| CHANGELOG | OK | `docs/CHANGELOG.md` |
| .gitignore env | OK | `.env*` / pem / `control.token` |
| **.editorconfig** | **本会话补** | 根 `.editorconfig` |
| GITHUB_IDENTITY | OK | 仓名 / 安装名分离 |
| PRODUCT-LAYERS | OK | L0–L6 · arina-only · Startup off |
| Dependabot | OK | `.github/dependabot.yml`（WAVE-1） |
| PR 模板 | OK | `.github/pull_request_template.md` |
| CI themes-gate | OK | ≠ doctor/live CDP |
| CODE_OF_CONDUCT | **P2 债** | 单人；`COC_REQUIRED=false` 不阻塞 |
| Issue 模板 / CODEOWNERS | P2 | 选修 |
| CI `pnpm audit` | DEFER | npmmirror 无 audit endpoint |

**L0/L1：** 继承 WAVE-1 **PASS**；本会话仅 editorconfig 硬化 + 本文 runbook。

---

## 6. DAY 验证清单

```powershell
# 仓
git status -sb
git rev-parse --short HEAD
npm test                          # 记 exit code

# 装机（只读）
Get-Content "$env:LOCALAPPDATA\Programs\CodexDreamSkin\current.json"
Test-Path "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\Codex Dream Skin - Auto Launch.lnk"

# 可选 live（不进 CI）
node packages/core/cli.mjs doctor
```

| 检查 | 期望 |
|------|------|
| `npm test` | exit **0** |
| current.json | 1.3.25 + runtimeId 存在 |
| Startup auto lnk | **False** |
| push | **未做** |
| asar | **未做** |

---

## 7. 本会话落地

| 项 | 结果 |
|----|------|
| 本文 | `docs/ops/cv-day-ready-2026-07-24.md` |
| `.editorconfig` | 根目录新增（L1 加深） |
| overview 指针 | 挂 ops day-ready |
| CHANGELOG | Unreleased 记一笔 |
| `npm test` | 见提交说明 / 会话验证 |
| push / asar / publish | **否** |

---

## 8. 相关链接

- 形态与栈：[`PROJECT.md`](../PROJECT.md)  
- 产品分层：[`PRODUCT-LAYERS.md`](../PRODUCT-LAYERS.md)  
- 用户说明：[`usage.md`](../usage.md)  
- 痛点：[`PAIN-POINTS.md`](../PAIN-POINTS.md) #21 #24 #25  
- 版本 ADR：[`adr/0003-single-version-source.md`](../adr/0003-single-version-source.md)  
- OSS 矩阵：[`cv-oss-gap-2026-07-23.md`](./cv-oss-gap-2026-07-23.md)  
