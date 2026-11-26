// TavernBoard Companion Web Explorer & Interactive Sandbox
// Supports BOTH:
//   1. Live Gno.land Onyx (onyx-1) JSON-RPC queries (vm/qeval & vm/qrender) + Adena wallet
//   2. Interactive zero-setup local sandbox mirroring p/tavernkit & r/tavernboard semantics

const UGNOT_PER_GNOT = 1_000_000;

const state = {
  mode: "sandbox", // "sandbox" | "onyx"
  walletAddr: null,
  statusFilter: "ALL",
  selectedId: 1,
  rpcUrl: "https://rpc.onyx.testnets.gno.land:443",
  realmPath: "gno.land/r/g1uhez53ghm94hh8m4ezxs82240ql87vfppjq0mc/tavernboard",
  bounties: [
    {
      id: 1,
      title: "Build On-Chain Event Indexer for Onyx Realms",
      summary: "Deliver a deterministic Go indexer that tracks GnoEvent streams (`BountyPosted`, `MilestoneApproved`, `DisputeResolved`) with SQLite snapshots and sub-second replay.",
      tags: "indexer,realm,go",
      sponsor: "g1alice94sp0ns0r7v2q8m4k5x2p9r6t3u8w0a1b",
      builder: "g1bob42bu1ld3r9c6d8e2f5h7j0k4m8n2p6q3r5s",
      status: "IN REVIEW",
      fundedUgnot: 12_000_000,
      releasedUgnot: 3_600_000,
      escrowVault: "g1subescrow1vault7x9k2m4p8q3r6t0v5w8y1z2",
      stakeVault: "g1substake1vault9a3c5e7g1j3l5n7p9r1t3v5",
      minReviewerStakeUgnot: 50_000,
      reviewerQuorum: 3,
      deadline: "2026-12-14",
      archived: false,
      milestones: [
        { index: 0, title: "Spec & ABCI Schema", weightBps: 3000, payoutUgnot: 3_600_000, status: "APPROVED", proofURL: "https://github.com/reactrailgun/tavernboard/pull/1" },
        { index: 1, title: "Core Event Indexer", weightBps: 5000, payoutUgnot: 6_000_000, status: "SUBMITTED", proofURL: "https://github.com/reactrailgun/tavernboard/pull/2" },
        { index: 2, title: "Benchmarks & Docs", weightBps: 2000, payoutUgnot: 2_400_000, status: "PENDING", proofURL: "" },
      ],
    },
    {
      id: 2,
      title: "Audit Sub-Realm Banker Isolation Invariants",
      summary: "Write adversarial filetests proving `cur.Sub(\"escrow/<id>\")` vaults cannot be cross-spent and `cur.Previous().IsUserCall()` blocks MsgRun payment spoofing.",
      tags: "security,audit,gnovm",
      sponsor: "g1carol77dao0fund3r4x6y8z2a4c6e8g0j2l4n6",
      builder: "g1dave88aud1t0r5m7p9r1t3v5x7z9b1d3f5h7j9",
      status: "DISPUTED",
      fundedUgnot: 8_000_000,
      releasedUgnot: 0,
      escrowVault: "g1subescrow2vault4b6d8f0h2j4l6n8p0r2t4v6",
      stakeVault: "g1substake2vault8m0p2r4t6v8x0z2b4d6f8h0",
      minReviewerStakeUgnot: 100_000,
      reviewerQuorum: 3,
      deadline: "2026-12-16",
      archived: false,
      milestones: [
        {
          index: 0,
          title: "Adversarial Audit Report",
          weightBps: 10000,
          payoutUgnot: 8_000_000,
          status: "DISPUTED",
          proofURL: "https://github.com/reactrailgun/tavernboard/blob/main/AUDIT.md",
          dispute: { approve: 1, reject: 1, stakePoolUgnot: 200_000, reason: "Sponsor requested extra MsgRun fuzz coverage; builder asserts spec satisfied." },
        },
      ],
    },
    {
      id: 3,
      title: "GnoConnect Mobile Wallet Signing Adapter",
      summary: "Create a lightweight TypeScript adapter that constructs signed MsgCall envelopes for TavernBoard `txlink` URLs.",
      tags: "wallet,gnoconnect,ts",
      sponsor: "g1alice94sp0ns0r7v2q8m4k5x2p9r6t3u8w0a1b",
      builder: "",
      status: "OPEN",
      fundedUgnot: 5_000_000,
      releasedUgnot: 0,
      escrowVault: "g1subescrow3vault1q3s5u7w9y1a3c5e7g9i1k3",
      stakeVault: "g1substake3vault5z7b9d1f3h5j7l9n1p3r5t7",
      minReviewerStakeUgnot: 50_000,
      reviewerQuorum: 3,
      deadline: "2026-12-17",
      archived: false,
      milestones: [
        { index: 0, title: "Signing Adapter", weightBps: 6000, payoutUgnot: 3_000_000, status: "PENDING", proofURL: "" },
        { index: 1, title: "Example & Docs", weightBps: 4000, payoutUgnot: 2_000_000, status: "PENDING", proofURL: "" },
      ],
    },
    {
      id: 4,
      title: "Pure SVG Crest & Escrow Card Renderer (`p/tavernkit`)",
      summary: "",
      tags: "svg,gnoweb,pure-pkg",
      sponsor: "g1carol77dao0fund3r4x6y8z2a4c6e8g0j2l4n6",
      builder: "g1bob42bu1ld3r9c6d8e2f5h7j0k4m8n2p6q3r5s",
      status: "ARCHIVED",
      fundedUgnot: 3_500_000,
      releasedUgnot: 3_500_000,
      escrowVault: "g1subescrow4vault9w7u5s3q1o9m7k5i3g1e9c7",
      stakeVault: "g1substake4vault2d4f6h8j0l2n4p6r8t0v2x4",
      minReviewerStakeUgnot: 50_000,
      reviewerQuorum: 3,
      deadline: "2026-12-01",
      archived: true,
      milestones: [
        { index: 0, title: "SVG Canvas & Sanitizer", weightBps: 10000, payoutUgnot: 3_500_000, status: "APPROVED", proofURL: "https://github.com/reactrailgun/tavernboard" },
      ],
    },
  ],
  profiles: [
    { addr: "g1bob42bu1ld3r9c6d8e2f5h7j0k4m8n2p6q3r5s", handle: "@reactrailgun", completed: 4, milestones: 9, earnedUgnot: 28_500_000, aligned: 3, slashed: 0, disputesWon: 1, disputesLost: 0 },
    { addr: "g1dave88aud1t0r5m7p9r1t3v5x7z9b1d3f5h7j9", handle: "g1dave88...h7j9", completed: 2, milestones: 5, earnedUgnot: 14_000_000, aligned: 5, slashed: 1, disputesWon: 0, disputesLost: 0 },
    { addr: "g1alice94sp0ns0r7v2q8m4k5x2p9r6t3u8w0a1b", handle: "g1alice9...0a1b", completed: 1, milestones: 2, earnedUgnot: 4_000_000, aligned: 2, slashed: 0, disputesWon: 0, disputesLost: 0 },
  ],
};

function fmtGNOT(ugnot) {
  if (!ugnot) return "0 GNOT";
  const sign = ugnot < 0 ? "-" : "";
  const abs = Math.abs(Math.trunc(ugnot));
  const whole = Math.floor(abs / UGNOT_PER_GNOT);
  const frac = abs % UGNOT_PER_GNOT;
  if (frac === 0) return `${sign}${whole} GNOT`;
  let fracStr = String(frac).padStart(6, "0");
  while (fracStr.length > 2 && fracStr.endsWith("0")) fracStr = fracStr.slice(0, -1);
  return `${sign}${whole}.${fracStr} GNOT`;
}

function shortAddr(a) {
  if (!a) return "Unclaimed";
  return a.length <= 14 ? a : `${a.slice(0, 8)}...${a.slice(-4)}`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function computeReputation(p) {
  const gnotCap = Math.min(Math.floor(p.earnedUgnot / UGNOT_PER_GNOT), 500);
  const xp = Math.max(0, p.completed * 250 + p.milestones * 80 + gnotCap * 5 + p.aligned * 60 + p.disputesWon * 100 - p.slashed * 120 - p.disputesLost * 150);
  const tiers = [
    { name: "Apprentice", min: 0, next: 250, accent: "#94a3b8" },
    { name: "Journeyman", min: 250, next: 750, accent: "#38bdf8" },
    { name: "Artisan", min: 750, next: 2000, accent: "#f59e0b" },
    { name: "Master", min: 2000, next: 5000, accent: "#c084fc" },
    { name: "Archmage", min: 5000, next: 0, accent: "#fbbf24" },
  ];
  let tier = tiers[0];
  for (const t of tiers) if (xp >= t.min) tier = t;
  const pos = p.milestones + p.aligned + p.disputesWon;
  const neg = p.slashed + p.disputesLost;
  const rel = pos + neg > 0 ? Math.floor((pos * 10000) / (pos + neg)) : 10000;
  const prog = tier.next > 0 ? Math.min(10000, Math.floor(((xp - tier.min) * 10000) / (tier.next - tier.min))) : 10000;
  return { xp, tier, rel, prog };
}

function buildGuildCrestSvgDataUri(p) {
  const r = computeReputation(p);
  const fillW = Math.max(r.xp > 0 ? 10 : 0, Math.floor((304 * r.prog) / 10000));
  const nextLabel = r.tier.next > 0 ? `Next tier: ${r.tier.next} XP` : "MAX TIER ACHIEVED";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="128" viewBox="0 0 420 128">
    <style>text{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}</style>
    <rect x="2" y="2" width="416" height="124" rx="14" ry="14" fill="#111622" stroke="${r.tier.accent}" stroke-width="2"/>
    <polygon points="48,22 78,34 74,74 48,96 22,74 18,34" fill="#1b2436" stroke="${r.tier.accent}" stroke-width="2.5"/>
    <polygon points="48,34 66,42 63,68 48,82 33,68 30,42" fill="${r.tier.accent}" opacity="0.22"/>
    <text x="41" y="65" fill="${r.tier.accent}" style="font-size:24px;font-weight:700">${r.tier.name[0]}</text>
    <text x="96" y="30" fill="#94a3b8" style="font-size:10px;letter-spacing:1.2px">TAVERNBOARD GUILD CREST</text>
    <rect x="302" y="16" width="100" height="20" rx="10" ry="10" fill="${r.tier.accent}" opacity="0.2"/>
    <text x="314" y="30" fill="${r.tier.accent}" style="font-size:11px;font-weight:700">${r.tier.name}</text>
    <text x="96" y="56" fill="#f8fafc" style="font-size:16px;font-weight:700">${escapeHtml(p.handle)}</text>
    <text x="96" y="76" fill="#cbd5e1" style="font-size:11px">${p.completed} quests  |  ${fmtGNOT(p.earnedUgnot)}  |  ${Math.floor(r.rel / 100)}% rel</text>
    <rect x="96" y="92" width="304" height="10" rx="5" ry="5" fill="#1e293b"/>
    <rect x="96" y="92" width="${fillW}" height="10" rx="5" ry="5" fill="${r.tier.accent}"/>
    <text x="96" y="116" fill="${r.tier.accent}" style="font-size:11px;font-weight:700">${r.xp} XP</text>
    <text x="246" y="116" fill="#94a3b8" style="font-size:10px">${nextLabel}</text>
  </svg>`;
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.add("hidden"), 3400);
}

// --- ABCI JSON-RPC Helper for Live Onyx (onyx-1) ---
async function abciQuery(rpcUrl, path, dataStr) {
  const url = `${rpcUrl.replace(/\/$/, "")}/abci_query?path=${encodeURIComponent(JSON.stringify(path))}&data=${encodeURIComponent(JSON.stringify(dataStr))}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const resp = json?.result?.response;
  if (!resp || resp.Error) throw new Error(resp?.Error || "Empty ABCI response");
  if (!resp.Value) return "";
  return new TextDecoder().decode(Uint8Array.from(atob(resp.Value), (c) => c.charCodeAt(0)));
}

async function queryOnyxBoard() {
  const rpcUrl = document.getElementById("rpcUrl").value.trim();
  const realmPath = document.getElementById("realmPath").value.trim();
  const statusEl = document.getElementById("rpcStatus");
  if (!realmPath) {
    showToast("Enter your deployed onyx-1 realm path first.");
    return;
  }
  state.rpcUrl = rpcUrl;
  state.realmPath = realmPath;
  statusEl.textContent = "Querying onyx-1...";
  try {
    const raw = await abciQuery(rpcUrl, "vm/qeval", `${realmPath}.GetBoardJSON(25)`);
    // vm/qeval returns `("{\"stats\":...}" string)` -> extract quoted JSON string
    const m = raw.match(/\("(.*)"\s+string\)/s);
    const jsonStr = m ? JSON.parse(`"${m[1]}"`) : raw;
    const parsed = JSON.parse(jsonStr);
    state.bounties = (parsed.bounties || []).map((b) => ({
      ...b,
      summary: "Loaded live from onyx-1 via vm/qeval. Open gnoweb tab for full rendered Markdown.",
      deadline: new Date(b.deadlineUnix * 1000).toISOString().slice(0, 10),
      milestones: [],
    }));
    statusEl.textContent = `Synced ${state.bounties.length} quests from onyx-1`;
    showToast(`Live Onyx sync succeeded (${state.bounties.length} quests).`);
    renderAll();
  } catch (err) {
    statusEl.textContent = `Query error: ${err.message}`;
    showToast(`Onyx RPC query failed: ${err.message}`);
  }
}

// --- Adena Wallet Integration ---
async function connectAdena() {
  if (!window.adena) {
    showToast("Adena wallet extension not detected — use gnokey CLI Builder tab or install adena.app");
    return;
  }
  try {
    await window.adena.AddEstablish("TavernBoard");
    const acct = await window.adena.GetAccount();
    state.walletAddr = acct?.data?.address || null;
    if (state.walletAddr) {
      document.getElementById("btnWallet").textContent = shortAddr(state.walletAddr);
      showToast(`Connected Adena: ${shortAddr(state.walletAddr)}`);
    }
  } catch (e) {
    showToast(`Adena connection cancelled: ${e.message || e}`);
  }
}

// --- Rendering ---
function renderStats() {
  const total = state.bounties.length;
  const open = state.bounties.filter((b) => b.status === "OPEN").length;
  const tvl = state.bounties.reduce((acc, b) => acc + Math.max(0, b.fundedUgnot - b.releasedUgnot), 0);
  const paid = state.bounties.reduce((acc, b) => acc + b.releasedUgnot, 0);
  const disputed = state.bounties.filter((b) => b.status === "DISPUTED").length;
  const archived = state.bounties.filter((b) => b.archived).length;

  document.getElementById("statsGrid").innerHTML = `
    <div class="stat-card"><div class="label">Total Quests</div><div class="value">${total}</div></div>
    <div class="stat-card"><div class="label">Open Quests</div><div class="value green">${open}</div></div>
    <div class="stat-card"><div class="label">Isolated Escrow TVL</div><div class="value amber">${fmtGNOT(tvl)}</div></div>
    <div class="stat-card"><div class="label">Total Paid Out</div><div class="value sky">${fmtGNOT(paid)}</div></div>
    <div class="stat-card"><div class="label">Active Disputes</div><div class="value">${disputed}</div></div>
    <div class="stat-card"><div class="label">Storage Archived</div><div class="value">${archived}</div></div>
  `;
}

function renderQuestList() {
  const list = document.getElementById("questList");
  const filtered = state.bounties.filter((b) => state.statusFilter === "ALL" || b.status === state.statusFilter);
  if (!filtered.length) {
    list.innerHTML = `<div class="card"><p class="muted">No quests match filter <code>${escapeHtml(state.statusFilter)}</code>.</p></div>`;
    return;
  }
  if (!filtered.some((b) => b.id === state.selectedId)) state.selectedId = filtered[0].id;

  list.innerHTML = filtered.map((b) => {
    const cls = b.status.replace(/\s+/g, "_");
    const settled = b.milestones.filter((m) => m.status === "APPROVED" || m.status.startsWith("PAID")).length;
    return `
      <article class="quest-card ${b.id === state.selectedId ? "selected" : ""}" data-id="${b.id}">
        <div class="quest-head">
          <h3 class="quest-title">#${b.id} ${escapeHtml(b.title)}</h3>
          <span class="badge ${cls}">${escapeHtml(b.status)}</span>
        </div>
        <div class="quest-meta">
          <span>Reward: <strong>${fmtGNOT(b.fundedUgnot)}</strong></span>
          <span>Milestones: ${settled}/${b.milestones.length || b.milestones}</span>
          <span>Due: ${escapeHtml(b.deadline)}</span>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll(".quest-card").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedId = Number(el.dataset.id);
      renderQuestList();
      renderDetail();
    });
  });
}

function renderDetail() {
  const pane = document.getElementById("detailPane");
  const b = state.bounties.find((q) => q.id === state.selectedId);
  if (!b) {
    pane.innerHTML = `<p class="muted">Select a quest to inspect its isolated sub-realm escrow vaults.</p>`;
    return;
  }
  const cls = b.status.replace(/\s+/g, "_");
  const locked = Math.max(0, b.fundedUgnot - b.releasedUgnot);

  const milestonesHtml = (b.milestones || []).map((m) => {
    let btns = "";
    if (state.mode === "sandbox" && !b.archived) {
      if (m.status === "PENDING" && b.builder) {
        btns += `<button class="btn-secondary" data-act="submit" data-m="${m.index}">Submit Proof</button>`;
      }
      if (m.status === "SUBMITTED") {
        btns += `<button class="btn-success" data-act="approve" data-m="${m.index}">Approve &amp; Pay ${fmtGNOT(m.payoutUgnot)}</button>`;
        btns += `<button class="btn-danger" data-act="dispute" data-m="${m.index}">Open Quorum Dispute</button>`;
      }
      if (m.status === "DISPUTED") {
        btns += `<button class="btn-success" data-act="vote-yes" data-m="${m.index}">Stake ${fmtGNOT(b.minReviewerStakeUgnot)} &amp; Vote Builder</button>`;
        btns += `<button class="btn-danger" data-act="vote-no" data-m="${m.index}">Stake ${fmtGNOT(b.minReviewerStakeUgnot)} &amp; Vote Sponsor</button>`;
      }
    }
    const dispHtml = m.dispute
      ? `<p class="muted" style="margin:.45rem 0 0">Quorum: <strong>${m.dispute.approve} approve / ${m.dispute.reject} reject</strong> (need ${b.reviewerQuorum}) &middot; Stake Pool: <code>${fmtGNOT(m.dispute.stakePoolUgnot)}</code></p>`
      : "";
    return `
      <div class="milestone-item">
        <div class="milestone-top">
          <strong>M${m.index}: ${escapeHtml(m.title)}</strong>
          <span><code>${(m.weightBps / 100).toFixed(0)}%</code> &middot; <strong style="color:var(--amber)">${fmtGNOT(m.payoutUgnot)}</strong> &middot; <code>${escapeHtml(m.status)}</code></span>
        </div>
        ${m.proofURL ? `<div class="muted" style="margin-top:.35rem">Proof: <code>${escapeHtml(m.proofURL)}</code></div>` : ""}
        ${dispHtml}
        ${btns ? `<div class="milestone-actions">${btns}</div>` : ""}
      </div>
    `;
  }).join("");

  let topActions = "";
  if (state.mode === "sandbox") {
    if (b.status === "OPEN") {
      topActions += `<button class="btn-primary" data-act="claim">Claim Quest</button>`;
    }
    if (!b.archived && b.status !== "COMPLETED" && b.status !== "CANCELLED") {
      topActions += `<button class="btn-secondary" data-act="topup">+1 GNOT DAO Top-Up</button>`;
    }
    if ((b.status === "COMPLETED" || b.status === "CANCELLED") && !b.archived) {
      topActions += `<button class="btn-secondary" data-act="archive">Archive &amp; Reclaim Storage Deposit</button>`;
    }
  }

  pane.innerHTML = `
    <div class="quest-head">
      <h2 style="margin:0">#${b.id} ${escapeHtml(b.title)}</h2>
      <span class="badge ${cls}">${escapeHtml(b.status)}</span>
    </div>
    <p class="muted" style="margin:.6rem 0">${b.archived ? "Archived tombstone — prose fields cleared to refund on-chain GnoVM storage deposit." : escapeHtml(b.summary)}</p>
    <div class="vault-box">
      <div class="vault-row"><span>Escrow Sub-Realm (<code>cur.Sub("escrow/${b.id}")</code>)</span><span>${escapeHtml(b.escrowVault)}</span></div>
      <div class="vault-row"><span>Live Locked / Paid</span><span><strong style="color:var(--amber)">${fmtGNOT(locked)}</strong> / ${fmtGNOT(b.releasedUgnot)}</span></div>
      <div class="vault-row"><span>Stake Sub-Realm (<code>cur.Sub("stake/${b.id}")</code>)</span><span>${escapeHtml(b.stakeVault)}</span></div>
      <div class="vault-row"><span>Sponsor &rarr; Builder</span><span>${shortAddr(b.sponsor)} &rarr; ${shortAddr(b.builder)}</span></div>
    </div>
    ${topActions ? `<div class="milestone-actions" style="margin-bottom:.85rem">${topActions}</div>` : ""}
    <h3 style="margin:.8rem 0 .25rem;font-size:.95rem">Milestones</h3>
    ${milestonesHtml || `<p class="muted">Query <code>bounty/${b.id}</code> in the gnoweb Render Preview tab for full milestone details.</p>`}
  `;

  pane.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => handleSandboxAction(b, btn.dataset.act, Number(btn.dataset.m)));
  });
}

function handleSandboxAction(b, act, mIdx) {
  if (act === "claim") {
    b.builder = state.walletAddr || "g1bob42bu1ld3r9c6d8e2f5h7j0k4m8n2p6q3r5s";
    b.status = "CLAIMED";
    showToast(`Quest #${b.id} claimed!`);
  } else if (act === "topup") {
    b.fundedUgnot += UGNOT_PER_GNOT;
    const openMs = b.milestones.filter((m) => m.status !== "APPROVED" && !m.status.startsWith("PAID"));
    if (openMs.length) openMs[0].payoutUgnot += UGNOT_PER_GNOT;
    showToast(`Added +1 GNOT to isolated vault escrow/${b.id}!`);
  } else if (act === "submit") {
    const m = b.milestones[mIdx];
    m.status = "SUBMITTED";
    m.proofURL = `https://github.com/reactrailgun/tavernboard/pull/${b.id * 10 + mIdx}`;
    b.status = "IN REVIEW";
    showToast(`Milestone M${mIdx} proof submitted for review.`);
  } else if (act === "approve") {
    const m = b.milestones[mIdx];
    m.status = "APPROVED";
    b.releasedUgnot += m.payoutUgnot;
    state.profiles[0].milestones += 1;
    state.profiles[0].earnedUgnot += m.payoutUgnot;
    if (b.milestones.every((x) => x.status === "APPROVED" || x.status.startsWith("PAID"))) {
      b.status = "COMPLETED";
      state.profiles[0].completed += 1;
    }
    showToast(`Approved M${mIdx}! Sub-realm vault paid ${fmtGNOT(m.payoutUgnot)} to builder.`);
  } else if (act === "dispute") {
    const m = b.milestones[mIdx];
    m.status = "DISPUTED";
    m.dispute = { approve: 0, reject: 0, stakePoolUgnot: 0, reason: "Escalated to stake-backed reviewer quorum." };
    b.status = "DISPUTED";
    showToast(`Dispute opened on M${mIdx} — independent reviewers may now stake & vote.`);
  } else if (act === "vote-yes" || act === "vote-no") {
    const m = b.milestones[mIdx];
    const d = m.dispute;
    d.stakePoolUgnot += b.minReviewerStakeUgnot;
    if (act === "vote-yes") d.approve += 1; else d.reject += 1;
    if (d.approve + d.reject >= b.reviewerQuorum && d.approve !== d.reject) {
      const builderWins = d.approve > d.reject;
      m.status = builderWins ? "PAID (QUORUM)" : "REFUNDED (QUORUM)";
      if (builderWins) {
        b.releasedUgnot += m.payoutUgnot;
        state.profiles[0].disputesWon += 1;
      }
      b.status = "COMPLETED";
      showToast(`Quorum settled (${d.approve}-${d.reject})! ${builderWins ? "Builder paid" : "Sponsor refunded"} & dissenters slashed 50%.`);
    } else {
      showToast(`Stake locked in stake/${b.id}. Quorum now ${d.approve}-${d.reject}.`);
    }
  } else if (act === "archive") {
    b.summary = "";
    b.archived = true;
    b.status = "ARCHIVED";
    showToast(`Quest #${b.id} archived — GnoVM storage deposit refunded!`);
  }
  renderAll();
}

function renderGuild() {
  const grid = document.getElementById("crestGrid");
  grid.innerHTML = state.profiles.map((p) => {
    const uri = buildGuildCrestSvgDataUri(p);
    return `<div class="crest-card"><img src="${uri}" alt="Guild Crest for ${escapeHtml(p.handle)}" /></div>`;
  }).join("");
}

function buildSandboxMarkdown(route) {
  if (route === "guide") {
    return `# TavernBoard — Sub-Realm Escrow & Quorum Architecture\n\n1. Every quest mints cur.Sub("escrow/<id>") and cur.Sub("stake/<id>").\n2. Direct EOA funding enforces cur.Previous().IsUserCall() + BankerTypeOriginSend.\n3. External DAOs co-fund via chain.DerivePkgSubAddr + SyncBountyVault.\n4. Dissenting dispute reviewers are slashed 50% to reward aligned reviewers.\n5. Closed quests reclaim Gno.land storage deposits via ArchiveClosedBounty.`;
  }
  if (route.startsWith("bounty/")) {
    const id = Number(route.split("/")[1]);
    const b = state.bounties.find((x) => x.id === id) || state.bounties[0];
    return `# Quest #${b.id}: ${b.title}\n\n![Escrow Vault ${b.id}](data:image/svg+xml;base64,...)\n\n- Status: \`${b.status}\`\n- Escrow Sub-Vault: \`${b.escrowVault}\` (funded: **${fmtGNOT(b.fundedUgnot)}**)\n- Stake Sub-Vault: \`${b.stakeVault}\`\n\n| # | Deliverable | Weight | Payout | Status |\n| --- | --- | --- | --- | --- |\n` +
      b.milestones.map((m) => `| ${m.index} | ${m.title} | ${m.weightBps / 100}% | **${fmtGNOT(m.payoutUgnot)}** | \`${m.status}\` |`).join("\n");
  }
  return `# TavernBoard — On-Chain Quest Escrow & Guild Reputation\n\n| ID | Quest | Status | Reward | Sponsor | Deadline |\n| --- | --- | --- | --- | --- | --- |\n` +
    state.bounties.map((b) => `| #${b.id} | [${b.title}](/r/tavernboard/tavernboard:bounty/${b.id}) | \`${b.status}\` | **${fmtGNOT(b.fundedUgnot)}** | ${shortAddr(b.sponsor)} | ${b.deadline} |`).join("\n");
}

async function renderGnowebPreview() {
  const route = document.getElementById("renderRouteInput").value.trim();
  const out = document.getElementById("renderOutput");
  if (state.mode === "onyx" && state.realmPath) {
    out.textContent = "Querying vm/qrender on onyx-1...";
    try {
      const md = await abciQuery(state.rpcUrl, "vm/qrender", `${state.realmPath}:${route}`);
      out.textContent = md || "(empty render output)";
    } catch (e) {
      out.textContent = `Error querying vm/qrender: ${e.message}`;
    }
    return;
  }
  out.textContent = buildSandboxMarkdown(route);
}

function renderCliSnippets() {
  const pkg = state.realmPath || "gno.land/r/<YOUR_G1_ADDRESS>/tavernboard";
  const snippets = [
    {
      title: "1. Post a 1 GNOT Multi-Milestone Quest",
      cmd: `gnokey maketx call \\\n  -pkgpath "${pkg}" \\\n  -func "PostBounty" \\\n  -args "Build Indexer" \\\n  -args "Deterministic GnoEvent indexer with tests" \\\n  -args "indexer,go" \\\n  -args "Spec:3000,Core:5000,Docs:2000" \\\n  -args "14" -args "50000" -args "3" \\\n  -send "1000000ugnot" \\\n  -gas-fee 1000000ugnot -gas-wanted 10000000 \\\n  -chainid onyx-1 -remote https://rpc.onyx.testnets.gno.land:443 \\\n  -broadcast mykey`,
    },
    {
      title: "2. Claim Quest #1 & Submit Proof-of-Delivery",
      cmd: `gnokey maketx call -pkgpath "${pkg}" -func "ClaimBounty" \\\n  -args "1" -args "Shipping with full GnoVM test coverage" \\\n  -gas-fee 1000000ugnot -gas-wanted 5000000 \\\n  -chainid onyx-1 -remote https://rpc.onyx.testnets.gno.land:443 -broadcast builderkey\n\ngnokey maketx call -pkgpath "${pkg}" -func "SubmitMilestone" \\\n  -args "1" -args "0" -args "https://github.com/reactrailgun/tavernboard/pull/1" -args "Milestone 0 delivered" \\\n  -gas-fee 1000000ugnot -gas-wanted 5000000 \\\n  -chainid onyx-1 -remote https://rpc.onyx.testnets.gno.land:443 -broadcast builderkey`,
    },
    {
      title: "3. Approve Milestone #0 (Releases Isolated Sub-Realm Escrow)",
      cmd: `gnokey maketx call -pkgpath "${pkg}" -func "ApproveMilestone" \\\n  -args "1" -args "0" -args "Verified on onyx-1!" \\\n  -gas-fee 1000000ugnot -gas-wanted 5000000 \\\n  -chainid onyx-1 -remote https://rpc.onyx.testnets.gno.land:443 -broadcast mykey`,
    },
    {
      title: "4. Query Live Board JSON via ABCI",
      cmd: `gnokey query vm/qeval -data "${pkg}.GetBoardJSON(20)" \\\n  -remote https://rpc.onyx.testnets.gno.land:443`,
    },
  ];
  document.getElementById("cliSnippets").innerHTML = snippets.map((s, i) => `
    <div class="cli-item">
      <div class="cli-item-head">
        <strong>${escapeHtml(s.title)}</strong>
        <button class="btn-secondary" data-copy="${i}">Copy</button>
      </div>
      <pre class="code-box">${escapeHtml(s.cmd)}</pre>
    </div>
  `).join("");
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard?.writeText(snippets[Number(btn.dataset.copy)].cmd);
      showToast("Copied gnokey command to clipboard!");
    });
  });
}

function renderAll() {
  renderStats();
  renderQuestList();
  renderDetail();
  renderGuild();
  renderGnowebPreview();
  renderCliSnippets();
}

// --- Event Wiring ---
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.statusFilter = btn.dataset.status;
    renderQuestList();
    renderDetail();
  });
});

document.getElementById("btnModeSandbox").addEventListener("click", () => {
  state.mode = "sandbox";
  document.getElementById("btnModeSandbox").classList.add("active");
  document.getElementById("btnModeOnyx").classList.remove("active");
  document.getElementById("rpcBar").classList.add("hidden");
  renderAll();
});

document.getElementById("btnModeOnyx").addEventListener("click", () => {
  state.mode = "onyx";
  document.getElementById("btnModeOnyx").classList.add("active");
  document.getElementById("btnModeSandbox").classList.remove("active");
  document.getElementById("rpcBar").classList.remove("hidden");
  renderAll();
});

document.getElementById("btnSyncOnyx").addEventListener("click", queryOnyxBoard);
document.getElementById("btnWallet").addEventListener("click", connectAdena);
document.getElementById("btnFetchRender").addEventListener("click", renderGnowebPreview);

function buildPostCliCommand() {
  const pkg = state.realmPath || "gno.land/r/<YOUR_G1_ADDRESS>/tavernboard";
  const ugnot = Math.round(Number(document.getElementById("fReward").value || 1) * UGNOT_PER_GNOT);
  return `gnokey maketx call \\\n  -pkgpath "${pkg}" -func "PostBounty" \\\n  -args ${JSON.stringify(document.getElementById("fTitle").value)} \\\n  -args ${JSON.stringify(document.getElementById("fSummary").value)} \\\n  -args ${JSON.stringify(document.getElementById("fTags").value)} \\\n  -args ${JSON.stringify(document.getElementById("fMilestones").value)} \\\n  -args "${document.getElementById("fDeadline").value}" \\\n  -args "${document.getElementById("fStake").value}" \\\n  -args "${document.getElementById("fQuorum").value}" \\\n  -send "${ugnot}ugnot" \\\n  -gas-fee 1000000ugnot -gas-wanted 10000000 \\\n  -chainid onyx-1 -remote https://rpc.onyx.testnets.gno.land:443 -broadcast mykey`;
}

document.getElementById("btnGenPostCli").addEventListener("click", () => {
  const cmd = buildPostCliCommand();
  const pre = document.getElementById("postPreviewCmd");
  pre.textContent = cmd;
  pre.classList.remove("hidden");
  navigator.clipboard?.writeText(cmd);
  showToast("Copied PostBounty gnokey command!");
});

document.getElementById("postForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("fTitle").value.trim();
  const summary = document.getElementById("fSummary").value.trim();
  const tags = document.getElementById("fTags").value.trim();
  const spec = document.getElementById("fMilestones").value.trim();
  const ugnot = Math.round(Number(document.getElementById("fReward").value) * UGNOT_PER_GNOT);
  const parts = spec.includes(":") ? spec.split(",").map((s) => {
    const idx = s.lastIndexOf(":");
    return { title: s.slice(0, idx).trim(), weightBps: Number(s.slice(idx + 1).trim()) };
  }) : [{ title: spec || "Full Delivery", weightBps: 10000 }];
  const sumBps = parts.reduce((a, p) => a + p.weightBps, 0);
  if (sumBps !== 10000) {
    showToast(`Milestone weights must sum to 10000 bps (got ${sumBps}).`);
    return;
  }
  const newId = Math.max(0, ...state.bounties.map((b) => b.id)) + 1;
  let alloc = 0;
  const milestones = parts.map((p, i) => {
    const pay = i === parts.length - 1 ? ugnot - alloc : Math.floor((ugnot * p.weightBps) / 10000);
    alloc += pay;
    return { index: i, title: p.title, weightBps: p.weightBps, payoutUgnot: pay, status: "PENDING", proofURL: "" };
  });
  state.bounties.unshift({
    id: newId,
    title,
    summary,
    tags,
    sponsor: state.walletAddr || "g1alice94sp0ns0r7v2q8m4k5x2p9r6t3u8w0a1b",
    builder: "",
    status: "OPEN",
    fundedUgnot: ugnot,
    releasedUgnot: 0,
    escrowVault: `g1subescrow${newId}vault00000000000000000000`,
    stakeVault: `g1substake${newId}vault000000000000000000000`,
    minReviewerStakeUgnot: Number(document.getElementById("fStake").value),
    reviewerQuorum: Number(document.getElementById("fQuorum").value),
    deadline: new Date(Date.now() + Number(document.getElementById("fDeadline").value) * 86400000).toISOString().slice(0, 10),
    archived: false,
    milestones,
  });
  state.selectedId = newId;
  document.querySelector('[data-tab="board"]').click();
  renderAll();
  showToast(`Quest #${newId} minted with isolated vault cur.Sub("escrow/${newId}")!`);
});

renderAll();
