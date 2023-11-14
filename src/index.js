/* eslint-disable no-sparse-arrays */
import React, { useEffect, useState } from "react";
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
import { interceptor } from "./interceptor";
import PersonnelAssessment from "./pages/PersonnelAssessment";
import CreatePersonnel from "./pages/CreatePersonnel";
import SnackbarComponent from "./components/SnackbarComponent";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";

const AppLayout = () => {
  
  //--------SnackBar---------
  const [isOpenSnackbar, setIsOpenSnackbar] = React.useState(false);
  const [snackbar, setSnackbar] = useState({
    status: '',
    message: ''
  });

  const openSnackbar = (snackbar) => {
      setSnackbar({
        status: snackbar.status,
        message: snackbar.message
      })
      setIsOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setIsOpenSnackbar(false);
  };

  const htmlSnackBar = <SnackbarComponent 
  autoHideDuration={5000}
  open={isOpenSnackbar} 
  handleClose={handleCloseSnackbar} 
  severity={snackbar.status} 
  message={snackbar.message}
  />

  //--------SnackBar---------

  interceptor();

  const [user, setUser] = useState({});

  const getUserIfTokenExist = () => {
    const token = localStorage.getItem('token');
    if (token) {
      return user
    }else{
      return []
    }
  }

  useEffect(() => {
    localStorage?.getItem('user') && setUser(JSON.parse(localStorage.getItem('user')));
  },[])

  return <>
    <Navbar user={getUserIfTokenExist()} setUser={setUser} />
    <Outlet context={[user, setUser, openSnackbar]} >
    </Outlet>
    {htmlSnackBar}
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
        path: "personnel/assess/:id",
        element: <PersonnelAssessment />,
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
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      ,
      {
        path: "personnel/create",
        element: <CreatePersonnel />,
      },
      ,
      {
        path: "project/createproject",
        element: <CreateProject/>,
      },
      ,
      {
        path: "project/projectdetail/:id",
        element: <ProjectDetail/>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);