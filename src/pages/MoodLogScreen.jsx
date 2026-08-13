import { useState } from "react";
import {
  Heart,
  TrendingUp,
  Calendar,
  Sparkles,
  Check,
  Moon,
  Sun,
  Waves,
  Sprout,
  BookOpen,
} from "lucide-react";
import {
  C,
  serif,
  sans,
  MOODS,
  moodById,
  todayKey,
  intentionById,
} from "../constants";
import { Button, Card, SectionHead, EmptyState } from "../components/ui";
import { toast } from "../lib/toast";
import * as db from "../lib/db";

export default function MoodLogScreen({ user, onNavigate }) {
  const moods = user?.moodLog || {};
  const [selected, setSelected] = useState(moods[todayKey()]?.mood || null);
  const [note, setNote] = useState(moods[todayKey()]?.note || "");
  const [saved, setSaved] = useState(false);

  const today = todayKey();
  const alreadyLogged = !!moods[today];

  // Last 7 days for the line chart (Monday through Sunday of current week).
  const entries = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // how many days back to Monday
    d.setDate(d.getDate() - daysToMonday + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      key,
      mood: moods[key]?.mood || null,
      note: moods[key]?.note || "",
    };
  });

  const hasHistory = entries.some((e) => e.mood);

  // Mood journal — every recorded check-in, newest first.
  const journal = Object.entries(moods)
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => (a.key < b.key ? 1 : -1));

  const save = () => {
    if (!selected) return;
    db.logMood(selected, note.trim());
    setSaved(true);
    toast(
      alreadyLogged
        ? "Check-in updated"
        : "Check-in saved — your chart grew by a day",
      Moon,
    );
    setTimeout(() => {
      setSaved(false);
      onNavigate("mood");
    }, 400);
  };

  // Simple insight derived ONLY from the user's own onboarding answers + history.
  const insight = (() => {
    if (user?.initialMood && !hasHistory) {
      const m = moodById(user.initialMood);
      return {
        icon: m?.icon || Sprout,
        text: `You started from a ${m?.label.toLowerCase()} place. Your baseline is now on the chart — future check-ins will trace your rhythm.`,
      };
    }
    if (hasHistory) {
      const vals = entries
        .filter((e) => e.mood)
        .map((e) => moodById(e.mood)?.value || 0);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const trend = avg >= 4 ? "rising" : avg >= 2.6 ? "steady" : "tender";
      return {
        icon: trend === "rising" ? Sun : trend === "steady" ? Waves : Sprout,
        text:
          trend === "rising"
            ? "Your recent check-ins lean light. Whatever you're doing, it's working — keep it gentle."
            : trend === "steady"
              ? "Your week has been even-keeled. That steadiness is a strength worth noticing."
              : `Your week has been heavy in places. ${user?.intention ? `Your intention — ${intentionById(user.intention).label.toLowerCase()} — is a good thing to hold close today.` : "Be extra kind to yourself today."}`,
      };
    }
    return null;
  })();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: "clamp(28px, 3.6vw, 38px)",
            color: C.ink,
          }}
        >
          Mood check-in
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
          A gentle daily pause to notice how you feel.
        </p>
      </div>

      {/* Check-in */}
      <Card tone="sky" style={{ padding: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 22,
          }}
        >
          <Calendar size={16} color={C.clay} strokeWidth={1.8} />
          <h2
            style={{
              fontFamily: serif,
              fontWeight: 400,
              fontSize: 20,
              color: C.ink,
            }}
          >
            How are you feeling today?
          </h2>
          {alreadyLogged && (
            <span
              className="ws-pill"
              style={{
                marginLeft: "auto",
                background: C.sageSoft,
                color: C.sage,
              }}
            >
              <Check size={11} strokeWidth={2.4} /> checked in
            </span>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {MOODS.map((m) => {
            const sel = selected === m.id;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={sel}
                className="ws-mood-option"
                onClick={() => setSelected(m.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "16px 4px",
                  borderRadius: 18,
                  outline: "none",
                  boxShadow: "none",
                  border: `2px solid ${sel ? m.color : "rgba(120,120,130,0.16)"}`,
                  background: sel ? m.soft : "var(--glass)",
                  cursor: "pointer",
                  fontFamily: sans,
                  transition: "all 0.18s ease, transform 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  if (!sel) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.borderColor = m.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!sel) {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.borderColor =
                      "rgba(19, 19, 199, 0.16)";
                  }
                }}
              >
                <span style={{ color: m.color }} aria-hidden="true">
                  <m.icon size={22} strokeWidth={1.6} />
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: sel ? 600 : 500,
                    color: sel ? m.color : C.muted,
                  }}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              fontSize: 13,
              color: C.muted,
              display: "block",
              marginBottom: 8,
            }}
          >
            Want to say more? (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Today I felt…"
            rows={3}
            className="ws-textarea"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={save}
            disabled={!selected}
            variant={saved ? "soft" : "primary"}
          >
            <Heart size={15} strokeWidth={1.8} />{" "}
            {saved
              ? "Saved!"
              : alreadyLogged
                ? "Update check-in"
                : "Save check-in"}
          </Button>
        </div>
      </Card>

      {/* History graph */}
      <Card tone="sage" style={{ padding: 28 }}>
        <SectionHead
          title="Your mood over time"
          sub={
            hasHistory
              ? "last 7 days"
              : "your chart starts empty — log a few days to see your rhythm"
          }
        />
        {!hasHistory ? (
          <EmptyState
            icon={<TrendingUp size={24} strokeWidth={1.6} />}
            title="No history yet"
            desc={
              user?.initialMood
                ? "Your onboarding baseline is already on the chart. Add check-ins above and the line will grow."
                : "Your mood history will gather here, day by day."
            }
          />
        ) : (
          <div>
            <div style={{ position: "relative", height: 190 }}>
              <svg
                viewBox="0 0 700 190"
                style={{ width: "100%", height: "100%" }}
                preserveAspectRatio="none"
              >
                {[0, 47.5, 95, 142.5, 190].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="700"
                    y2={y}
                    stroke="rgba(44,35,48,0.07)"
                    strokeWidth="1"
                    strokeDasharray="4 5"
                  />
                ))}
                {/* area under the line */}
                {(() => {
                  const pts = entries.map((e, i) => {
                    const x = (i / 6) * 680 + 10;
                    const v = moodById(e.mood)?.value || 0;
                    return { x, y: v ? 165 - (v / 5) * 140 : null };
                  });
                  const valid = pts.filter((p) => p.y !== null);
                  if (valid.length < 2) return null;
                  const poly = `M${valid[0].x},190 L${valid.map((p) => `${p.x},${p.y}`).join(" L")} L${valid[valid.length - 1].x},190 Z`;
                  return (
                    <polygon
                      points={poly}
                      fill="url(#moodGrad)"
                      opacity="0.5"
                    />
                  );
                })()}
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.clay} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={C.clay} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {(() => {
                  const pts = entries.map((e, i) => {
                    const x = (i / 6) * 680 + 10;
                    const v = moodById(e.mood)?.value || 0;
                    return { x, y: v ? 165 - (v / 5) * 140 : null };
                  });
                  const valid = pts.filter((p) => p.y !== null);
                  if (valid.length < 2) return null;
                  return (
                    <polyline
                      points={valid.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill="none"
                      stroke={C.clay}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })()}
                {entries.map((e, i) => {
                  const meta = moodById(e.mood);
                  const x = (i / 6) * 680 + 10;
                  const y = meta ? 165 - (meta.value / 5) * 140 : 165;
                  return (
                    <g key={e.key}>
                      {meta ? (
                        <>
                          <circle
                            cx={x}
                            cy={y}
                            r="7"
                            fill="#FFFFFF"
                            stroke={meta.color}
                            strokeWidth="2.4"
                          />
                          <circle cx={x} cy={y} r="2.6" fill={meta.color} />
                        </>
                      ) : (
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="rgba(44,35,48,0.08)"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 6px",
                marginTop: 6,
              }}
            >
              {entries.map((e) => (
                <span key={e.key} style={{ fontSize: 10, color: C.faint }}>
                  {new Date(e.key + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "narrow",
                  })}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                paddingTop: 16,
                marginTop: 14,
                borderTop: "1px solid rgba(44,35,48,0.07)",
              }}
            >
              {MOODS.map((m) => (
                <span
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 10.5,
                    color: C.muted,
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: m.color,
                    }}
                  />
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Mood journal — every check-in, kept */}
      <Card tone="lavender" style={{ padding: 28 }}>
        <SectionHead title="Mood journal" sub="every check-in, kept here" />
        {journal.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={24} strokeWidth={1.6} />}
            title="Your journal is empty"
            desc="Check-ins you save will be recorded here, one page per day."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {journal.map((e) => {
              const meta = moodById(e.mood);
              if (!meta) return null;
              return (
                <div
                  key={e.key}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 16,
                    background: "var(--glass)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      background: meta.soft,
                      color: meta.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <meta.icon size={17} strokeWidth={1.8} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
                      {new Date(e.key + "T12:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                      <span
                        style={{
                          marginLeft: 8,
                          color: meta.color,
                          fontWeight: 600,
                        }}
                      >
                        {meta.label}
                      </span>
                    </p>
                    {e.note && (
                      <p
                        style={{
                          fontSize: 12.5,
                          color: C.muted,
                          marginTop: 3,
                          lineHeight: 1.55,
                        }}
                      >
                        “{e.note}”
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Insight — derived from onboarding answers + history */}
      {insight && (
        <Card
          tone="pink"
          style={{
            padding: 22,
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: "var(--glass)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <insight.icon
              size={20}
              strokeWidth={1.6}
              style={{ color: C.clay }}
              aria-hidden="true"
            />
          </div>
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.clay,
                fontWeight: 700,
                marginBottom: 5,
              }}
            >
              <Sparkles
                size={11}
                strokeWidth={1.8}
                style={{ display: "inline", marginRight: 5 }}
              />
              A gentle note
            </p>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
              {insight.text}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
