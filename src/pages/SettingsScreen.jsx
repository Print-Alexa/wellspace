import { useState } from "react";
import { Shield, Bell, Heart, Copy, Check, LogOut, Sparkles, Download, Trash2, Eye, EyeOff, RefreshCw, Info, KeyRound, Lightbulb, Sprout, MoonStar } from "lucide-react";
import { C, serif, sans, generateRecoveryCode, FORTUNES } from "../constants";
import { Button, Card, SectionHead, Avatar, Toggle, Modal, Stars, Aura, Motif } from "../components/ui";
import { toast } from "../lib/toast";
import { applyTheme } from "../lib/darkmode";
import * as db from "../lib/db";

export default function SettingsScreen({ user, onSignOut, onNavigate }) {
  const [name, setName] = useState(user?.anonName || "");
  const [codeVisible, setCodeVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [prefs, setPrefs] = useState(user?.prefs || {});
  const [recoveryCode, setRecoveryCode] = useState(user?.recoveryCode || generateRecoveryCode());

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === user?.anonName) return;
    db.saveUser({ anonName: trimmed });
    toast("Display name updated — still anonymous", Heart);
    onNavigate("settings");
  };

  const setPref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    db.savePrefs({ [key]: value });
    if (key === "darkMode") applyTheme(value);
  };

  const savedCards = (user?.savedCards || [])
    .map((id) => FORTUNES.find((f) => f.id === id))
    .filter(Boolean);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Select the code to copy it manually", Lightbulb);
    }
  };

  const regenerate = () => {
    const code = generateRecoveryCode();
    db.saveUser({ recoveryCode: code });
    setRecoveryCode(code);
    setCodeVisible(true);
    setConfirmRegen(false);
    toast("New recovery code created — the old one no longer works", KeyRound);
  };

  const exportData = () => {
    const data = db.getUser();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wellspace-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Your data has been exported", Download);
  };

  const deleteSpace = async () => {
    db.clearAllData();
    setConfirmDelete(false);
    toast("Your space has been erased — no trace left", Sprout);
    setTimeout(() => onSignOut(), 700);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "relative" }}>
      <Aura tone="gold" size={400} top="-90px" right="-110px" />
      <Aura tone="lavender" size={340} bottom="-70px" left="-100px" />
      <div style={{ position: "relative" }}>
        <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(28px, 3.6vw, 38px)", color: C.ink }}>Settings</h1>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Your anonymous profile, keys, and preferences.</p>
      </div>

      {/* Profile */}
      <Card tone="lavender" style={{ padding: 26 }}>
        <SectionHead title="Your anonymous profile" sub="auto-generated — change it anytime, it stays anonymous" />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <Avatar seed={(user?.anonName?.length || 5) * 7} size={62} style={{ fontSize: 26 }}>
            {(user?.anonName?.[0] || "W").toUpperCase()}
          </Avatar>
          <div>
            <p style={{ fontFamily: serif, fontSize: 19, color: C.ink }}>{user?.anonName}</p>
            <p style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>
              Anonymous since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "this year"} · no email, no real name
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            placeholder="Your anonymous display name"
            className="ws-input"
            style={{ flex: 1, minWidth: 220, borderRadius: 999 }}
          />
          <Button onClick={saveName} disabled={!name.trim() || name.trim() === user?.anonName}>
            <Check size={15} strokeWidth={2} /> Save name
          </Button>
        </div>
      </Card>

      {/* Recovery code */}
      <Card tone="night" style={{ padding: 26, position: "relative", overflow: "hidden" }}>
        <Stars count={16} seed={4} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <Shield size={17} color={C.star} strokeWidth={1.8} />
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 20, color: "#FFF6E3" }}>Recovery code</h2>
          </div>
          <p style={{ fontSize: 13, color: "rgba(244,222,174,0.65)", lineHeight: 1.7, marginBottom: 16, maxWidth: 460 }}>
            The only key back into your space. Keep it somewhere safe — we cannot
            recover it for you.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: "rgba(244,222,174,0.08)", border: "1px solid rgba(244,222,174,0.18)", borderRadius: 16, padding: "15px 17px" }}>
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "clamp(16px, 2.6vw, 19px)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: C.star,
                userSelect: "all",
                filter: codeVisible ? "none" : "blur(6px)",
                transition: "filter 0.25s ease",
              }}
            >
              {recoveryCode}
            </span>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <button onClick={() => setCodeVisible((v) => !v)} title={codeVisible ? "Hide code" : "Show code"} style={iconBtn}>
                {codeVisible ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
              </button>
              <button onClick={copyCode} style={textBtn}>
                {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.8} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => setConfirmRegen(true)} style={textBtn}>
                <RefreshCw size={13} strokeWidth={1.8} /> Regenerate
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card tone="butter" style={{ padding: 26 }}>
        <SectionHead title="Notifications" sub="gentle nudges, never nagging" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Bell size={16} color={C.faint} strokeWidth={1.8} />
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>Daily reminder time</p>
              <p style={{ fontSize: 11.5, color: C.faint }}>when your gentle nudge arrives</p>
            </div>
          </div>
          <input
            type="time"
            value={prefs.reminderTime || "08:00"}
            onChange={(e) => setPref("reminderTime", e.target.value)}
            style={{ padding: "7px 12px", borderRadius: 999, border: "1.5px solid var(--line)", fontSize: 13, background: "var(--glass)", fontFamily: sans, color: C.ink, outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { key: "dailyCard", label: "Daily fortune card", desc: "when your new card is ready", icon: Sparkles },
            { key: "moodNudge", label: "Mood check-in reminder", desc: "a gentle daily pause", icon: Heart },
            { key: "habitReminders", label: "Habit reminders", desc: "nudges for unchecked habits", icon: Check },
            { key: "communityReplies", label: "Community replies", desc: "when someone answers your post", icon: Bell },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", borderTop: i > 0 ? "1px solid rgba(44,35,48,0.06)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon size={16} color={C.faint} strokeWidth={1.8} />
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>{item.label}</p>
                    <p style={{ fontSize: 11.5, color: C.faint }}>{item.desc}</p>
                  </div>
                </div>
                <Toggle value={!!prefs[item.key]} onChange={(v) => setPref(item.key, v)} label={item.label} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Appearance */}
      <Card tone="lavender" style={{ padding: 26 }}>
        <SectionHead title="Appearance" sub="make the room match the hour" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <MoonStar size={16} color={C.faint} strokeWidth={1.8} />
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>Dark mode</p>
              <p style={{ fontSize: 11.5, color: C.faint }}>a calmer, deeper version of your space</p>
            </div>
          </div>
          <Toggle value={!!prefs.darkMode} onChange={(v) => setPref("darkMode", v)} label="Dark mode" />
        </div>
      </Card>

      {/* Saved cards */}
      <Card tone="sky" style={{ padding: 26 }}>
        <SectionHead title="Saved cards" sub={savedCards.length ? "kept in your space, one per saved card" : "cards you keep will gather here"} />
        {savedCards.length === 0 ? (
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            When you save a fortune card, it's stored right here in your anonymous
            space — accessible only with your recovery code. Nothing is kept
            anywhere else.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {savedCards.map((f) => (
              <div
                key={f.id}
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
                    background: C.goldSoft,
                    color: C.butterDeep,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={16} strokeWidth={1.8} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{f.title}</p>
                  <p style={{ fontSize: 12.5, color: C.muted, marginTop: 3, lineHeight: 1.55, fontStyle: "italic", fontFamily: serif }}>
                    “{f.text}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Privacy & data */}
      <Card tone="sage" style={{ padding: 26 }}>
        <SectionHead title="Privacy & data" sub="your space is yours alone" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={exportData}>
            <Download size={15} strokeWidth={1.8} /> Export my data
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={15} strokeWidth={1.8} /> Erase my space
          </Button>
        </div>
        <p style={{ fontSize: 12, color: C.faint, marginTop: 14, lineHeight: 1.65 }}>
          Exporting downloads everything in your space as JSON. Erasing removes
          it all — habits, moods, cards, posts — with no way back. This is the
          point: nothing about you is kept anywhere.
        </p>
      </Card>

      {/* About */}
      <Card tone="sky" style={{ padding: 26 }}>
        <SectionHead title="About WellSpace" />
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
          <Motif motif="lotus" color={C.clay} size={44} style={{ flexShrink: 0, opacity: 0.85 }} />
          <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75, flex: 1 }}>
            Built for students, by students. Warm, calm, and anonymous — a quiet
            corner of the internet for tending your days.
          </p>
        </div>
        <p style={{ fontSize: 12.5, color: C.faint, display: "flex", alignItems: "center", gap: 6 }}>
          <Info size={13} strokeWidth={1.8} /> Version 1.0 · always anonymous · your data, your rules
        </p>
      </Card>

      {/* Sign out */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
        <Button variant="danger" onClick={onSignOut}>
          <LogOut size={15} strokeWidth={1.8} /> Leave my space
        </Button>
      </div>

      {/* Regenerate confirm */}
      <Modal open={confirmRegen} onClose={() => setConfirmRegen(false)} title="Create a new recovery code?">
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 20 }}>
          Your current code will stop working immediately. Make sure you save the
          new one before closing this.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={() => setConfirmRegen(false)}>Keep current code</Button>
          <Button variant="night" onClick={regenerate}><RefreshCw size={14} strokeWidth={1.8} /> Generate new code</Button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Erase your space forever?">
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
          Everything disappears: habits, streaks, moods, cards, posts and your
          recovery code. This cannot be undone — that's the anonymous promise.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Keep my space</Button>
          <Button variant="danger" onClick={deleteSpace}><Trash2 size={14} strokeWidth={1.8} /> Erase everything</Button>
        </div>
      </Modal>
    </div>
  );
}

const iconBtn = {
  width: 36,
  height: 36,
  borderRadius: 10,
  border: "1px solid rgba(244,222,174,0.22)",
  background: "rgba(244,222,174,0.09)",
  color: C.star,
  cursor: "pointer",
  fontFamily: sans,
  fontSize: 12,
  fontWeight: 600,
  justifyContent: "center",
  transition: "background 0.16s",
};

// Text buttons next to the code — iconBtn is square; these size to their
// label instead of squishing the text into 36px.
const textBtn = {
  ...iconBtn,
  width: "auto",
  minWidth: 44,
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "0 14px",
};
