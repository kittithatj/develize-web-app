import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Button,
  Container,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import logo from "../image/develize_logo.png";
import ProfileAvatar from "../ProfileAvatar";

function Navbar(props) {
  const [sidebar, setSidebar] = useState(false);
  const [menuState, setMenuState] = useState([...SidebarData]);

  const showSidebar = () => setSidebar(!sidebar);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setMenuState((prev) => {
      const newState = [...prev];
      if (user?.role === "Administrator") {
        newState[0].visible = true;
        newState[1].visible = true;
        newState[2].visible = true;
        newState[3].visible = true;
        newState[4].visible = true;
      } else {
        if (
          user?.role === "Personnel Manager" ||
          user?.role === "Project Manager" ||
          user?.role === "Resource Manager"
        ) {
          newState[0].visible = true;
          newState[1].visible = true;
          newState[2].visible = true;
          newState[3].visible = true;
          newState[4].visible = false;
        }
        if (user?.role === "Assessor") {
          newState[0].visible = true;
          newState[1].visible = true;
          newState[2].visible = false;
          newState[3].visible = false;
          newState[4].visible = false;
        }
        newState[0].visible = true;
      }
      return newState;
    });
  }, [localStorage.getItem("user")]);

  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
          <div className="upper left">
            <Link to="#" className="menu-bars left">
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          </div>
          <div className="upper center">
            <Link to={"/home"}>
              <img src={logo} alt="logo" className="logo text-center" />
            </Link>
          </div>
          {Object.keys(props.user).length === 0 && (
            <div className="upper right">
              <Link to={"/login"}>
              <Button
                sx={{ mr: 2 }}
                color="primary"
                variant="contained"
                className="login-btn"
              >
                {" "}
                Sign in
              </Button>
              </Link>
            </div>
          )}
          {Object.keys(props.user).length !== 0 && (
            <div className="upper right">
              <Container
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "right",
                }}
              >
                <ProfileAvatar
                  variant="rounded"
                  name={props.user.firstName + " " + props.user.lastName}
                />
                <Typography
                  variant="button"
                  sx={{ fontWeight: "bold", ml: 1, mr: 2 }}
                >
                  {props.user.firstName + " " + props.user.lastName}
                </Typography>
                <Tooltip title="Sign Out">
                  <IconButton onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Container>
            </div>
          )}
        </div>

        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <IoIcons.IoMdArrowBack />
              </Link>
            </li>
            {menuState
              .filter((item) => {
                if (localStorage.getItem("token") === null) {
                  return item.title === "Home";
                } else {
                  return true;
                }
              })
              .map((item, index) => {
                if (!item.visible) {
                  return null;
                }
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span style={{ marginLeft: "5px" }}>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
