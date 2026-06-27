/* ============================================================
   Caden — dashboard.js
   Renders mocked system state and simulates live activity:
   a ticking heartbeat, a streaming log feed, and quick actions
   that confirm with toasts. This is the seam where the local
   server's real telemetry plugs in later.
   ============================================================ */

// Guard first.
if (!requireAuth()) {
  throw new Error("Not authenticated");
}

/* ----------------------------------------------------------
   1. Mock data
   ---------------------------------------------------------- */
const AGENTS = [
  { name: "Orchestrator Brain", role: "Routes every input · core process", status: "on", seen: "now" },
  { name: "News Monitor Agent", role: "Scans sources every 15 min", status: "on", seen: "2m ago" },
  { name: "Notification Agent", role: "Routes Telegram + email", status: "idle", seen: "12m ago" },
  { name: "Self-Check Agent", role: "Integrity + health, hourly", status: "on", seen: "8m ago" },
  { name: "Repair Agent", role: "External audit, weekly", status: "idle", seen: "6d ago" },
  { name: "Conversation Agent", role: "Chat threads + context", status: "on", seen: "now" },
];

const TASKS = [
  { name: "News sweep", next: "in 11m", last: "4m ago", status: "scheduled", cls: "" },
  { name: "Hourly self-check", next: "in 38m", last: "22m ago", status: "scheduled", cls: "" },
  { name: "Daily backup", next: "03:00", last: "03:00", status: "done", cls: "pill--ok" },
  { name: "Weekly repair audit", next: "Sun 04:00", last: "6d ago", status: "scheduled", cls: "" },
  { name: "Engagement check", next: "in 1h 12m", last: "—", status: "queued", cls: "pill--warn" },
];

const NOTIFICATIONS = [
  { channel: "Telegram", to: "Weston", preview: "Transit project update flagged for your review", status: "queued" },
  { channel: "Email", to: "Weston", preview: "Weekend weather advisory for the trip", status: "wait 28m" },
  { channel: "Device", to: "Kitchen kiosk", preview: "Package is out for delivery", status: "sent" },
];

// Log line templates the simulator draws from.
const LOG_POOL = [
  { lvl: "info", msg: "news-monitor: scored 14 items, 1 above threshold" },
  { lvl: "info", msg: "conversation: thread context updated for session #a91" },
  { lvl: "ok", msg: "self-check: file checksums verified, 0 mismatches" },
  { lvl: "info", msg: "scheduler: queued task 'engagement-check' (+2h)" },
  { lvl: "info", msg: "orchestrator: heartbeat broadcast to 6 agents" },
  { lvl: "warn", msg: "groq: rate-limit at 80%, rotating to key #2" },
  { lvl: "info", msg: "notify: device active, surfacing inline (no escalation)" },
  { lvl: "ok", msg: "backup: snapshot replicated to secondary host" },
  { lvl: "info", msg: "news-monitor: 3 sources polled in 412ms" },
  { lvl: "warn", msg: "self-check: log dir at 61% — rotation due in 2d" },
  { lvl: "info", msg: "memory: indexed 2 new conversations" },
  { lvl: "ok", msg: "repair: local audit pass, no action required" },
];

const SEED_LOGS = [
  { lvl: "ok", msg: "orchestrator: boot complete, all agents online", ago: 142 },
  { lvl: "info", msg: "scheduler: loaded 5 persistent tasks from db", ago: 138 },
  { lvl: "info", msg: "news-monitor: first sweep complete, 0 alerts", ago: 121 },
  { lvl: "ok", msg: "self-check: integrity pass, disk at 38%", ago: 96 },
  { lvl: "warn", msg: "groq: key #1 nearing limit, prepared rotation", ago: 64 },
  { lvl: "info", msg: "conversation: session #a91 opened from dashboard", ago: 33 },
  { lvl: "info", msg: "orchestrator: heartbeat broadcast to 6 agents", ago: 12 },
];

/* ----------------------------------------------------------
   2. Elements
   ---------------------------------------------------------- */
const agentList = document.getElementById("agent-list");
const taskBody = document.getElementById("task-body");
const notifList = document.getElementById("notif-list");
const logFeed = document.getElementById("log-feed");
const hbStat = document.getElementById("hb-stat");
const toastStack = document.getElementById("toast-stack");
const shell = document.getElementById("app-shell");

const DOT_FOR = { on: "dot--on dot--pulse", idle: "dot--idle", error: "dot--error" };
const STATUS_TEXT = { on: "running", idle: "idle", error: "error" };

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

/* ----------------------------------------------------------
   3. Render: agents, tasks, notifications
   ---------------------------------------------------------- */
function renderAgents() {
  agentList.innerHTML = "";
  AGENTS.forEach((a) => {
    const row = document.createElement("div");
    row.className = "agent";
    row.innerHTML = `
      <span class="dot ${DOT_FOR[a.status]}" aria-hidden="true"></span>
      <div class="agent-id">
        <div class="agent-name">${escapeHtml(a.name)}</div>
        <div class="agent-role">${escapeHtml(a.role)}</div>
      </div>
      <span class="agent-seen">${escapeHtml(STATUS_TEXT[a.status])} · ${escapeHtml(a.seen)}</span>`;
    agentList.appendChild(row);
  });
}

function renderTasks() {
  taskBody.innerHTML = "";
  TASKS.forEach((t) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="t-name">${escapeHtml(t.name)}</td>
      <td class="t-mono t-next">${escapeHtml(t.next)}</td>
      <td class="t-mono hide-sm">${escapeHtml(t.last)}</td>
      <td><span class="pill ${t.cls}">${escapeHtml(t.status)}</span></td>`;
    taskBody.appendChild(tr);
  });
}

function renderNotifications() {
  notifList.innerHTML = "";
  NOTIFICATIONS.forEach((n) => {
    const row = document.createElement("div");
    row.className = "notif";
    row.innerHTML = `
      <span class="notif-channel">${escapeHtml(n.channel)}</span>
      <div class="notif-body">
        <div class="notif-to">To ${escapeHtml(n.to)}</div>
        <div class="notif-preview">${escapeHtml(n.preview)}</div>
      </div>
      <span class="notif-status">${escapeHtml(n.status)}</span>`;
    notifList.appendChild(row);
  });
}

/* ----------------------------------------------------------
   4. Log feed
   ---------------------------------------------------------- */
function clockFromAgo(secondsAgo) {
  const d = new Date(Date.now() - secondsAgo * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function logLineEl(lvl, msg, ago) {
  const el = document.createElement("div");
  el.className = "log-line";
  const time = typeof ago === "number" ? clockFromAgo(ago) : clockFromAgo(0);
  el.innerHTML = `
    <span class="log-time">${time}</span>
    <span class="lvl lvl--${lvl}">${lvl.toUpperCase()}</span>
    <span class="log-msg">${escapeHtml(msg)}</span>`;
  return el;
}

function seedLogs() {
  logFeed.innerHTML = "";
  SEED_LOGS.forEach((l) => logFeed.appendChild(logLineEl(l.lvl, l.msg, l.ago)));
  logFeed.scrollTop = logFeed.scrollHeight;
}

function pushLog(lvl, msg) {
  // Show empty-state replacement removal if needed.
  const empty = logFeed.querySelector(".empty");
  if (empty) empty.remove();

  const nearBottom =
    logFeed.scrollHeight - logFeed.scrollTop - logFeed.clientHeight < 48;
  logFeed.appendChild(logLineEl(lvl, msg));

  // Cap the feed length so the DOM doesn't grow forever.
  while (logFeed.children.length > 80) logFeed.removeChild(logFeed.firstChild);
  if (nearBottom) logFeed.scrollTop = logFeed.scrollHeight;
}

/* ----------------------------------------------------------
   5. Live simulation
   ---------------------------------------------------------- */
let heartbeat = 12;
function startSimulation() {
  // ticking heartbeat
  setInterval(() => {
    heartbeat += 1;
    if (heartbeat > 15) heartbeat = 1;
    if (hbStat) hbStat.textContent = heartbeat + "s";
  }, 1000);

  // streaming log lines
  setInterval(() => {
    const pick = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
    pushLog(pick.lvl, pick.msg);
  }, 3600);
}

/* ----------------------------------------------------------
   6. Toasts + quick actions
   ---------------------------------------------------------- */
function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.innerHTML = `<span class="toast-dot" aria-hidden="true"></span><span>${escapeHtml(message)}</span>`;
  toastStack.appendChild(el);
  setTimeout(() => {
    el.classList.add("is-leaving");
    setTimeout(() => el.remove(), 280);
  }, 3400);
}

const ACTIONS = {
  heartbeat() {
    heartbeat = 1;
    if (hbStat) hbStat.textContent = "1s";
    pushLog("ok", "orchestrator: manual heartbeat — 6/6 agents reported in");
    toast("Heartbeat triggered — all agents reported in.");
  },
  repair() {
    pushLog("info", "repair: manual audit started on secondary host");
    toast("Repair check started on the secondary machine.");
    setTimeout(() => pushLog("ok", "repair: audit complete, no action required"), 2600);
  },
  clearLog() {
    logFeed.innerHTML = '<div class="empty">Log cleared. New events will appear here.</div>';
    toast("Log cleared.");
  },
  restart() {
    pushLog("warn", "orchestrator: restarting Conversation Agent…");
    toast("Restarting Conversation Agent…");
    setTimeout(() => {
      pushLog("ok", "conversation: back online, context restored");
      toast("Conversation Agent is back online.");
    }, 2200);
  },
};

document.querySelectorAll("[data-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const fn = ACTIONS[btn.getAttribute("data-action")];
    if (fn) fn();
  });
});

/* ----------------------------------------------------------
   7. Rail toggle + logout
   ---------------------------------------------------------- */
document.getElementById("menu-toggle").addEventListener("click", () =>
  shell.classList.add("rail-open")
);
document.getElementById("rail-scrim").addEventListener("click", () =>
  shell.classList.remove("rail-open")
);
document.querySelectorAll("[data-logout]").forEach((el) =>
  el.addEventListener("click", logout)
);

/* ----------------------------------------------------------
   8. Boot
   ---------------------------------------------------------- */
renderAgents();
renderTasks();
renderNotifications();
seedLogs();
startSimulation();
