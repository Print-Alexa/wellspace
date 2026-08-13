// ─────────────────────────────────────────────────────────────
// WellSpace — design system (single source of truth)
// Warm, calm, motivating. Headspace meets tarot.
// Grounded, intentional, never clinical.
// ─────────────────────────────────────────────────────────────

import {
  Waves,
  Sprout,
  Sun,
  Sparkles,
  Moon,
  Wind,
  CloudRain,
  Zap,
  Droplets,
  Activity,
  Footprints,
  Brain,
  PenLine,
  BookOpen,
  Sunrise,
  Leaf,
  MoonStar,
  Target,
  HeartHandshake,
  Smartphone,
  Coffee,
  Candy,
  AlarmClock,
  Feather,
  Clock,
  Gamepad2,
  HeartCrack,
  Hourglass,
  Scale,
  Hand,
  ShoppingBag,
} from "lucide-react";

export const C = {
  // ── Paper & ink — calm near-white by default, flips in dark mode ──
  // Neutrals are CSS variables so `[data-theme="dark"]` overrides them
  // everywhere, including inline styles that reference these tokens.
  cream: "var(--cream)",
  offWhite: "var(--off-white)",
  paper: "var(--paper)",
  sand: "var(--sand)",
  ink: "var(--ink)",
  muted: "var(--muted)",
  faint: "var(--faint)",
  line: "var(--line)",
  cardLine: "var(--card-line)",

  // ── The five-color brand palette ──
  butter: "#FFF8BD", // Buttercream — cards, surfaces
  butterDeep: "#C08A1C", // readable butter-gold for text/icons on light
  orange: "#F26200", // Burnt Orange — primary buttons, accents
  orangeSoft: "#FFE9DB", // soft peach wash
  blue: "#D6E8FD", // Baby Blue — secondary sections
  blueSoft: "#D6E8FD",
  blueDeep: "#6E97C9", // readable blue for icons/lines on light
  olive: "#6B7A3A", // Olive Green — secondary buttons, accents
  oliveSoft: "#EBEFDB", // soft olive wash

  // Card tones (bg + border) — solid pastels on the pale room
  butterCard: { bg: "#FFF8BD", border: "rgba(196, 172, 60, 0.40)" },
  pinkCard: { bg: "#F4D0E5", border: "rgba(214, 130, 178, 0.40)" }, // reference pink
  sageCard: { bg: "#EBEFDB", border: "rgba(107, 122, 58, 0.35)" }, // olive
  skyCard: { bg: "#D6E8FD", border: "rgba(120, 160, 220, 0.40)" }, // baby blue
  lavenderCard: { bg: "#E9EDF7", border: "rgba(150, 170, 210, 0.35)" }, // soft blue-lavender

  // Night — dusty plum, the reference dark
  night: "#2F2A3D",
  night2: "#3B3547",
  night3: "#453F58",
  star: "#F4DEAE", // buttercream starlight on dark
  starDim: "rgba(244, 222, 174, 0.45)",

  // Accent aliases — muted, warm, calm
  gold: "#C08A1C", // butter-gold — on-dark highlights, happy mood
  goldSoft: "#FBF0C4", // pale butter tint
  clay: "#C26B5E", // muted terracotta-rose — accents
  claySoft: "#F7E4DE",
  sage: "#6B7A3A", // Olive Green — secondary action
  sageSoft: "#EBEFDB",
  sky: "#6E97C9", // deep baby blue — icons & lines on light
  skySoft: "#D6E8FD",
  lavender: "#9B8FBD", // soft grey-lavender — moods only
  lavenderSoft: "#ECEBF2",
  rose: "#CE7A63", // warm terracotta-rose — gentle warnings
  roseSoft: "#F9E4DB",
  danger: "#BF3A1E",
  dangerSoft: "#FBE3D8",

  // Back-compat aliases
  dark: "#1B1B1F",
  border: "rgba(27, 27, 31, 0.12)",
};

// ─── TYPE ────────────────────────────────────────────────────
export const serif = "'DM Serif Display', Georgia, serif";
export const script = "'Playwrite HR Lijeva', cursive";
export const sans = "'Inter', system-ui, -apple-system, sans-serif";

// ─── SHAPE & DEPTH — soft, rounded, minimal shadows ─────────
export const RADIUS = { lg: 24, md: 18, sm: 12, pill: 999 };
export const SHADOW = {
  soft: "0 1px 2px rgba(51,41,31,0.05), 0 10px 28px rgba(51,41,31,0.07)",
  lift: "0 2px 8px rgba(51,41,31,0.06), 0 24px 56px rgba(51,41,31,0.12)",
  night: "0 24px 64px rgba(30,22,14,0.5)",
};

// ─── GRAIN — film grain on backgrounds only, never cards ────
export const grain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

// ─── PAGE BACKGROUNDS — grain is painted INTO the background
// layer so it textures only the backdrop, never the cards. ────
// Page background lives in a CSS variable so dark mode swaps it in one place.
export const bgGradient = "var(--page-bg)";

export const pageBg = {
  minHeight: "100vh",
  background: `${grain}, ${bgGradient}`,
  backgroundAttachment: "fixed",
};

export const glassCard = {
  background: "var(--glass)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  borderRadius: RADIUS.lg,
  border: "1px solid var(--card-line)",
  boxShadow: SHADOW.soft,
};

// ─── GLASS BAR (nav / tab bar) ───────────────────────────────
export const glassBar = {
  background: "var(--glass)",
  backdropFilter: "blur(20px) saturate(1.2)",
  WebkitBackdropFilter: "blur(20px) saturate(1.2)",
  border: "1px solid var(--card-line)",
};

// ─── MOODS — the emotion picker ──────────────────────────────
// value = position on the 1–5 chart scale; color = brand hue.
// Mood hues are harmonized with the five-color palette (calm→baby blue,
// content→olive, happy→butter-gold, grateful→burnt orange) with muted
// complementary tones for the harder feelings — distinct enough to read
// at a glance in the picker and chart.
export const MOODS = [
  { id: "calm", label: "Calm", icon: Waves, value: 4, color: "#6E97C9", soft: "#D6E8FD" },
  { id: "content", label: "Content", icon: Sprout, value: 4, color: C.olive, soft: C.oliveSoft },
  { id: "happy", label: "Happy", icon: Sun, value: 5, color: C.butterDeep, soft: C.goldSoft },
  { id: "grateful", label: "Grateful", icon: Sparkles, value: 5, color: C.orange, soft: C.orangeSoft },
  { id: "tired", label: "Tired", icon: Moon, value: 3, color: C.lavender, soft: C.lavenderSoft },
  { id: "anxious", label: "Anxious", icon: Wind, value: 2, color: "#D97B2B", soft: "#F7E4D8" },
  { id: "low", label: "Low", icon: CloudRain, value: 1, color: "#6C7A99", soft: "#E6EAF1" },
  { id: "stressed", label: "Stressed", icon: Zap, value: 2, color: C.rose, soft: C.roseSoft },
];

export const moodById = (id) => MOODS.find((m) => m.id === id) || null;

// ─── HABIT LIBRARY — two families, because that's what WellSpace
// is about: habits to BUILD (add to your days) and habits to
// BREAK (let go of). Categorized in the onboarding quiz.
export const HABIT_LIBRARY = [
  // ── Build — gentle additions ──
  { id: "water", label: "Drink water", category: "build", icon: Droplets, color: C.sky, soft: C.skySoft },
  { id: "sleep", label: "Sleep well", category: "build", icon: Moon, color: C.lavender, soft: C.lavenderSoft },
  { id: "move", label: "Move your body", category: "build", icon: Activity, color: C.sage, soft: C.sageSoft },
  { id: "walk", label: "Take a walk", category: "build", icon: Footprints, color: C.sage, soft: C.sageSoft },
  { id: "meditate", label: "Meditate", category: "build", icon: Brain, color: C.sky, soft: C.skySoft },
  { id: "journal", label: "Journal", category: "build", icon: PenLine, color: C.clay, soft: C.claySoft },
  { id: "read", label: "Read 10 pages", category: "build", icon: BookOpen, color: C.gold, soft: C.goldSoft },
  { id: "sunlight", label: "Morning sunlight", category: "build", icon: Sunrise, color: C.gold, soft: C.goldSoft },
  { id: "nature", label: "Time in nature", category: "build", icon: Leaf, color: C.sage, soft: C.sageSoft },
  // ── Break — small things to let go of ──
  { id: "screen", label: "No phone after 9pm", category: "break", icon: MoonStar, color: C.rose, soft: C.roseSoft },
  { id: "scroll", label: "Less social media", category: "break", icon: Smartphone, color: C.rose, soft: C.roseSoft },
  { id: "caffeine", label: "No caffeine after 4pm", category: "break", icon: Coffee, color: C.clay, soft: C.claySoft },
  { id: "sugar", label: "Skip sugary snacks", category: "break", icon: Candy, color: C.rose, soft: C.roseSoft },
  { id: "snooze", label: "Wake on the first alarm", category: "break", icon: AlarmClock, color: C.clay, soft: C.claySoft },
  { id: "lateNight", label: "Sleep before midnight", category: "break", icon: Clock, color: C.lavender, soft: C.lavenderSoft },
  { id: "gaming", label: "Less late-night gaming", category: "break", icon: Gamepad2, color: C.lavender, soft: C.lavenderSoft },
  { id: "energyDrinks", label: "No energy drinks", category: "break", icon: Zap, color: C.clay, soft: C.claySoft },
  { id: "negativeTalk", label: "Soften negative self-talk", category: "break", icon: HeartCrack, color: C.rose, soft: C.roseSoft },
  { id: "procrastinate", label: "Stop procrastinating", category: "break", icon: Hourglass, color: C.lavender, soft: C.lavenderSoft },
  { id: "compare", label: "Stop comparing yourself", category: "break", icon: Scale, color: C.rose, soft: C.roseSoft },
  { id: "nailBite", label: "Stop biting nails", category: "break", icon: Hand, color: C.clay, soft: C.claySoft },
  { id: "impulseBuy", label: "Cut impulse spending", category: "break", icon: ShoppingBag, color: C.rose, soft: C.roseSoft },
];

export const HABIT_CATEGORIES = {
  build: {
    id: "build",
    title: "Habits to build",
    tagline: "gentle additions to your days",
    icon: Sprout,
    color: C.sage,
    soft: C.sageSoft,
  },
  break: {
    id: "break",
    title: "Habits to release",
    tagline: "small things to let go of",
    icon: Feather,
    color: C.rose,
    soft: C.roseSoft,
  },
};

export const habitsByCategory = (category) => HABIT_LIBRARY.filter((h) => h.category === category);

export const habitMeta = (id) =>
  HABIT_LIBRARY.find((h) => h.id === id) || {
    id,
    label: id,
    category: "build",
    icon: Sparkles,
    color: C.lavender,
    soft: C.lavenderSoft,
  };

// ─── INTENTIONS ──────────────────────────────────────────────
export const INTENTIONS = [
  { id: "calm", label: "Find calm", desc: "Less noise, more stillness", icon: Waves },
  { id: "focus", label: "Improve focus", desc: "A clear mind for my days", icon: Target },
  { id: "energy", label: "Build energy", desc: "Feel more alive daily", icon: Sunrise },
  { id: "connection", label: "Feel connected", desc: "Less lonely, more held", icon: HeartHandshake },
  { id: "rest", label: "Rest without guilt", desc: "Sleep, softness, recovery", icon: MoonStar },
];

export const intentionById = (id) =>
  INTENTIONS.find((i) => i.id === id) || { id, label: id, desc: "", icon: Sparkles };

// ─── COMMUNITY REACTIONS — icon-keyed, rendered as lucide icons ───
export const REACTIONS = [
  { id: "sprout", label: "support", icon: Sprout },
  { id: "sparkles", label: "love", icon: Sparkles },
  { id: "hug", label: "hugs", icon: HeartHandshake },
  { id: "rain", label: "empathy", icon: CloudRain },
  { id: "sun", label: "hope", icon: Sun },
];

// Old preview sessions stored reaction emojis; map them to icon ids so
// stale local data still renders.
const LEGACY_REACTION_EMOJI = {
  "🌿": "sprout",
  "✨": "sparkles",
  "🫂": "hug",
  "🌧️": "rain",
  "☀️": "sun",
};

export const reactionById = (id) =>
  REACTIONS.find((r) => r.id === (LEGACY_REACTION_EMOJI[id] || id)) || REACTIONS[0];

// ─── FORTUNE DECK — 12 cards, drawn fresh per user per day ───
// motif keys are rendered by components/Motif.jsx
export const FORTUNES = [
  {
    id: "star",
    title: "The Star",
    motif: "star",
    text: "You are not behind. You are exactly where the sky needs you to be.",
    bg: ["#1A1430", "#2C2350"],
    accent: "#F4DEAE",
  },
  {
    id: "moon",
    title: "The Moon",
    motif: "moon",
    text: "Rest is not a reward you earn. It is how you arrive.",
    bg: ["#171F38", "#283353"],
    accent: "#D9E2F2",
  },
  {
    id: "sun",
    title: "The Sun",
    motif: "sun",
    text: "You don't have to be everything today. Warmth is enough.",
    bg: ["#3A2410", "#5C3A1E"],
    accent: "#F7D98B",
  },
  {
    id: "compass",
    title: "The Compass",
    motif: "compass",
    text: "Small steps, often repeated, quietly become a direction.",
    bg: ["#14283A", "#24435E"],
    accent: "#BFDCF2",
  },
  {
    id: "river",
    title: "The River",
    motif: "wave",
    text: "Let today flow. You don't have to carry it all at once.",
    bg: ["#0F2E33", "#1D4A52"],
    accent: "#BFE8E2",
  },
  {
    id: "lantern",
    title: "The Lantern",
    motif: "lantern",
    text: "One small light is enough to find your way.",
    bg: ["#2E2416", "#4E3B1E"],
    accent: "#F2C879",
  },
  {
    id: "seed",
    title: "The Seed",
    motif: "sprout",
    text: "What you planted quietly is already growing.",
    bg: ["#1A2E1D", "#2C4A32"],
    accent: "#C4E8B0",
  },
  {
    id: "harbor",
    title: "The Harbor",
    motif: "anchor",
    text: "It's all right to come in from the storm. You're safe here.",
    bg: ["#17222E", "#2A3B4C"],
    accent: "#CDE0F0",
  },
  {
    id: "ember",
    title: "The Ember",
    motif: "flame",
    text: "Your spark is still there. Breathe on it gently.",
    bg: ["#33150F", "#57241A"],
    accent: "#F2A484",
  },
  {
    id: "oak",
    title: "The Oak",
    motif: "tree",
    text: "You are more rooted than you feel.",
    bg: ["#1E2A16", "#344724"],
    accent: "#D6E8A8",
  },
  {
    id: "tide",
    title: "The Tide",
    motif: "tide",
    text: "Feelings come and go. You remain.",
    bg: ["#122636", "#1F4154"],
    accent: "#A8D4E8",
  },
  {
    id: "dawn",
    title: "The Dawn",
    motif: "dawn",
    text: "A new hour is already beginning — step into it softly.",
    bg: ["#33182A", "#55304A"],
    accent: "#F2C4D8",
  },
];

// Each user draws their OWN card per day — seeded by anonymous uid,
// stable across reloads without storage, never "pre-made" globally.
export const fortuneForToday = (seed = "", date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  let h = 0;
  const s = `${seed}${todayKey(date)}${day}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return FORTUNES[h % FORTUNES.length];
};

export const todayKey = (date = new Date()) => {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

// ─── STREAKS ─────────────────────────────────────────────────
export const dayKey = (date = new Date()) => {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

// Current streak in days, counting back from today (a miss yesterday
// but a hit today still keeps a streak of 1).
export function currentStreak(checkedDates = [], date = new Date()) {
  const set = new Set(checkedDates.map((d) => dayKey(new Date(d))));
  let streak = 0;
  let cursor = date;
  if (!set.has(dayKey(cursor))) cursor = addDays(cursor, -1); // grace: yesterday
  while (set.has(dayKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// Last 7 days as [{ key, done }], oldest first — for the week dots.
export function lastSevenDays(checkedDates = [], date = new Date()) {
  const set = new Set(checkedDates.map((d) => dayKey(new Date(d))));
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(date, -i);
    const key = dayKey(d);
    out.push({ key, label: d.toLocaleDateString("en-US", { weekday: "narrow" }), done: set.has(key) });
  }
  return out;
}

// ─── MISC ────────────────────────────────────────────────────
export const greeting = (date = new Date()) => {
  const h = date.getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export const longDate = (date = new Date()) =>
  date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

// Anonymous display-name generators — soft, nature-flavoured, never
// derived from personal data.
const ADJ = ["Quiet", "Gentle", "Soft", "Slow", "Misty", "Golden", "Mossy", "Hazy", "Kind", "Lucky", "Warm", "Shy"];
const NOUN = ["Maple", "Moth", "Willow", "Raven", "Fox", "Pine", "Dune", "Harbor", "Meadow", "Otter", "Comet", "Fern"];
export function anonName() {
  const a = ADJ[Math.floor(Math.random() * ADJ.length)];
  const n = NOUN[Math.floor(Math.random() * NOUN.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${a}${n}${num}`;
}

// Recovery codes — unambiguous, human-friendly.
export function generateRecoveryCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = (n) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `WELL-${seg(4)}-${seg(4)}`;
}
