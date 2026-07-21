# ADR 0005 — 薄产品壳（U3 · 可选 Tauri L1）

- **状态**：Proposed（依赖 **0004** 契约面；**不**替换 watch 守护）
- **日期**：2026-07-21
- **相关**：0001 · 0003 · **0004（U1 前置）** · dual-open-policy · codesign-decision

## 背景

同类产品（Codex-NN、Styler、Jason Theme Studio）用桌面 GUI 降低「脚本恐惧」。本仓差异化是 **Windows 运行时守护**，不是 Creator IDE。用户表单选择 **U1+U3**：在工程现代化之后，增加 **薄产品壳** 做主题切换/预览/导入，**明确不替换** `injector --watch`。

## 决策

### D1. 壳与核分离

```text
[Tauri/L1 壳] --HTTP/IPC--> [control-plane 9336 + CLI] --kick--> [watch injector L4]
                禁止：壳内再起第二套 CDP 长驻注入器
```

| 组件 | 允许 | 禁止 |
|------|------|------|
| **壳（U3）** | 列表主题、apply、预览缩略图、打开 doctor 摘要、导入主题目录/zip | 自建 watch CDP 守护、绕过 token、改 asar |
| **核（现 runtime）** | 唯一页面注入与 reattach | 被壳进程生命周期 bind 死（壳退出 ≠ 卸皮，除非用户显式 restore） |

### D2. 技术选型（默认）

- **Tauri 2** + 前端轻量（React/Svelte/Solid 三选一，实施时定；优先包体与安全默认值）  
- 调用面：优先 **已有** control-plane + `cli.mjs`；若需新 API，先扩 contracts（0004）再实现  
- 分发：可选便携 zip；**Authenticode 不绑定 MVP**（延续 SmartScreen 文档化；签名另决策）

### D3. 平台

- **Windows 第一**；macOS 壳不在本 ADR 范围（避免 0004 放宽被解释为平台全面放开）

### D4. 安全

- 壳不读对话、不读 API key  
- 主题导入走 **同核校验**（schema/对比度/路径），不在壳内 `eval`  
- 若壳起本地 HTTP：仅 `127.0.0.1` + 短命 token（对齐 Jason/heige 模型）

### D5. 与 U1 的顺序

1. **0004** 至少完成：contracts 初版 + control/doctor 类型 + kick 客户端可测  
2. 再脚手架 Tauri 调 `apply`/`list`/`doctor`  
3. stamp/probe-kit 可并行，不阻塞壳的只读管理功能  

### D6. 成功标准（MVP）

- 用户能：浏览 11+ 用户主题、一键 apply、见 kick 结果、见 fresh 布尔  
- 全程 **仅一个** watch injector（doctor 可证）  
- 卸载壳 ≠ 必须卸皮；显式「恢复原生」才走 restore 路径  

## 结果

- L1 体验接近竞品管理器，**不**放弃零第二守护纪律  
- 壳可独立版本号；runtime 线仍 0003  

## 权衡 / 代价

| 代价 | 缓解 |
|------|------|
| Rust/Node 双工具链 | 壳仓可 `apps/shell` 隔离；文档分受众 |
| 包体与 SmartScreen | 文档「仍要运行」；可选后续签名 |
| 范围膨胀成 Styler | MVP 清单冻结；伴侣/AI 生成 **Out** |

## 非目标

- 窗内 F6 完整 catalog 热循环（#25 另卡）  
- 主题市场、账号系统  
- 2GB 安装树镜像  
- 替换 publish-runtime 为「仅 GUI 发布」  

## 实施状态

**未实施。** 见两周排期文档（第 2 周仅尖兵，完整 U3 在 U1 骨架后）。  

## 参考

- slovx2/Codex-NN（兼容 Dream Skin 包、Tauri）  
- xuhuanstudio/codex-styler（壳+证据门，重；本仓只学边界话术）  
- 本仓 `apps/native/CodexFastLaunch`（已有原生入口先例）  
