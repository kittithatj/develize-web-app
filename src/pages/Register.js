import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Grid } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { userApi } from "../api/user-api";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser, openSnackbar] = useOutletContext({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const registerSubmit = () => {
    setLoading(true);

    if (formData.password.length < 6) {
      openSnackbar({
        status: "warning",
        message: "Password must be at least 6 characters",
      });

      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      openSnackbar({
        status: "error",
        message: "Password not match. Please try again",
      });

      setLoading(false);
      return;
    }

    const userToRegister = {
      ...formData,
      role: role,
    };

    userApi
      .register(userToRegister)
      .then(() => {
        setLoading(false);
        navigate("/register/success");
        openSnackbar({
          status: "success",
          message: "Register success",
        });
      })
      .catch((error) => {
        openSnackbar({
          status: "error",
          message: "Username or email already exist",
        });
        navigate("/register");
        setLoading(false);
      });
  };

  return (
    <div className="main-content">
      <CssBaseline />
      <Box
        sx={{
          width: "600px",
          marginTop: 5,
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper",
          borderRadius: "15px",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <VpnKeyIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerSubmit();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "8px",
                }}
              >
                <div style={{ fontSize: "15px", marginBottom: "5px" }}>
                  Username
                </div>
                <TextField
                  fullWidth
                  required
                  id="username"
                  name="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "20px",
                }}
              >
                <div style={{ fontSize: "15px", marginBottom: "5px" }}>
                  Firstname
                </div>
                <TextField
                  fullWidth
                  required
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "15px", marginBottom: "5px" }}>
                  Lastname
                </div>
                <TextField
                  fullWidth
                  required
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "8px",
                }}
              >
                <div style={{ fontSize: "15px", marginBottom: "5px" }}>
                  Password
                </div>
                <TextField
                  fullWidth
                  required
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "8px",
                }}
              >
                <div style={{ fontSize: "15px", marginBottom: "5px" }}>
                  Confirm Password
                </div>
                <TextField
                  fullWidth
                  required
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "8px",
                }}
              >
                <div style={{ fontSize: "15px", marginBottom: "5px" }}>
                  Email
                </div>
                <TextField
                  fullWidth
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </form>
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" size={100} />
      </Backdrop>
    </div>
  );
}
