import { useEffect, useState, useRef } from "react";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import AuthScreen from "./pages/AuthScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import Dashboard from "./pages/Dashboard";
import * as db from "./lib/db";
import { applyTheme } from "./lib/darkmode";

export default function App() {
  const [stage, setStage] = useState("loading");
  const [screen, setScreen] = useState("dashboard");
  const skipPushRef = useRef(false); // prevent pushState feedback loop

  // Apply the user's saved theme (session prefs) on mount.
  useEffect(() => {
    applyTheme(!!db.getUser()?.prefs?.darkMode);
  }, []);

  // Initialize screen from URL hash on mount.
  useEffect(() => {
    const hash = window.location.hash.slice(1) || "dashboard";
    setScreen(hash);
  }, []);

  // Update URL hash when screen changes (for browser back/forward support).
  useEffect(() => {
    if (skipPushRef.current) {
      skipPushRef.current = false;
      return;
    }
    window.history.pushState(null, "", `#${screen}`);
  }, [screen]);

  // Listen for browser back/forward button.
  useEffect(() => {
    const handlePopState = () => {
      skipPushRef.current = true; // prevent pushState from running
      const hash = window.location.hash.slice(1) || "dashboard";
      setScreen(hash);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage, screen]);

  const afterLoading = () =>
    setStage(db.getUser()?.onboarded ? "app" : "landing");
  const handleAuth = () =>
    setStage(db.getUser()?.onboarded ? "app" : "onboarding");
  const handleSignOut = async () => {
    await db.resetAuth();
    window.location.hash = "";
    setScreen("dashboard");
    setStage("landing");
  };

  if (stage === "loading") return <LoadingScreen onComplete={afterLoading} />;
  if (stage === "landing")
    return <LandingPage onGetStarted={() => setStage("auth")} />;
  if (stage === "auth")
    return (
      <AuthScreen onAuth={handleAuth} onBack={() => setStage("landing")} />
    );
  if (stage === "onboarding")
    return <OnboardingScreen onComplete={() => setStage("app")} />;

  return (
    <Dashboard
      screen={screen}
      onNavigate={setScreen}
      onSignOut={handleSignOut}
    />
  );
}
