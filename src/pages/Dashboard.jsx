import { useState, useEffect } from "react";
import { Home, Flame, Heart, Sparkles, MoreHorizontal, X } from "lucide-react";
import { C, serif, sans, script, grain, bgGradient } from "../constants";
import VennLogo from "../components/VennLogo";
import { Aura } from "../components/ui";
import Sidebar from "./SideBar";
import { NAV } from "./nav";
import DashboardScreen from "./DashboardScreen";
import MoodLogScreen from "./MoodLogScreen";
import HabitTrackerScreen from "./HabitTrackerScreen";
import FortuneCardScreen from "./FortuneCardScreen";
import CommunityFeedScreen from "./CommunityFeedScreen";
import AccountabilityPartnerScreen from "./AccountabilityPartnerScreen";
import SettingsScreen from "./SettingsScreen";
import Toaster from "../components/Toaster";
import * as db from "../lib/db";

const TAB_MAIN = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "habits", label: "Habits", icon: Flame },
  { id: "mood", label: "Mood", icon: Heart },
  { id: "fortune", label: "Fortune", icon: Sparkles },
];

const TAB_MORE = NAV.filter((n) => !TAB_MAIN.some((t) => t.id === n.id)); // community, partner, settings

export default function Dashboard({ screen, onNavigate, onSignOut }) {
  const [version, setVersion] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);

  // Pull the latest shared state on entry — a partner may have matched you
  // (or someone replied to your post) while you were away.
  useEffect(() => {
    let live = true;
    db.refreshUser().then((u) => {
      if (live && u) setVersion((v) => v + 1);
    });
    return () => {
      live = false;
    };
  }, []);

  const user = db.getUser();
  const go = (id) => {
    setMoreOpen(false);
    onNavigate(id);
    setVersion((v) => v + 1); // re-read fresh user data on navigation
  };

  const renderScreen = () => {
    const props = { user, onNavigate: go };
    switch (screen) {
      case "habits":
        return <HabitTrackerScreen {...props} />;
      case "mood":
        return <MoodLogScreen {...props} />;
      case "fortune":
        return <FortuneCardScreen {...props} />;
      case "community":
        return <CommunityFeedScreen {...props} />;
      case "partner":
        return <AccountabilityPartnerScreen {...props} />;
      case "settings":
        return <SettingsScreen {...props} onSignOut={onSignOut} />;
      default:
        return <DashboardScreen {...props} />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `${grain}, ${bgGradient}`,
        backgroundSize: "200px, auto",
        backgroundAttachment: "fixed",
        fontFamily: sans,
        color: C.ink,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient aura light — soft drifting glow behind every screen */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Aura tone="gold" size={520} top="-140px" right="-120px" />
        <Aura tone="lavender" size={460} top="24%" left="-180px" />
        <Aura tone="sage" size={420} bottom="-120px" right="8%" />
      </div>

      <div
        style={{
          display: "flex",
          gap: 18,
          maxWidth: 1320,
          margin: "0 auto",
          padding: "clamp(12px, 3vw, 20px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Desktop sidebar */}
        <div className="ws-desk-only">
          <Sidebar
            current={screen}
            onNavigate={go}
            userName={user?.anonName}
            onSignOut={onSignOut}
          />
        </div>

        {/* Main column */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            paddingBottom: 96,
            position: "relative",
          }}
        >
          {/* Mobile top bar */}
          <div
            className="ws-phone-only"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              position: "sticky",
              top: 0,
              zIndex: 40,
              background: "var(--glass)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderBottom: "1px solid var(--card-line)",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <VennLogo size={28} />
              <span style={{ fontFamily: script, fontSize: 17, color: C.ink }}>
                WellSpace
              </span>
            </div>
            <button
              onClick={() => go("settings")}
              aria-label="Settings"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "1px solid var(--card-line)",
                background: "var(--glass)",
                color: C.ink,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {(user?.anonName?.[0] || "W").toUpperCase()}
            </button>
          </div>

          {/* Screen */}
          <div
            key={screen + version}
            className="ws-rise"
            style={{ maxWidth: 920, margin: "0 auto" }}
          >
            {renderScreen()}
          </div>
        </main>
      </div>

      {/* Mobile bottom dock — dark floating pill, reference look */}
      <div
        className="ws-phone-only ws-dock"
        style={{
          position: "fixed",
          bottom: 10,
          left: 10,
          right: 10,
          zIndex: 45,
        }}
      >
        {TAB_MAIN.filter((t) => t.id === "dashboard" || t.id === "habits").map(
          ({ id, label, icon: Icon }) => {
            const active = screen === id;
            return (
              <button
                key={id}
                onClick={() => go(id)}
                className={`ws-dock__btn ${active ? "ws-dock__btn--on" : ""}`}
              >
                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </button>
            );
          },
        )}
        <button
          className="ws-dock__plus"
          onClick={() => go("mood")}
          aria-label="Log mood"
        >
          <Heart size={20} strokeWidth={2} />
        </button>
        {TAB_MAIN.filter((t) => t.id === "fortune").map(
          ({ id, label, icon: Icon }) => {
            const active = screen === id;
            return (
              <button
                key={id}
                onClick={() => go(id)}
                className={`ws-dock__btn ${active ? "ws-dock__btn--on" : ""}`}
              >
                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </button>
            );
          },
        )}
        <button className="ws-dock__btn" onClick={() => setMoreOpen(true)}>
          <MoreHorizontal size={19} strokeWidth={1.8} />
          More
        </button>
      </div>

      {/* More sheet */}
      {moreOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23,17,43,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 55,
          }}
          onClick={() => setMoreOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="ws-rise"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              background: C.cream,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              border: "1px solid var(--card-line)",
              padding: "18px 20px calc(26px + env(safe-area-inset-bottom))",
              boxShadow: "0 -16px 48px rgba(44,35,48,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <p style={{ fontFamily: serif, fontSize: 18, fontWeight: 400 }}>
                More spaces
              </p>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(44,35,48,0.06)",
                  color: C.muted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={15} strokeWidth={2} />
              </button>
            </div>
            {TAB_MORE.map(({ id, label, icon: Icon }) => {
              const active = screen === id;
              return (
                <button
                  key={id}
                  onClick={() => go(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "13px 14px",
                    borderRadius: 16,
                    border: "none",
                    background: active ? C.claySoft : "var(--glass)",
                    color: active ? C.clay : C.ink,
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    fontFamily: sans,
                    cursor: "pointer",
                    marginBottom: 8,
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
