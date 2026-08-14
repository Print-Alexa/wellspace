import { useState } from "react";
import {
  Send,
  Flame,
  CheckCircle2,
  Circle,
  UserCheck,
  Sparkles,
  Compass,
  HeartHandshake,
  Clock,
} from "lucide-react";

// Captured once at module load — static text, not live countdown.
const NOW_MS = Date.now();
import { C, serif, sans } from "../constants";
import {
  Button,
  Card,
  SectionHead,
  Avatar,
  Stars,
  EmptyState,
  Aura,
  Motif,
} from "../components/ui";
import * as db from "../lib/db";

const STEPS = [
  {
    icon: Compass,
    title: "We match you quietly",
    desc: "Paired by habits and availability — never by identity.",
  },
  {
    icon: UserCheck,
    title: "Share goals",
    desc: "Pick habits you both want to keep. One shared list, two names.",
  },
  {
    icon: HeartHandshake,
    title: "Check in together",
    desc: "A private chat and gentle nudges when your partner shows up.",
  },
];

export default function AccountabilityPartnerScreen({ user }) {
  const [phase, setPhase] = useState("idle"); // idle | searching | no-match
  const partner = user?.partner;
  const [messages, setMessages] = useState(partner?.messages || []);
  const [goals, setGoals] = useState(partner?.goals || []);
  const [draft, setDraft] = useState("");
  const pairedDays = partner
    ? Math.max(
        1,
        Math.round((NOW_MS - new Date(partner.pairedAt).getTime()) / 86400000),
      )
    : 0;
  const pairStreak = Math.max(0, ...(goals || []).map((g) => g.streak || 0));

  const search = async () => {
    setPhase("searching");
    try {
      const foundPartner = await db.findPartner();
      if (foundPartner) {
        db.setPartner(foundPartner);
        setPhase("idle");
        window.location.reload(); // Refresh to show the new partner
      } else {
        setPhase("no-match");
      }
    } catch {
      setPhase("no-match");
    }
  };

  // ── No partner yet ──
  if (!partner) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          position: "relative",
        }}
      >
        <Aura tone="lavender" size={420} top="-80px" right="-120px" />
        <Aura tone="gold" size={340} bottom="-60px" left="-100px" />
        <div style={{ position: "relative" }}>
          <h1
            style={{
              fontFamily: serif,
              fontWeight: 400,
              fontSize: "clamp(28px, 3.6vw, 38px)",
              color: C.ink,
            }}
          >
            Partner space
          </h1>
          <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
            Two strangers, one quiet promise to show up.
          </p>
        </div>

        <Card
          tone="night"
          style={{
            padding: 36,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Stars count={26} seed={6} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <Avatar seed={4} size={62} style={{ fontSize: 26 }}>
                Y
              </Avatar>
              <HeartHandshake
                size={26}
                color={C.gold}
                strokeWidth={1.6}
                className="ws-float"
              />
              <Avatar
                seed={9}
                size={62}
                style={{ fontSize: 26, filter: "grayscale(0.4)" }}
              >
                ?
              </Avatar>
            </div>
            <h2
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(24px, 3.4vw, 32px)",
                color: "#FFF6E3",
                marginBottom: 10,
              }}
            >
              Find your quiet anchor
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(244,222,174,0.7)",
                maxWidth: 440,
                margin: "0 auto 24px",
                lineHeight: 1.7,
              }}
            >
              An accountability partner is a fellow student who wants the same
              thing as you: to keep the promises they made to themselves.
            </p>
            <Button
              variant="gold"
              onClick={search}
              disabled={phase === "searching"}
            >
              {phase === "searching" ? (
                <>
                  <Clock size={15} strokeWidth={1.8} /> Listening for a match…
                </>
              ) : (
                <>
                  <Compass size={15} strokeWidth={1.8} /> Find a partner
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Matching states */}
        {phase === "searching" && (
          <Card
            className="ws-rise"
            style={{ padding: 28, textAlign: "center" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="ws-twinkle"
                  style={{ fontSize: 18, animationDelay: `${i * 0.4}s` }}
                  aria-hidden="true"
                >
                  ✦
                </span>
              ))}
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: 17,
                color: C.ink,
                fontStyle: "italic",
              }}
            >
              Listening for another student who's looking…
            </p>
            <p style={{ fontSize: 12.5, color: C.faint, marginTop: 6 }}>
              Matching is anonymous and habit-based. This usually takes a
              moment.
            </p>
          </Card>
        )}

        {phase === "no-match" && (
          <Card className="ws-rise" style={{ padding: 28 }}>
            <EmptyState
              icon={<Motif motif="crescent" color={C.lavender} size={28} />}
              title="No one is listening right now"
              desc="Partners pair up when two students are looking at the same time. Check back later — your habits will be ready when a match is."
            >
              <Button variant="soft" onClick={search}>
                <Sparkles size={15} strokeWidth={1.8} /> Try again
              </Button>
            </EmptyState>
          </Card>
        )}

        {phase !== "searching" && (
          <Card style={{ padding: 28 }}>
            <SectionHead title="How it works" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
              }}
            >
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      padding: 18,
                      borderRadius: 18,
                      background: "var(--glass)",
                      border: "1px solid var(--card-line)",
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        background: C.goldSoft,
                        color: "#7a5a1e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <Icon size={19} strokeWidth={1.8} />
                    </div>
                    <p
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: C.ink,
                        marginBottom: 5,
                      }}
                    >
                      {s.title}
                    </p>
                    <p
                      style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}
                    >
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ── Matched: chat + shared goals ──
  const send = () => {
    if (!draft.trim()) return;
    db.sendMessage(draft.trim());
    setMessages((m) => [
      ...m,
      {
        id: `m_${Date.now()}`,
        fromMe: true,
        text: draft.trim(),
        time: "just now",
      },
    ]);
    setDraft("");
  };

  const toggleGoal = (id, who) => {
    db.toggleSharedGoal(id, who);
    setGoals((g) => g.map((x) => (x.id === id ? { ...x, [who]: !x[who] } : x)));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        position: "relative",
      }}
    >
      <Aura tone="sage" size={380} top="-80px" right="-100px" />
      <div style={{ position: "relative" }}>
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: "clamp(28px, 3.6vw, 38px)",
            color: C.ink,
          }}
        >
          Partner space
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
          A quiet corner for you and your accountability buddy.
        </p>
      </div>

      {/* Partner card */}
      <Card
        tone="night"
        style={{ padding: 24, position: "relative", overflow: "hidden" }}
      >
        <Stars count={14} seed={12} />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative" }}>
            <Avatar
              seed={partner.name.length * 3}
              size={60}
              style={{ fontSize: 25 }}
            >
              {partner.name?.[0]?.toUpperCase()}
            </Avatar>
            <span
              style={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: C.sage,
                border: "2.5px solid #3B3547",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <h2
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: 20,
                  color: "#FFF6E3",
                }}
              >
                {partner.name}
              </h2>
              <span
                style={{
                  fontSize: 10,
                  background: "rgba(244,222,174,0.15)",
                  color: "rgba(244,222,174,0.85)",
                  padding: "3px 9px",
                  borderRadius: 999,
                }}
              >
                anonymous partner
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "rgba(244,222,174,0.6)",
                marginTop: 2,
              }}
            >
              {`paired ${pairedDays} days ago · habits overlap: ${(goals || []).filter((g) => g.me && g.partner).length}`}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: serif,
                fontSize: 34,
                color: C.star,
                lineHeight: 1,
              }}
            >
              {pairStreak}
            </p>
            <p
              style={{
                fontSize: 10,
                color: "rgba(244,222,174,0.55)",
                marginTop: 3,
              }}
            >
              day streak
            </p>
          </div>
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Chat */}
        <Card
          tone="sky"
          style={{ display: "flex", flexDirection: "column", height: 460 }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid rgba(44,35,48,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <UserCheck size={16} color={C.clay} strokeWidth={1.8} />
            <h2
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: 16.5,
                color: C.ink,
              }}
            >
              Chat with {partner.name}
            </h2>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.sage,
                  animation: "ws-twinkle 2s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: 11, color: C.muted }}>quietly here</span>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.length === 0 && (
              <p
                style={{
                  fontSize: 12.5,
                  color: C.faint,
                  textAlign: "center",
                  marginTop: 30,
                  fontStyle: "italic",
                  fontFamily: serif,
                }}
              >
                Say hello — gently.
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.fromMe ? "flex-end" : "flex-start",
                }}
              >
                <div style={{ maxWidth: "76%" }}>
                  <div
                    style={{
                      padding: "10px 15px",
                      borderRadius: 17,
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      borderBottomRightRadius: msg.fromMe ? 5 : 17,
                      borderBottomLeftRadius: msg.fromMe ? 17 : 5,
                      background: msg.fromMe ? C.clay : "var(--glass)",
                      border: msg.fromMe
                        ? "none"
                        : "1px solid var(--card-line)",
                      color: msg.fromMe ? "#FFFFFF" : C.ink,
                      boxShadow: msg.fromMe
                        ? "0 6px 18px rgba(192,100,72,0.25)"
                        : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                  <p
                    style={{
                      fontSize: 10,
                      color: C.faint,
                      marginTop: 3,
                      textAlign: msg.fromMe ? "right" : "left",
                    }}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(44,35,48,0.08)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Send a gentle message…"
              className="ws-input"
              style={{ borderRadius: 999, padding: "10px 16px", fontSize: 13 }}
            />
            <button
              onClick={send}
              aria-label="Send message"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: C.clay,
                border: "none",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.06)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              <Send size={15} strokeWidth={2} />
            </button>
          </div>
        </Card>

        {/* Shared goals */}
        <Card tone="butter" style={{ padding: 20 }}>
          <SectionHead
            title="Shared goals"
            sub="check off when you've done yours"
          />
          {(goals || []).length === 0 ? (
            <EmptyState
              icon={<Flame size={22} strokeWidth={1.6} />}
              title="No shared goals yet"
              desc="When you both pick a habit to keep together, it appears here."
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "var(--glass)",
                    border: "1px solid var(--card-line)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 9,
                    }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>
                      {goal.label}
                    </p>
                    {goal.streak > 0 && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: 11,
                          color: C.clay,
                          fontWeight: 600,
                        }}
                      >
                        <Flame size={10} strokeWidth={1.8} /> {goal.streak}
                      </span>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <button
                      onClick={() => toggleGoal(goal.id, "me")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        color: goal.me ? C.sage : C.faint,
                        fontFamily: sans,
                        fontWeight: goal.me ? 600 : 500,
                      }}
                    >
                      {goal.me ? (
                        <CheckCircle2 size={14} strokeWidth={1.8} />
                      ) : (
                        <Circle size={14} strokeWidth={1.8} />
                      )}{" "}
                      You
                    </button>
                    <div
                      style={{
                        width: 1,
                        height: 14,
                        background: "rgba(44,35,48,0.1)",
                      }}
                    />
                    <button
                      onClick={() => toggleGoal(goal.id, "partner")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        color: goal.partner ? C.clay : C.faint,
                        fontFamily: sans,
                        fontWeight: goal.partner ? 600 : 500,
                      }}
                    >
                      {goal.partner ? (
                        <CheckCircle2 size={14} strokeWidth={1.8} />
                      ) : (
                        <Circle size={14} strokeWidth={1.8} />
                      )}{" "}
                      {partner.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              marginTop: 14,
              background: C.sand,
              borderRadius: 14,
              padding: "13px 15px",
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 13.5,
                color: C.ink,
                lineHeight: 1.6,
              }}
            >
              “You don't have to do it perfectly. You just have to keep showing
              up.”
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
