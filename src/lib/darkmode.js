// ─────────────────────────────────────────────────────────────
// Dark mode helper.
//
// Applies `data-theme="dark"` on <html>, which flips every CSS
// variable in index.css. The choice is persisted both in the
// session prefs (`user.prefs.darkMode`) and in a tiny localStorage
// key so index.html can apply it BEFORE first paint (no flash).
// ─────────────────────────────────────────────────────────────

const THEME_KEY = "wellspace.theme";

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark";
  } catch {
    return false;
  }
}

export function applyTheme(dark) {
  const root = document.documentElement;
  if (dark) {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    // storage unavailable — theme is session-only
  }
}
