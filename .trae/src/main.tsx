import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PodcastStudio from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PodcastStudio />
  </StrictMode>
);
