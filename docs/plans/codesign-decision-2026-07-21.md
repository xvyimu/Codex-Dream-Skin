# 代码签名 / SmartScreen 决策 · 2026-07-21

- 关联：[`PAIN-POINTS.md`](../PAIN-POINTS.md) #24 · [`usage.md`](../usage.md) SmartScreen · research §7.5 / 包 P3-F5 · TD-16
- 事实源：[`2026-07-21-progress-aligned-debt-and-portfolio.md`](../research/2026-07-21-progress-aligned-debt-and-portfolio.md) §7.5 · FastLaunch [`README`](../../apps/native/CodexFastLaunch/README.md)
- **本轮决策：近期 No-Go 购证 · 维持 A（文档「仍要运行」）**；分发扩大后再评估 B

## 背景

1. **#24**：首次运行时 Windows SmartScreen 可能拦截**未签名**入口（「Windows 保护了你的电脑」）。
2. **主入口**：`CodexFastLaunch.exe`（任务栏 / 开始菜单 / 桌面 / Startup）；冷启约 ~100ms，相对 PS 路径 36–64×。
3. **Install 入口**：产品包 / Install 落到未签名 native 或脚本入口；摩擦在**首次信任提示**，不是安装逻辑 bug。
4. **现状缓解**：[`usage.md`](../usage.md)「更多信息 → 仍要运行」；**非**安装失败。

## 选项

| 选项 | 做法 | 判定 |
|------|------|------|
| **A** | 维持文档「仍要运行」；不购证 | **近期采用** |
| **B** | OV 或 EV 代码签名 + 密钥保管 + CI/发版签名流水线 | **分发扩大时再评估** |
| **C** | 去掉 native exe，仅脚本入口 | **不推荐**（回退 PAIN #5/#17 已修的冷启体验） |

（不评估商店上架皮肤等不可行形态。）

## 成本维度

| 维度 | 量级 / 说明 |
|------|-------------|
| 证书费用 | **公开行业量级、非报价**：OV 代码签名常见约 **数百美元/年** 量级；EV 常见 **更高数百～近千美元/年** 量级；近年多要求硬件 token / 云 HSM，总拥有成本高于「只买文件证书」时代。**非本仓询价、非下单依据。** |
| 密钥保管 | USB token / 云 HSM；私钥不得进 git；备份与吊销流程；个人/组织身份核验周期（常数日～数周） |
| CI 签名流水线 | 发版机或 CI 调 `signtool` / `Set-AuthenticodeSignature`；产物哈希；token 解锁；失败则阻断发版 |
| 时间 | 核验 + 采购 + 流水线 + 首次 SmartScreen 声誉积累（即使签名后，新发布者声誉仍可能需下载量/时间；**不承诺**签名后零提示） |

## 推荐决策

1. **近期（当前产品阶段）**：**No-Go 购证** → **维持 A**。
2. **理由**：B 的费用 + 密钥治理 + 流水线与当前自用/小范围分发不匹配；对标 Styler 亦把签名放在 v1 门后（路线图门闩，非本仓当前必须项）；A 已文档化且可逆。
3. **C 否决**：FastLaunch 已证明任务栏 ~100ms 路径价值；去掉 exe 会回退冷启摩擦（PAIN 已关路径）。
4. **重评 B 的触发条件**（满足任一即开评估卡，**仍不自动采购**）：
   - 对外分发扩大（非作者本机 / 明确第三方用户群）
   - SmartScreen 成为主诉「安装失败」（数据或重复报告，而非首次可点「仍要运行」）
   - 有预算与密钥托管方案（含 CI）且维护者愿意承担吊销/续期
5. **B 若将来 Go**：优先评估 **OV vs EV** 与 token 托管，另开决策/实施卡；**本文件不授权采购**。

## 禁止与验收

**禁止**：本文 **不**授权购买证书、不授权改/删 FastLaunch、不授权签名二进制、不引入 signtool CI。

**验收**：

1. 本文存在：`docs/plans/codesign-decision-2026-07-21.md`
2. [`PAIN-POINTS.md`](../PAIN-POINTS.md) #24 或 [`RELEASE-EVIDENCE.md`](../RELEASE-EVIDENCE.md) 有一行链到本文
3. 无代码 / 二进制 / 版本变更（diff 仅 docs）
