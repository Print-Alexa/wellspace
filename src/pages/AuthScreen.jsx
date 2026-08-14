import { useState } from "react";
import { ArrowRight, ArrowLeft, KeyRound, Check, Copy, Shield, Sparkles, Flame, AlertTriangle, Eye, EyeOff, Moon, Lightbulb } from "lucide-react";
import { C, serif, script, sans, SHADOW, grain } from "../constants";
import VennLogo from "../components/VennLogo";
import { Button, Card, Stars, Aura } from "../components/ui";
import { toast } from "../lib/toast";
import * as db from "../lib/db";
import bgImage from "../assets/background.png";

const GoogleMark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

export default function AuthScreen({ onAuth, onBack }) {
  const [view, setView] = useState("choose"); // choose | code
  const [sub, setSub] = useState("enter"); // enter | new | saved
  const [code, setCode] = useState("");
  const [newCode, setNewCode] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    setError("");
    const res = await db.startWithGoogle();
    if (res.mode === "local") {
      setPreviewMode(true);
      toast("Preview mode — signed in with a temporary anonymous space", Moon);
    }
    setBusy(false);
    onAuth();
  };

  const handleEnterCode = async () => {
    const c = code.trim().toUpperCase();
    if (c.length < 13) return;
    setBusy(true);
    setError("");
    const res = await db.redeemCode(c);
    setBusy(false);
    if (!res) {
      setError("That code doesn't match any space. Double-check it and try again.");
      return;
    }
    onAuth();
  };

  const handleGenerate = () => {
    const { code } = db.startAnonymous();
    setNewCode(code);
    setSub("saved");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(newCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Select the code and copy it manually", Lightbulb);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: sans, background: `${grain}, ${C.cream}`, backgroundSize: "200px, auto" }}>
      {/* ── Left: photo panel ── */}
      <div
        className="ws-auth-photo"
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          background: `linear-gradient(180deg, rgba(36,24,18,0.32), rgba(36,24,18,0.86)), url(${bgImage}) center/cover no-repeat, ${C.night}`,
          overflow: "hidden",
        }}
      >
        <Stars count={30} seed={5} />
        <div style={{ position: "relative", zIndex: 1, padding: 52, width: "100%", maxWidth: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <VennLogo size={40} color={C.star} starColor={C.gold} />
            <span style={{ fontFamily: script, fontSize: 23, color: "#FFF6E3" }}>WellSpace</span>
          </div>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(30px, 3.6vw, 46px)", color: "#FFF6E3", lineHeight: 1.12, marginBottom: 16 }}>
            Your quiet corner
            <br />
            to grow.
          </h1>
          <p style={{ fontSize: 15, color: "rgba(244,222,174,0.75)", lineHeight: 1.7, marginBottom: 28, maxWidth: 360 }}>
            Track moods, build habits, and find your people — all anonymously,
            with no identity attached.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["shield", "100% anonymous"],
              ["flame", "gentle streaks"],
              ["sparkles", "daily fortune"],
            ].map(([icon, label]) => (
              <span
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255,253,248,0.1)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(244,222,174,0.22)",
                  color: "#FFF6E3",
                  fontSize: 12,
                  padding: "7px 14px",
                  borderRadius: 999,
                }}
              >
                {icon === "shield" && <Shield size={12} strokeWidth={1.8} />}
                {icon === "flame" && <Flame size={12} strokeWidth={1.8} />}
                {icon === "sparkles" && <Sparkles size={12} strokeWidth={1.8} />}
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: the two ways in ── */}
      <div className="ws-auth-panel" style={{ width: "min(480px, 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", overflowY: "auto", position: "relative" }}>
        <Aura tone="gold" size={420} top="-100px" right="-140px" />
        <Aura tone="sage" size={360} bottom="-80px" left="-120px" />
        <button
          onClick={onBack}
          style={{
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: 5,
            border: "none",
            background: "none",
            color: C.muted,
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
            marginBottom: 26,
            fontFamily: sans,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.clay)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "")}
        >
          <ArrowLeft size={15} strokeWidth={1.8} /> Back
        </button>

        {view === "choose" && (
          <div className="ws-rise">
            <p className="ws-eyebrow" style={{ marginBottom: 12 }}>Welcome</p>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(26px, 3vw, 34px)", color: C.ink, marginBottom: 10 }}>
              Come as you are.
            </h2>
            <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.7, marginBottom: 30 }}>
              No name, no email, no profile picture. Two ways in — both keep
              your space anonymous.
            </p>

            {previewMode && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  background: C.goldSoft,
                  border: `1px solid rgba(201,151,63,0.35)`,
                  color: "#7a5a1e",
                  borderRadius: 14,
                  padding: "12px 14px",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  marginBottom: 20,
                }}
              >
                <Sparkles size={14} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  You're in <strong>preview mode</strong> — running on a temporary
                  anonymous session. Google sign-in will connect for real when the
                  app is deployed.
                </span>
              </div>
            )}

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={busy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                padding: "18px 16px",
                borderRadius: 18,
                background: C.paper,
                border: "1.5px solid rgba(44,35,48,0.12)",
                boxShadow: SHADOW.soft,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: sans,
                transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = SHADOW.lift;
                e.currentTarget.style.borderColor = "rgba(44,35,48,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "rgba(110,151,201,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <GoogleMark />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 2 }}>
                  {busy ? "Opening Google…" : "Continue with Google"}
                </p>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                  Just a recovery key — your Google info is never stored or shown.
                </p>
              </div>
              <ArrowRight size={17} color={C.faint} strokeWidth={1.8} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(44,35,48,0.1)" }} />
              <span style={{ fontSize: 12, color: C.faint }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(44,35,48,0.1)" }} />
            </div>

            {/* Recovery code */}
            <button
              onClick={() => {
                setView("code");
                setSub("enter");
                setError("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                padding: "18px 16px",
                borderRadius: 18,
                background: `linear-gradient(150deg, ${C.night}, ${C.night2})`,
                border: "1px solid rgba(244,222,174,0.22)",
                boxShadow: SHADOW.night,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: sans,
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 30px 70px rgba(23,17,43,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "rgba(244,222,174,0.12)",
                  color: C.star,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <KeyRound size={19} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14.5, fontWeight: 600, color: "#FFF6E3", marginBottom: 2 }}>
                  Stay anonymous with a recovery code
                </p>
                <p style={{ fontSize: 12, color: "rgba(244,222,174,0.65)", lineHeight: 1.5 }}>
                  No email, no name, no trace. A code is the only key to your space.
                </p>
              </div>
              <ArrowRight size={17} color="rgba(244,222,174,0.6)" strokeWidth={1.8} />
            </button>

            <p style={{ fontSize: 11.5, color: C.faint, marginTop: 24, lineHeight: 1.6 }}>
              By continuing you agree to our <a href="#" style={{ color: C.clay, textDecoration: "none" }}>Privacy Policy</a>. We never sell your data — there isn't any to sell.
            </p>
          </div>
        )}

        {/* ── Code panel ── */}
        {view === "code" && (
          <div className="ws-rise">
            <button
              onClick={() => setView("choose")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                border: "none",
                background: "none",
                color: C.muted,
                fontSize: 13,
                cursor: "pointer",
                padding: 0,
                marginBottom: 20,
                fontFamily: sans,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.clay)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              <ArrowLeft size={15} strokeWidth={1.8} /> All sign-in options
            </button>

            {sub === "enter" && (
              <>
                <p className="ws-eyebrow" style={{ marginBottom: 12 }}>Recovery code</p>
                <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(26px, 3vw, 34px)", color: C.ink, marginBottom: 10 }}>
                  Welcome back.
                </h2>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
                  Enter your recovery code to return to your space. Only you can
                  restore it — we can't.
                </p>
                <label style={{ fontSize: 12.5, color: C.muted, display: "block", marginBottom: 8 }}>
                  Your recovery code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 14))}
                  placeholder="WELL-XXXX-XXXX"
                  onKeyDown={(e) => e.key === "Enter" && handleEnterCode()}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `1.5px solid ${error ? C.danger : "rgba(44,35,48,0.14)"}`,
                    fontSize: 17,
                    fontFamily: "ui-monospace, monospace",
                    letterSpacing: "0.08em",
                    color: C.ink,
                    background: C.paper,
                    outline: "none",
                    marginBottom: 14,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.clay)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = error ? C.danger : "rgba(44,35,48,0.14)")}
                />
                {error && (
                  <p style={{ fontSize: 12.5, color: C.danger, background: C.dangerSoft, borderRadius: 10, padding: "10px 13px", marginBottom: 14 }}>
                    {error}
                  </p>
                )}
                <Button onClick={handleEnterCode} block disabled={code.length < 13 || busy} size="lg">
                  {busy ? "Checking…" : "Enter my space"} <ArrowRight size={15} strokeWidth={2} />
                </Button>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(44,35,48,0.1)" }} />
                  <span style={{ fontSize: 12, color: C.faint }}>new here?</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(44,35,48,0.1)" }} />
                </div>
                <Button onClick={handleGenerate} variant="ghost" block>
                  <KeyRound size={15} strokeWidth={1.8} /> Generate a new recovery code
                </Button>
              </>
            )}

            {sub === "saved" && newCode && (
              <>
                <p className="ws-eyebrow" style={{ marginBottom: 12 }}>Your recovery code</p>
                <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(26px, 3vw, 34px)", color: C.ink, marginBottom: 10 }}>
                  Save this code.
                </h2>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 22 }}>
                  This is the only way back into your space. Write it down, keep
                  it somewhere safe — we cannot recover it for you.
                </p>
                <Card tone="night" style={{ padding: "20px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
                  <Stars count={10} seed={21} />
                  <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <span
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: "clamp(17px, 3vw, 21px)",
                        letterSpacing: "0.09em",
                        color: C.star,
                        fontWeight: 700,
                        userSelect: "all",
                        filter: showCode ? "none" : "blur(7px)",
                        transition: "filter 0.25s ease",
                      }}
                    >
                      {newCode}
                    </span>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => setShowCode((s) => !s)}
                        title={showCode ? "Hide code" : "Show code"}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          border: "1px solid rgba(244,222,174,0.25)",
                          background: "rgba(244,222,174,0.1)",
                          color: C.star,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        {showCode ? <EyeOff size={14} strokeWidth={1.8} /> : <Eye size={14} strokeWidth={1.8} />}
                      </button>
                      <button
                        onClick={copyCode}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "0 14px",
                          height: 34,
                          borderRadius: 10,
                          border: "1px solid rgba(244,222,174,0.25)",
                          background: "rgba(244,222,174,0.1)",
                          color: C.star,
                          fontSize: 12,
                          cursor: "pointer",
                          fontFamily: sans,
                        }}
                      >
                        {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.8} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </Card>
                <div
                  style={{
                    display: "flex",
                    gap: 9,
                    alignItems: "flex-start",
                    background: C.goldSoft,
                    border: `1px solid rgba(201,151,63,0.35)`,
                    color: "#7a5a1e",
                    borderRadius: 12,
                    padding: "11px 14px",
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    marginBottom: 22,
                  }}
                >
                  <AlertTriangle size={14} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>Screenshot it or write it down before continuing.</span>
                </div>
                <Button onClick={onAuth} block size="lg">
                  I've saved it — set up my space <ArrowRight size={15} strokeWidth={2} />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
