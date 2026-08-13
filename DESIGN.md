# WellSpace — Design System

> Warm, calm, motivating. **Headspace meets tarot** — grounded, intentional,
> never clinical. WellSpace should feel like a safe, cozy digital room:
> candlelight paper, deep night skies, and a quiet gold star in between.

This document is the design source of truth. The implementation lives in
`src/constants.js` (tokens + data), `src/index.css` (primitives), and
`src/components/ui.jsx` (components). Everything below can be rebuilt in Figma
as color styles, text styles, and components — see the [Figma build guide](#figma-build-guide).

---

## 1 · Brand

| Asset | Spec |
|---|---|
| **Wordmark** | “WellSpace” set in **Playwrite HR Lijeva** (script, 400). Used for the logo lockup, sidebar brand, nav, and loading screen. Never used for body copy. |
| **Mark** | Two overlapping circles (Venn) with a four-point star in the overlap — *a meeting of self and space, with a quiet spark in between*. Inline SVG: `src/components/VennLogo.jsx`, favicon `public/favicon.svg`. |
| **Tagline** | “Your quiet corner.” / “A quiet space for your wellbeing.” |

## 2 · Color styles

All values in `src/constants.js` (`C` object) and CSS variables in `src/index.css`.

### The five-color palette
| Token | Hex | Use |
|---|---|---|
| `offWhite` / `cream` | `#FAFAF8` | **base background** — the warm room |
| `butter` / `buttercream` | `#FFF8BD` | **cards, surfaces** — buttercream glass |
| `orange` / `clay` | `#F26200` | **Burnt Orange — primary buttons, accents** |
| `blue` / `skySoft` | `#D6E8FD` | **Baby Blue — secondary sections** |
| `olive` / `sage` | `#6B7A3A` | **Olive Green — secondary buttons, accents** |

### Paper & ink (the “bright room”)
| Token | Hex | Use |
|---|---|---|
| `paper` | `#FFFDF4` | warm-white sheets, inputs, glass fills |
| `sand` | `#F2EFE1` | soft warm section washes, avatars, subtle fills |
| `ink` | `#33291F` | primary text — warm espresso |
| `muted` | `#6F6350` | secondary text |
| `faint` | `#A89A82` | tertiary text, placeholders |
| `line` | `rgba(51,41,31,0.12)` | hairline borders |
| `cardLine` | `rgba(255,253,244,0.7)` | glass edge highlight |

### Derived tints & card tones
| Token | Hex | Use |
|---|---|---|
| `claySoft` / `orangeSoft` | `#FFE9DB` | peach wash — active nav, soft buttons |
| `sageSoft` / `oliveSoft` | `#EBEFDB` | olive wash — pills, section tints |
| `gold` / `butterDeep` | `#C08A1C` | butter-gold — on-dark highlights, happy mood |
| `goldSoft` | `#FBF0C4` | pale butter tint |
| `blueDeep` / `sky` | `#6E97C9` | readable blue for icons & lines on light |
| `lavender` | `#9B8FBD` | tired (moods only) |
| `rose` | `#CE7A63` | stressed / gentle warning |
| `danger` | `#BF3A1E` | destructive actions only |
| butter / sage / sky / pink / lavender cards | white glass with a faint tint per tone | clear, airy surfaces — colour lives in icons and pills, not card fills (`C.*Card` border colors) |

### Night (the “tarot hours”) — deep warm cocoa, buttercream starlight
| Token | Hex | Use |
|---|---|---|
| `night` | `#241812` | loading screen, fortune card, CTA band, dark cards |
| `night2` | `#33251A` | night gradient mid |
| `night3` | `#45352A` | deepest night stop |
| `star` | `#FFE9A8` | text/lines on dark — buttercream starlight |
| `gold` | `#C08A1C` | accent — star gold, on-dark highlights |

**Mood palette** (emotion picker, chart, harmonized with the brand): calm
`#6E97C9` · content `#6B7A3A` · happy `#C08A1C` · grateful `#F26200` · tired
`#9B8FBD` · anxious `#D97B2B` · low `#6C7A99` · stressed `#CE7A63`.

### Gradients, grain & aura
- Page: `radial-gradient(130% 110% at 50% 0%, #FDFDF8, #FAFAF8 48%, #F1EEE1)`
- Night: `linear-gradient(150deg, #241812, #33251A)`
- Film grain: subtle SVG turbulence painted **into background layers only** —
  never over cards or text (`--grain`, `pageBg`, `body`). A second whisper of
  grain (`ws-photo-grain`) sits on photos so pictures read like warm prints.
- **Aura light**: soft, slowly-drifting blurred glow blobs (`Aura` + `ws-aura`,
  20s drift) in burnt orange / olive / baby blue / rose / starlight behind
  glass cards. One or two per screen, low opacity, never over text — the warm
  haze of the space.

## 3 · Text styles

| Style | Font | Size / Line | Use |
|---|---|---|---|
| Display | DM Serif Display 400 | `clamp(42px, 5.6vw, 68px)` / 1.06 | hero headline |
| H1 | DM Serif Display 400 | `clamp(28px, 3.6vw, 38px)` / 1.2 | screen titles |
| H2 | DM Serif Display 400 | 20px / 1.25 | card titles |
| H3 | DM Serif Display 400 | 17–24px | emphasis |
| Body | Inter 400 | 14–16px / 1.65 | copy |
| Label | Inter 500–600 | 12.5–14px | buttons, chips, rows |
| Caption | Inter 400–500 | 10–12px / 1.55 | meta, dates, footnotes |
| Eyebrow | Inter 700, `0.22em` caps | 11px | section kickers |
| Affirmation | DM Serif Display **italic** | 19–23px / 1.55 | fortune card text |
| Script | Playwrite HR Lijeva 400 | 17–46px | wordmark only |

## 4 · Shape, depth, spacing

- Radii: **24 / 18 / 12** px; buttons & chips **999** (pill). Generous whitespace.
- Shadows: **minimal**. `soft` = 1px hairline + 10px/28px @ 7% ink; `lift` for hover;
  `night` for dark surfaces. No harsh drop shadows.
- **Glass morphism**: `rgba(255,253,248,0.72)` + `backdrop-filter: blur(18px)` on
  cards (with a 1px inner highlight and a whisper of warm gold in the deep shadow);
  nav bars blur 20px. Night glass uses star-tinted fills.
- Spacing rhythm: 8/12/14/16/18/20/22/24/28/32/36/40/48.

## 5 · Components

Implemented in `src/components/ui.jsx` + `src/index.css`.

| Component | Notes |
|---|---|
| `Button` | pill, variants: primary (clay), night, gold, ghost, soft, danger; sizes sm/lg; `:active` scale .97; hover lift + soft glow. |
| `Card` | glass (default), sand, night (with starfield). 1px border, no harsh shadow. |
| `Chip` | pill toggle, clay-active state. |
| `Toggle` | 46×26 pill switch, spring thumb, sage-on. |
| `Avatar` | anonymous gradient disc (6 warm gradients, seeded by name). No photos. |
| `EmptyState` | dashed-icon art + serif title + muted desc + CTAs. The brand-new experience. |
| `ProgressRing` | SVG ring, animated dashoffset, serif % label. |
| `Stars` | deterministic starfield for night surfaces (twinkle). |
| `Motif` | 18 celestial emblems (star, moon, sun, compass, wave, lantern, sprout, anchor, flame, tree, tide, dawn, **lotus, butterfly, feather, crescent, mountain, starburst**) — gold line art for the fortune deck and illustrated accents across screens. |
| `Aura` | soft blurred glow blob (gold/sage/lavender/rose/night) with a slow 20s drift — place behind glass cards at low opacity. |
| `Modal` | glass backdrop blur, paper sheet, Escape/backdrop close. |
| `Toaster` | night pill toast, bottom-center. |
| `DashedPhoto` | dashed placeholder for imagery that comes later. |
| Habit check | 30px circle; check **draws itself in** via stroke-dashoffset. |

## 6 · The 11 screens

| # | Screen | Key design notes |
|---|---|---|
| 1 | **Loading** | dark photo + night veil, animated Venn (circles draw in, star pops & twinkles), script wordmark reveal, tagline, tap-to-enter. ~4s auto. |
| 2 | **Landing** | glass pill nav; hero with real photo (yoga.png, film-grain overlay) + floating glass cards + a floating lotus illustration; aura glow blobs behind hero, features, how-it-works, community and CTA; night CTA band with starfield and inner auras; dashed placeholders for future imagery. |
| 3 | **Auth** | split layout (photo panel / paper panel). Exactly two options: **Continue with Google** and **Stay anonymous with a recovery code**. Code flow: enter / generate / save-with-blur-copy. |
| 4 | **Onboarding** | 4 steps: habits to track → daily intention → mood baseline → ready. The habit quiz is split into **Habits to build** (add to your days) and **Habits to release** (let go of) — the two families at the heart of the app. Answers shape the dashboard. Progress hairline top. |
| 5 | **Dashboard** | greeting + intention pill; mood summary (baseline from onboarding → 7-day bars); fortune preview (night card); today's habits with streaks + progress ring; community whispers; partner teaser. All empty-state-safe. |
| 6 | **Habit tracker** | stat cards (today / best streak / week %), animated check-off, week dots, streak flames, add/remove with confirm modal. |
| 7 | **Mood log** | 8-emotion picker (icon + hue), optional note, 7-day line/area chart, legend, “gentle note” insight derived from onboarding answers + history. |
| 8 | **Fortune card** | **full-screen night** scene; real celestial photograph on the card face (gradient fallback offline), gold emblem, foil corners; flip reveals the **italic serif affirmation**; per-user daily draw (seeded by uid + date); save-card. |
| 9 | **Community** | compose → share anonymously; post cards (gradient avatars, reactions as pills, expandable replies); empty state for brand-new users. |
| 10 | **Partner** | find-a-partner flow (honest “no match yet” for new users); matched view = partner card + chat + shared goals check-off. |
| 11 | **Settings** | anonymous profile (rename), recovery-code manage (blur reveal / copy / regenerate), notification toggles + time, privacy (export JSON / erase all), about. |

## 7 · States & empty states

- **No pre-filled mock data.** New users land on a genuinely empty space:
  dashboard welcome card, empty habit list, quiet community, no partner.
- Everything visible comes from the onboarding quiz (habits, intention, mood
  baseline) or the user's own actions.
- Every list/feed has a designed empty state with a clear next action.

## 8 · Responsive & motion

- **Web-first, mobile-responsive.** Desktop: glass sidebar (248px) + content
  column. ≤1023px: top bar + floating bottom tab bar (Home · Habits · Mood ·
  Fortune · More → Community/Partner/Settings sheet).
- Motion: 0.16–0.5s, `cubic-bezier(0.22,1,0.36,1)`. Micro-interactions on
  hover (lift, glow, check-draw, star twinkle, card flip 0.9s). Aura blobs
  drift gently on a 20s loop; the fortune cover motif “breathes” in place
  (5s scale, never drifting over the artwork). `prefers-reduced-motion`
  fully respected.

## 9 · Privacy & data model

- Anonymous only. Google sign-in maps to an auto-generated anonymous ID —
  real name/email never stored or rendered (`src/lib/db.js`).
- Firestore collections: `users/{uid}` (session), `recoveryCodes/{code}`,
  `posts/{postId}` + `posts/{postId}/replies`.
- When Firebase is unreachable (local review), `db.js` transparently falls
  back to a device session so the whole flow works offline.

## 10 · Figma build guide

1. **Styles** — create color styles from §2, text styles from §3.
2. **Variables** — paste the token tables into Figma Variables (mode “Light”).
3. **Components** — Button (variants), Card (3 tones), Chip, Toggle, Avatar,
   EmptyState, ProgressRing, Stars, Modal, Toaster, Motif (12 variants),
   Habit check. Auto-layout, corner radius 24/18/12/999.
4. **Frames** — 11 screens × 2 breakpoints (Desktop 1440, Mobile 390).
   Reuse the same component instances; swap sidebar → bottom tabs.
   Layer aura blobs behind the main surfaces and drop the grain texture over
   background fills and photos (blend mode: multiply/overlay).
5. **Prototype** — link flows: Loading → Landing → Auth → Onboarding →
   Dashboard → each app screen; fortune flip; partner match; settings modals.
6. **Assets** — export `VennLogo.svg` for all brand placements.

---

*Generated as part of the WellSpace design build. The interactive prototype in
this repo IS the design — every token, component and screen above is live.*
