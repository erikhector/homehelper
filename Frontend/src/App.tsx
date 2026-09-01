import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";

import type { PaletteMode } from "@mui/material";

import { routes } from "./routes/Routes";
import queryClient from "./services/queryClient";
import createAppTheme from "./styles/theme";
import { ThemeModeContext } from "./styles/ThemeModeContext";

import "./styles/Site.css";

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_BASE_URL
});

export default function App() {
  const [mode, setMode] = useState<PaletteMode>(() => (localStorage.getItem("theme-mode") === "dark" ? "dark" : "light"));
  const toggleMode = () =>
    setMode((currentMode) => {
      const nextMode = currentMode === "light" ? "dark" : "light";
      localStorage.setItem("theme-mode", nextMode);

      return nextMode;
    });

  return (
    <HelmetProvider>
      <ThemeModeContext.Provider value={{ mode, toggleMode }}>
        <ThemeProvider theme={createAppTheme(mode)}>
          <CssBaseline />
          <Helmet titleTemplate={`%s | ${import.meta.env.VITE_APP_TITLE}`} />
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </HelmetProvider>
  );
}
