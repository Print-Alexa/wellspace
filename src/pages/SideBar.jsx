import { LogOut, Shield } from "lucide-react";
import { C, script, sans } from "../constants";
import VennLogo from "../components/VennLogo";
import { Avatar } from "../components/ui";
import { NAV } from "./nav";

export default function Sidebar({ current, onNavigate, userName, onSignOut }) {
  return (
    <aside
      style={{
        width: 248,
        flexShrink: 0,
        position: "sticky",
        top: 14,
        height: "calc(100vh - 28px)",
        background: "var(--glass)",
        backdropFilter: "blur(22px) saturate(1.2)",
        WebkitBackdropFilter: "blur(22px) saturate(1.2)",
        border: "1px solid var(--card-line)",
        borderRadius: 26,
        boxShadow: "0 1px 2px rgba(44,35,48,0.04), 0 10px 28px rgba(44,35,48,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 14px",
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 0", marginBottom: 24 }}>
        <VennLogo size={34} />
        <div>
          <div style={{ fontFamily: script, fontSize: 18, color: C.ink, lineHeight: 1.1 }}>WellSpace</div>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, marginTop: 2 }}>
            anonymous space
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = current === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "10px 12px",
                borderRadius: 14,
                border: "none",
                background: active ? C.claySoft : "transparent",
                color: active ? C.clay : C.muted,
                fontSize: 13.5,
                fontFamily: sans,
                cursor: "pointer",
                textAlign: "left",
                fontWeight: active ? 600 : 500,
                transition: "background 0.16s ease, color 0.16s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(44,35,48,0.05)";
                  e.currentTarget.style.color = C.ink;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.muted;
                }
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.1 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 8px",
          marginBottom: 8,
          borderRadius: 16,
          background: C.sand,
          border: "1px solid rgba(44,35,48,0.05)",
        }}
      >
        <Avatar seed={userName ? userName.length * 7 : 3} size={34} style={{ fontSize: 15 }}>
          {userName?.[0]?.toUpperCase() || "W"}
        </Avatar>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {userName || "Wanderer"}
          </p>
          <p style={{ fontSize: 10.5, color: C.faint, display: "flex", alignItems: "center", gap: 4 }}>
            <Shield size={9} strokeWidth={2} /> anonymous
          </p>
        </div>
      </div>

      <button
        onClick={onSignOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 12px",
          borderRadius: 12,
          border: "none",
          background: "transparent",
          color: C.faint,
          fontSize: 13,
          fontFamily: sans,
          cursor: "pointer",
          transition: "color 0.16s ease, background 0.16s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = C.danger;
          e.currentTarget.style.background = C.dangerSoft;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = C.faint;
          e.currentTarget.style.background = "transparent";
        }}
      >
        <LogOut size={15} strokeWidth={1.8} /> Leave my space
      </button>
    </aside>
  );
}
