import type { RouteObject } from "react-router";

import About from "Src/components/About/Index";
import Error401 from "Src/components/Errors/Error401";
import Error404 from "Src/components/Errors/Error404";
import ErrorBoundary from "Src/components/Errors/ErrorBoundary";
import Home from "Src/components/Home/Index";
import Layout from "Src/components/Layout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    children: [
      { path: "/", element: <Home />, index: true },
      { path: "*", element: <Error404 /> },
      { path: "unauthorized", element: <Error401 /> },
      { path: "about", element: <About /> }
    ]
  }
];
