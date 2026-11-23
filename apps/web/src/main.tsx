import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource-variable/jetbrains-mono";
import App from "./App.tsx";
import "./lib/agent";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("The app root element is missing.");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
