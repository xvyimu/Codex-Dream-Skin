# Shared helper: print failed check names from post-update-report.json.
# Sourced by publish-runtime.ps1 and verify-post-update-failure-summary.ps1.
# Keep this file free of publish side-effects (no Start-Process / install paths).
# Contract: docs/contracts/post-update-report.md (schemaVersion=1; legacy missing version OK).

function Write-CodexSkinPostUpdateFailureSummary {
  param([string]$ReportPath = (Join-Path $env:LOCALAPPDATA 'CodexDreamSkin\post-update-report.json'))
  if (-not (Test-Path -LiteralPath $ReportPath)) { return }
  try {
    $rep = Get-Content -LiteralPath $ReportPath -Raw -Encoding UTF8 | ConvertFrom-Json
    # schemaVersion: missing = legacy (continue); 1 or unknown larger = best-effort v1 fields.
    # Do not throw on unknown versions.

    # Soft-tolerate checks: null/missing → empty; single object or array → @(...).
    $checks = @()
    try {
      if ($null -ne $rep.PSObject.Properties['checks'] -and $null -ne $rep.checks) {
        $checks = @($rep.checks)
      }
    } catch {
      $checks = @()
    }

    $failed = @($checks | Where-Object { -not $_.pass })
    if ($rep.error) {
      Write-Host ("post-update report error: " + $rep.error)
    }
    if ($failed.Count -gt 0) {
      $parts = $failed | ForEach-Object {
        $name = if ($null -ne $_.name -and "$($_.name)".Length -gt 0) { "$($_.name)" } else { '(unnamed)' }
        $d = if ($_.detail) { " ($($_.detail))" } else { '' }
        "$name$d"
      }
      Write-Host ("post-update failed checks: " + ($parts -join '; '))
    } elseif (-not $rep.pass) {
      Write-Host "post-update report: pass=false (no per-check detail)"
    }
  } catch {
    # ignore parse errors — observability best-effort
  }
}
