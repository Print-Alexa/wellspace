# WellSpace

An anonymous student wellbeing & habit-tracking app. Warm, calm, motivating —
**Headspace meets tarot**. Habits, mood check-ins, daily fortune cards, an
anonymous community, and accountability partners — with no public identity,
ever.

The space is illustrated, not sterile: film grain over warm paper and photos,
soft drifting **aura light** behind glass cards, and hand-drawn celestial
motifs (lotus, butterfly, feather, crescent, starburst…) woven through every
screen — while keeping glassmorphism, icon-only UI, and the no-mock-data rule.

Design system & full spec: **[DESIGN.md](./DESIGN.md)**

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # eslint
```

## Reviewing the design

- Open the app: **Loading → Landing → Auth → Onboarding → Dashboard**.
- The layout is responsive via CSS: glass sidebar on desktop, top bar +
  floating bottom tab bar ≤1023px. Resize the window to see both breakpoints.
- Google sign-in falls back to a temporary anonymous session when there's no
  live backend, so every screen works offline.

## Structure

```
src/
  constants.js          # design tokens, moods, build/break habit library, 12-card fortune deck, streaks
  index.css             # global system: primitives, motion, responsive shell rules
  firebase.js           # Firebase config (auth + firestore)
  lib/
    db.js               # data facade: Firestore <-> local session fallback
    session.js          # anonymous session shape, recovery-code store
    toast.js            # toast emitter
  components/
    ui.jsx              # Button, Card, Chip, Toggle, Avatar, EmptyState, ProgressRing, Modal, Stars, Motif, Aura, DashedPhoto…
    VennLogo.jsx        # the mark: two circles, four-point star
    LoadingScreen.jsx
    Toaster.jsx
  pages/
    LandingPage.jsx     # marketing
    AuthScreen.jsx      # Google / recovery code
    OnboardingScreen.jsx
    Dashboard.jsx       # app shell (sidebar, tabs, mobile nav)
    Sidebar.jsx         # desktop nav
    nav.js
    DashboardScreen.jsx # mood, streaks, fortune preview, community
    HabitTrackerScreen.jsx
    MoodLogScreen.jsx
    FortuneCardScreen.jsx
    CommunityFeedScreen.jsx
    AccountabilityPartnerScreen.jsx
    SettingsScreen.jsx
```

## Firebase wiring

- **Auth**: `signInWithPopup` → mapped to an anonymous profile
  (`users/{firebaseUid}` with a generated display name — the Google identity
  is never stored or rendered). Recovery codes are keys to the same shape.
- **Data**: Firestore collections `users/{uid}`, `recoveryCodes/{code}`,
  `posts/{postId}`, `posts/{postId}/replies`.
- **Offline**: when Firebase can't be reached, `src/lib/db.js` transparently
  uses a device-local session (`localStorage`) with the exact same API — so
  the app is fully reviewable and still production-ready.

## Privacy commitments

- No real names or emails — ever. Anonymous display names are auto-generated
  (`QuietMaple`, `GentleFern`, …).
- No pre-filled mock data: new users get a genuinely empty space; everything
  they see comes from their onboarding answers or their own actions.
- Users can export everything (JSON) and erase their space completely.
