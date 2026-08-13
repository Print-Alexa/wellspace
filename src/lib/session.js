// Anonymous session store.
//
// WellSpace is fully anonymous. A session is a small bundle of data kept on the
// device (and mirrored to Firestore when Firebase is available). New users have
// an EMPTY session — the app never seeds demo data. Everything a user sees
// comes from their onboarding quiz + their own actions.
//
// Collections in Firestore (production):
//   users/{uid}              — this exact session shape
//   recoveryCodes/{code}     — { uid, createdAt }
//   posts/{postId}           — anonymous community posts
//   posts/{postId}/replies   — anonymous replies
// The device copy below is the offline / preview fallback.

const SESSION_KEY = "wellspace.session.v2"; // bumped when the session schema changes
const CODES_KEY = "wellspace.codes.v2";

export function emptySession(overrides = {}) {
  return {
    uid: `anon_${Math.random().toString(36).slice(2, 12)}`,
    anonName: null, // generated on first use
    authMethod: "recovery", // "google" | "recovery" | "google-preview"
    recoveryCode: null,
    createdAt: new Date().toISOString(),
    onboarded: false,

    // ── Onboarding quiz answers — the only "data" a new app may have ──
    buildHabits: [], // habit ids the user chose to track
    extraHabits: [], // custom habits added later, by name
    intention: null, // intention id (see INTENTIONS)
    initialMood: null, // mood id — seeds the dashboard mood summary

    // ── The user's own activity — all starts empty ──
    moodLog: {}, // { "YYYY-MM-DD": { mood, note, ts } }
    habitChecks: {}, // { habitId: ["YYYY-MM-DD", ...] }
    posts: [], // user's own community posts
    savedCards: [], // fortune card ids the user kept
    partner: null, // { id, name, pairedAt, goals, messages }

    prefs: {
      dailyCard: true,
      moodNudge: true,
      habitReminders: true,
      communityReplies: false,
      reminderTime: "08:00",
      sound: true,
    },

    ...overrides,
  };
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? { ...emptySession(), ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage unavailable — session is in-memory only.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // noop
  }
}

// ─── Recovery codes (device-local map for the offline demo; Firestore is the
// production store). ─────────────────────────────────────────────────────────

export function generateRecoveryCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = (n) =>
    Array.from(
      { length: n },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  return `WELL-${seg(4)}-${seg(4)}`;
}

export function storeCode(code, uid) {
  try {
    const map = JSON.parse(localStorage.getItem(CODES_KEY) || "{}");
    map[code] = { uid, createdAt: new Date().toISOString() };
    localStorage.setItem(CODES_KEY, JSON.stringify(map));
  } catch {
    // noop
  }
}

export function findCode(code) {
  try {
    const map = JSON.parse(localStorage.getItem(CODES_KEY) || "{}");
    return map[code] || null;
  } catch {
    return null;
  }
}
