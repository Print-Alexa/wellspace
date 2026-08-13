import { useState } from "react";
import { Flame, Plus, TrendingUp, X, Trash2, Sparkles, Sprout, Moon } from "lucide-react";
import { C, serif, todayKey, currentStreak, lastSevenDays, habitMeta, HABIT_LIBRARY, HABIT_CATEGORIES } from "../constants";
import { Button, Card, SectionHead, EmptyState, ProgressRing, Modal } from "../components/ui";
import { toast } from "../lib/toast";
import * as db from "../lib/db";

export default function HabitTrackerScreen({ user, onNavigate }) {
  const habits = [...(user?.buildHabits || []), ...(user?.extraHabits || [])];
  const checks = user?.habitChecks || {};
  const today = todayKey();

  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [pulseId, setPulseId] = useState(null);

  const doneToday = habits.filter((h) => (checks[h] || []).includes(today)).length;
  const bestStreak = Math.max(0, ...habits.map((h) => currentStreak(checks[h] || [])));
  const pct = habits.length ? Math.round((doneToday / habits.length) * 100) : 0;

  const toggle = (id) => {
    const isDone = (checks[id] || []).includes(today);
    db.toggleHabit(id, !isDone);
    setPulseId(id);
    setTimeout(() => {
      setPulseId(null);
      onNavigate("habits"); // re-render with fresh data
    }, 260);
  };

  const addCustom = () => {
    const name = newHabit.trim();
    if (!name) return;
    if (habits.includes(name) || HABIT_LIBRARY.some((h) => h.label === name)) {
      toast("That habit is already in your space", Sprout);
      return;
    }
    db.saveUser({ extraHabits: [...(user?.extraHabits || []), name] });
    setNewHabit("");
    setShowAdd(false);
    onNavigate("habits");
  };

  const addLibrary = (id) => {
    db.addHabit(id);
    onNavigate("habits");
  };

  const remove = (id) => {
    db.removeHabit(id);
    setConfirmRemove(null);
    onNavigate("habits");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 14 }}>
        <div>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(28px, 3.6vw, 38px)", color: C.ink }}>Your daily habits</h1>
          <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Gentle nudges, not demands. Every check-in counts.</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} strokeWidth={2} /> New habit
        </Button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Today", value: `${doneToday}/${habits.length}`, icon: TrendingUp, color: C.clay, tone: "butter" },
          { label: "Best streak", value: `${bestStreak}d`, icon: Flame, color: C.gold, tone: "pink" },
          { label: "This week", value: `${pct}%`, icon: Sparkles, color: C.sage, tone: "sage" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} tone={stat.tone} style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: `${stat.color}1f`,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontFamily: serif, fontSize: 22, color: C.ink, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add habit */}
      {showAdd && (
        <Card className="ws-rise" style={{ padding: 22 }}>
          <SectionHead title="Add a habit" sub="From the library, or make it your own" />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="e.g. Practice gratitude"
              className="ws-input"
              style={{ flex: 1, minWidth: 200, borderRadius: 999 }}
            />
            <Button onClick={addCustom} disabled={!newHabit.trim()}>Add habit</Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)} aria-label="Close">
              <X size={15} strokeWidth={1.8} />
            </Button>
          </div>
          <p style={{ fontSize: 11.5, color: C.faint, marginBottom: 8 }}>OR pick from the library</p>
          {["build", "break"].map((cat) => {
            const catMeta = HABIT_CATEGORIES[cat];
            const CatIcon = catMeta.icon;
            const items = HABIT_LIBRARY.filter((h) => h.category === cat && !habits.includes(h.id));
            if (items.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: catMeta.color, marginBottom: 7, display: "flex", alignItems: "center", gap: 5 }}>
                  <CatIcon size={12} strokeWidth={1.8} /> {catMeta.title}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {items.map((h) => (
                    <button key={h.id} onClick={() => addLibrary(h.id)} className="ws-chip" onMouseEnter={(e) => (e.currentTarget.style.borderColor = h.color)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}>
                      <h.icon size={15} strokeWidth={1.8} style={{ color: h.color }} aria-hidden="true" /> {h.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* List */}
      {habits.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Flame size={26} strokeWidth={1.6} />}
            title="Nothing to tend yet"
            desc="Habits you chose in onboarding live here. Add your first one and the streaks will follow."
          >
            <Button onClick={() => setShowAdd(true)}>
              <Plus size={15} strokeWidth={2} /> Add your first habit
            </Button>
          </EmptyState>
        </Card>
      ) : (
        <Card style={{ padding: "10px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {habits.map((h, i) => {
              const meta = habitMeta(h);
              const done = (checks[h] || []).includes(today);
              const streak = currentStreak(checks[h] || []);
              const week = lastSevenDays(checks[h] || []);
              return (
                <div
                  key={h}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "15px 0",
                    borderBottom: i < habits.length - 1 ? "1px solid rgba(44,35,48,0.07)" : "none",
                    transition: "opacity 0.2s",
                  }}
                >
                  <button
                    onClick={() => toggle(h)}
                    aria-label={done ? `Mark ${meta.label} as not done` : `Mark ${meta.label} done`}
                    className={`ws-check ${done ? "ws-check--on" : ""}`}
                    style={pulseId === h ? { transform: "scale(1.18)" } : undefined}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path className="ws-check__tick" d="M2.5 7.5 L6 11 L12.5 4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div style={{ width: 42, height: 42, borderRadius: 14, background: meta.soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: done ? 0.55 : 1 }}>
                    <meta.icon size={20} strokeWidth={1.6} style={{ color: meta.color }} aria-hidden="true" />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: done ? C.faint : C.ink, textDecoration: done ? "line-through" : "none" }}>
                      {meta.label}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      {week.map((d) => (
                        <span
                          key={d.key}
                          title={d.label}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: d.done ? meta.color : "rgba(44,35,48,0.1)",
                            transition: "background 0.2s",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: streak > 0 ? C.clay : C.faint, fontSize: 12.5, fontWeight: 600 }}>
                    <Flame size={13} strokeWidth={1.8} />
                    {streak > 0 ? `${streak}d` : "new"}
                  </div>

                  <button
                    onClick={() => setConfirmRemove(h)}
                    aria-label={`Remove ${meta.label}`}
                    style={{ width: 30, height: 30, borderRadius: 10, border: "none", background: "transparent", color: C.faint, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.16s, color 0.16s, background 0.16s" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = 1;
                      e.currentTarget.style.color = C.danger;
                      e.currentTarget.style.background = C.dangerSoft;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = 0;
                      e.currentTarget.style.color = C.faint;
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Progress */}
      {habits.length > 0 && (
        <Card tone="sky" style={{ padding: 24, display: "flex", alignItems: "center", gap: 22 }}>
          <ProgressRing pct={pct} size={84} color={C.clay} />
          <div>
            <p style={{ fontFamily: serif, fontSize: 17, fontWeight: 400, color: C.ink }}>{pct}% of today</p>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 3, lineHeight: 1.6 }}>
              {pct === 100
                ? (<>Everything checked. Rest well — you earned it. <Moon size={13} strokeWidth={1.8} style={{ display: "inline", verticalAlign: -2 }} /></>)
                : "A little progress is still progress. One check at a time."}
            </p>
          </div>
        </Card>
      )}

      <Modal open={!!confirmRemove} onClose={() => setConfirmRemove(null)} title="Let this habit go?">
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 20 }}>
          You'll lose the streak for <strong style={{ color: C.ink }}>{habitMeta(confirmRemove || "").label}</strong>.
          You can always add it back.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={() => setConfirmRemove(null)}>Keep it</Button>
          <Button variant="danger" onClick={() => remove(confirmRemove)}>
            <Trash2 size={14} strokeWidth={1.8} /> Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
}
