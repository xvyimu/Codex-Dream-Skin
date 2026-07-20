# TD-02 drill: fake post-update-report.json + Write-CodexSkinPostUpdateFailureSummary.
# Does NOT run publish-runtime.ps1 main flow / Quiet post-update.
# Cases A/B/C (schemaVersion=1, legacy, missing name). Exit 0 only if all pass.

$ErrorActionPreference = 'Stop'

$here = $PSScriptRoot
. (Join-Path $here 'post-update-failure-summary.ps1')

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("codex-skin-fake-report-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null

$failures = @()
$caseCount = 0

function Invoke-SummaryCase {
  param(
    [string]$Id,
    [hashtable]$Report,
    [scriptblock]$Assert
  )
  $script:caseCount++
  $reportPath = Join-Path $tempRoot ("case-$Id.json")
  $Report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8

  $output = & {
    Write-CodexSkinPostUpdateFailureSummary -ReportPath $reportPath 6>&1 | Out-String
  }

  $ok = & $Assert $output
  if (-not $ok) {
    $script:failures += $Id
    Write-Host "VERIFY FAIL case $Id"
    Write-Host "--- captured ---"
    Write-Host $output
  } else {
    Write-Host ("case ${Id}: ok")
    if ($output.Trim()) { Write-Host $output.Trim() }
  }
}

try {
  # A: schemaVersion=1, failed smoke name must print
  Invoke-SummaryCase -Id 'A' -Report @{
    schemaVersion = 1
    pass = $false
    checks = @(
      @{ name = 'smoke-dream-skin.ps1'; pass = $false; detail = 'exit=1' }
      @{ name = 'CDP verified against current Codex'; pass = $true; detail = 'ok' }
    )
    error = $null
  } -Assert {
    param($output)
    ($output -match 'smoke-dream-skin\.ps1') -and ($output -match 'post-update failed checks')
  }

  # B: legacy — no schemaVersion, still prints failed name
  Invoke-SummaryCase -Id 'B' -Report @{
    pass = $false
    checks = @(
      @{ name = 'smoke-dream-skin.ps1'; pass = $false; detail = 'exit=1' }
      @{ name = 'CDP verified against current Codex'; pass = $true; detail = 'ok' }
    )
    error = $null
  } -Assert {
    param($output)
    ($output -match 'smoke-dream-skin\.ps1') -and ($output -match 'post-update failed checks')
  }

  # C: schemaVersion=1, check missing name → (unnamed) placeholder, no throw
  Invoke-SummaryCase -Id 'C' -Report @{
    schemaVersion = 1
    pass = $false
    checks = @(
      @{ pass = $false; detail = 'x' }
    )
    error = $null
  } -Assert {
    param($output)
    ($output -match 'post-update failed checks') -and ($output -match '\(unnamed\)')
  }

  if ($failures.Count -gt 0) {
    Write-Host ("VERIFY FAIL: cases " + ($failures -join ', '))
    exit 1
  }

  Write-Host ("verify-post-update-failure-summary: ok ($caseCount cases)")
  exit 0
} finally {
  Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
