<#
.SYNOPSIS
  Deploys TavernBoard (p/<Namespace>/tavernkit + r/<Namespace>/tavernboard) to Gno.land Onyx testnet (onyx-1).
.DESCRIPTION
  Safely stages a namespace-rewritten copy under a temporary folder, verifies all imports,
  and broadcasts two `gnokey maketx addpkg` transactions using your local gnokey key.
  NEVER stores, logs, or commits any seed phrases or private keys.
.EXAMPLE
  .\scripts\deploy-onyx.ps1 -KeyName mykey -Namespace g1youraddresshere...
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$KeyName,

    [Parameter(Mandatory = $true)]
    [string]$Namespace,

    [string]$ChainID = 'onyx-1',
    [string]$Remote = 'https://rpc.onyx.testnets.gno.land:443',
    [string]$GasFee = '500000ugnot',
    [int64]$GasWanted = 150000000,
    [string]$MaxDeposit = '25000000ugnot',
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$toolsBin = 'C:\Users\69426\.gemini\antigravity\scratch\survival-challenge\tools\gno-bin\gnokey.exe'
$gnokey = if (Test-Path $toolsBin) { $toolsBin } else { 'gnokey' }

if ($Namespace -notmatch '^g1[a-z0-9]{38}$') {
    Write-Warning "Namespace '$Namespace' does not look like a standard g1... bech32 address. Continuing anyway..."
}

$pPath = "gno.land/p/$Namespace/tavernkit"
$rPath = "gno.land/r/$Namespace/tavernboard"

$stage = Join-Path ([System.IO.Path]::GetTempPath()) ("tavernboard-deploy-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path "$stage\p\tavernkit","$stage\r\tavernboard" -Force | Out-Null

try {
    Copy-Item -Recurse -Force "$root\p\tavernkit\*" "$stage\p\tavernkit\"
    Copy-Item -Recurse -Force "$root\r\tavernboard\*" "$stage\r\tavernboard\"

    # Rewrite module paths & cross-package import in staged copy ONLY.
    (Get-Content "$stage\p\tavernkit\gnomod.toml" -Raw) -replace 'gno\.land/p/tavernboard/tavernkit', $pPath | Set-Content "$stage\p\tavernkit\gnomod.toml" -NoNewline
    (Get-Content "$stage\r\tavernboard\gnomod.toml" -Raw) -replace 'gno\.land/r/tavernboard/tavernboard', $rPath | Set-Content "$stage\r\tavernboard\gnomod.toml" -NoNewline

    Get-ChildItem "$stage\r\tavernboard\*.gno" | ForEach-Object {
        $raw = Get-Content $_.FullName -Raw
        $updated = $raw -replace 'gno\.land/p/tavernboard/tavernkit', $pPath
        Set-Content $_.FullName $updated -NoNewline
    }

    Write-Host "Staged deployment packages:" -ForegroundColor Cyan
    Write-Host "  1) Pure package : $pPath"
    Write-Host "  2) Realm        : $rPath"
    Write-Host "  Target network  : $ChainID ($Remote)"

    if ($DryRun) {
        Write-Host "`n[DryRun] Would execute:" -ForegroundColor Yellow
        Write-Host "$gnokey maketx addpkg -pkgpath `"$pPath`" -pkgdir `"$stage\p\tavernkit`" -gas-fee $GasFee -gas-wanted $GasWanted -max-deposit $MaxDeposit -chainid $ChainID -remote $Remote -broadcast $KeyName"
        Write-Host "$gnokey maketx addpkg -pkgpath `"$rPath`" -pkgdir `"$stage\r\tavernboard`" -gas-fee $GasFee -gas-wanted $GasWanted -max-deposit $MaxDeposit -chainid $ChainID -remote $Remote -broadcast $KeyName"
        return
    }

    Write-Host "`n=== Step 1/2: Deploying $pPath ===" -ForegroundColor Green
    & $gnokey maketx addpkg `
        -pkgpath $pPath `
        -pkgdir "$stage\p\tavernkit" `
        -gas-fee $GasFee `
        -gas-wanted $GasWanted `
        -max-deposit $MaxDeposit `
        -chainid $ChainID `
        -remote $Remote `
        -broadcast `
        $KeyName
    if ($LASTEXITCODE -ne 0) { throw "Deployment of $pPath failed." }

    Write-Host "`n=== Step 2/2: Deploying $rPath ===" -ForegroundColor Green
    & $gnokey maketx addpkg `
        -pkgpath $rPath `
        -pkgdir "$stage\r\tavernboard" `
        -gas-fee $GasFee `
        -gas-wanted $GasWanted `
        -max-deposit $MaxDeposit `
        -chainid $ChainID `
        -remote $Remote `
        -broadcast `
        $KeyName
    if ($LASTEXITCODE -ne 0) { throw "Deployment of $rPath failed." }

    Write-Host "`nDEPLOYED LIVE ON ONYX ($ChainID)!" -ForegroundColor Green
    Write-Host "  gnoweb URL : https://onyx.testnets.gno.land/r/$Namespace/tavernboard" -ForegroundColor Yellow
    Write-Host "  Pure pkg   : https://onyx.testnets.gno.land/p/$Namespace/tavernkit" -ForegroundColor Yellow
} finally {
    if (Test-Path $stage) {
        Remove-Item -Recurse -Force $stage -ErrorAction SilentlyContinue
    }
}
