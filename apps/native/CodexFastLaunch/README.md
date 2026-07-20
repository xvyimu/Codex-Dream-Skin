# apps/native/CodexFastLaunch
#
# 任务栏/开始菜单/桌面 Codex 的原生快启入口。
#
# ## 为什么要有它
# 旧路径 `powershell.exe -File open-codex-dream-skin.ps1` 冷启 ~3.8s：
#   PS 5.1 进程冷启 ~800ms + launcher-ui.ps1 加载 ~400ms + Add-Type C# 焦点类 ~500ms
#   + CDP/焦点探测 ~600-1000ms。用户点任务栏感觉"卡死"。
#
# 本 exe 只做：
#   1. GET http://127.0.0.1:<controlPort>/health（~30ms）
#   2. 命中 → 本进程 P/Invoke SetForegroundWindow 置前 Codex（~30-70ms）
#   3. miss  → 异步 fork open-codex-dream-skin.ps1 完整启动器
#
# 实测：冷启 ~105ms，热启 ~59ms（相对 PS 路径快 36–64×）。
#
# ## 构建
# Windows 10+ 自带 .NET Framework 4.x csc.exe，无需 SDK：
#
#   powershell -NoProfile -File apps\native\CodexFastLaunch\build.ps1
#   # 或 publish-runtime.ps1 会自动编译并安装到 programRoot
#
# 产物：`bin/CodexFastLaunch.exe`（~120KB，winexe 无控制台）
#
# ## 安装
# publish-runtime.ps1 会：
#   1. csc 编译（若源存在）
#   2. 拷到 %LOCALAPPDATA%\Programs\CodexDreamSkin\CodexFastLaunch.exe
#   3. install-ux-shortcuts.ps1 把 Codex.lnk 指向它
#
# ## 日志
# %LOCALAPPDATA%\CodexDreamSkin\fast-launch.log
