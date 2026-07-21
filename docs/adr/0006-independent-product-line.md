# ADR 0006 — 独立产品线（彻底脱离原仓库）

- **状态**：Accepted（2026-07-22 修订：删除工作树 `vendor/` 与 `docs/research/`）
- **日期**：2026-07-22
- **相关**：0001（产品线合并）、**0002（废止）**、0003（单一版本源）、0004（工程现代化）

## 背景

GitHub 上 `xvyimu/Codexveil` **已不是 fork**（`isFork: false`，无 parent）。曾保留
`upstream` remote、vendor 镜像同步脚本与 research 考古文，妨碍「完全当新项目开发」。

## 决策

1. **唯一 remote：`origin`**（`xvyimu/Codexveil`）。删除 `upstream` remote。
2. **废止 ADR 0002 在线同步**（脚本与 `upstream-sync.json` 已删除）。
3. **工作树删除 `vendor/dreamskin/`**（2026-07-22）：不再保留第三方快照目录；
   历史内容仅存在于 **git history**（不 filter-repo）。
4. **工作树删除 `docs/research/`**（2026-07-22）：调研长文仅在 git history。
5. **装机脚本 first-party**：tray / launch / restore 在 `apps/launcher/`；
   `publish-runtime.ps1` 只从 `apps/launcher` + `packages/*` 拷贝。
6. **开发体系**：`docs/PROJECT.md` · `ARCHITECTURE` · `CONTRIBUTING` · ADR 0001/0003/0004/0005。

## 结果

| 项 | 之后 |
|----|------|
| git remotes | **仅 origin** |
| vendor / research | **工作树无**（历史可查） |
| publish | 只拷 first-party |
| 产品/安装名 | CodexDreamSkin **不变** |

## 不做

- 不 `filter-repo` 压历史（旧 blob 仍在 history，直到将来单独授权）
- 不改安装路径 / AUMID / 产品显示名
