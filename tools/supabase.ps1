param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$SupabaseArgs
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$workspaceRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$homeDir = Join-Path $workspaceRoot ".supabase-home"

New-Item -ItemType Directory -Force -Path $homeDir | Out-Null
$env:HOME = $homeDir
$env:USERPROFILE = $homeDir

function Import-EnvFile {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    return
  }

  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) {
      return
    }

    $index = $line.IndexOf("=")
    if ($index -lt 1) {
      return
    }

    $name = $line.Substring(0, $index).Trim()
    $value = $line.Substring($index + 1).Trim().Trim('"').Trim("'")
    [Environment]::SetEnvironmentVariable($name, $value, "Process")
  }
}

Import-EnvFile -Path (Join-Path $workspaceRoot ".env")
Import-EnvFile -Path (Join-Path $workspaceRoot "backend\.env")
Import-EnvFile -Path (Join-Path $workspaceRoot "supabase\functions\.env")

Push-Location $workspaceRoot
try {
  & supabase.cmd @SupabaseArgs
  exit $LASTEXITCODE
} finally {
  Pop-Location
}
