# DoraHacks Submission Kit — Gnome Tavern Hackathon | Gno.land

**Builder**: `ReActRailGun` (`https://dorahacks.io/builder/u_3ca9d65d4a3b54`)  
**GitHub Repo**: `https://github.com/reactrailgun/tavernboard`  
**Hackathon Deadline**: **December 18, 2026 at 01:00 UTC**  
**Naming Compliance Check**: `TavernBoard` — **PASS** (does NOT use the forbidden "Gno" prefix or imply official endorsement).

---

## 1. Ready-to-Paste DoraHacks BUIDL Fields

### Project Name
`TavernBoard`

### Short Tagline / Vision (<= 140 chars)
`On-chain micro-bounty escrow powered by Gno.land v1.8 sub-realm vaults, stake-backed reviewer quorums, and SVG guild crests.`

### Tags
`Gno.land`, `Go`, `Smart Contracts`, `DeFi`, `DAO`, `Social`, `dApps`

### Public Code Repository Link
`https://github.com/reactrailgun/tavernboard`

### Live Testnet Deployment Link (fill in after running `scripts/deploy-onyx.ps1`)
`https://onyx.testnets.gno.land/r/<YOUR_G1_ADDRESS>/tavernboard`

### Full Project Description (Paste into DoraHacks BUIDL Description)

```markdown
## What is TavernBoard?

**TavernBoard** is a Gno-native on-chain micro-bounty board, multi-milestone escrow engine, and composable builder reputation realm deployed live on **Gno.land Onyx (`onyx-1`, v1.8.0)**.

Rather than pooling every sponsor's funds into one monolithic contract balance or relying on off-chain backends, TavernBoard showcases four capabilities unique to **Gno.land v1.8**:

1. **Per-Bounty Cryptographically Isolated Sub-Realm Vaults (`cur.Sub`)**
   Every posted quest mints two dedicated sub-realm tokens: `cur.Sub("escrow/<id>")` for reward escrow and `cur.Sub("stake/<id>")` for dispute reviewer stakes. Payouts execute exclusively through `banker.NewBanker(banker.BankerTypeRealmSend, sub)` — enforcing vault isolation at the GnoVM banker level so Quest #1 can never spend a single `ugnot` belonging to Quest #2.

2. **Composable DAO & Cross-Realm Co-Funding (`chain.DerivePkgSubAddr` + `SyncBountyVault`)**
   External users or DAO realms can derive any quest's escrow sub-address, transfer `ugnot` directly to it, and call `SyncBountyVault` to allocate bonus funding across remaining milestones with dust-free basis-point integer arithmetic.

3. **Stake-Backed Reviewer Quorum with Atomic 50% Slashing**
   If a milestone deliverable is contested (or a sponsor goes unresponsive past the 48h grace period), independent reviewers stake `ugnot` into `stake/<id>` and vote with on-chain rationales. The moment strict majority quorum is reached, settlement executes atomically: the milestone pays out or refunds, aligned reviewers recover 100% of their stake plus an equal share of the 50% slashed dissenting stakes, and both sub-vaults drain to `0 ugnot`.

4. **Pure Reusable Package (`p/<addr>/tavernkit`) + Full `gnoweb` App + Storage-Deposit Hygiene**
   - `p/<addr>/tavernkit` exports stateless basis-point milestone splitting, deterministic XP/Craft Tier reputation math, quorum tally logic, and **pure on-chain SVG Guild Crest & Escrow Vault Card** rendering (`p/nt/svg/v0`).
   - `r/<addr>/tavernboard` renders a complete multi-route Markdown + SVG application (`Render(path)`) via `p/nt/mux/v0`, `p/nt/avl/pager/v0`, `p/moul/txlink/v0`, `p/nt/mdalert/v0`, `p/moul/mdtable/v0`, `p/nt/markdown/sanitize/v0`, and `r/sys/users`.
   - Other Gno realms and DAOs can gate permissions directly with `tavernboard.HasCraftTier(caller, tavernkit.TierArtisan)`.
   - Once closed quests drain to `0 ugnot`, anyone can invoke `ArchiveClosedBounty` to prune heavy prose into a compact tombstone and reclaim Gno.land storage deposits.
   - Includes a zero-dependency companion web explorer (`web/index.html`) supporting live `onyx-1` ABCI JSON-RPC queries (`vm/qeval`, `vm/qrender`), Adena wallet integration, and an interactive local sandbox.

## Verification & Testing

- **14/14 GnoVM tests passing** (`gno test -v` on exact Onyx `v1.8.0` commit `fc79041f4`), covering multi-milestone vault isolation, DAO `SyncBountyVault`, stake-backed quorum slashing, `IsUserCall()` payment-spoofing regression, XSS/Markdown sanitization, deadline reclamation, and permissionless storage archival.
- **`gno lint` clean** with zero warnings across both packages.
```

---

## 2. 90-Second Demo Video Storyboard (Required for DoraHacks)

Record a crisp 90–120s screen capture (OBS Studio / Loom / YouTube Unlisted) showing the live working product:

1. **0:00–0:15 — Live `gnoweb` Home (`https://onyx.testnets.gno.land/r/<YOUR_G1_ADDRESS>/tavernboard`)**:
   - Show the live Quest Board, protocol stats table, filter bar (`Open`, `In Review`, `Disputed`, `Guild Hall`), and one-click `txlink` "+ Post a Quest" button.
2. **0:15–0:35 — Bounty Detail & Sub-Realm Vault Isolation (`:bounty/1`)**:
   - Highlight the pure on-chain **SVG Escrow Vault Card**, the dedicated `cur.Sub("escrow/1")` vault address with its live `ugnot` balance, and milestone breakdown table.
3. **0:35–0:55 — Live Transaction Flow (`gnokey` or gnoweb `txlink`)**:
   - Execute `ApproveMilestone` (or `PostBounty`) live on `onyx-1`, refresh `gnoweb`, and show the SVG Escrow Card bar advancing + vault balance dropping cleanly while Bounty #2's vault remains untouched.
4. **0:55–1:15 — Guild Hall & On-Chain SVG Guild Crest (`:guild` -> `:builder/<addr>`)**:
   - Open the Guild Hall leaderboard and click into a builder profile to show their pure on-chain **SVG Guild Crest Card** (XP bar, Craft Tier, reliability %).
5. **1:15–1:30 — Companion Web Explorer (`web/index.html`) & Test Suite**:
   - Show the Companion Web Explorer querying live `onyx-1` via `vm/qeval` (`GetBoardJSON`) AND flash the terminal running `.\scripts\test.ps1` (`14/14 PASS`, `gno lint` clean!).

---

## 3. Pre-Submission Checklist (Do Before Dec 18, 2026 01:00 UTC)

- [ ] Push `hackathons/gnome-tavern` to public GitHub repo `https://github.com/reactrailgun/tavernboard`
- [ ] Claim free `onyx-1` testnet GNOT from `https://faucet.gno.land`
- [ ] Run `.\scripts\deploy-onyx.ps1 -KeyName <yourkey> -Namespace <your_g1_addr>` to deploy `p/<addr>/tavernkit` + `r/<addr>/tavernboard` live on `onyx-1`
- [ ] Seed 2–3 sample quests (and 1 completed quest so Guild Hall shows a live SVG Guild Crest!) on `onyx-1`
- [ ] Verify `https://onyx.testnets.gno.land/r/<your_g1_addr>/tavernboard` loads cleanly in browser
- [ ] Record 90-second demo video and upload (YouTube Unlisted or Loom)
- [ ] Submit BUIDL on `https://dorahacks.io/hackathon/gnome-tavern/detail` under `ReActRailGun` with:
  - Live `onyx.testnets.gno.land/r/<your_g1_addr>/tavernboard` link
  - Public GitHub link `https://github.com/reactrailgun/tavernboard`
  - Demo video link
  - Project description above
- [ ] Optional polish: share progress link in `#gnome-tavern-hackathon` on `https://discord.gg/gnoland` for early feedback & visibility!
