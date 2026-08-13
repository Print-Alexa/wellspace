// ─────────────────────────────────────────────────────────────
// WellSpace data facade.
//
// One API for the whole app. When Firebase is reachable it reads and
// writes Firestore; when it isn't (local preview, popups blocked,
// offline) it transparently falls back to the device session store —
// so the full experience can be reviewed without a live backend.
//
// Anonymous by design:
//  • Google sign-in is used ONLY as a recoverable key. The profile
//    written to Firestore is `users/{firebaseUid}` holding an
//    auto-generated anonymous name — never the real name or email.
//  • Recovery codes map to the same anonymous uid.
// ─────────────────────────────────────────────────────────────

import { auth, provider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  emptySession,
  loadSession,
  saveSession,
  clearSession,
  generateRecoveryCode,
  storeCode,
  findCode,
} from "./session";
import { anonName, todayKey } from "../constants";

let cached = loadSession();

function persist(user) {
  cached = user;
  saveSession(user);
  syncRemote(user);
}

function syncRemote(user) {
  if (auth?.currentUser?.uid) {
    setDoc(doc(db, "users", auth.currentUser.uid), user, { merge: true }).catch(() => {});
  }
}

async function remoteDoc(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

// ─── Session lifecycle ───────────────────────────────────────

// The current user session, or null if brand new.
export function getUser() {
  return cached || null;
}

// Sign in with Google → mapped to an anonymous profile.
// Falls back to a fully anonymous local session in preview mode.
export async function startWithGoogle() {
  try {
    const res = await signInWithPopup(auth, provider);
    const uid = res.user.uid; // used only as a key — identity never stored
    let data = await remoteDoc(uid);
    if (!data) {
      data = emptySession({ uid, anonName: anonName(), authMethod: "google" });
      await setDoc(doc(db, "users", uid), data).catch(() => {});
    }
    persist(data);
    return { mode: "firebase", user: data };
  } catch {
    const data = emptySession({ anonName: anonName(), authMethod: "google-preview" });
    persist(data);
    return { mode: "local", user: data };
  }
}

// Stay anonymous — generate a recovery code and a fresh empty space.
export function startAnonymous() {
  const code = generateRecoveryCode();
  const data = emptySession({ anonName: anonName(), recoveryCode: code });
  storeCode(code, data.uid);
  persist(data);
  if (auth?.currentUser) {
    // Only for Google-authed users who switch to code mode in the same run.
    setDoc(doc(db, "recoveryCodes", code), { uid: data.uid, createdAt: new Date().toISOString() }).catch(() => {});
  }
  return { code, user: data };
}

// Return to a space with a recovery code.
export async function redeemCode(rawCode) {
  const code = (rawCode || "").trim().toUpperCase();
  try {
    const snap = await getDoc(doc(db, "recoveryCodes", code));
    if (snap.exists()) {
      const { uid } = snap.data();
      const data = (await remoteDoc(uid)) || emptySession({ uid });
      persist(data);
      return { mode: "firebase", user: data };
    }
  } catch {
    // fall through to local
  }
  const local = findCode(code);
  if (local) {
    const data = cached && cached.uid === local.uid ? cached : emptySession({ uid: local.uid });
    persist(data);
    return { mode: "local", user: data };
  }
  return null;
}

// Merge a patch into the session (onboarding answers, prefs, …).
export function saveUser(patch) {
  const user = { ...(cached || emptySession()), ...patch };
  persist(user);
  return user;
}

export async function resetAuth() {
  clearSession();
  cached = null;
  try {
    await auth?.signOut();
  } catch {
    // noop
  }
}

// ─── Activity — each helper mutates, persists, mirrors ───────

function mutate(fn) {
  const user = cached || emptySession();
  fn(user);
  persist(user);
  return user;
}

export function logMood(mood, note = "") {
  return mutate((u) => {
    u.moodLog[todayKey()] = { mood, note, ts: new Date().toISOString() };
    if (!u.initialMood) u.initialMood = mood;
  });
}

export function toggleHabit(habitId, done) {
  return mutate((u) => {
    const key = todayKey();
    const checks = u.habitChecks[habitId] || [];
    u.habitChecks[habitId] = done
      ? [...new Set([...checks, key])]
      : checks.filter((d) => d !== key);
  });
}

export function addHabit(id) {
  return mutate((u) => {
    if (!u.buildHabits.includes(id)) u.buildHabits = [...u.buildHabits, id];
  });
}

export function removeHabit(id) {
  return mutate((u) => {
    u.buildHabits = u.buildHabits.filter((h) => h !== id);
    delete u.habitChecks[id];
  });
}

export function setIntention(id) {
  return mutate((u) => (u.intention = id));
}

export function addPost(text) {
  return mutate((u) => {
    u.posts = [
      {
        id: `post_${Date.now()}`,
        name: u.anonName,
        text,
        time: "just now",
        reactions: [],
        replies: [],
        mine: true,
      },
      ...u.posts,
    ];
  });
}

export function saveCard(id) {
  return mutate((u) => {
    if (!u.savedCards.includes(id)) u.savedCards = [...u.savedCards, id];
  });
}

export function setPartner(partner) {
  return mutate((u) => (u.partner = partner));
}

export function sendMessage(text) {
  return mutate((u) => {
    if (!u.partner) return;
    u.partner.messages = [
      ...(u.partner.messages || []),
      { id: `m_${Date.now()}`, fromMe: true, text, time: "just now" },
    ];
  });
}

export function toggleSharedGoal(id, who) {
  return mutate((u) => {
    if (!u.partner) return;
    u.partner.goals = (u.partner.goals || []).map((g) =>
      g.id === id ? { ...g, [who]: !g[who] } : g,
    );
  });
}

export function savePrefs(patch) {
  return mutate((u) => (u.prefs = { ...u.prefs, ...patch }));
}

export function clearAllData() {
  clearSession();
  cached = null;
}
