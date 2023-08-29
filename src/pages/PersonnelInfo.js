import { Avatar, Badge, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Api } from '../config/api-config';
import Grid from '@mui/material/Grid';
import { PersonnelAPI } from "../api/personnel-api";

function PersonnelInfo() {
  const [personnel, setPersonnel] = useState([]);

  const fetchPersonnelData = () => {
    PersonnelAPI.getAllPersonnel().then((data)=>{
      setPersonnel(data);
    })
  };

  useEffect(() => {
    fetchPersonnelData();
  }, []);

  const fullname = (p) => {
    return p.firstName + " " + p.lastName;
  };

  return (
    <div className="main-content">
      <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "15px",
            }}
          >
            <div className="header">
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                style={{ marginLeft: "-4px" }}
              >
                <Avatar sx={{ width: 100, height: 100 }}>
                  {/* รูป icon User */}
                </Avatar>
              </Badge>
            </div>
            <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
              Attid Kingkoiklang
            </Typography>
            <div className="header"></div>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "15px",
            }}
          >
            <div className="header">
              <Typography
                sx={{ mt: 1, mb: 2, color: "black" }}
                variant="h5"
                color="textSecondary"
              >
                Personnel Information
              </Typography>
            </div>
            <div className="content">
              <Typography sx={{ mt: 1,}} variant="h6" color="textSecondary">
               <span style={{ color: "black" }}>Firstname : </span>Attid
               <span style={{ color: "black" }}>Lastname : </span>Kingkoiklang
              </Typography>
              
              <Typography sx={{ mt: 1,}} variant="h6" color="textSecondary">
               <span style={{ color: "black" }}>Email : </span>Attid.1987@gmail.com
              </Typography>

              <Typography sx={{ mt: 1,}} variant="h6" color="textSecondary">
               <span style={{ color: "black" }}>PhoneNumber : </span>0621234567
              </Typography>

              <Typography sx={{ mt: 1,}} variant="h6" color="textSecondary">
               <span style={{ color: "black" }}>Division : </span>DIT630
              </Typography>

              <Typography sx={{ mt: 1,}} variant="h6" color="textSecondary">
               <span style={{ color: "black" }}>Position : </span>Manager
              </Typography>

              <Typography sx={{ mt: 1,}} variant="h6" color="textSecondary">
               <span style={{ color: "black" }}>EmploymentStatus : </span>immortal
              </Typography>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default PersonnelInfo;
