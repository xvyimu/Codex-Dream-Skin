# ADR 0006 — 独立产品线（彻底脱离原仓库）

- **状态**：Accepted
- **日期**：2026-07-22
- **相关**：0001（产品线合并）、**0002（废止）**、0003（单一版本源）、0004（工程现代化）

## 背景

GitHub 上 `xvyimu/Codexveil` **已不是 fork**（`isFork: false`，无 parent）。
开发树却仍保留：

- git remote `upstream` → `Fei-Away/Codex-Dream-Skin`
- `scripts/windows/sync-upstream-assets.ps1` + `docs/upstream-sync.json` 的「定期对照」叙事
- 文档里「fork / 上游 promote 流水线」措辞

这些会把维护者拉回「跟着原仓走」的心智，与「完全当成新项目开发」冲突。

## 决策

1. **唯一 remote：`origin`**（`xvyimu/Codexveil`）。删除 `upstream` remote 与其 tracking refs。
2. **废止 ADR 0002 的「在线上游同步」机制**：不再 `git fetch upstream`、不再把
   `lastSyncedUpstreamSha` 当活基线、不再把「对原仓 PR / 盲 promote」当工作流。
3. **`vendor/dreamskin/` 降级为冻结第三方快照**：保留文件（许可合规 + 可选人工 diff），
   但 **不**当作可自动刷新的上游镜像；生产路径继续禁止 import。
4. **`sync-upstream-assets.ps1` 退役**：脚本改写为明确拒绝执行并指向本 ADR（避免误跑
   去 fetch 已不存在的 remote）。
5. **开发体系以本仓文档为准**：`docs/PROJECT.md` · `docs/ARCHITECTURE.md` ·
   `docs/CONTRIBUTING.md` · ADR 0001/0003/0004/0005 · 任务卡。需要外部灵感时，
   走一次性调研笔记，不建长期 git 链接。

## 结果

| 项 | 之前 | 之后 |
|----|------|------|
| git remotes | origin + upstream | **仅 origin** |
| 上游同步脚本 | 可 fetch / 刷 vendor | **退役**（exit 非 0 + 说明） |
| `upstream-sync.json` | 活基线 | **归档冻结**（`status: retired`） |
| vendor | 「上游镜像」 | **冻结第三方快照**（NOTICE） |
| 产品/安装名 | CodexDreamSkin | **不变**（非 fork 痕迹，是产品品牌） |

## 权衡

- 不再自动获知第三方仓的 CSS/PS 修复；若将来有价值，用 **一次性** `gh`/浏览器
  调研 + 人工移植，并写进当期 research 笔记——**不**重建 remote。
- git 历史里仍有旧 commit 消息与 research 文档含「upstream」字样；不 rewrite 历史。
  现行规则以本 ADR + `GITHUB_IDENTITY.md` 为准。

## 不做

- 不 `filter-repo` / 不压扁历史（成本高、无许可收益）
- 不改安装路径 / AUMID / 产品显示名
- 不删除 `vendor/dreamskin/` 文件内容（避免丢掉可对照资产与 NOTICE 义务）
