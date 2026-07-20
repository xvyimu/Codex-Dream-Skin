#Requires -Version 5.1
<#
.SYNOPSIS
  编译 CodexFastLaunch.exe（Codex Dream Skin 原生任务栏快启入口）。

.DESCRIPTION
  用 .NET Framework 4.5 内置 csc.exe 编译（Windows 10+ 都有），产出单文件 exe，
  不依赖 SDK / dotnet CLI。产物：
    apps/native/CodexFastLaunch/bin/CodexFastLaunch.exe

  发布：由 scripts/windows/publish-runtime.ps1 把 exe 拷到 programRoot/
        并在 install-ux-shortcuts.ps1 里让 Codex.lnk 直接指向它。

.PARAMETER Configuration
  Debug 生成调试符号；Release（默认）走 /optimize+。

.PARAMETER Icon
  可选，嵌入图标资源。默认从 %LOCALAPPDATA%\Programs\CodexDreamSkin\codex-icon.ico 找。
#>
[CmdletBinding()]
param(
  [ValidateSet('Debug', 'Release')][string]$Configuration = 'Release',
  [string]$Icon
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$here = Split-Path -LiteralPath $PSCommandPath -Parent
$src = Join-Path $here 'CodexFastLaunch.cs'
$outDir = Join-Path $here 'bin'
$outExe = Join-Path $outDir 'CodexFastLaunch.exe'

if (-not (Test-Path -LiteralPath $src)) { throw "source missing: $src" }
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# 找 csc.exe：优先 .NET Framework 4.x（v4.0.30319），退到 3.5
$cscCandidates = @(
  (Join-Path $env:SystemRoot 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'),
  (Join-Path $env:SystemRoot 'Microsoft.NET\Framework\v4.0.30319\csc.exe'),
  (Join-Path $env:SystemRoot 'Microsoft.NET\Framework64\v3.5\csc.exe')
)
$csc = $cscCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $csc) { throw "csc.exe not found; .NET Framework 4.x seems missing" }
Write-Host "csc = $csc"

# 图标嵌入（可选）
if (-not $Icon) {
  $default = Join-Path $env:LOCALAPPDATA 'Programs\CodexDreamSkin\codex-icon.ico'
  if (Test-Path -LiteralPath $default) { $Icon = $default }
}

# 组装 csc 参数
$cscArgs = @(
  '/nologo',
  '/target:winexe',            # 无控制台窗口
  '/platform:anycpu',
  # 不用 /langversion —— 早期 v4.0.30319 csc 只认 ISO-1..5/Default，
  # 用默认（C# 5）够 out 参数 / 传统 P/Invoke。
  '/nowarn:1701,1702',
  ('/out:"' + $outExe + '"')
)
if ($Configuration -eq 'Release') {
  $cscArgs += @('/optimize+', '/debug-')
} else {
  $cscArgs += @('/optimize-', '/debug+')
}
if ($Icon -and (Test-Path -LiteralPath $Icon)) {
  $cscArgs += ('/win32icon:"' + $Icon + '"')
  Write-Host "icon = $Icon"
}
$cscArgs += @(
  '/reference:System.dll',
  '/reference:System.Core.dll',
  ('"' + $src + '"')
)

Write-Host "compile -> $outExe"
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$cmd = $csc + ' ' + ($cscArgs -join ' ')
$proc = Start-Process -FilePath $csc -ArgumentList $cscArgs -Wait -PassThru -NoNewWindow
$sw.Stop()

if ($proc.ExitCode -ne 0) {
  throw ("csc exit=" + $proc.ExitCode)
}
$size = (Get-Item -LiteralPath $outExe).Length
Write-Host ("OK size=" + $size + "B ms=" + $sw.ElapsedMilliseconds)
Write-Host $outExe
