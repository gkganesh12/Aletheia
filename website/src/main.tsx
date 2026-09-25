import { MotionConfig } from "framer-motion";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ToastProvider } from "@/components/shared/Toast";
import App from "./App";
import "./index.css";

// React 19 owns route metadata after mount; remove the static first-load fallback.
document
  .querySelectorAll("[data-initial-seo]")
  .forEach((node) => node.remove());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <App />
        </ToastProvider>
      </MotionConfig>
    </HelmetProvider>
  </StrictMode>,
);
