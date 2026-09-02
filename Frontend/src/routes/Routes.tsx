import type { RouteObject } from "react-router";

import About from "Src/components/About/Index";
import Error401 from "Src/components/Errors/Error401";
import Error404 from "Src/components/Errors/Error404";
import ErrorBoundary from "Src/components/Errors/ErrorBoundary";
import Home from "Src/components/Home/Index";
import Landing from "Src/components/Landing/Index";
import Layout from "Src/components/Layout";
import Login from "Src/components/Login/Index";
import Signup from "Src/components/Signup/Index";
import Templates from "Src/components/Templates/Index";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <Landing /> },
      { path: "children", element: <Home /> },
      { path: "templates", element: <Templates /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "*", element: <Error404 /> },
      { path: "unauthorized", element: <Error401 /> },
      { path: "about", element: <About /> }
    ]
  }
];
