<#
.SYNOPSIS
  Checks Onyx (onyx-1) GPAO activation status and seeds 3 live demo quests onto TavernBoard.
.DESCRIPTION
  Reads key names/addresses from the local wallet JSON files (outside this git repo) without
  ever printing mnemonics or passphrases. Once gpao enables the parked inert packages, this
  script seeds:
    - Quest #1: Multi-milestone IN REVIEW (M0 paid from isolated escrow/1, M1 submitted)
    - Quest #2: OPEN 3 GNOT quest ready for judges/visitors to claim via gnoweb txlink
    - Quest #3: COMPLETED 1.5 GNOT quest (ranks builder in Guild Hall with live SVG Guild Crest)
#>
param(
    [string]$WalletDir = 'C:\Users\69426\.gemini\antigravity\scratch\survival-challenge\wallet',
    [string]$Rpc = 'https://rpc.onyx.testnets.gno.land:443',
    [string]$ChainID = 'onyx-1'
)

$ErrorActionPreference = 'Stop'
$toolsBin = 'C:\Users\69426\.gemini\antigravity\scratch\survival-challenge\tools\gno-bin\gnokey.exe'
$gnokey = if (Test-Path $toolsBin) { $toolsBin } else { 'gnokey' }

$dep = Get-Content (Join-Path $WalletDir 'gno_tavern_deployer.json') -Raw | ConvertFrom-Json
$bld = Get-Content (Join-Path $WalletDir 'gno_tavern_builder.json') -Raw | ConvertFrom-Json

$ns = $dep.address
$pPath = "gno.land/p/$ns/tavernkit"
$rPath = "gno.land/r/$ns/tavernboard"

Write-Host "Checking live status on $ChainID..." -ForegroundColor Cyan
$metaP = & $gnokey query vm/qpkgmeta_json -data $pPath -remote $Rpc 2>&1 | Out-String
$metaR = & $gnokey query vm/qpkgmeta_json -data $rPath -remote $Rpc 2>&1 | Out-String
Write-Host "  tavernkit  : $($metaP.Trim() -replace '\s+', ' ')"
Write-Host "  tavernboard: $($metaR.Trim() -replace '\s+', ' ')"

if ($metaR -notmatch '"status"\s*:\s*"live"') {
    Write-Warning "Realm is still parked ('inert') awaiting Onyx gpao approval. Re-run this script once status turns 'live'!"
    exit 0
}

function Invoke-GnoCall {
    param($Who, [string]$Func, [string[]]$ArgsList, [string]$Send = '')
    $cmdArgs = @('maketx', 'call', '-pkgpath', $rPath, '-func', $Func)
    foreach ($a in $ArgsList) { $cmdArgs += @('-args', $a) }
    if ($Send) { $cmdArgs += @('-send', $Send) }
    $cmdArgs += @(
        '-gas-fee', '200000ugnot',
        '-gas-wanted', '30000000',
        '-max-deposit', '5000000ugnot',
        '-chainid', $ChainID,
        '-remote', $Rpc,
        '-broadcast',
        '-insecure-password-stdin',
        $Who.key_name
    )
    $out = $Who.passphrase | & $gnokey @cmdArgs 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Call $Func failed: $out" }
    Write-Host "  OK $Func ($($Who.key_name))" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

Write-Host "`nSeeding 3 live demo quests on $rPath..." -ForegroundColor Cyan

Invoke-GnoCall $dep 'PostBounty' @(
    'Build Onyx Event Indexer',
    'Deliver a deterministic Go indexer tracking TavernBoard GnoEvents (BountyPosted, MilestoneApproved, DisputeResolved) with SQLite snapshots.',
    'indexer,realm,go',
    'Spec & ABCI Schema:3000,Core Event Engine:5000,Benchmarks & Docs:2000',
    '21', '50000', '3'
) '2000000ugnot'

Invoke-GnoCall $bld 'ClaimBounty' @('1', 'Shipping deterministic event replay with full GnoVM test coverage.')
Invoke-GnoCall $bld 'SubmitMilestone' @('1', '0', 'https://github.com/reactrailgun/tavernboard', 'Delivered ABCI event schema and unit tests.')
Invoke-GnoCall $dep 'ApproveMilestone' @('1', '0', 'Clean schema! Released 0.6 GNOT from isolated sub-realm escrow/1.')
Invoke-GnoCall $bld 'SubmitMilestone' @('1', '1', 'https://github.com/reactrailgun/tavernboard', 'Core indexer implemented and benchmarked against onyx-1.')

Invoke-GnoCall $dep 'PostBounty' @(
    'GnoConnect Wallet Signing Adapter',
    'Create a zero-dependency TypeScript adapter wiring TavernBoard gnoweb txlink actions to Adena and GnoConnect mobile signers.',
    'wallet,gnoconnect,ts',
    'Signing Adapter:6000,Examples & Docs:4000',
    '18', '50000', '3'
) '3000000ugnot'

Invoke-GnoCall $dep 'PostBounty' @(
    'Pure SVG Guild Crest Renderer',
    'Build deterministic pure-Gno SVG Guild Crest and Escrow Vault Card renderers using p/nt/svg/v0 and sanitize.HTMLEscape.',
    'svg,gnoweb,pure-pkg',
    'Full Delivery',
    '14', '50000', '3'
) '1500000ugnot'

Invoke-GnoCall $bld 'ClaimBounty' @('3', 'Implementing stateless SVG canvas with zero XML injection surface.')
Invoke-GnoCall $bld 'SubmitMilestone' @('3', '0', 'https://github.com/reactrailgun/tavernboard', 'Shipped p/tavernkit/badge.gno with XSS sanitization tests.')
Invoke-GnoCall $dep 'ApproveMilestone' @('3', '0', 'Verified! Paid 1.5 GNOT from escrow/3 and ranked builder in Guild Hall.')

Write-Host "`nLIVE SEEDING COMPLETE!" -ForegroundColor Green
Write-Host "  gnoweb URL: https://onyx.testnets.gno.land/r/$ns/tavernboard" -ForegroundColor Yellow
