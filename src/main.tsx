import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./lib/theme-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="zaplink-theme">
      <BrowserRouter>
        <App />
        <Toaster richColors />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
