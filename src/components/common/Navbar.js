import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import { Button, Container, Typography } from "@mui/material";
import logo from "../image/develize_logo.png";
import ProfileAvatar from "../ProfileAvatar";

function Navbar(props) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

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
            <Link to={'/home'}>
              <img src={logo} alt="logo" className="logo text-center" />
            </Link>
          </div>
          {Object.keys(props.user).length === 0 && (
            <div className="upper right">
              <Button sx={{ mr: 2, }} color="primary" variant="contained" className="login-btn" href="/login"> Sign in</Button>
            </div>
          )}
          {Object.keys(props.user).length !== 0 && (
            <div className="upper right">
              <Container sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'right' }}>
                <ProfileAvatar variant='rounded' name={props.user.firstName + ' ' + props.user.lastName} />
                <Typography variant="button" sx={{ fontWeight: 'bold', ml: 1 }}>
                  {props.user.firstName + ' ' + props.user.lastName}
                </Typography>
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
            {SidebarData
            .filter((item)=>{
              if(localStorage.getItem('token') === null){
                return item.title === 'Home'
              }else{
                return true
              }
            })
            .map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
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
