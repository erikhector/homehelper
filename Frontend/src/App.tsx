import { Helmet, HelmetProvider } from "react-helmet-async";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";

import { routes } from "./routes/Routes";
import queryClient from "./services/queryClient";
import theme from "./styles/theme";

import "./styles/Site.css";

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_BASE_URL
});

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Helmet titleTemplate={`%s | ${import.meta.env.VITE_APP_TITLE}`} />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
