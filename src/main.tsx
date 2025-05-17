import { Analytics } from "@vercel/analytics/react";
import { Ion } from "cesium";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { config } from "@/config/config.ts";

import App from "./App.tsx";

Ion.defaultAccessToken = config.ionAccessToken;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Analytics />
    <App />
  </StrictMode>
);
