/* ============================================================
   Caden — nav.js
   Landing-page behaviour: auth-aware nav links, scroll reveals,
   and the two signature pieces — a live system console and the
   ambient "awareness" oscilloscope. Everything here is guarded
   by element presence so the file is safe to load anywhere.
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* --------------------------------------------------------
     1. Auth-aware primary action
     "Open Caden" goes straight to the app when a session
     exists, otherwise to the login gate.
     -------------------------------------------------------- */
  function wireAuthLinks() {
    const target =
      typeof isAuthed === "function" && isAuthed() ? "app.html" : "login.html";
    document.querySelectorAll("[data-open-caden]").forEach((el) => {
      el.setAttribute("href", target);
    });
  }

  /* --------------------------------------------------------
     2. Reveal on scroll / load
     -------------------------------------------------------- */
  function wireReveals() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------
     3. Live system console (hero signature)
     A small heartbeat counter that ticks like a process
     reporting in. Calm, never noisy.
     -------------------------------------------------------- */
  function wireConsole() {
    const hb = document.getElementById("hb-counter");
    if (!hb) return;

    let seconds = 3;
    setInterval(() => {
      seconds += 1;
      if (seconds > 14) seconds = 1; // a fresh heartbeat lands
      hb.textContent = seconds + "s";
    }, 1000);

    // Occasionally tick the "scanned" counter so the page feels alive.
    const scanned = document.getElementById("scan-counter");
    if (scanned) {
      let count = 1204;
      setInterval(() => {
        count += Math.floor(Math.random() * 3);
        scanned.textContent = count.toLocaleString();
      }, 4200);
    }
  }

  /* --------------------------------------------------------
     4. Ambient awareness signal (canvas oscilloscope)
     A slow baseline that breathes, with the occasional blip
     — Caden registering something worth noticing.
     -------------------------------------------------------- */
  function wireSignal() {
    const canvas = document.querySelector(".hero-signal");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const accent = "61, 142, 240";
    const baseline = () => height * 0.62;

    // Reduced motion: draw one calm static baseline and stop.
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(${accent}, 0.5)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, baseline());
      ctx.lineTo(width, baseline());
      ctx.stroke();
      return;
    }

    // Travelling blips that fade as they age.
    const blips = [];
    function spawnBlip() {
      blips.push({ x: Math.random() * 0.2, life: 0 });
      const next = 2600 + Math.random() * 3600;
      setTimeout(spawnBlip, next);
    }
    setTimeout(spawnBlip, 1200);

    let t = 0;
    function draw() {
      t += 0.012;
      ctx.clearRect(0, 0, width, height);
      const mid = baseline();

      // main waveform
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const p = x / width;
        let y =
          mid +
          Math.sin(p * 9 + t) * 4 +
          Math.sin(p * 23 - t * 1.6) * 2;

        // add any active blips as gaussian bumps
        for (const b of blips) {
          const d = p - b.x;
          y -= Math.exp(-(d * d) / 0.0009) * 26 * Math.exp(-b.life * 1.4);
        }
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, `rgba(${accent}, 0.15)`);
      grad.addColorStop(0.5, `rgba(${accent}, 0.85)`);
      grad.addColorStop(1, `rgba(${accent}, 0.15)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // advance + retire blips
      for (let i = blips.length - 1; i >= 0; i--) {
        blips[i].x += 0.0016;
        blips[i].life += 0.012;
        if (blips[i].x > 1.1 || blips[i].life > 6) blips.splice(i, 1);
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* --------------------------------------------------------
     Boot
     -------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    wireAuthLinks();
    wireReveals();
    wireConsole();
    wireSignal();
  });
})();
