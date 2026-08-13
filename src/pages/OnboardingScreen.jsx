import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Sparkles, Moon } from "lucide-react";
import {
  C,
  serif,
  sans,
  grain,
  HABIT_LIBRARY,
  HABIT_CATEGORIES,
  INTENTIONS,
  MOODS,
  intentionById,
  moodById,
} from "../constants";
import VennLogo from "../components/VennLogo";
import { Button, Card, Aura } from "../components/ui";
import { toast } from "../lib/toast";
import * as db from "../lib/db";

const STEPS = ["Habits", "Intention", "Baseline", "Ready"];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [habits, setHabits] = useState([]);
  const [intention, setIntention] = useState(null);
  const [mood, setMood] = useState(null);

  const progress = (step / (STEPS.length - 1)) * 100;

  const toggleHabit = (id) =>
    setHabits((p) =>
      p.includes(id)
        ? p.filter((x) => x !== id)
        : p.length < 5
          ? [...p, id]
          : p,
    );

  const renderHabitCard = (h) => {
    const selected = habits.includes(h.id);
    return (
      <button
        key={h.id}
        onClick={() => toggleHabit(h.id)}
        style={{
          borderRadius: 20,
          padding: "18px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          border: `2px solid ${selected ? h.color : "rgba(44,35,48,0.1)"}`,
          background: selected ? h.soft : "rgba(255,253,248,0.7)",
          cursor: "pointer",
          transition: "all 0.18s ease",
          fontFamily: sans,
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!selected) e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
      >
        {selected && (
          <span
            className="ws-pop"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: h.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={11} color="#fff" strokeWidth={3} />
          </span>
        )}
        <span style={{ color: h.color }} aria-hidden="true">
          <h.icon size={24} strokeWidth={1.6} />
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: selected ? h.color : C.muted,
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          {h.label}
        </span>
      </button>
    );
  };

  const finish = () => {
    db.saveUser({
      onboarded: true,
      buildHabits: habits,
      intention,
      initialMood: mood,
      onboardedAt: new Date().toISOString(),
    });
    toast("Your space is ready", Moon);
    onComplete();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `${grain}, ${C.cream}`,
        backgroundSize: "200px, auto",
        fontFamily: sans,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Aura tone="gold" size={520} top="-140px" right="-120px" />
      <Aura tone="sage" size={440} top="42%" left="-160px" />
      <Aura tone="lavender" size={400} bottom="-120px" right="10%" />
      {/* progress */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "rgba(44,35,48,0.08)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.max(8, progress)}%`,
            background: `linear-gradient(90deg, ${C.clay}, ${C.gold})`,
            borderRadius: 2,
            transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "30px 24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <VennLogo size={30} />
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>
          {step + 1} of {STEPS.length} — {STEPS[step]}
        </span>
      </div>

      <div
        style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px 90px" }}
      >
        {/* ── STEP 0 · habits ── */}
        {step === 0 && (
          <div className="ws-rise" key="s0">
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p className="ws-eyebrow" style={{ marginBottom: 12 }}>
                Step 1 · Habits
              </p>
              <h1
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: "clamp(28px, 4.6vw, 42px)",
                  color: C.ink,
                  marginBottom: 10,
                }}
              >
                What would you like to tend?
              </h1>
              <p style={{ fontSize: 14.5, color: C.muted }}>
                Two ways to tend your days — habits to build, and habits to
                release. Pick up to 5.
              </p>
            </div>
            {["build", "break"].map((cat) => {
              const catMeta = HABIT_CATEGORIES[cat];
              const CatIcon = catMeta.icon;
              return (
                <div key={cat} style={{ marginBottom: 28 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 11,
                        background: catMeta.soft,
                        color: catMeta.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CatIcon size={16} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p
                        style={{ fontSize: 14, fontWeight: 600, color: C.ink }}
                      >
                        {catMeta.title}
                      </p>
                      <p style={{ fontSize: 11.5, color: C.faint }}>
                        {catMeta.tagline}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(130px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {HABIT_LIBRARY.filter((h) => h.category === cat).map(
                      renderHabitCard,
                    )}
                  </div>
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 18,
                marginTop: 24,
                borderTop: "1px solid rgba(44,35,48,0.08)",
              }}
            >
              <p style={{ fontSize: 13, color: C.muted }}>
                {habits.length} / 5 selected
              </p>
              <Button onClick={() => setStep(1)} disabled={habits.length === 0}>
                Continue <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 1 · intention ── */}
        {step === 1 && (
          <div className="ws-rise" key="s1">
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p className="ws-eyebrow" style={{ marginBottom: 12 }}>
                Step 2 · Intention
              </p>
              <h1
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: "clamp(28px, 4.6vw, 42px)",
                  color: C.ink,
                  marginBottom: 10,
                }}
              >
                Set a daily intention
              </h1>
              <p style={{ fontSize: 14.5, color: C.muted }}>
                A small north star to return to each morning. It will greet you
                on your dashboard.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {INTENTIONS.map((opt) => {
                const sel = intention === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setIntention(opt.id)}
                    style={{
                      borderRadius: 20,
                      padding: "20px 18px",
                      textAlign: "left",
                      cursor: "pointer",
                      border: `2px solid ${sel ? C.clay : "rgba(44,35,48,0.1)"}`,
                      background: sel ? C.claySoft : "rgba(255,253,248,0.7)",
                      transition: "all 0.18s",
                      fontFamily: sans,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <span
                      style={{ color: sel ? C.clay : C.muted }}
                      aria-hidden="true"
                    >
                      <opt.icon size={24} strokeWidth={1.6} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: serif,
                          fontSize: 16.5,
                          color: C.ink,
                          fontWeight: 400,
                        }}
                      >
                        {opt.label}
                      </p>
                      <p
                        style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}
                      >
                        {opt.desc}
                      </p>
                    </div>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${sel ? C.clay : "rgba(44,35,48,0.18)"}`,
                        background: sel ? C.clay : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.18s",
                      }}
                    >
                      {sel && <Check size={11} color="#fff" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 18,
                marginTop: 24,
                borderTop: "1px solid rgba(44,35,48,0.08)",
              }}
            >
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ArrowLeft size={16} /> Back
              </Button>
              <Button onClick={() => setStep(2)} disabled={!intention}>
                Continue <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2 · mood baseline ── */}
        {step === 2 && (
          <div className="ws-rise" key="s2">
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p className="ws-eyebrow" style={{ marginBottom: 12 }}>
                Step 3 · Baseline
              </p>
              <h1
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: "clamp(28px, 4.6vw, 42px)",
                  color: C.ink,
                  marginBottom: 10,
                }}
              >
                How have you been feeling lately?
              </h1>
              <p style={{ fontSize: 14.5, color: C.muted }}>
                No right answer. This seeds your mood summary so your chart has
                a starting point.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {MOODS.map((m) => {
                const sel = mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={sel}
                    className="ws-mood-option"
                    onClick={() => setMood(m.id)}
                    style={{
                      borderRadius: 20,
                      padding: "20px 10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 10,
                      border: `2px solid ${sel ? m.color : "rgba(44,35,48,0.1)"}`,
                      background: sel ? m.soft : "rgba(255,253,248,0.7)",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      fontFamily: sans,
                      outline: "none",
                      boxShadow: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!sel)
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <span style={{ color: m.color }} aria-hidden="true">
                      <m.icon size={26} strokeWidth={1.6} />
                    </span>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: sel ? m.color : C.muted,
                      }}
                    >
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 18,
                marginTop: 24,
                borderTop: "1px solid rgba(44,35,48,0.08)",
              }}
            >
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!mood}>
                Continue <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3 · ready ── */}
        {step === 3 && (
          <div
            className="ws-rise"
            key="s3"
            style={{ textAlign: "center", padding: "26px 0" }}
          >
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -18,
                  borderRadius: "50%",
                  background: `${C.goldSoft}cc`,
                  filter: "blur(22px)",
                }}
              />
              <VennLogo size={74} style={{ position: "relative" }} />
            </div>
            <h1
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(30px, 4.8vw, 46px)",
                color: C.ink,
                marginBottom: 14,
              }}
            >
              Your sanctuary is ready
            </h1>
            <p
              style={{
                fontSize: 14.5,
                color: C.muted,
                maxWidth: 460,
                margin: "0 auto 26px",
                lineHeight: 1.75,
              }}
            >
              You'll tend{" "}
              <strong style={{ color: C.clay, fontWeight: 600 }}>
                {habits.length} habits
              </strong>
              , hold an intention to{" "}
              <strong style={{ color: C.clay, fontWeight: 600 }}>
                {intentionById(intention).label.toLowerCase()}
              </strong>
              , and start from a{" "}
              <strong style={{ color: C.clay, fontWeight: 600 }}>
                {moodById(mood)?.label.toLowerCase() || "gentle"}
              </strong>{" "}
              place.
            </p>
            <Card
              style={{
                padding: "18px 22px",
                maxWidth: 460,
                margin: "0 auto 30px",
                textAlign: "left",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <Sparkles
                size={16}
                color={C.gold}
                strokeWidth={1.8}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
                Your first{" "}
                <strong style={{ color: C.gold, fontWeight: 600 }}>
                  fortune card
                </strong>{" "}
                is waiting. Drawn fresh for you each day at midnight — tap to
                reveal it.
              </p>
            </Card>
            <div
              style={{
                display: "flex",
                gap: 9,
                alignItems: "center",
                justifyContent: "center",
                background: C.sageSoft,
                color: C.sage,
                borderRadius: 999,
                padding: "9px 16px",
                fontSize: 12.5,
                fontWeight: 500,
                maxWidth: 420,
                margin: "0 auto 30px",
              }}
            >
              <Moon size={14} strokeWidth={1.8} />
              <span>
                Your answers shape your dashboard — nothing is linked to who you
                are.
              </span>
            </div>
            <Button onClick={finish} size="lg">
              Enter WellSpace <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
