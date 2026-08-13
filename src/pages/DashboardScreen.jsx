import {
  Heart,
  ArrowRight,
  Sparkles,
  Users,
  Flame,
  Compass,
  TrendingUp,
} from "lucide-react";
import {
  C,
  serif,
  sans,
  greeting,
  longDate,
  todayKey,
  fortuneForToday,
  currentStreak,
  habitMeta,
  intentionById,
  moodById,
  reactionById,
} from "../constants";
import {
  Button,
  Card,
  SectionHead,
  EmptyState,
  Motif,
  Stars,
  Avatar,
} from "../components/ui";

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function DashboardScreen({ user, onNavigate }) {
  const habits = [...(user?.buildHabits || []), ...(user?.extraHabits || [])];
  const checks = user?.habitChecks || {};
  const moods = user?.moodLog || {};
  const myPosts = user?.posts || [];
  const today = todayKey();
  const doneToday = habits.filter((h) =>
    (checks[h] || []).includes(today),
  ).length;

  const fortune = fortuneForToday(user?.uid || "");

  // 7-day chart: show Monday through Sunday of current week
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // how many days back to Monday
    d.setDate(d.getDate() - daysToMonday + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return (
      moods[key]?.mood ||
      (d.toDateString() === new Date().toDateString() && !moods[key]
        ? user?.initialMood
        : null)
    );
  });

  // ── Signals — real data only, no invented scores ──
  const moodVals = last7.filter(Boolean).map((id) => moodById(id)?.value || 0);
  const moodAvg = moodVals.length
    ? moodVals.reduce((a, b) => a + b, 0) / moodVals.length
    : 0;
  const hasData = moodVals.length > 0 || habits.length > 0;
  const latestMood = moods[today]?.mood || user?.initialMood;

  // ── Streaks — best current streak, straight from real check-in data ──
  const streaks = habits.map((h) => ({
    id: h,
    streak: currentStreak(checks[h] || []),
  }));
  const best = streaks.reduce((a, b) => (b.streak > a.streak ? b : a), {
    id: null,
    streak: 0,
  });
  const hasAnyChecks = habits.some((h) => (checks[h] || []).length > 0);

  // ── Assistant line — a real insight from the user's own data ──
  let assistantTitle = "Your space is listening";
  let assistantLine =
    "Log your first mood and check off a habit — your space grows from real, gentle data.";
  let assistantCta = "Log my first mood";
  if (hasData) {
    if (moodVals.length && moodAvg < 3) {
      assistantTitle = "A tender week";
      assistantLine =
        "Your mood has been low lately. That's worth naming — your space is here for exactly this.";
      assistantCta = "Talk it out";
    } else if (best.streak >= 3) {
      assistantTitle = "You're in a rhythm";
      assistantLine = `${best.streak}-day streak on ${habitMeta(best.id).label.toLowerCase()} — keep the pace, gently.`;
      assistantCta = "Keep it going";
    } else {
      assistantTitle = "A gentle nudge";
      assistantLine = `Moods and habits each shape your week — ${doneToday} habit${doneToday === 1 ? "" : "s"} done today. One small check-in is enough.`;
      assistantCta = "Check in";
    }
  }

  const feed = myPosts.slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <p style={{ fontSize: 13, color: C.muted }}>{longDate()}</p>
          <h1
            style={{
              fontFamily: serif,
              fontWeight: 400,
              fontSize: "clamp(30px, 4vw, 40px)",
              color: C.ink,
              marginTop: 3,
              lineHeight: 1.1,
            }}
          >
            {greeting()},{" "}
            <span style={{ fontStyle: "italic", color: C.clay }}>
              {user?.anonName || "Wanderer"}
            </span>
          </h1>
          {user?.intention && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 8,
              }}
            >
              <span
                className="ws-pill"
                style={{
                  background: C.goldSoft,
                  color: "#7a5a1e",
                  borderColor: "rgba(201,151,63,0.35)",
                }}
              >
                {(() => {
                  const it = intentionById(user.intention);
                  return (
                    <>
                      <it.icon
                        size={12}
                        strokeWidth={1.8}
                        style={{ verticalAlign: -1 }}
                      />
                      Intention: {it.label.toLowerCase()}
                    </>
                  );
                })()}
              </span>
            </div>
          )}
        </div>
        <Button variant="ghost" onClick={() => onNavigate("mood")}>
          <Heart size={15} strokeWidth={1.8} color={C.clay} /> How are you
          feeling?
        </Button>
      </div>

      {/* Brand-new welcome */}
      {habits.length === 0 && !moods[today] && !user?.initialMood && (
        <Card tone="pink" style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -20,
              opacity: 0.85,
            }}
          >
            <Motif motif="meditate" color={C.clay} size={150} />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <EmptyState
              icon={<Sparkles size={26} strokeWidth={1.6} />}
              title="Your space is ready"
              desc="Log how you feel today or check off a habit — this is your place to grow, gently."
            >
              <Button onClick={() => onNavigate("mood")}>
                <Heart size={15} strokeWidth={1.8} /> Log mood
              </Button>
              <Button variant="ghost" onClick={() => onNavigate("habits")}>
                View habits <ArrowRight size={15} strokeWidth={1.8} />
              </Button>
            </EmptyState>
          </div>
        </Card>
      )}

      {/* Top row: mood + fortune */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        {/* Mood summary */}
        <Card
          tone="sage"
          style={{ padding: 24, display: "flex", flexDirection: "column" }}
        >
          <SectionHead
            title="Mood this week"
            sub={
              latestMood
                ? `Feeling ${moodById(latestMood).label.toLowerCase()}`
                : "Log your first check-in to start your chart"
            }
            action={
              <button onClick={() => onNavigate("mood")} style={linkBtn}>
                View all <ArrowRight size={12} strokeWidth={1.8} />
              </button>
            }
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              paddingTop: 8,
            }}
          >
            {last7.map((moodId, i) => {
              const meta = moodById(moodId);
              const h = meta ? Math.max(12, (meta.value / 5) * 100) : 6;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 7,
                    height: 130,
                    justifyContent: "flex-end",
                  }}
                >
                  <span aria-hidden="true">
                    {meta ? (
                      <meta.icon
                        size={13}
                        strokeWidth={1.8}
                        style={{ color: meta.color }}
                      />
                    ) : (
                      ""
                    )}
                  </span>
                  <div
                    className="ws-pop"
                    style={{
                      width: "100%",
                      maxWidth: 30,
                      height: h,
                      borderRadius: "10px 10px 5px 5px",
                      background: meta
                        ? `linear-gradient(180deg, ${meta.color}, ${meta.color}cc)`
                        : "repeating-linear-gradient(45deg, transparent 0 5px, rgba(27,27,31,0.08) 5px 7px)",
                      opacity: meta ? 1 : 0.7,
                    }}
                  />
                  <span style={{ fontSize: 10, color: C.faint }}>
                    {WEEK_LABELS[i]}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingTop: 14,
              marginTop: 10,
              borderTop: "1px solid rgba(27,27,31,0.07)",
            }}
          >
            <TrendingUp size={14} color={C.sage} strokeWidth={1.8} />
            <span style={{ fontSize: 12.5, color: C.muted }}>
              {moods[today]?.mood ? (
                <>
                  Today:{" "}
                  <strong style={{ color: C.ink, fontWeight: 600 }}>
                    {moodById(moods[today].mood)?.label || "—"}
                  </strong>{" "}
                  {moods[today].note && <>— “{moods[today].note}”</>}
                </>
              ) : latestMood ? (
                <>
                  Baseline from your onboarding:{" "}
                  <strong style={{ color: C.ink, fontWeight: 600 }}>
                    {moodById(latestMood).label}
                  </strong>
                </>
              ) : (
                "No moods yet — start today"
              )}
            </span>
          </div>
        </Card>

        {/* Fortune preview */}
        <Card
          tone="night"
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => onNavigate("fortune")}
        >
          <Stars count={18} seed={9} />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <SectionHead
              title={<span style={{ color: C.star }}>Today's fortune</span>}
              sub={
                <span style={{ color: "rgba(244,222,174,0.55)" }}>
                  drawn for you at dawn
                </span>
              }
              action={<Sparkles size={16} color={C.gold} strokeWidth={1.8} />}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 0",
              }}
            >
              <div className="ws-float">
                <Motif motif={fortune.motif} color={C.star} size={86} />
              </div>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 15,
                color: C.star,
                textAlign: "center",
                lineHeight: 1.5,
                marginBottom: 14,
              }}
            >
              “{fortune.text}”
            </p>
            <Button
              variant="gold"
              block
              onClick={(e) => {
                e.stopPropagation();
                onNavigate("fortune");
              }}
            >
              Reveal your card <ArrowRight size={14} strokeWidth={2} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Assistant — identical structure to its sibling cards */}
      <Card tone="sage" style={{ padding: 24 }}>
        <SectionHead
          title="WellSpace assistant"
          sub={assistantTitle}
          action={
            <Button size="sm" onClick={() => onNavigate("mood")}>
              {assistantCta} <ArrowRight size={13} strokeWidth={2} />
            </Button>
          }
        />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              background: C.claySoft,
              color: C.clay,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} strokeWidth={1.8} />
          </div>
          <p
            style={{
              fontSize: 13.5,
              color: C.muted,
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            {assistantLine}
          </p>
        </div>
      </Card>

      {/* Habits */}
      <Card tone="butter" style={{ padding: 24 }}>
        <SectionHead
          title="Today's habits"
          sub={`${doneToday} of ${habits.length} done`}
          action={
            <button onClick={() => onNavigate("habits")} style={linkBtn}>
              View all <ArrowRight size={12} strokeWidth={1.8} />
            </button>
          }
        />
        {habits.length === 0 ? (
          <EmptyState
            icon={<Flame size={24} strokeWidth={1.6} />}
            title="No habits yet"
            desc="Choose what to tend from your onboarding, or add a new one anytime."
          >
            <Button variant="soft" onClick={() => onNavigate("habits")}>
              <Flame size={15} strokeWidth={1.8} /> Add a habit
            </Button>
          </EmptyState>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {/* Streak summary — always visible on the home */}
            <div
              style={{
                minWidth: 160,
                flexShrink: 0,
                textAlign: "center",
                padding: "8px 4px",
              }}
            >
              {best.streak > 0 ? (
                <>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 24,
                      background: C.claySoft,
                      color: C.clay,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px",
                    }}
                  >
                    <Flame size={30} strokeWidth={1.8} />
                  </div>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: 30,
                      color: C.ink,
                      lineHeight: 1,
                    }}
                  >
                    {best.streak}
                    <span style={{ fontSize: 17, color: C.muted }}>d</span>
                  </p>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
                    best streak — {habitMeta(best.id).label.toLowerCase()}
                  </p>
                </>
              ) : hasAnyChecks ? (
                <>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 24,
                      background: C.sand,
                      color: C.faint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px",
                    }}
                  >
                    <Flame size={30} strokeWidth={1.6} />
                  </div>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: 17,
                      color: C.ink,
                      lineHeight: 1.2,
                    }}
                  >
                    No active streak
                  </p>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
                    check in today to start one
                  </p>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 24,
                      background: C.sand,
                      color: C.faint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px",
                    }}
                  >
                    <Flame size={30} strokeWidth={1.6} />
                  </div>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: 17,
                      color: C.ink,
                      lineHeight: 1.2,
                    }}
                  >
                    Your first streak
                  </p>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
                    starts when you check in today
                  </p>
                </>
              )}
            </div>
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 6,
              }}
            >
              {habits.slice(0, 6).map((h) => {
                const meta = habitMeta(h);
                const done = (checks[h] || []).includes(today);
                const streak = currentStreak(checks[h] || []);
                return (
                  <div
                    key={h}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "7px 6px",
                      borderRadius: 12,
                      transition: "background 0.16s",
                    }}
                  >
                    <span
                      style={{ color: meta.color, opacity: done ? 0.5 : 1 }}
                      aria-hidden="true"
                    >
                      <meta.icon size={20} strokeWidth={1.6} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 12.5,
                          fontWeight: 500,
                          color: done ? C.faint : C.ink,
                          textDecoration: done ? "line-through" : "none",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {meta.label}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {streak > 0 ? (
                          <>
                            <Flame size={11} color={C.clay} strokeWidth={2} />
                            <span style={{ color: C.clay }}>
                              {streak}d streak
                            </span>
                          </>
                        ) : done ? (
                          <span style={{ color: C.sage }}>checked today</span>
                        ) : (
                          <span style={{ color: C.faint, fontWeight: 500 }}>
                            not yet today
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Bottom row: community + partner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        {/* Community */}
        <Card tone="sky" style={{ padding: 24 }}>
          <SectionHead
            title="Community whispers"
            sub="anonymous, always"
            action={
              <button onClick={() => onNavigate("community")} style={linkBtn}>
                Open feed <ArrowRight size={12} strokeWidth={1.8} />
              </button>
            }
          />
          {!feed || feed.length === 0 ? (
            <EmptyState
              icon={<Users size={24} strokeWidth={1.6} />}
              title="The common room is quiet"
              desc="Posts from students like you will appear here — share a thought or a small win to break the silence."
            >
              <Button variant="soft" onClick={() => onNavigate("community")}>
                <Compass size={15} strokeWidth={1.8} /> Visit community
              </Button>
            </EmptyState>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {feed.slice(0, 2).map((post) => (
                <div
                  key={post.id}
                  onClick={() => onNavigate("community")}
                  style={{
                    padding: 14,
                    borderRadius: 16,
                    cursor: "pointer",
                    background: "var(--glass)",
                    border: "1px solid var(--line)",
                    transition: "background 0.16s, transform 0.16s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.sand;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Avatar
                      seed={post.name?.length || 2}
                      size={26}
                      style={{ fontSize: 12 }}
                    >
                      {post.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <span
                      style={{ fontSize: 11.5, fontWeight: 600, color: C.clay }}
                    >
                      {post.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        color: C.faint,
                        marginLeft: "auto",
                      }}
                    >
                      {post.time}
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: C.ink }}>
                    {post.text}
                  </p>
                  {post.reactions?.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 9 }}>
                      {post.reactions.slice(0, 3).map((r, i) => {
                        const RIcon = reactionById(r.icon || r.emoji).icon;
                        return (
                          <span
                            key={i}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 11,
                              color: C.muted,
                              background: C.sand,
                              borderRadius: 999,
                              padding: "3px 9px",
                            }}
                          >
                            <RIcon size={11} strokeWidth={1.8} /> {r.count}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Partner / streak teaser */}
        {user?.partner ? (
          <Card
            style={{ padding: 24, display: "flex", flexDirection: "column" }}
          >
            <SectionHead
              title="Your anchor"
              sub={`paired with ${user.partner.name}`}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 0",
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar
                  seed={user.partner.name.length * 3}
                  size={64}
                  style={{ fontSize: 26 }}
                >
                  {user.partner.name?.[0]?.toUpperCase()}
                </Avatar>
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: C.sage,
                    border: "2.5px solid #FFFFFF",
                  }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: C.muted,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              {user.partner.goals?.filter((g) => g.me && g.partner).length || 0}{" "}
              shared goals today
            </p>
            <Button variant="soft" block onClick={() => onNavigate("partner")}>
              Open partner space <ArrowRight size={14} strokeWidth={1.8} />
            </Button>
          </Card>
        ) : (
          <Card
            tone="lavender"
            style={{ padding: 24, display: "flex", flexDirection: "column" }}
          >
            <SectionHead title="Go steady" sub="an accountability partner" />
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 0",
                color: C.faint,
              }}
            >
              <Compass size={34} strokeWidth={1.4} />
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: C.muted,
                textAlign: "center",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              Pair up anonymously and keep each other gently on track.
            </p>
            <Button variant="ghost" block onClick={() => onNavigate("partner")}>
              Find a partner
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

const linkBtn = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: 12.5,
  color: C.clay,
  fontWeight: 600,
  fontFamily: sans,
};
