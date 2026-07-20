#Requires -Version 5.1
<#
.SYNOPSIS
  Uninstall Codex Dream Skin (program root + optional state).

.DESCRIPTION
  Removes %LOCALAPPDATA%\Programs\CodexDreamSkin by default.
  With -RemoveState also removes themes/active-theme/state under
  %LOCALAPPDATA%\CodexDreamSkin (user catalog is wiped).
  Does not uninstall OpenAI Codex.

  Shortcut cleanup matches install-ux layout (#18):
    daily Codex/ChatGPT/换肤 (desktop + Start Menu)
    Start Menu "Codex 工具" folder
    Startup auto-launch
    legacy "Codex Skin 高级" / scattered repair entries
  Does NOT remove Microsoft Store Codex tiles (OS package).
#>
[CmdletBinding()]
param(
  [switch]$RemoveState,
  [switch]$KeepShortcuts
)

$ErrorActionPreference = "Stop"
try {
  & chcp.com 65001 | Out-Null
  $utf8 = [System.Text.UTF8Encoding]::new($false)
  try { [Console]::OutputEncoding = $utf8 } catch {}
  $OutputEncoding = $utf8
} catch {}

$programRoot = Join-Path $env:LOCALAPPDATA "Programs\CodexDreamSkin"
$stateRoot = Join-Path $env:LOCALAPPDATA "CodexDreamSkin"
$programs = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs"
$desktop = [Environment]::GetFolderPath("Desktop")
$startup = Join-Path $programs "Startup"
$taskbar = Join-Path $env:APPDATA "Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar"

# Codepoint labels (PS 5.1 safe)
$huanfu = -join ([char]0x6362, [char]0x80A4)
$gongju = -join ([char]0x5DE5, [char]0x5177)
$switchName = "Codex " + $huanfu
$toolsName = "Codex " + $gongju

Write-Host "Uninstall Codex Dream Skin"
Write-Host "  program: $programRoot"
Write-Host "  state  : $stateRoot (remove=$RemoveState)"

# Stop watch injectors best-effort
try {
  Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -match 'CodexDreamSkin\\versions\\.*injector\.mjs' } |
    ForEach-Object {
      Write-Host "Stopping injector PID $($_.ProcessId)"
      Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }
} catch {}

# Stop tray / open scripts under program root
try {
  Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -match 'CodexDreamSkin\\.*(tray-dream-skin|open-codex-dream-skin|launcher-ui)' } |
    ForEach-Object {
      if ($_.ProcessId -ne $PID) {
        Write-Host "Stopping PS PID $($_.ProcessId)"
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
      }
    }
} catch {}

# Stop native fast launch if still running
try {
  Get-Process -Name "CodexFastLaunch" -ErrorAction SilentlyContinue |
    ForEach-Object {
      Write-Host "Stopping CodexFastLaunch PID $($_.Id)"
      Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
} catch {}

function Remove-LinkIfExists([string]$Path) {
  if (Test-Path -LiteralPath $Path) {
    Remove-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue
    Write-Host "rm  $Path"
  }
}

if (-not $KeepShortcuts) {
  $fileTargets = @(
    (Join-Path $desktop "Codex.lnk"),
    (Join-Path $desktop "ChatGPT.lnk"),
    (Join-Path $desktop ($switchName + ".lnk")),
    (Join-Path $desktop "Codex Skin.lnk"),
    (Join-Path $programs "Codex.lnk"),
    (Join-Path $programs "ChatGPT.lnk"),
    (Join-Path $programs ($switchName + ".lnk")),
    (Join-Path $programs "Codex Skin.lnk"),
    (Join-Path $programs "Codex Skin 管理.lnk"),
    (Join-Path $programs "Codex 皮肤修复.lnk"),
    (Join-Path $programs "Codex 更新回归.lnk"),
    (Join-Path $programs "Codex Skin 使用说明.lnk"),
    (Join-Path $startup "Codex Dream Skin - Auto Launch.lnk")
  )
  foreach ($t in $fileTargets) { Remove-LinkIfExists $t }

  # Taskbar pins: only remove if they still point at our FastLaunch / open script
  if (Test-Path -LiteralPath $taskbar) {
    $shell = New-Object -ComObject WScript.Shell
    foreach ($name in @("Codex.lnk", "ChatGPT.lnk")) {
      $p = Join-Path $taskbar $name
      if (-not (Test-Path -LiteralPath $p)) { continue }
      try {
        $sc = $shell.CreateShortcut($p)
        $tp = [string]$sc.TargetPath
        $args = [string]$sc.Arguments
        if ($tp -match 'CodexFastLaunch\.exe$' -or $args -match 'open-codex-dream-skin|CodexDreamSkin') {
          Remove-LinkIfExists $p
        }
      } catch {
        Write-Warning ("taskbar skip $name : " + $_.Exception.Message)
      }
    }
  }

  # Tools folder (new) + legacy advanced folders
  $dirTargets = @(
    (Join-Path $programs $toolsName),
    (Join-Path $programs "Codex Skin 高级"),
    (Join-Path $programs "Codex 高级")
  )
  Get-ChildItem -LiteralPath $programs -Directory -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Name -like "Codex Skin*" -or
      $_.Name -eq $toolsName -or
      ($_.Name -like "Codex *" -and $_.Name -match "高级|Advanced|工具")
    } |
    ForEach-Object {
      Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
      Write-Host ("rmdir " + $_.Name)
    }
  foreach ($d in $dirTargets) {
    if (Test-Path -LiteralPath $d) {
      Remove-Item -LiteralPath $d -Recurse -Force -ErrorAction SilentlyContinue
      Write-Host "rmdir $d"
    }
  }
}

if (Test-Path -LiteralPath $programRoot) {
  Remove-Item -LiteralPath $programRoot -Recurse -Force
  Write-Host "Removed program root"
} else {
  Write-Host "Program root already absent"
}

if ($RemoveState -and (Test-Path -LiteralPath $stateRoot)) {
  Remove-Item -LiteralPath $stateRoot -Recurse -Force
  Write-Host "Removed state root (themes + active-theme + logs)"
} elseif (-not $RemoveState) {
  Write-Host "State root kept (themes/active-theme). Use -RemoveState to wipe."
}

Write-Host "Uninstall done. OpenAI Codex itself was not removed."
Write-Host "Store tile (if any) is OS-owned and was not modified."
