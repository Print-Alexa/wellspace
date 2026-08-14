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
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  runTransaction,
} from "firebase/firestore";
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
let syncWarned = false;

function persist(user) {
  cached = user;
  saveSession(user);
  syncRemote(user);
}

// Mirror the session to Firestore so community & partner features can
// share it. Keyed by the session's own anonymous uid — no login required
// (the anonymous design means every session already has one).
function syncRemote(user) {
  if (!user?.uid) return;
  setDoc(doc(db, "users", user.uid), user, { merge: true }).catch((e) => {
    if (!syncWarned) {
      syncWarned = true;
      console.warn("WellSpace: Firestore sync unavailable — running local-only", e);
    }
  });
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
    const data = emptySession({
      anonName: anonName(),
      authMethod: "google-preview",
    });
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
    setDoc(doc(db, "recoveryCodes", code), {
      uid: data.uid,
      createdAt: new Date().toISOString(),
    }).catch(() => {});
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
    const data =
      cached && cached.uid === local.uid
        ? cached
        : emptySession({ uid: local.uid });
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
  const uid = cached?.uid;
  if (uid) {
    // Stop advertising as available for a partner.
    setDoc(doc(db, "users", uid), { seekPartner: false }, { merge: true }).catch(
      () => {},
    );
  }
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

export async function addPost(text) {
  const createdAt = new Date().toISOString();
  let id = `post_${Date.now()}`; // local-only fallback

  // Save to Firestore first so everyone sees it. No login required — the
  // post is anonymous by design, keyed by the session's own uid.
  try {
    const ref = await addDoc(collection(db, "posts"), {
      name: cached?.anonName || "Anonymous",
      text,
      userId: cached?.uid,
      createdAt,
      reactions: [],
      replies: [],
    });
    id = ref.id; // use the shared id so the feed can dedupe own posts
  } catch (e) {
    console.warn("WellSpace: post kept local-only (Firestore unreachable)", e);
  }

  const postData = {
    id,
    name: cached?.anonName || "Anonymous",
    text,
    time: "just now",
    reactions: [],
    replies: [],
    mine: true,
    userId: cached?.uid,
    createdAt,
  };

  // Save to local session
  mutate((u) => {
    u.posts = [postData, ...u.posts];
  });

  return postData;
}

function timeAgo(iso) {
  if (!iso) return "";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Fetch community posts from Firestore
export async function getCommunityPosts() {
  try {
    if (!cached?.uid) return [];
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(50),
    );
    const snap = await getDocs(q);
    return snap.docs
      .filter((d) => d.data().text)
      .map((d) => ({
        id: d.id,
        ...d.data(),
        time: timeAgo(d.data().createdAt),
        mine: d.data().userId === cached.uid,
      }));
  } catch (e) {
    console.warn("WellSpace: could not fetch community posts", e);
    return [];
  }
}

export async function findPartner() {
  try {
    if (!cached?.uid) return null;

    // Broadcast that you're looking, so other searchers can find you.
    setDoc(doc(db, "users", cached.uid), { seekPartner: true }, { merge: true }).catch(
      () => {},
    );

    // Find others who are also listening. (Equality filter only — a query
    // like `buildHabits != []` is invalid on array fields and always failed.)
    const q = query(
      collection(db, "users"),
      where("seekPartner", "==", true),
      limit(30),
    );
    const snap = await getDocs(q);

    for (const candidateDoc of snap.docs) {
      const data = candidateDoc.data();
      if (candidateDoc.id === cached.uid) continue; // never match yourself
      if (data.partner) continue; // already claimed by someone else
      if (!Array.isArray(data.buildHabits) || data.buildHabits.length === 0)
        continue; // need at least one shared habit

      const partner = {
        id: candidateDoc.id,
        name: data.anonName || "QuietCompanion",
        pairedAt: new Date().toISOString(),
        goals: (cached.buildHabits || []).map((h) => ({
          id: h,
          streak: 0,
          me: false,
          them: false,
        })),
        messages: [],
      };

      try {
        // Claim them atomically so two searchers never match the same person.
        await runTransaction(db, async (tx) => {
          const candRef = doc(db, "users", candidateDoc.id);
          const candSnap = await tx.get(candRef);
          if (!candSnap.exists() || candSnap.data().partner)
            throw new Error("taken");
          // Their view of the match points back at us.
          const partnerForThem = {
            ...partner,
            id: cached.uid,
            name: cached.anonName || "QuietCompanion",
          };
          tx.update(candRef, { partner: partnerForThem, seekPartner: false });
          tx.update(doc(db, "users", cached.uid), {
            partner,
            seekPartner: false,
          });
        });
        return partner; // claimed!
      } catch {
        // Someone else matched them first — try the next listener.
      }
    }

    return null; // nobody is listening right now
  } catch (e) {
    console.warn("WellSpace: partner search failed", e);
    return null;
  }
}

// Pull the latest shared state for this session (someone may have matched
// you as a partner, or replied to your post, while you were away).
export async function refreshUser() {
  if (!cached?.uid) return cached;
  try {
    const snap = await getDoc(doc(db, "users", cached.uid));
    if (snap.exists()) {
      cached = { ...cached, ...snap.data() };
      saveSession(cached);
    }
  } catch (e) {
    console.warn("WellSpace: could not refresh space", e);
  }
  return cached;
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
