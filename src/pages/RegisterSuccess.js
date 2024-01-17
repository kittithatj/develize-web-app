import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

export default function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <Container component="main" maxWidth="sm">
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
          <Avatar sx={{ m: 5, bgcolor: "rgb(61, 218, 137)",height:"80px", width:"80px"}}>
            <DoneOutlineIcon sx={{height:"50px", width:"50px"}} />
          </Avatar>
          <Box>
            <Typography sx={{textAlign:"center"}} component="h1" variant="h5">
            Your registration has been submitted to the administrator.
            </Typography>
            <Typography sx={{textAlign:"center", m:2}} component="h1" variant="h5">
            Once your information is approved, a confirmation email will be sent to you.
            </Typography>

            <Typography sx={{textAlign:"center",color:"primary.main", textDecoration:"underline",cursor:"pointer"}} 
            component="h1" variant="h6" onClick={()=>{navigate("/login")}}>
            Back to Login
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
