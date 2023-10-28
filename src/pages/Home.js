import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Container, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { Link } from "react-router-dom";
import LanOutlinedIcon from "@mui/icons-material/LanOutlined";
import WavingHandIcon from '@mui/icons-material/WavingHand';

function Home() {
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
              'font-size': "8rem",
              margin: "30px",
            }}
            >
            </WavingHandIcon>
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
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Box
            sx={{
              width: 270,
              height: 350,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
            }}
          >
            <PersonOutlineOutlinedIcon
              style={{ fontSize: "90px", marginBottom: "-100px" }}
            />
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: "25px", margin: "0px" }}>Personnel</h1>
              <h2
                style={{ fontSize: "14px", marginTop: "11px", color: "gray" }}
              >
                Management of employee
              </h2>
            </div>
            <Link to="/Personnel">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#3DDA89",
                  color: "white",
                  borderRadius: 90,
                }}
              >
                Manage
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 270,
              height: 350,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
            }}
          >
            <LightbulbOutlinedIcon
              style={{ fontSize: "80px", marginBottom: "-90px" }}
            />
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: "25px", margin: "0px" }}>Skill</h1>
              <h2
                style={{ fontSize: "14px", marginTop: "10px", color: "gray" }}
              >
                Skill Management and type of skill
              </h2>
            </div>
            <Link to="/Skill">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#3DDA89",
                  color: "white",
                  borderRadius: 90,
                }}
              >
                Manage
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 270,
              height: 350,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <LanOutlinedIcon
                style={{ fontSize: "80px", marginBottom: "-90px" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: "25px", margin: "0px" }}>Project</h1>
              <h2
                style={{ fontSize: "14px", marginTop: "12px", color: "gray" }}
              >
                Project management and Project details
              </h2>
            </div>
            <Link to="/Project">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#3DDA89",
                  color: "white",
                  borderRadius: 90,
                }}
              >
                Manage
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
