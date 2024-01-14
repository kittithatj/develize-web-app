import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { userApi } from "../api/user-api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser, openSnackbar] = useOutletContext({});
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const userForm = {
      username: data.get("username"),
      password: data.get("password"),
    };

    userApi
      .login(userForm)
      .then((data) => {
        localStorage.setItem("token", data.token);
        openSnackbar({
          status: "success",
          message: "Login Success",
        });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setLoading(false);
        navigate("/Home");
      })
      .catch((err) => {
        setLoading(false);
        openSnackbar({
          status: "error",
          message: "Login Failed",
        });
      });
  };

  return (
    <div className="main-content">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Box style={{ display: "flex", justifyContent: "flex-end" }}>
            <p
              style={{
                color: "gray",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "16px",
                margin: "0",
              }}
            >
              <a href="/register">Register account</a>
            </p>
          </Box>
        </Box>
        <span style={{fontSize:20, color:"GrayText"}}>
        username : test_user | password : p@ssword
        </span>
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" size={100} />
      </Backdrop>
    </div>
  );
}
