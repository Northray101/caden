/* @ds-bundle: {"format":3,"namespace":"CadenDesignSystem_d87b20","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"PresenceOrb","sourcePath":"components/core/PresenceOrb.jsx"},{"name":"StatusDot","sourcePath":"components/core/StatusDot.jsx"}]} */

(() => {

const __ds_ns = (window.CadenDesignSystem_d87b20 = window.CadenDesignSystem_d87b20 || {});
const __ds_scope = {};
(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PATHS = {
  mic: React.createElement(React.Fragment, null, React.createElement("rect", { x: "9", y: "2.5", width: "6", height: "11", rx: "3" }), React.createElement("path", { d: "M5.5 11a6.5 6.5 0 0 0 13 0" }), React.createElement("path", { d: "M12 17.5V21" }), React.createElement("path", { d: "M8.5 21h7" })),
  send: React.createElement("path", { d: "M4 12l16-7-7 16-2-7-7-2Z" }),
  chat: React.createElement("path", { d: "M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z" }),
  activity: React.createElement("path", { d: "M3 12h4l2 6 4-14 2 8h6" }),
  shield: React.createElement(React.Fragment, null, React.createElement("path", { d: "M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6l7-3Z" }), React.createElement("path", { d: "M9.5 12l1.8 1.8L15 10" })),
  device: React.createElement(React.Fragment, null, React.createElement("rect", { x: "2.5", y: "4", width: "13", height: "9", rx: "1.5" }), React.createElement("rect", { x: "17", y: "8", width: "4.5", height: "11", rx: "1.2" }), React.createElement("path", { d: "M6 17h5" })),
  wrench: React.createElement("path", { d: "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-2.1Z" }),
  user: React.createElement(React.Fragment, null, React.createElement("circle", { cx: "12", cy: "8", r: "3.2" }), React.createElement("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" })),
  clock: React.createElement(React.Fragment, null, React.createElement("circle", { cx: "12", cy: "12", r: "8.5" }), React.createElement("path", { d: "M12 7.5V12l3 2" })),
  bell: React.createElement(React.Fragment, null, React.createElement("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }), React.createElement("path", { d: "M10.5 19a1.6 1.6 0 0 0 3 0" })),
  plus: React.createElement("path", { d: "M12 5v14M5 12h14" }),
  arrowRight: React.createElement("path", { d: "M5 12h14M13 6l6 6-6 6" }),
  sparkle: React.createElement("path", { d: "M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3Z" }),
  sun: React.createElement(React.Fragment, null, React.createElement("circle", { cx: "12", cy: "12", r: "4" }), React.createElement("path", { d: "M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" })),
  home: React.createElement(React.Fragment, null, React.createElement("path", { d: "M4 11l8-7 8 7" }), React.createElement("path", { d: "M6 10v9h12v-9" })),
  x: React.createElement("path", { d: "M6 6l12 12M18 6L6 18" }),
  pause: React.createElement(React.Fragment, null, React.createElement("path", { d: "M9 5v14M15 5v14" })),
  check: React.createElement("path", { d: "M5 12.5l4.2 4.2L19 7" }),
};
function Icon({ name, size = 20, stroke = 1.7, style = {}, ...rest }) {
  const glyph = PATHS[name] || PATHS.sparkle;
  return React.createElement("svg", _extends({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { display: "block", flex: "0 0 auto", ...style } }, rest), glyph);
}
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({ children, variant = "primary", size = "md", icon, iconRight, block = false, disabled = false, style = {}, ...rest }) {
  const sizes = { sm: { padding: "8px 14px", fontSize: "var(--t-small)", radius: "var(--r-sm)", gap: 7 }, md: { padding: "12px 20px", fontSize: "var(--t-small)", radius: "var(--r)", gap: 8 }, lg: { padding: "15px 26px", fontSize: "var(--t-body)", radius: "var(--r-lg)", gap: 10 } };
  const sz = sizes[size] || sizes.md;
  const base = { display: block ? "flex" : "inline-flex", width: block ? "100%" : undefined, alignItems: "center", justifyContent: "center", gap: sz.gap, fontFamily: "var(--font-mono)", fontSize: sz.fontSize, fontWeight: 500, letterSpacing: "0.01em", padding: sz.padding, borderRadius: sz.radius, border: "1px solid transparent", transition: "transform var(--dur) var(--ease), background var(--dur) var(--ease), border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)", whiteSpace: "nowrap", opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto", cursor: "pointer" };
  const variants = { primary: { background: "var(--accent)", color: "var(--text-on-accent)", fontWeight: 600, boxShadow: "var(--shadow-sm)" }, ghost: { background: "var(--surface)", borderColor: "var(--border-strong)", color: "var(--text)" }, quiet: { background: "transparent", color: "var(--text-muted)" }, ink: { background: "rgba(243,233,218,0.08)", borderColor: "var(--border-ink)", color: "var(--text-on-ink)" } };
  return React.createElement("button", _extends({ type: "button", disabled: disabled, className: `caden-btn caden-btn--${variant}`, style: { ...base, ...(variants[variant] || variants.primary), ...style } }, rest), icon && React.createElement(__ds_scope.Icon, { name: icon, size: size === "lg" ? 19 : 16 }), children, iconRight && React.createElement(__ds_scope.Icon, { name: iconRight, size: size === "lg" ? 19 : 16 }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({ name, size = 40, iconSize, tone = "default", label, style = {}, ...rest }) {
  const tones = { default: { color: "var(--text-muted)", hoverBg: "var(--bg-2)" }, ink: { color: "var(--text-on-ink-muted)", hoverBg: "rgba(243,233,218,0.08)" }, accent: { color: "var(--accent)", hoverBg: "var(--accent-wash)" } };
  const t = tones[tone] || tones.default;
  return React.createElement("button", _extends({ type: "button", "aria-label": label, title: label, className: "caden-iconbtn", style: { width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-pill)", color: t.color, background: "transparent", transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)", "--hb": t.hoverBg, ...style } }, rest), React.createElement(__ds_scope.Icon, { name: name, size: iconSize || Math.round(size * 0.5) }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/PresenceOrb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PresenceOrb({ size = 180, state = "idle", label = "Caden", showLabel = false, flat = false, style = {}, ...rest }) {
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coreAnim = reduce ? "none" : state === "listening" ? "caden-listen 1.6s var(--ease-soft) infinite, caden-morph 8s var(--ease-soft) infinite" : state === "thinking" ? "caden-breathe 3.2s var(--ease-soft) infinite, caden-morph 6s var(--ease-soft) infinite" : "caden-breathe var(--breathe) var(--ease-soft) infinite, caden-morph var(--morph) var(--ease-soft) infinite";
  const glow = state === "listening" || state === "speaking" ? "var(--glow-lg)" : "var(--glow)";
  const wrap = { position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", ...style };
  const core = { position: "relative", width: "100%", height: "100%", borderRadius: "var(--blob-1)", background: flat ? "var(--accent)" : "radial-gradient(circle at 34% 30%, var(--presence-a) 0%, var(--presence-b) 46%, var(--presence-c) 100%)", boxShadow: flat ? "none" : glow, animation: flat ? (reduce ? "none" : "caden-morph 22s var(--ease-soft) infinite") : coreAnim, willChange: "transform, border-radius" };
  const sheen = { position: "absolute", inset: "8%", borderRadius: "inherit", background: "conic-gradient(from 0deg, rgba(255,248,241,0) 0%, rgba(255,248,241,0.34) 22%, rgba(255,248,241,0) 48%, rgba(255,248,241,0.18) 72%, rgba(255,248,241,0) 100%)", mixBlendMode: "soft-light", animation: reduce ? "none" : `caden-spin ${state === "thinking" ? "3.5s" : "16s"} linear infinite`, pointerEvents: "none" };
  const highlight = { position: "absolute", top: "14%", left: "20%", width: "38%", height: "30%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(255,250,243,0.55), rgba(255,250,243,0) 70%)", filter: "blur(2px)", pointerEvents: "none" };
  const showRipples = state === "listening" && !flat && !reduce;
  return React.createElement("div", _extends({ className: "caden-presence", "data-state": state, style: wrap }, rest),
    showRipples && [0, 1, 2].map(i => React.createElement("span", { key: i, "aria-hidden": "true", style: { position: "absolute", inset: 0, borderRadius: "var(--blob-2)", border: "1.5px solid var(--accent-line)", animation: `caden-ripple 2.4s var(--ease-out) ${i * 0.7}s infinite`, pointerEvents: "none" } })),
    React.createElement("div", { style: core, "aria-hidden": "true" }, !flat && React.createElement("div", { style: sheen }), !flat && React.createElement("div", { style: highlight })),
    showLabel && React.createElement("span", { style: { position: "absolute", bottom: -28, fontFamily: "var(--font-mono)", fontSize: "var(--t-mono)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-dim)" } }, label),
    React.createElement("span", { className: "sr-only" }, "Caden is ", state === "idle" ? "present and listening" : state));
}
Object.assign(__ds_scope, { PresenceOrb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PresenceOrb.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatusDot({ tone = "on", pulse = false, size = 8, style = {}, ...rest }) {
  const tones = { on: { bg: "var(--ok)", wash: "var(--ok-wash)" }, idle: { bg: "var(--warn)", wash: "var(--warn-wash)" }, error: { bg: "var(--err)", wash: "var(--err-wash)" }, accent: { bg: "var(--accent)", wash: "var(--accent-wash)" }, off: { bg: "var(--text-dim)", wash: "transparent" } };
  const t = tones[tone] || tones.on;
  return React.createElement("span", _extends({ "aria-hidden": "true", style: { position: "relative", display: "inline-block", width: size, height: size, flex: "0 0 auto", borderRadius: "50%", background: t.bg, boxShadow: `0 0 0 3px ${t.wash}`, ...style } }, rest),
    pulse && React.createElement("span", { style: { position: "absolute", inset: 0, borderRadius: "50%", background: t.bg, animation: "pulse-ring 2.6s var(--ease) infinite" } }));
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusDot.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;
__ds_ns.Icon = __ds_scope.Icon;
__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;
__ds_ns.IconButton = __ds_scope.IconButton;
__ds_ns.PresenceOrb = __ds_scope.PresenceOrb;
__ds_ns.StatusDot = __ds_scope.StatusDot;

})();
