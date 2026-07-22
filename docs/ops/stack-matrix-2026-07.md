# Codexveil · 栈矩阵 · 2026-07

> W1 落盘 · W2 更新 · 对照 `portfolio-arch-upgrade-2026h2/repos/cv.md` + `crosscut.md`  
> 工作树：`C:\Users\yuanjia\orca\workspaces\Codexveil\w2-cv-claude`  
> 报告：`w1-arch-upgrade-codexveil-claude.md` · `w2-arch-upgrade-codexveil-claude.md`

## 1. 当前 → 目标 → 波次

| 项 | 当前（W2 实测） | 目标（半年卡） | W1 | **W2 已做** |
|----|-----------------|----------------|----|-------------|
| **Node engines** | `>=20`（`package.json`） | 产品 runtime 仍 ≥20；开发/CI **22 LTS** | CI themes-gate **22** | 不改 engines |
| **packageManager** | `pnpm@11.5.0` | 11.5 与组合对齐 | 已对齐 | 不变 |
| **TypeScript** | `^5.9.2` | 跟补丁线 | 不 bump | 不 bump |
| **contracts** | `@codex-skin/contracts` 开发态包 | **扩大公共 API 类型** | 不扩 | **扩 inject/kick 面**：`inject.ts`（kickResult · themeInjectConfig · catalogEntry · early keys）+ 测 |
| **runtime 版本线** | `1.3.25` · stamp `publish-runtime.ps1 -Version` | 同 | 无真 publish | **无再 publish**（装态已 1.3.25-eee7c8） |
| **注入架构** | theme-load + **payload-builder** + control-plane / fs-io | 模块图强制 | S2 theme-load | **S3 payload-builder 抽出** + required 白名单 + 离线测 |
| **主题默认观感** | runtime `assets/theme.json` = **preset-arina-hashimoto** 粉系 | 默认 arina · 非 Gothic | V2 CSS/inject | 不改默认 |
| **测试门** | `npm test` = unit + contracts | DOM probe 纪律 / 主题质量门 | unit + contracts | **+ test:payload-builder · test:catalog-quality**；C-2 真机 H1–H7 纪律 |
| **可选薄壳** | launcher first-party | ADR 0005 W3–W4 | 不做 | **不做** |

## 2. 横切对齐（X-NODE / X-PNPM）

| 组合目标 | Codexveil |
|----------|-----------|
| Node CI 22 | **是**（themes-gate） |
| engines 产品 ≥20 | **是** |
| pnpm 11.5 | **是** |
| 换 UI 框架 | **禁止** |

## 3. 架构主刀进度（相对半年卡）

| 主刀 | 波 | 状态 |
|------|-----|------|
| V2 视觉对齐 Fei-Away（arina） | W1–W2 | W1 起步；W2 **未**整换 css |
| injector 模块图强制 | W2 | **S3 payload-builder** 完成；Backlog（CdpSession / stamp 接线）仍另 PR |
| 主题 schema/质量门 | W2 | **catalog-quality 测** + CONTRIBUTING C-2 真机纪律 |
| publish 白名单 = 模块图测试 | 持续 | payload-builder **required**；verify-payload 含 import 边 |

## 4. 明确不做（W2）

- `publish-runtime` 真装机 / asar  
- vendor · 默认 Gothic · V3 整文件替换 css/inject  
- Node engines 硬升 22  
- CdpSession 外提 / stamp shadow（injector-split backlog）

## 5. 验证命令

```powershell
npm test
pwsh -NoProfile -File scripts/windows/verify-publish-runtime-payload.ps1
# 期望均为 exit 0
```

## 6. 修订

| 日期 | 说明 |
|------|------|
| 2026-07-23 | W1 初版：CI Node 22 + 视觉 V2 起步 |
| 2026-07-23 | W2：contracts inject 面 · payload-builder S3 · catalog-quality · stack-matrix 列 |
