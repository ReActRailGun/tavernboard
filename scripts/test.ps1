# Run all GnoVM unit tests and linter for TavernBoard against the exact Onyx v1.8.0 toolchain.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$tools = 'C:\Users\69426\.gemini\antigravity\scratch\survival-challenge\tools'
$gnoBin = Join-Path $tools 'gno-bin\gno.exe'
$gnoSrc = Join-Path $tools 'gno-src'

if (!(Test-Path $gnoBin)) {
    $gnoBin = 'gno'
}

$exP = Join-Path $gnoSrc 'examples\gno.land\p\tavernboard'
$exR = Join-Path $gnoSrc 'examples\gno.land\r\tavernboard'

# Remove stale junctions/dirs if present and copy fresh project files into v1.8.0 examples workspace
# (avoids Gno's Windows backslash bug in remote modcache downloads while verifying against exact Onyx stdlibs).
foreach ($d in @($exP, $exR)) {
    if (Test-Path $d) {
        cmd /c rmdir /s /q "$d" | Out-Null
    }
}
Copy-Item -Recurse -Force (Join-Path $root 'p') $exP
Copy-Item -Recurse -Force (Join-Path $root 'r') $exR

$env:GNOROOT = $gnoSrc
Push-Location (Join-Path $gnoSrc 'examples')
try {
    Write-Host "=== 1. gno test -v ./gno.land/p/tavernboard/tavernkit ===" -ForegroundColor Cyan
    & $gnoBin test -v ./gno.land/p/tavernboard/tavernkit
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host "`n=== 2. gno test -v ./gno.land/r/tavernboard/tavernboard ===" -ForegroundColor Cyan
    & $gnoBin test -v ./gno.land/r/tavernboard/tavernboard
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host "`n=== 3. gno lint ===" -ForegroundColor Cyan
    & $gnoBin lint ./gno.land/p/tavernboard/tavernkit ./gno.land/r/tavernboard/tavernboard
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host "`nALL TESTS AND LINT PASSED!" -ForegroundColor Green
} finally {
    Pop-Location
    foreach ($d in @($exP, $exR)) {
        if (Test-Path $d) {
            cmd /c rmdir /s /q "$d" | Out-Null
        }
    }
}
