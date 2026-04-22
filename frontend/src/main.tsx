import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Suppress Monaco Editor internal "Canceled" Promise errors
window.addEventListener("unhandledrejection", (e) => {
  if (e.reason && (e.reason.name === "Canceled" || e.reason.message === "Canceled")) {
    e.preventDefault();
  }
});

const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const argStr = args.map(a => (typeof a === 'object' && a !== null ? (a.message || a.name || JSON.stringify(a)) : String(a))).join(' ');
  if (argStr.includes("Canceled") || argStr.includes("Cancel") || argStr.includes("canceled")) {
    return; // Completely suppress any monaco cancellation logs
  }
  originalConsoleError(...args);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
