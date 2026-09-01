import { Helmet, HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router";

import { routes } from "./routes/Routes";

import "./styles/Site.css";

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_BASE_URL
});

export default function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate={`%s | ${import.meta.env.VITE_APP_TITLE}`} />
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
