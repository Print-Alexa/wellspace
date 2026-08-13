import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// WellSpace fonts — DM Serif Display (headlines), Inter (UI),
// Playwrite HR Lijeva (wordmark). These MUST be imported for the
// @font-face declarations to exist; without them everything falls
// back to Georgia/cursive/system fonts.
import "@fontsource/dm-serif-display";
import "@fontsource/dm-serif-display/400-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playwrite-hr-lijeva";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
