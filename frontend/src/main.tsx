import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AppProviders from "./components/AppProviders/AppProviders.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </StrictMode>
);
