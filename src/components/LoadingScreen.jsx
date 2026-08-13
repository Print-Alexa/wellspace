import { useEffect, useState } from "react";
import { C, script, sans, grain } from "../constants";
import bgImage from "../assets/background.png";

export default function LoadingScreen({ onComplete }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const done = () => {
      setLeaving(true);
      setTimeout(onComplete, 450);
    };
    const t = setTimeout(done, 4200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      onClick={() => {
        setLeaving(true);
        setTimeout(onComplete, 250);
      }}
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        cursor: "pointer",
        background: `${grain}, linear-gradient(180deg, rgba(36,24,18,0.52), rgba(36,24,18,0.84)), url(${bgImage}) center/cover no-repeat, ${C.night}`,
        backgroundSize: "200px, auto, auto, auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.45s ease",
        opacity: leaving ? 0 : 1,
      }}
    >
      <style>{`
        @keyframes lg-circle {
          0% { opacity: 0; transform: scale(0.6); }
          60% { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes lg-star {
          0% { opacity: 0; transform: scale(0.2) rotate(0deg); }
          55% { opacity: 1; transform: scale(1.25) rotate(18deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes lg-star-glow {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.18); }
        }
        @keyframes lg-reveal {
          from { clip-path: inset(-30% 100% -30% 0); }
          to { clip-path: inset(-30% 0 -30% 0); }
        }
        @keyframes lg-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lg-pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.9); opacity: 0; }
        }
      `}</style>

      {/* ambient stars */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
        {Array.from({ length: 26 }).map((_, i) => {
          const x = (i * 37.7) % 100;
          const y = (i * 53.3) % 100;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: 1.5 + (i % 3),
                height: 1.5 + (i % 3),
                borderRadius: "50%",
                background: C.star,
                opacity: 0.2 + ((i * 13) % 60) / 100,
                animation: `lg-fade 2.4s ease ${(i % 8) * 0.3}s infinite alternate`,
              }}
            />
          );
        })}
      </div>

      {/* animated mark */}
      <div style={{ position: "relative", width: 128, height: 128, marginBottom: 26 }}>
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: "1px solid rgba(244,222,174,0.5)",
            animation: "lg-pulse-ring 2.6s ease-out infinite",
          }}
        />
        <svg width="128" height="128" viewBox="0 0 100 100" fill="none">
          <circle
            cx="38"
            cy="50"
            r="22"
            stroke={C.star}
            strokeWidth="2.4"
            opacity="0"
            style={{ animation: "lg-circle 1.1s cubic-bezier(0.22,1,0.36,1) 0.15s forwards" }}
          />
          <circle
            cx="62"
            cy="50"
            r="22"
            stroke={C.star}
            strokeWidth="2.4"
            opacity="0.42"
            style={{ animation: "lg-circle 1.1s cubic-bezier(0.22,1,0.36,1) 0.5s forwards" }}
          />
          <path
            d="M50,43 L51.9,47.9 L56.8,49 L51.9,50.1 L50,55 L48.1,50.1 L43.2,49 L48.1,47.9 Z"
            fill={C.gold}
            opacity="0"
            style={{
              animation: "lg-star 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.9s forwards, lg-star-glow 2.4s ease-in-out 1.7s infinite",
              transformOrigin: "50px 49px",
            }}
          />
        </svg>
      </div>

      {/* wordmark — hand-written reveal */}
      <div style={{ position: "relative", overflow: "hidden", padding: "6px 14px" }}>
        <div
          style={{
            fontFamily: script,
            fontSize: "clamp(34px, 6vw, 46px)",
            color: "#FFF6E3",
            lineHeight: 1.5,
            clipPath: "inset(-30% 100% -30% 0)",
            animation: "lg-reveal 1.6s cubic-bezier(0.4,0,0.2,1) 0.35s forwards",
            whiteSpace: "nowrap",
            textShadow: "0 2px 24px rgba(47,42,61,0.5)",
          }}
        >
          WellSpace
        </div>
      </div>

      <div
        style={{
          fontFamily: sans,
          fontSize: 10.5,
          letterSpacing: "0.34em",
          color: "rgba(244,222,174,0.55)",
          textTransform: "uppercase",
          marginTop: 18,
          opacity: 0,
          animation: "lg-fade 0.8s ease 1.4s forwards",
        }}
      >
        your quiet corner
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 34,
          fontFamily: sans,
          fontSize: 12,
          color: "rgba(255,246,227,0.5)",
          letterSpacing: "0.06em",
          opacity: 0,
          animation: "lg-fade 0.8s ease 2.2s forwards",
        }}
      >
        tap anywhere to enter
      </div>
    </div>
  );
}
