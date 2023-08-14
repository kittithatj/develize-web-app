import React, { useState } from "react";
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
import Login from "./pages/Login";
import PersonnelEdit from "./pages/PersonnelEdit";
import PersonnelInfo from "./pages/PersonnelInfo";
import Register from "./pages/Register"

const AppLayout = () => {

  const [user, setUser] = useState({});

  return <>
    <Navbar user={user} setUser={setUser} />
    <Outlet context={[user, setUser]} />
  </>
};

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
        path: "personnel/edit/:id",
        element: <PersonnelEdit />,
      },
      {
        path: "personnel/:id",
        element: <PersonnelInfo />,
      },
      {
        path: "skill",
        element: <Skill />,
      },
      {
        path: "project",
        element: <Project />,
      },
      {
        path: "*",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "Register",
        element: <Register />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);