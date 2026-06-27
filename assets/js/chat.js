/* ============================================================
   Caden — chat.js
   Chat UI logic. Static phase: renders mock conversation
   history and Caden's replies locally. No network yet — the
   reply layer is the seam where the local server connects.
   ============================================================ */

// Guard first — bounce to login before any UI renders.
if (!requireAuth()) {
  throw new Error("Not authenticated");
}

/* ----------------------------------------------------------
   1. Mock data
   ---------------------------------------------------------- */
const CONVERSATIONS = [
  {
    id: "today",
    title: "Morning brief",
    preview: "Three things worth your attention",
    time: "08:14",
    messages: [
      { from: "caden", time: "08:14", text:
        "Morning. Quiet night — six agents reported in clean, no errors. Three things worth your attention today." },
      { from: "caden", time: "08:14", text:
        "Your 2pm moved to 2:30. A package is out for delivery. And the office network had a brief drop at 4am that recovered on its own — I logged it, nothing to do." },
    ],
  },
  {
    id: "news",
    title: "News relevance check",
    preview: "Filtered 41 stories down to 2",
    time: "Yest",
    messages: [
      { from: "user", time: "21:02", text: "Anything I missed today?" },
      { from: "caden", time: "21:02", text:
        "I scanned 41 stories across your sources. Two cleared the relevance threshold for you — a follow-up on the transit project you flagged last month, and a weather advisory for the weekend trip. The rest didn't meet the bar." },
    ],
  },
  {
    id: "repair",
    title: "Self-check report",
    preview: "File integrity verified",
    time: "Yest",
    messages: [
      { from: "user", time: "13:40", text: "Run a health check on yourself." },
      { from: "caden", time: "13:40", text:
        "Done. File checksums match, all agents responsive, disk at 38%, last backup replicated to the second machine at 03:00. No repair needed. I'll run the next pass at the top of the hour." },
    ],
  },
  {
    id: "reminder",
    title: "Reminder follow-up",
    preview: "Re-checking in 30 minutes",
    time: "Mon",
    messages: [
      { from: "user", time: "09:10", text: "Remind me to call the contractor at 11." },
      { from: "caden", time: "09:10", text:
        "Set for 11:00. I'll reach you on whatever device you're active on. If you don't respond in five minutes I'll send it to Telegram, then email after thirty." },
    ],
  },
];

/* In-character demo replies. Lightweight keyword routing so it
   feels responsive without a backend. */
const REPLIES = [
  { match: ["weather", "rain", "forecast", "temperature"], text:
    "In a live system I'd pull this from your configured sources. For now I'm running on generated data — but the routing's real: I'd score it for relevance and only surface it if it mattered to your day." },
  { match: ["news", "happening", "headline", "story"], text:
    "I monitor your sources every fifteen minutes and score each item against your profile. Once the backend's connected, this is where I'd hand you the two or three stories that actually clear the threshold." },
  { match: ["status", "health", "agents", "system", "uptime"], text:
    "Six agents online, zero errors, last heartbeat seconds ago. The dashboard has the full picture — system status, scheduled tasks, and the live log feed." },
  { match: ["remind", "reminder", "schedule", "tomorrow", "later"], text:
    "I can hold that. When the scheduler's wired up I'll create the task, persist it, and follow the notification ladder — device first, then Telegram, then email." },
  { match: ["who", "what are you", "yourself", "caden"], text:
    "I'm Caden — a home system that runs on your hardware around the clock. Right now I'm the interface, running on generated data. The brain comes online when the local server is connected." },
];

const FALLBACKS = [
  "Noted. I'm in demo mode right now, so I'm working from generated data — but the conversation, memory, and routing all run through here once the local server is connected.",
  "Got it. The interface is live; the brain is the next phase. When the backend's wired up, this is exactly where the real answer would land.",
  "Understood. I'll remember the shape of this. For now I'm static, but nothing about how we talk changes when I go live on your hardware.",
];

/* ----------------------------------------------------------
   2. Elements
   ---------------------------------------------------------- */
const thread = document.getElementById("thread-inner");
const convoList = document.getElementById("convo-list");
const form = document.getElementById("composer");
const input = document.getElementById("composer-input");
const sendBtn = document.getElementById("send-btn");
const headTitle = document.getElementById("chat-title");
const shell = document.getElementById("app-shell");

let activeId = CONVERSATIONS[0].id;
let replyIndex = 0;

/* ----------------------------------------------------------
   3. Rendering
   ---------------------------------------------------------- */
function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function renderConvoList() {
  convoList.innerHTML = "";
  CONVERSATIONS.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "convo" + (c.id === activeId ? " is-active" : "");
    btn.type = "button";
    btn.setAttribute("aria-current", c.id === activeId ? "true" : "false");
    btn.innerHTML = `
      <div class="convo-title">${escapeHtml(c.title)}</div>
      <div class="convo-meta">
        <span class="convo-preview">${escapeHtml(c.preview)}</span>
        <span class="convo-time">${escapeHtml(c.time)}</span>
      </div>`;
    btn.addEventListener("click", () => selectConvo(c.id));
    convoList.appendChild(btn);
  });
}

const CADEN_GLYPH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h3l2 5 4-12 2 7h5"/></svg>`;

function messageEl(msg) {
  const row = document.createElement("div");
  row.className = "msg msg--" + msg.from;
  const avatar =
    msg.from === "caden"
      ? `<div class="msg-avatar" aria-hidden="true">${CADEN_GLYPH}</div>`
      : `<div class="msg-avatar" aria-hidden="true">W</div>`;
  const name = msg.from === "caden" ? "Caden" : "You";
  row.innerHTML = `
    ${avatar}
    <div class="msg-body">
      <div class="msg-name">${name}</div>
      <div class="msg-bubble"><p>${escapeHtml(msg.text)}</p></div>
      <div class="msg-time">${escapeHtml(msg.time || nowTime())}</div>
    </div>`;
  return row;
}

function renderThread() {
  const convo = CONVERSATIONS.find((c) => c.id === activeId);
  headTitle.textContent = convo.title;
  thread.innerHTML = "";
  convo.messages.forEach((m) => thread.appendChild(messageEl(m)));
  scrollToBottom();
}

function selectConvo(id) {
  activeId = id;
  renderConvoList();
  renderThread();
  closeRail();
}

/* ----------------------------------------------------------
   4. Sending
   ---------------------------------------------------------- */
function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    thread.parentElement.scrollTop = thread.parentElement.scrollHeight;
  });
}

function pickReply(text) {
  const lower = text.toLowerCase();
  for (const r of REPLIES) {
    if (r.match.some((k) => lower.includes(k))) return r.text;
  }
  const f = FALLBACKS[replyIndex % FALLBACKS.length];
  replyIndex += 1;
  return f;
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "msg msg--caden typing";
  row.id = "typing-row";
  row.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">${CADEN_GLYPH}</div>
    <div class="msg-body">
      <div class="msg-name">Caden <span class="sr-only">is typing</span></div>
      <div class="msg-bubble" aria-label="Caden is typing">
        <span class="dot-typing"></span><span class="dot-typing"></span><span class="dot-typing"></span>
      </div>
    </div>`;
  thread.appendChild(row);
  scrollToBottom();
}

function clearTyping() {
  const t = document.getElementById("typing-row");
  if (t) t.remove();
}

function sendMessage(text) {
  const convo = CONVERSATIONS.find((c) => c.id === activeId);
  const userMsg = { from: "user", text: text, time: nowTime() };
  convo.messages.push(userMsg);
  thread.appendChild(messageEl(userMsg));
  scrollToBottom();

  showTyping();
  const delay = 750 + Math.min(text.length * 18, 1400);
  setTimeout(() => {
    clearTyping();
    const reply = { from: "caden", text: pickReply(text), time: nowTime() };
    convo.messages.push(reply);
    thread.appendChild(messageEl(reply));
    scrollToBottom();
  }, delay);
}

/* ----------------------------------------------------------
   5. Composer wiring
   ---------------------------------------------------------- */
function autosize() {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 180) + "px";
  sendBtn.disabled = input.value.trim() === "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  sendMessage(text);
  input.value = "";
  autosize();
  input.focus();
});

input.addEventListener("input", autosize);
input.addEventListener("keydown", (e) => {
  // Enter sends; Shift+Enter inserts a newline.
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

/* ----------------------------------------------------------
   6. New chat + rail toggle + logout
   ---------------------------------------------------------- */
document.getElementById("new-chat").addEventListener("click", () => {
  const id = "chat-" + Date.now();
  CONVERSATIONS.unshift({
    id: id,
    title: "New conversation",
    preview: "Say something to Caden",
    time: "now",
    messages: [
      { from: "caden", time: nowTime(), text:
        "I'm here. Ask me anything — or just tell me what to keep an eye on." },
    ],
  });
  selectConvo(id);
  input.focus();
});

function openRail() { shell.classList.add("rail-open"); }
function closeRail() { shell.classList.remove("rail-open"); }
document.getElementById("menu-toggle").addEventListener("click", openRail);
document.getElementById("rail-scrim").addEventListener("click", closeRail);

document.querySelectorAll("[data-logout]").forEach((el) =>
  el.addEventListener("click", logout)
);

/* ----------------------------------------------------------
   7. Boot
   ---------------------------------------------------------- */
renderConvoList();
renderThread();
autosize();
