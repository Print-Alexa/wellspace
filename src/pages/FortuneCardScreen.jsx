import { useState } from "react";
import {
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  C,
  serif,
  sans,
  SHADOW,
  fortuneForToday,
  longDate,
} from "../constants";
import { Motif, Stars } from "../components/ui";
import { toast } from "../lib/toast";
import * as db from "../lib/db";
import cardArt from "../assets/fc.png";

// The user's own card artwork, with a cream gradient as an automatic
// fallback layer underneath, so the card is never empty.
const CARD_ART = `url(${cardArt}) center/cover no-repeat, linear-gradient(165deg, #FDF6E3 0%, #F3E7C6 55%, #E9DBAF 100%)`;

export default function FortuneCardScreen({ user, onNavigate }) {
  const [flipped, setFlipped] = useState(false);
  const fortune = fortuneForToday(user?.uid || "");
  const saved = user?.savedCards?.includes(fortune.id) || false;

  const saveCard = () => {
    db.saveCard(fortune.id);
    toast(
      saved
        ? "Card already saved"
        : "Saved — it's waiting for you in your space",
      Sparkles,
    );
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 40px)",
        borderRadius: 28,
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${C.night} 0%, ${C.night2} 60%, ${C.night3} 100%)`,
        color: C.star,
        display: "flex",
        flexDirection: "column",
        padding: "30px 24px 36px",
        boxShadow: SHADOW.night,
      }}
    >
      <Stars count={56} seed={17} />
      {/* drifting nebula blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(40% 30% at 20% 15%, rgba(160,139,199,0.16) 0%, transparent 70%), radial-gradient(45% 35% at 85% 80%, rgba(110,145,181,0.14) 0%, transparent 70%), radial-gradient(30% 25% at 70% 20%, rgba(201,151,63,0.08) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* header */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <button
          onClick={() => onNavigate("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            background: "rgba(244,222,174,0.08)",
            color: "rgba(244,222,174,0.75)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            padding: "8px 14px",
            borderRadius: 999,
            fontFamily: sans,
          }}
        >
          <ArrowLeft size={14} strokeWidth={1.8} /> Dashboard
        </button>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(244,222,174,0.5)",
            }}
          >
            Daily card
          </p>
          <p
            style={{
              fontSize: 12.5,
              color: "rgba(244,222,174,0.75)",
              marginTop: 2,
            }}
          >
            {longDate()}
          </p>
        </div>
      </div>

      {/* title */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          marginBottom: 26,
        }}
      >
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 40px)",
            color: "#FFF6E3",
            lineHeight: 1.15,
          }}
        >
          {flipped ? fortune.title : "Your card, today"}
        </h1>
        <p
          style={{
            fontSize: 13.5,
            color: "rgba(244,222,174,0.6)",
            marginTop: 6,
            fontStyle: "italic",
            fontFamily: serif,
          }}
        >
          {flipped
            ? "carry this with you"
            : "drawn fresh for you — tap to reveal"}
        </p>
      </div>

      {/* the card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 0 20px",
          perspective: 1400,
        }}
      >
        <div
          style={{
            width: "min(320px, 82vw)",
            aspectRatio: "5 / 8",
            position: "relative",
            cursor: "pointer",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.9s cubic-bezier(0.4, 0.1, 0.2, 1)",
          }}
          onClick={() => setFlipped((f) => !f)}
          role="button"
          aria-label={flipped ? "Flip the card back" : "Reveal today's fortune"}
        >
          {/* ── Front: the celestial picture — kept clean, no veil ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 26,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: CARD_ART,
              boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
              overflow: "hidden",
              border: "1px solid rgba(244,222,174,0.25)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: 18,
                border: "1px solid rgba(244,222,174,0.3)",
              }}
            />
            {/* gold foil corners */}
            {[
              "top: 14px; left: 14px; border-top: 1.5px solid rgba(244,222,174,0.7); border-left: 1.5px solid rgba(244,222,174,0.7); width: 18px; height: 18px; border-top-left-radius: 10px;",
              "top: 14px; right: 14px; border-top: 1.5px solid rgba(244,222,174,0.7); border-right: 1.5px solid rgba(244,222,174,0.7); width: 18px; height: 18px; border-top-right-radius: 10px;",
              "bottom: 14px; left: 14px; border-bottom: 1.5px solid rgba(244,222,174,0.7); border-left: 1.5px solid rgba(244,222,174,0.7); width: 18px; height: 18px; border-bottom-left-radius: 10px;",
              "bottom: 14px; right: 14px; border-bottom: 1.5px solid rgba(244,222,174,0.7); border-right: 1.5px solid rgba(244,222,174,0.7); width: 18px; height: 18px; border-bottom-right-radius: 10px;",
            ].map((pos, i) => (
              <div key={i} style={{ position: "absolute", ...cssObj(pos) }} />
            ))}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
              }}
            >
              <div
                className="ws-breathe"
                style={{ position: "relative" }}
              >
                <Motif motif={fortune.motif} color={C.star} size={72} />
              </div>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.34em",
                  color: "rgba(244,222,174,0.8)",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                WellSpace
              </p>
              <p
                style={{
                  fontSize: 10.5,
                  color: "rgba(244,222,174,0.55)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  animation: "ws-twinkle 2.6s ease-in-out infinite",
                }}
              >
                ✦ tap to reveal ✦
              </p>
            </div>
          </div>

          {/* ── Back: the affirmation — cream card, ink message ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 26,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: `linear-gradient(160deg, #FDF6E3 0%, #F3E7C6 55%, #EADCAE 100%)`,
              boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
              overflow: "hidden",
              border: "1px solid rgba(196,172,60,0.45)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: 18,
                border: "1px solid rgba(196,172,60,0.5)",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "38px 26px",
                textAlign: "center",
              }}
            >
              <Motif
                motif={fortune.motif}
                color="#5C4424"
                size={54}
                style={{ marginBottom: 18 }}
              />
              <p
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.3em",
                  color: "rgba(92,68,36,0.85)",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {fortune.title}
              </p>
              <p
                style={{
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(19px, 4vw, 23px)",
                  lineHeight: 1.55,
                  color: "#5C4424",
                }}
              >
                “{fortune.text}”
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(92,68,36,0.55)",
                  letterSpacing: "0.3em",
                  marginTop: 22,
                }}
              >
                — ✦ —
              </p>
            </div>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                paddingBottom: 18,
              }}
            >
              <p
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.24em",
                  color: "rgba(92,68,36,0.55)",
                  textTransform: "uppercase",
                }}
              >
                your card · {longDate()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* actions */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={saveCard}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 20px",
            borderRadius: 999,
            border: "1px solid rgba(244,222,174,0.3)",
            background: saved
              ? "rgba(201,151,63,0.25)"
              : "rgba(244,222,174,0.1)",
            color: C.star,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: sans,
            transition: "background 0.18s",
          }}
        >
          {saved ? (
            <BookmarkCheck size={15} strokeWidth={1.8} />
          ) : (
            <Bookmark size={15} strokeWidth={1.8} />
          )}
          {saved ? "Saved" : "Save this card"}
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 20px",
            borderRadius: 999,
            border: "none",
            background: "rgba(244,222,174,0.12)",
            color: C.star,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: sans,
          }}
        >
          <RotateCcw size={14} strokeWidth={1.8} />{" "}
          {flipped ? "Back of card" : "Read again"}
        </button>
      </div>

      <p
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          fontSize: 12,
          color: "rgba(244,222,174,0.5)",
          marginTop: 18,
          fontFamily: serif,
          fontStyle: "italic",
        }}
      >
        A new card arrives at dawn — yours alone, drawn for you.
      </p>
    </div>
  );
}

// tiny helper: "top: 0; left: 0" string → object
function cssObj(str) {
  return str
    .split(";")
    .filter(Boolean)
    .reduce((acc, kv) => {
      const [k, ...rest] = kv.split(":");
      const v = rest.join(":").trim();
      const camel = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      acc[camel] = v;
      return acc;
    }, {});
}
