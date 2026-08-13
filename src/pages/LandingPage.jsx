import {
  Sparkles,
  Heart,
  Users,
  Shield,
  ArrowRight,
  Moon,
  Star,
  Flame,
  KeyRound,
  Sun,
  Leaf,
  Compass,
} from "lucide-react";
import { C, serif, script, sans, SHADOW, grain } from "../constants";
import VennLogo from "../components/VennLogo";
import yogaPhoto from "../assets/yoga.png";
import bgImage from "../assets/background.png";
import { Button, Stars, Aura, Motif } from "../components/ui";

// Real photography with graceful fallback to a local asset.
const PHOTOS = {
  hero: yogaPhoto,
  forest:
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1400&q=80",
  meditation:
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=80",
  night:
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1800&q=80",
};

function Photo({ src, alt, style, fallback = bgImage }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
    />
  );
}

const FEATURES = [
  {
    icon: Sparkles,
    title: "Daily fortune cards",
    desc: "A tarot-style card each morning — celestial art and a quiet affirmation drawn just for you.",
    color: C.gold,
    soft: C.goldSoft,
  },
  {
    icon: Heart,
    title: "Mood check-ins",
    desc: "A one-tap emotion picker and a gentle history graph that shows patterns, not judgments.",
    color: C.sage,
    soft: C.sageSoft,
  },
  {
    icon: Flame,
    title: "Habit streaks",
    desc: "Build daily rituals with streaks that encourage — never punish. Miss a day? You're still here.",
    color: C.clay,
    soft: C.claySoft,
  },
  {
    icon: Users,
    title: "Anonymous community",
    desc: "Share and reply without a name. Reactions and replies, no followers, no likes to chase.",
    color: C.sky,
    soft: C.skySoft,
  },
  {
    icon: Compass,
    title: "Accountability partners",
    desc: "Pair up anonymously with shared goals and a private chat — two people, gently keeping pace.",
    color: C.lavender,
    soft: C.lavenderSoft,
  },
  {
    icon: Shield,
    title: "Private by design",
    desc: "No name, no email, no photo. A recovery code is the only key back into your space.",
    color: C.rose,
    soft: C.roseSoft,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Choose what to tend",
    desc: "Pick the habits you want to grow and a daily intention. That's the seed of your dashboard.",
  },
  {
    n: "02",
    title: "Check in gently",
    desc: "Each day: log a mood, check off habits, draw your fortune card. Two quiet minutes.",
  },
  {
    n: "03",
    title: "Grow, quietly",
    desc: "Watch streaks build, share with strangers who get it, or keep it entirely to yourself.",
  },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div
      style={{
        background: `${grain}, var(--page-bg)`,
        backgroundSize: "200px, auto",
        backgroundAttachment: "fixed",
        color: C.ink,
        fontFamily: sans,
        overflowX: "hidden",
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          width: "min(1120px, calc(100% - 28px))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "10px 12px 10px 18px",
          borderRadius: 999,
          background: "var(--glass)",
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          border: "1px solid var(--card-line)",
          boxShadow: SHADOW.soft,
        }}
      >
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <VennLogo size={32} />
          <span style={{ fontFamily: script, fontSize: 21, color: C.ink }}>WellSpace</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 13.5, color: C.muted, fontWeight: 500 }}>
          {[
            ["#features", "Features"],
            ["#how", "How it works"],
            ["#community", "Community"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                color: "inherit",
                transition: "color 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.clay)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              {label}
            </a>
          ))}
        </div>
        <Button onClick={onGetStarted} size="sm">
          Start your space
        </Button>
      </nav>

      {/* ── HERO ── */}
      <header
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          padding: "140px 24px 80px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            // Soft color washes only — the room (sage + grain) shows through.
            background: `radial-gradient(90% 70% at 85% 10%, ${C.claySoft}55 0%, transparent 55%), radial-gradient(80% 60% at 8% 85%, ${C.skySoft}99 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />
        {/* thin pink curved line — the reference loop */}
        <svg
          className="ws-squiggle"
          style={{ top: 90, right: "2%", width: "min(520px, 40vw)", height: 130 }}
          viewBox="0 0 520 130"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 96 C 120 30, 220 150, 340 70 S 470 24, 514 66" />
        </svg>
        <svg
          className="ws-squiggle"
          style={{ top: 60, left: "-1%", width: "min(300px, 24vw)", height: 90, transform: "scaleX(-1)" }}
          viewBox="0 0 520 130"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 96 C 120 30, 220 150, 340 70 S 470 24, 514 66" />
        </svg>
        <Aura tone="gold" size={560} top="-160px" right="-140px" />
        <Aura tone="sage" size={480} top="34%" left="-200px" />
        <Aura tone="lavender" size={420} bottom="-100px" right="18%" />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1120,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.02fr 0.98fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(255,253,248,0.75)",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: SHADOW.soft,
                color: C.clay,
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: "0.05em",
                marginBottom: 26,
              }}
            >
              <Moon size={13} strokeWidth={1.8} /> Anonymous &amp; safe — by design
            </span>
            <h1
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(44px, 5.8vw, 72px)",
                lineHeight: 1.04,
                color: C.ink,
                marginBottom: 22,
              }}
            >
              Mind, body
              <br />
              &amp;{" "}
              <span style={{ fontStyle: "italic", color: C.clay }}>spirit</span>
              <br />
              — one quiet space
            </h1>
            <p
              style={{
                fontSize: 16.5,
                lineHeight: 1.75,
                color: C.muted,
                maxWidth: 460,
                marginBottom: 30,
              }}
            >
              Track habits, log moods, draw a daily fortune card, and find peer
              support — without a public identity. Your mind deserves a sanctuary.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 34 }}>
              <Button onClick={onGetStarted} size="lg">
                Begin, anonymously <ArrowRight size={16} strokeWidth={2} />
              </Button>
              <a href="#how" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="lg">
                  See how it works
                </Button>
              </a>
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                ["01", "name shown, ever"],
                ["01", "recovery code to return"],
                ["24/7", "your space, your pace"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p style={{ fontFamily: serif, fontSize: 24, color: C.gold }}>{val}</p>
                  <p style={{ fontSize: 11.5, color: C.muted, marginTop: 2, maxWidth: 110 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero media — real photo, floating glass cards, aura light */}
          <div style={{ position: "relative" }}>
            <div
              className="ws-photo-grain"
              style={{
                borderRadius: 36,
                overflow: "hidden",
                height: "min(540px, 66vh)",
                border: "5px solid rgba(255,253,248,0.85)",
                boxShadow: SHADOW.lift,
                position: "relative",
              }}
            >
              <Photo src={PHOTOS.hero} alt="A student sitting calmly on the beach at sunset" />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(23,17,43,0.28), transparent 42%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* floating fortune preview */}
            <div
              className="ws-float"
              style={{
                position: "absolute",
                bottom: -24,
                left: -24,
                background: "rgba(255,253,248,0.82)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.85)",
                borderRadius: 20,
                boxShadow: SHADOW.lift,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                maxWidth: 250,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: `linear-gradient(150deg, ${C.night}, ${C.night2})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.star,
                  flexShrink: 0,
                }}
              >
                <Star size={17} strokeWidth={1.6} />
              </div>
              <div>
                <p style={{ fontSize: 10.5, color: C.muted, letterSpacing: "0.04em" }}>Today's fortune</p>
                <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 13.5, color: C.ink, marginTop: 1 }}>
                  The Star — “You are not behind…”
                </p>
              </div>
            </div>

            {/* floating meditate illustration — the reference figure */}
            <div
              className="ws-float"
              style={{
                position: "absolute",
                top: -20,
                left: "42%",
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--glass)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid var(--card-line)",
                boxShadow: SHADOW.soft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animationDelay: "0.8s",
              }}
            >
              <Motif motif="meditate" color={C.clay} size={34} />
            </div>

            {/* floating mood pill */}
            <div
              className="ws-float"
              style={{
                position: "absolute",
                top: -16,
                right: -12,
                background: "rgba(255,253,248,0.82)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.85)",
                borderRadius: 999,
                boxShadow: SHADOW.soft,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                animationDelay: "1.4s",
              }}
            >
              <Heart size={13} color={C.clay} strokeWidth={1.8} />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Mood: calm</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "110px 24px", position: "relative" }}>
        <Aura tone="rose" size={460} top="-60px" left="-160px" />
        <Aura tone="sky" size={420} bottom="-80px" right="-140px" />
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 60px" }}>
            <p className="ws-eyebrow" style={{ marginBottom: 14 }}>Features</p>
            <h2
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 46px)",
                lineHeight: 1.14,
                color: C.ink,
              }}
            >
              Everything you need to feel grounded
            </h2>
            <p style={{ fontSize: 15.5, color: C.muted, marginTop: 16, lineHeight: 1.7 }}>
              Six gentle tools, one safe place. Built for students, kept anonymous.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="ws-card"
                  style={{
                    padding: 28,
                    transition: "transform 0.24s ease, box-shadow 0.24s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = SHADOW.lift;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: f.soft,
                      color: f.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                      position: "relative",
                    }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 20, color: C.ink, marginBottom: 8 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how"
        style={{
          padding: "110px 24px",
          // A translucent neutral wash — grain still reads through it.
          background: `linear-gradient(180deg, rgba(239,241,231,0.7) 0%, rgba(239,241,231,0.95) 100%)`,
          position: "relative",
        }}
      >
        <Aura tone="gold" size={520} top="-80px" right="-160px" />
        <Aura tone="lavender" size={440} bottom="-60px" left="-140px" />
        <div style={{ maxWidth: 980, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
            <p className="ws-eyebrow" style={{ marginBottom: 14 }}>How it works</p>
            <h2
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 46px)",
                color: C.ink,
              }}
            >
              Three gentle steps
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ textAlign: "center", position: "relative" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: "0 auto 18px",
                    borderRadius: "50%",
                    background: "rgba(255,253,248,0.85)",
                    border: "1px solid rgba(255,255,255,0.85)",
                    boxShadow: SHADOW.soft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: serif,
                    fontSize: 22,
                    color: C.clay,
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 20, color: C.ink, marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>{s.desc}</p>
                {i < 2 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 24,
                      right: -26,
                      color: "rgba(201,151,63,0.55)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 28, alignItems: "stretch" }}>
            <div
              className="ws-photo-grain"
              style={{
                borderRadius: 28,
                overflow: "hidden",
                border: "3px solid rgba(255,253,248,0.9)",
                boxShadow: SHADOW.soft,
                minHeight: 260,
                position: "relative",
              }}
            >
              <Photo
                src={PHOTOS.forest}
                alt="A person resting outdoors with a book in a sunlit field"
                style={{ position: "absolute", inset: 0 }}
              />
            </div>
            <div className="ws-card ws-card--night" style={{ padding: 30, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <Stars count={22} seed={3} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <KeyRound size={18} color={C.star} strokeWidth={1.8} />
                  <p style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,222,174,0.7)" }}>
                    Anonymous by default
                  </p>
                </div>
                <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 24, lineHeight: 1.25, marginBottom: 12 }}>
                  No name. No email. No followers.
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(244,222,174,0.75)" }}>
                  Google sign-in is only a recovery key — it's mapped to a
                  throwaway anonymous ID and never displayed. Choose the recovery
                  code instead and leave no trace at all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section id="community" style={{ padding: "110px 24px", position: "relative" }}>
        <Aura tone="sage" size={480} top="10%" right="-160px" />
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 44,
              alignItems: "center",
              marginBottom: 56,
            }}
          >
            <div
              className="ws-photo-grain"
              style={{
                borderRadius: 32,
                overflow: "hidden",
                height: 380,
                border: "3px solid rgba(255,253,248,0.9)",
                boxShadow: SHADOW.lift,
                position: "relative",
              }}
            >
              <Photo
                src={PHOTOS.meditation}
                alt="A group of students meditating calmly outdoors"
                style={{ position: "absolute", inset: 0 }}
              />
            </div>
            <div>
              <p className="ws-eyebrow" style={{ marginBottom: 14 }}>The common room</p>
              <h2
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: "clamp(28px, 3.4vw, 40px)",
                  lineHeight: 1.16,
                  color: C.ink,
                  marginBottom: 18,
                }}
              >
                A calm corner of the internet
              </h2>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
                WellSpace feels like a deep breath. No likes, no follower counts,
                no pressure to perform — just students who get it, showing up
                quietly for themselves and each other.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "No public identity — ever",
                  "Gentle reminders, never nagging",
                  "Your data stays yours, always",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: C.sageSoft,
                        color: C.sage,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Sun size={12} strokeWidth={2.4} />
                    </div>
                    <span style={{ fontSize: 14.5, color: C.ink }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* photo strip */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 18 }}>
            <div
              className="ws-photo-grain"
              style={{
                borderRadius: 24,
                overflow: "hidden",
                height: 220,
                border: "3px solid rgba(255,253,248,0.9)",
                boxShadow: SHADOW.soft,
                position: "relative",
              }}
            >
              <Photo
                src={PHOTOS.night}
                alt="A starry night sky over a calm landscape"
                style={{ position: "absolute", inset: 0 }}
              />
            </div>
            <div
              style={{
                borderRadius: 24,
                border: "1.5px dashed rgba(44,35,48,0.2)",
                height: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                color: C.faint,
                background: "rgba(255,253,248,0.5)",
              }}
            >
              <Leaf size={24} strokeWidth={1.6} />
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>Your moments</span>
              <span style={{ fontSize: 11 }}>community photos coming soon</span>
            </div>
            <div
              style={{
                borderRadius: 24,
                border: "1.5px dashed rgba(44,35,48,0.2)",
                height: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                color: C.faint,
                background: "rgba(255,253,248,0.5)",
              }}
            >
              <Users size={24} strokeWidth={1.6} />
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>Shared wins</span>
              <span style={{ fontSize: 11 }}>milestones feed coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "40px 24px 110px", position: "relative" }}>
        <Aura tone="rose" size={440} bottom="-60px" left="-140px" />
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            borderRadius: 40,
            padding: "84px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(150deg, ${C.night} 0%, ${C.night2} 60%, ${C.night3} 100%)`,
            boxShadow: SHADOW.night,
          }}
        >
          <Stars count={42} seed={11} />
          <Aura tone="night" size={480} top="-140px" right="-120px" />
          <Aura tone="gold" size={380} bottom="-120px" left="-80px" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <VennLogo size={54} color={C.star} starColor={C.gold} style={{ margin: "0 auto 22px" }} />
            <h2
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(30px, 4.4vw, 48px)",
                color: "#FFF6E3",
                marginBottom: 16,
              }}
            >
              Your sanctuary is waiting
            </h2>
            <p
              style={{
                fontSize: 15.5,
                color: "rgba(244,222,174,0.75)",
                maxWidth: 460,
                margin: "0 auto 34px",
                lineHeight: 1.7,
              }}
            >
              A quiet minute each day — to notice, to tend, to rest. No identity
              required, ever.
            </p>
            <Button onClick={onGetStarted} variant="gold" size="lg">
              Enter WellSpace <ArrowRight size={16} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(44,35,48,0.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <VennLogo size={28} />
            <span style={{ fontFamily: script, fontSize: 19, color: C.ink }}>WellSpace</span>
          </div>
          <p style={{ fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
            <Moon size={13} strokeWidth={1.8} /> A safe space for student wellbeing. Always anonymous.
          </p>
          <div style={{ display: "flex", gap: 18, fontSize: 12.5, color: C.faint }}>
            <a href="#" style={{ textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ textDecoration: "none" }}>Safety</a>
            <a href="#" style={{ textDecoration: "none" }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
