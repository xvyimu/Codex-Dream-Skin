# TD-02 drill: fake post-update-report.json + Write-CodexSkinPostUpdateFailureSummary.
# Does NOT run publish-runtime.ps1 main flow / Quiet post-update.
# Exit 0 when output contains failed check name; else exit 1.

$ErrorActionPreference = 'Stop'

$here = $PSScriptRoot
. (Join-Path $here 'post-update-failure-summary.ps1')

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("codex-skin-fake-report-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
$reportPath = Join-Path $tempRoot 'post-update-report.json'

try {
  $report = @{
    pass = $false
    checks = @(
      @{ name = 'smoke-dream-skin.ps1'; pass = $false; detail = 'exit=1' }
      @{ name = 'CDP verified against current Codex'; pass = $true; detail = 'ok' }
    )
    error = $null
  }
  $report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8

  $output = & {
    Write-CodexSkinPostUpdateFailureSummary -ReportPath $reportPath 6>&1 | Out-String
  }

  $okName = $output -match 'smoke-dream-skin\.ps1'
  $okPrefix = $output -match 'post-update failed checks'

  if (-not $okName -or -not $okPrefix) {
    Write-Host "VERIFY FAIL: expected failed check name + prefix in summary output"
    Write-Host "--- captured ---"
    Write-Host $output
    exit 1
  }

  Write-Host $output.Trim()
  Write-Host "verify-post-update-failure-summary: ok"
  exit 0
} finally {
  Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
