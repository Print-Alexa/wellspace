import { useEffect, useMemo } from "react";
import { C, serif } from "../constants";

// ─── Button ──────────────────────────────────────────────────
export function Button({
  variant = "primary", // primary | night | gold | ghost | soft | danger
  size, // sm | lg
  block,
  className = "",
  style,
  children,
  ...rest
}) {
  const cls = [
    "ws-btn",
    `ws-btn--${variant}`,
    size && `ws-btn--${size}`,
    block && "ws-btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}

// ─── Card ────────────────────────────────────────────────────
// tone: glass (default) | sand | night | butter | pink | sage | sky | lavender
export function Card({ tone = "glass", style, className = "", children, ...rest }) {
  const tones = ["glass", "sand", "night", "butter", "pink", "sage", "sky", "lavender"];
  const cls = tone === "glass" || !tones.includes(tone) ? "ws-card" : `ws-card ws-card--${tone}`;
  return (
    <div className={`${cls} ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}

// ─── Section heading ─────────────────────────────────────────
export function SectionHead({ title, sub, action, style }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 14,
        ...style,
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: 20,
            color: C.ink,
            lineHeight: 1.25,
          }}
        >
          {title}
        </h2>
        {sub && (
          <p style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{sub}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Chip ────────────────────────────────────────────────────
export function Chip({ active, onClick, children, style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ws-chip ${active ? "ws-chip--on" : ""}`}
      style={style}
    >
      {children}
    </button>
  );
}

// ─── Toggle ──────────────────────────────────────────────────
export function Toggle({ value, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`ws-toggle ${value ? "ws-toggle--on" : ""}`}
    />
  );
}

// ─── Avatar — anonymous gradient disc ────────────────────────
// Anonymous gradient discs — palette-family washes (peach, butter,
// baby blue, olive, lavender, rose). No photos, ever.
const AVATAR_GRADIENTS = [
  ["#FFE9DB", "#F0C39B"],
  ["#FBF0C4", "#E8D897"],
  ["#D6E8FD", "#AFCDF3"],
  ["#EBEFDB", "#C7D2A4"],
  ["#ECEBF2", "#D2CBE2"],
  ["#F9E4DB", "#E7BFA6"],
];

export function Avatar({ seed = 0, size = 44, children, style }) {
  const [a, b] = AVATAR_GRADIENTS[Math.abs(seed || 0) % AVATAR_GRADIENTS.length];
  return (
    <div
      aria-hidden="true"
      className="ws-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(145deg, ${a}, ${b})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────
export function EmptyState({ icon, title, desc, children, style }) {
  return (
    <div className="ws-empty" style={style}>
      {icon && <div className="ws-empty__art">{icon}</div>}
      {title && <h3 className="ws-empty__title">{title}</h3>}
      {desc && <p className="ws-empty__desc">{desc}</p>}
      {children && (
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Dashed photo placeholder ────────────────────────────────
export function DashedPhoto({ label = "Image", height, style, children }) {
  return (
    <div
      className="ws-placeholder ws-placeholder--photo"
      style={{ minHeight: height, ...style }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M4 18l5-5 4 4 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  );
}

// ─── Progress ring ───────────────────────────────────────────
export function ProgressRing({ pct = 0, size = 88, stroke = 7, color = C.sage, label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="ws-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="ws-ring__track" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - clamped / 100)}
          className="ws-ring__value"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label || (
          <span style={{ fontFamily: serif, fontSize: size * 0.24, color: C.ink }}>
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Star field — deterministic night sky ────────────────────
export function Stars({ count = 40, seed = 7 }) {
  const stars = useMemo(() => {
    const out = [];
    const rand = (i) => {
      const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count; i++) {
      out.push({
        left: rand(i) * 100,
        top: rand(i + 999) * 100,
        size: 1 + rand(i + 555) * 2.2,
        delay: rand(i + 1234) * 3,
        dim: rand(i + 777) > 0.6,
      });
    }
    return out;
  }, [count, seed]);

  return (
    <div className="ws-stars" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.dim ? 0.5 : 0.9,
            animationDelay: `${s.delay}s`,
            boxShadow: `0 0 ${s.size * 3}px ${s.dim ? 0 : 1}px rgba(255,233,168,0.5)`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ws-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="ws-modal" style={{ maxWidth: width || 440 }} role="dialog" aria-modal="true">
        {title && (
          <h3
            style={{
              fontFamily: serif,
              fontWeight: 400,
              fontSize: 22,
              color: C.ink,
              marginBottom: 12,
            }}
          >
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}

// ─── Motif — celestial emblems for fortune cards ─────────────
export function Motif({ motif = "star", color = C.star, size = 64, style }) {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 2.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      {motif === "star" && (
        <>
          <path {...common} d="M50 18 L55 43 L50 46 L45 43 Z M50 82 L55 57 L50 54 L45 57 Z M18 50 L43 45 L46 50 L43 55 Z M82 50 L57 55 L54 50 L57 45 Z" strokeWidth={2.2} />
          <path {...common} d="M50 30 C54 42 58 46 70 50 C58 54 54 58 50 70 C46 58 42 54 30 50 C42 46 46 42 50 30 Z" />
          <path {...common} d="M50 12 L53 16 L50 20 L47 16 Z M88 50 L84 53 L80 50 L84 47 Z M12 50 L16 47 L20 50 L16 53 Z M50 80 L53 84 L50 88 L47 84 Z" strokeWidth={2} />
        </>
      )}
      {motif === "moon" && (
        <>
          <path {...common} d="M64 18 A36 36 0 1 0 64 82 A28 28 0 1 1 64 18 Z" />
          <circle {...common} cx="72" cy="30" r="2.4" fill={color} stroke="none" />
          <circle {...common} cx="80" cy="46" r="1.8" fill={color} stroke="none" />
          <circle {...common} cx="70" cy="70" r="2" fill={color} stroke="none" />
        </>
      )}
      {motif === "sun" && (
        <>
          <circle {...common} cx="50" cy="50" r="17" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              {...common}
              strokeWidth={2}
              x1={50 + 24 * Math.cos((a * Math.PI) / 180)}
              y1={50 + 24 * Math.sin((a * Math.PI) / 180)}
              x2={50 + 32 * Math.cos((a * Math.PI) / 180)}
              y2={50 + 32 * Math.sin((a * Math.PI) / 180)}
            />
          ))}
          <circle {...common} cx="50" cy="50" r="7" fill={color} stroke="none" />
        </>
      )}
      {motif === "compass" && (
        <>
          <circle {...common} cx="50" cy="50" r="30" />
          <circle {...common} cx="50" cy="50" r="22" strokeWidth={1.4} strokeDasharray="3 4" />
          <path {...common} d="M50 28 L58 50 L50 72 L42 50 Z" />
          <path {...common} d="M50 28 L50 72 M42 50 L58 50" strokeWidth={1.4} />
          <circle {...common} cx="50" cy="50" r="3" fill={color} stroke="none" />
        </>
      )}
      {motif === "wave" && (
        <>
          <path {...common} d="M14 40 C 26 28, 38 52, 50 40 C 62 28, 74 52, 86 40" />
          <path {...common} d="M14 56 C 26 44, 38 68, 50 56 C 62 44, 74 68, 86 56" />
          <path {...common} d="M14 72 C 26 60, 38 84, 50 72 C 62 60, 74 84, 86 72" />
        </>
      )}
      {motif === "lantern" && (
        <>
          <path {...common} d="M40 14 H60" />
          <path {...common} d="M44 14 V24 M56 14 V24" />
          <path {...common} d="M38 24 H62 V38 A12 12 0 0 1 38 38 Z" />
          <path {...common} d="M42 38 H58 V52 A8 8 0 0 1 42 52 Z" />
          <path {...common} d="M42 52 H58 L54 86 H46 Z" />
          <path {...common} d="M38 38 A12 12 0 0 0 62 38" strokeWidth={1.6} opacity={0.6} />
        </>
      )}
      {motif === "sprout" && (
        <>
          <path {...common} d="M50 86 V48" />
          <path {...common} d="M50 62 C 34 62, 28 48, 30 36 C 42 36, 50 46, 50 62 Z" />
          <path {...common} d="M50 72 C 62 70, 70 58, 70 44 C 60 44, 52 54, 50 66 Z" />
          <circle {...common} cx="50" cy="86" r="2.4" fill={color} stroke="none" />
        </>
      )}
      {motif === "anchor" && (
        <>
          <circle {...common} cx="50" cy="30" r="8" />
          <path {...common} d="M50 38 V84 M50 40 C50 52 40 56 32 56 M50 40 C50 52 60 56 68 56" />
          <path {...common} d="M30 68 H70" />
          <path {...common} d="M24 56 C24 60 26 62 30 62 M76 56 C76 60 74 62 70 62" />
        </>
      )}
      {motif === "flame" && (
        <>
          <path {...common} d="M50 14 C 60 34, 74 42, 74 60 A24 24 0 0 1 26 60 C 26 44, 38 34, 50 14 Z" />
          <path {...common} d="M50 38 C 54 48, 62 52, 62 60 A12 12 0 0 1 38 60 C 38 52, 46 48, 50 38 Z" />
        </>
      )}
      {motif === "tree" && (
        <>
          <path {...common} d="M50 82 V58" />
          <path {...common} d="M50 76 C 30 78, 26 62, 36 52 C 26 48, 30 32, 44 34 C 46 22, 62 22, 66 32 C 78 30, 82 46, 70 54 C 78 62, 72 78, 50 76 Z" />
          <path {...common} d="M38 70 H62" strokeWidth={1.6} />
        </>
      )}
      {motif === "tide" && (
        <>
          <path {...common} d="M50 14 C 60 24, 66 32, 66 42 A16 16 0 0 1 34 42 C 34 32, 40 24, 50 14 Z" />
          <path {...common} d="M10 62 C 20 52, 30 72, 40 62 C 50 52, 60 72, 70 62 C 80 52, 90 72, 92 62" />
          <path {...common} d="M10 78 C 20 68, 30 88, 40 78 C 50 68, 60 88, 70 78 C 80 68, 90 88, 92 78" />
        </>
      )}
      {motif === "dawn" && (
        <>
          <path {...common} d="M50 40 A24 24 0 0 1 50 78" />
          <path {...common} d="M50 18 V28" />
          <path {...common} d="M30 30 L37 37 M70 30 L63 37" />
          <path {...common} d="M14 78 H86" />
          <path {...common} d="M22 68 H78" strokeWidth={1.6} />
        </>
      )}
      {motif === "lotus" && (
        <>
          <path {...common} d="M50 84 C 42 70 32 62 22 60 C 28 50 40 50 50 60 C 44 48 40 40 36 34 C 46 36 52 44 54 54 C 56 44 62 36 72 38 C 68 44 62 50 56 58 C 66 52 74 54 78 62 C 68 64 58 70 50 84 Z" />
          <path {...common} d="M50 60 V 30" />
          <path {...common} d="M50 30 C 48 24 48 20 50 16 C 52 20 52 24 50 30 Z" />
        </>
      )}
      {motif === "butterfly" && (
        <>
          <path {...common} d="M50 36 V 72" />
          <path {...common} d="M50 40 C 38 34 24 36 20 26 C 32 22 42 26 50 40 Z" />
          <path {...common} d="M50 40 C 62 34 76 36 80 26 C 68 22 58 26 50 40 Z" />
          <path {...common} d="M50 54 C 40 60 28 62 24 72 C 34 76 44 68 50 56 Z" />
          <path {...common} d="M50 54 C 60 60 72 62 76 72 C 66 76 56 68 50 56 Z" />
          <path {...common} d="M50 36 C 48 26 46 20 44 14 M50 36 C 52 26 54 20 56 14" />
        </>
      )}
      {motif === "feather" && (
        <>
          <path {...common} d="M34 84 L 48 70" />
          <path {...common} d="M46 72 C 58 62 72 52 78 26 C 66 24 54 32 46 48 C 40 58 36 70 34 84 Z" />
          <path {...common} d="M46 72 C 52 60 60 48 68 38" strokeWidth={1.6} />
        </>
      )}
      {motif === "crescent" && (
        <>
          <path {...common} d="M62 18 A 34 34 0 1 0 62 82 A 26 26 0 1 1 62 18 Z" />
          <path {...common} d="M42 30 L 45 38 L 53 40 L 46 44 L 48 52 L 42 47 L 36 52 L 38 44 L 31 40 L 39 38 Z" fill={color} stroke="none" />
        </>
      )}
      {motif === "mountain" && (
        <>
          <path {...common} d="M14 78 L 38 40 L 50 58 L 60 46 L 86 78 Z" />
          <path {...common} d="M14 78 H 86" />
          <circle {...common} cx="50" cy="28" r="4.5" fill={color} stroke="none" />
          <path {...common} d="M50 23 V 16 M50 33 V 38" strokeWidth={1.6} />
        </>
      )}
      {motif === "meditate" && (
        <>
          <circle {...common} cx="50" cy="27" r="9" />
          <path {...common} d="M45.5 25 q4.5 -3.5 9 0" strokeWidth={1.8} />
          <path {...common} d="M50 36 v9" />
          <path {...common} d="M35 50 q15 -9 30 0 q6 3 6 9 q0 6 -5 9 q-15 8 -32 0 q-5 -3 -5 -9 q0 -6 6 -9 Z" />
          <path {...common} d="M31 52 q-9 15 1 25" />
          <path {...common} d="M69 52 q9 15 -1 25" />
          <path {...common} d="M29 58 q-6 10 -1 27" />
          <path {...common} d="M71 58 q6 10 1 27" />
          <path {...common} d="M29 84 q21 8 42 0" />
          <path {...common} d="M29 84 q4 4 12 3 M71 84 q-4 4 -12 3" strokeWidth={1.6} />
        </>
      )}
      {motif === "starburst" && (
        <>
          <circle {...common} cx="50" cy="50" r="20" />
          {[0, 30, 60, 90, 120, 150].map((a) => (
            <line
              key={a}
              {...common}
              strokeWidth={2}
              x1={50 + 23 * Math.cos((a * Math.PI) / 180)}
              y1={50 + 23 * Math.sin((a * Math.PI) / 180)}
              x2={50 + 34 * Math.cos((a * Math.PI) / 180)}
              y2={50 + 34 * Math.sin((a * Math.PI) / 180)}
            />
          ))}
          <circle {...common} cx="50" cy="50" r="5" fill={color} stroke="none" />
        </>
      )}
    </svg>
  );
}

// ─── Score ring — the reference's segmented health dial ─────
// A ring broken into colored arcs, each with an icon sitting on its
// arc, and a big number in the center. All data-driven — callers pass
// the segments and the center value; nothing is pre-filled.
export function ScoreRing({ segments = [], value = 0, label = "your space score", size = 200 }) {
  const r = 80;
  const cx = 100;
  const cy = 100;
  const circ = 2 * Math.PI * r;
  const n = segments.length || 1;
  const arc = circ / n;
  const gap = 6; // degrees of breathing room between arcs
  const gapLen = (gap / 360) * circ;
  const segLen = arc - gapLen;

  const iconPos = (i) => {
    const mid = ((i + 0.5) * 360) / n;
    const a = ((mid - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  return (
    <div className="ws-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(27,27,31,0.08)"
          strokeWidth={17}
        />
        {segments.map((s, i) => {
          const rot = (i * 360) / n - 90;
          return (
            <g key={i} transform={`rotate(${rot} ${cx} ${cy})`}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={17}
                strokeLinecap="round"
                strokeDasharray={`${segLen} ${circ - segLen}`}
                strokeDashoffset={-gapLen / 2}
                opacity={s.active === false ? 0.22 : 1}
              />
            </g>
          );
        })}
        {segments.map((s, i) => {
          if (!s.icon) return null;
          const p = iconPos(i);
          const Icon = s.icon;
          return (
            <g
              key={`i${i}`}
              transform={`translate(${p.x} ${p.y})`}
              opacity={s.active === false ? 0.45 : 1}
            >
              <circle r="13" fill="#fff" opacity="0.9" />
              <Icon
                x={-7}
                y={-7}
                width={14}
                height={14}
                strokeWidth={2}
                color={s.color}
              />
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: serif, fontWeight: 400, fontSize: size * 0.13, color: C.ink, lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: size * 0.052, color: C.muted, maxWidth: size * 0.55 }}>{label}</span>
      </div>
    </div>
  );
}

// ─── Aura — a soft, slowly-drifting glow blob ───────────────
// Place behind glass cards at low opacity; pointer-events: none.
export function Aura({ tone = "gold", size = 360, top, left, right, bottom, style }) {
  return (
    <div
      aria-hidden="true"
      className={`ws-aura ws-aura--${tone}`}
      style={{ width: size, height: size, top, left, right, bottom, ...style }}
    />
  );
}
