import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./react/index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./react/App.tsx";
import { AppWrapper } from "./react/components/common/PageMeta.tsx";
import { ThemeProvider } from "./react/context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
