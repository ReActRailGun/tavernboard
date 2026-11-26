# Deploying TavernBoard to Gno.land Onyx Testnet (`onyx-1`)

Verified live network configuration as of **November 26, 2026**:

| Parameter | Value |
|---|---|
| **Active Testnet** | **Onyx** (`onyx-1`) — runs mainnet release line (`v1.8.0-rc.1`, commit `fc79041f4`) |
| **JSON-RPC Endpoint** | `https://rpc.onyx.testnets.gno.land:443` (alias: `https://rpc.latest.testnets.gno.land:443`) |
| **gnoweb Explorer** | `https://onyx.testnets.gno.land` |
| **Testnet Faucet** | `https://faucet.gno.land` |
| **Namespace Rule** | Permissionless address namespaces: `gno.land/p/<your_g1_address>/tavernkit` and `gno.land/r/<your_g1_address>/tavernboard` |

> **Security Reminder**: Never paste, commit, or log your `gnokey` mnemonic or private key in code, scripts, or chat.

---

## Live Deployed Instance (Official Submission)

| Artifact | Path / URL | Onyx Block | Status |
|---|---|---|---|
| **Deployer Account** | `g1uhez53ghm94hh8m4ezxs82240ql87vfppjq0mc` | — | Funded via official `faucet-agent.onyx.testnets.gno.land` |
| **Pure Package (`tavernkit`)** | `gno.land/p/g1uhez53ghm94hh8m4ezxs82240ql87vfppjq0mc/tavernkit` | `#1,424,620` | Submitted (`inert`, awaiting `gpao` activation) |
| **Stateful Realm (`tavernboard`)** | `gno.land/r/g1uhez53ghm94hh8m4ezxs82240ql87vfppjq0mc/tavernboard` | `#1,424,623` | Submitted (`inert`, awaiting `gpao` activation) |
| **Live `gnoweb` URL** | `https://onyx.testnets.gno.land/r/g1uhez53ghm94hh8m4ezxs82240ql87vfppjq0mc/tavernboard` | — | Activates automatically upon `gpao` `MsgEnablePackage` |

> **About Onyx `inert` Policy & `gpao`**: On `onyx-1` (`vm:p:code_submission_policy = "inert"`), every post-genesis `addpkg` is parked on-chain (`vm/qinertpaths`) until the Onyx **Package-Approvals Oracle (`gpao`)** verifies imports/types off-chain and broadcasts `MsgEnablePackage`. Check live status anytime with:
> ```powershell
> gnokey query vm/qpkgmeta_json -data "gno.land/r/g1uhez53ghm94hh8m4ezxs82240ql87vfppjq0mc/tavernboard" -remote https://rpc.onyx.testnets.gno.land:443
> ```

---

## Step 1: Create or Select Your `gnokey` Account

Use the compiled `gnokey` binary (either in `PATH` or `..\..\tools\gno-bin\gnokey.exe`):

```powershell
# Create a new testnet deployer key (write down the mnemonic safely offline!)
gnokey add tavern-deployer

# Show your g1... address
gnokey list
```

Copy your `g1...` address (e.g., `g1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`).

---

## Step 2: Claim Free Onyx Testnet GNOT

1. Open **https://faucet.gno.land**
2. Select **Onyx (`onyx-1`)**
3. Paste your `g1...` address and claim testnet GNOT (deploying both packages + posting sample quests uses ~5–15 GNOT total including storage deposits).
4. Verify your balance on Onyx:

```powershell
gnokey query bank/balances/<YOUR_G1_ADDRESS> -remote https://rpc.onyx.testnets.gno.land:443
```

---

## Step 3: Deploy Both Packages with One Command

### Windows (PowerShell)

```powershell
# Preview exact commands first (safe dry run)
.\scripts\deploy-onyx.ps1 -KeyName tavern-deployer -Namespace <YOUR_G1_ADDRESS> -DryRun

# Broadcast live to onyx-1!
.\scripts\deploy-onyx.ps1 -KeyName tavern-deployer -Namespace <YOUR_G1_ADDRESS>
```

### Linux / macOS

```bash
./scripts/deploy-onyx.sh tavern-deployer <YOUR_G1_ADDRESS> --dry-run
./scripts/deploy-onyx.sh tavern-deployer <YOUR_G1_ADDRESS>
```

The script automatically:
1. Stages a clean temporary copy of `p/tavernkit` and `r/tavernboard`.
2. Rewrites `gnomod.toml` module paths and the cross-package import to your exact `g1...` address namespace.
3. Deploys **`gno.land/p/<YOUR_G1_ADDRESS>/tavernkit`** first, then **`gno.land/r/<YOUR_G1_ADDRESS>/tavernboard`**.
4. Deletes the temporary staging folder cleanly.

---

## Step 4: Verify Live Deployment on `gnoweb`

Open your live deployed realm in a browser:
- **Live Realm URL (submit this link on DoraHacks!)**:
  `https://onyx.testnets.gno.land/r/<YOUR_G1_ADDRESS>/tavernboard`
- **Live Pure Package URL**:
  `https://onyx.testnets.gno.land/p/<YOUR_G1_ADDRESS>/tavernkit`

---

## Step 5: Seed 2–3 Live Demo Quests on `onyx-1` (Highly Recommended for Judges!)

Before recording your demo video and submitting on DoraHacks, run these live transactions so judges immediately see real TVL, real isolated sub-realm escrow vaults, real SVG Escrow Cards, and real SVG Guild Crests on `onyx.testnets.gno.land`:

```powershell
$PKG = "gno.land/r/<YOUR_G1_ADDRESS>/tavernboard"
$RPC = "https://rpc.onyx.testnets.gno.land:443"

# 1. Post Quest #1 (2 GNOT split 40/60 across 2 milestones)
gnokey maketx call `
  -pkgpath $PKG -func "PostBounty" `
  -args "Build Onyx Event Indexer" `
  -args "Deliver deterministic GnoEvent indexer for TavernBoard escrow & dispute events with benchmarks." `
  -args "indexer,realm,go" `
  -args "Schema & Spec:4000,Core Indexer & Tests:6000" `
  -args "21" -args "50000" -args "3" `
  -send "2000000ugnot" `
  -gas-fee 1000000ugnot -gas-wanted 15000000 `
  -max-deposit 10000000ugnot `
  -chainid onyx-1 -remote $RPC -broadcast tavern-deployer

# 2. Post Quest #2 (1 GNOT single-milestone quest)
gnokey maketx call `
  -pkgpath $PKG -func "PostBounty" `
  -args "GnoConnect Wallet Adapter for TavernBoard" `
  -args "Zero-dependency browser signer wiring gnoweb txlink actions to Adena and GnoConnect." `
  -args "wallet,frontend,ts" `
  -args "Full Delivery" `
  -args "14" -args "50000" -args "3" `
  -send "1000000ugnot" `
  -gas-fee 1000000ugnot -gas-wanted 15000000 `
  -max-deposit 10000000ugnot `
  -chainid onyx-1 -remote $RPC -broadcast tavern-deployer

# 3. Verify live Render(path) and JSON API via ABCI
gnokey query vm/qrender -data "$PKG`:bounty/1" -remote $RPC
gnokey query vm/qeval   -data "$PKG.GetBoardJSON(10)" -remote $RPC
```

Optional (using a second testnet key `tavern-builder` funded from the faucet) to showcase a full end-to-end completed quest + SVG Guild Crest:
```powershell
gnokey maketx call -pkgpath $PKG -func "ClaimBounty" -args "2" -args "Shipping with unit tests" -gas-fee 1000000ugnot -gas-wanted 8000000 -chainid onyx-1 -remote $RPC -broadcast tavern-builder
gnokey maketx call -pkgpath $PKG -func "SubmitMilestone" -args "2" -args "0" -args "https://github.com/reactrailgun/tavernboard" -args "Delivered cleanly on onyx-1" -gas-fee 1000000ugnot -gas-wanted 8000000 -chainid onyx-1 -remote $RPC -broadcast tavern-builder
gnokey maketx call -pkgpath $PKG -func "ApproveMilestone" -args "2" -args "0" -args "Verified and paid from isolated sub-realm escrow!" -gas-fee 1000000ugnot -gas-wanted 8000000 -chainid onyx-1 -remote $RPC -broadcast tavern-deployer
```

Now open `web/index.html`, switch to **Live Onyx RPC**, paste `gno.land/r/<YOUR_G1_ADDRESS>/tavernboard`, and click **Query On-Chain State** — your live quests, escrow vault addresses, and `gnoweb` Markdown render instantly!
