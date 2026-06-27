/* ============================================================
   Caden — auth.js
   Client-side auth state. Hardcoded for the static phase;
   swaps to a real token from the local server in Phase 2.
   Stored in localStorage under "caden_auth".
   ============================================================ */

// Phase-1 credentials. Replaced by server-issued tokens later.
const VALID_USER = "admin";
const VALID_PASS = "caden2025";
const AUTH_KEY = "caden_auth";

/**
 * Resolve a path relative to the page that loaded this script, so links
 * work both locally and on a GitHub Pages project subpath (/repo/...).
 */
function cadenPath(file) {
  const base = window.location.pathname.replace(/[^/]*$/, "");
  return base + file;
}

/**
 * Attempt sign-in. On success, store a flag and route to the app.
 * Returns true/false so the caller can render an error state.
 */
function login(user, pass) {
  if (user === VALID_USER && pass === VALID_PASS) {
    localStorage.setItem(AUTH_KEY, "true");
    window.location.href = cadenPath("app.html");
    return true;
  }
  return false;
}

/** Guard for protected pages. Call at the very top of app/dashboard JS. */
function requireAuth() {
  if (!localStorage.getItem(AUTH_KEY)) {
    window.location.replace(cadenPath("login.html"));
    return false;
  }
  return true;
}

/** True when a session flag is present. */
function isAuthed() {
  return Boolean(localStorage.getItem(AUTH_KEY));
}

/** End the session and return to the login screen. */
function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = cadenPath("login.html");
}
