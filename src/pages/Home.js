import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { Container, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

function Home() {

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    setMenuState((prev) => {
      const newState = [...prev];
      if (user?.role === "Administrator") {
        newState[0].visible = true;
        newState[1].visible = true;
        newState[2].visible = true;
        newState[3].visible = true;
      } else {
        if (
          user?.role === "Personnel Manager" ||
          user?.role === "Project Manager" ||
          user?.role === "Resource Manager"
        ) {
          newState[0].visible = true;
          newState[1].visible = true;
          newState[2].visible = true;
          newState[3].visible = false;
        }
        if (user?.role === "Assessor") {
          newState[0].title = "Personnel Assessment";
          newState[0].description =
            "Assess and record personnel's soft skills. Provide radar chart reports that useful for project management.";
          newState[0].visible = true;
          newState[1].visible = false;
          newState[2].visible = false;
          newState[3].visible = false;
        }
      }
      return newState;
    });
  }, []);

  const [user, setUser] = React.useState({});
  const [menuState, setMenuState] = React.useState([
    {
      title: "Personnel Management",
      description:
        "Useful features for efficient personnel management. Able to associate specific skills with each person, providing a detailed profile of their technical expertise.",
      link: "/personnel",
      icon: <PeopleAltIcon sx={{ fontSize: 70 }} />,
      iconColor: "#30b5fc",
      visible: true,
    },
    {
      title: "Skill Management",
      description:
        "Find, create, and delete various tech skills. Ensures your team's skill inventory is always accurate and reflective of the dynamic technological landscape.",
      link: "/skill",
      icon: <MenuBookIcon sx={{ fontSize: 70 }} />,
      iconColor: "#edd011",
      visible: true,
    },
    {
      title: "Project Management",
      description:
        "Central hub for project management within organization. Building dynamic project teams that required specific skill sets for successful project execution.",
      link: "/project",
      icon: <WidgetsIcon sx={{ fontSize: 70 }} />,
      iconColor: "#ff3636",
      visible: true,
    },
    {
      title: "User Management",
      description:
        "Manage user accounts and their permissions. Approve or reject requests for new account registerations.",
      link: "/user/manage",
      icon: <ManageAccountsIcon sx={{ fontSize: 70 }} />,
      iconColor: "#707070",
      visible: true,
    },
  ]);

  if (localStorage.getItem("token") == null) {
    return (
      <div className="main-content">
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Container
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "50px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <WavingHandIcon
              sx={{
                "font-size": "7rem",
                margin: "30px",
              }}
            ></WavingHandIcon>
            <Typography variant="h3" component="div" gutterBottom>
              Welcome to DEVELIZE
            </Typography>
            <Typography variant="h4" component="div" gutterBottom>
              Please{" "}
              <Link to="/login" underline="hover">
                Login
              </Link>{" "}
              to Continue.
            </Typography>
          </Container>
        </Container>
      </div>
    );
  }
  return (
    <div className="main-content">
      <Box className="flex-center" sx={{flexWrap: "wrap",}}>
        {menuState.map((menu) => {
          if (!menu.visible) {
            return null;
          }
          return (
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: 4,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                margin: 3,
                maxWidth: "400px",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: menu.iconColor,
                  height: "150px",
                  width: "150px",
                  mb: 5,
                  mt: 1,
                }}
              >
                {menu.icon}
              </Avatar>
              <Typography variant="h5" component="div" gutterBottom>
                {menu.title}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                gutterBottom
                sx={{ minHeight: "120px" }}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{menu.description}
              </Typography>
              <Link to={menu.link} underline="hover">
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    backgroundColor: "#5FDF2F",
                    marginTop: "20px",
                    borderRadius: "20px",
                  }}
                >
                  NAVIGATE
                </Button>
              </Link>
            </Box>
          );
        })}
      </Box>
    </div>
  );
}

export default Home;
