import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Personnel",
    path: "/personnel",
    icon: <IoIcons.IoMdPerson />,
    cName: "nav-text",
  },
  {
    title: "Skill",
    path: "/skill",
    icon: <FaIcons.FaLightbulb />,
    cName: "nav-text",
  },
  {
    title: "Project",
    path: "/project",
    icon: <FaIcons.FaProjectDiagram />,
    cName: "nav-text",
  },
  {
    title: "User Management",
    path: "/user/manage",
    icon: <FaIcons.FaUserSecret />,
    cName: "nav-text",
  },
];
