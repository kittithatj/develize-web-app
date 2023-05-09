import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Personnel from "./pages/Personnel";
import Skill from "./pages/Skill";
import Project from "./pages/Project";
import Navbar from "./components/common/Navbar";
import "./App.css";

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "personnel",
        element: <Personnel />,
      },
      {
        path: "skill",
        element: <Skill />,
      },
      {
        path: "project",
        element: <Project />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);