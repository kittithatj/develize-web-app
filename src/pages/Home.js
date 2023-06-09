import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@mui/material';
import Button from '@mui/material/Button';
import { BsFillPersonFill } from "react-icons/bs";
import { FaLightbulb } from 'react-icons/fa';
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { Link } from 'react-router-dom';


function Home() {
  return (
    <div className='main-content'>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Box
            sx={{
              width: 270,
              height: 350,
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '23px',
            }}
          >
            <IconButton sx={{ p: 0, marginBottom: '-110px' }}>
             <Icon as={BsFillPersonFill} style={{ fontSize: '100px' }} />
            </IconButton>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '25px' }}>Personnel</h1>
                <h2 style={{ fontSize: '12px', marginTop: '10px' }}>Management of employee</h2>
                </div>
            <Link to="/Personnel">
              <Button variant="contained" style={{ backgroundColor: '#25BD71', color: 'white', borderRadius: 90 }}>Manage</Button>
            </Link>
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 270,
              height: 350,
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '23px',
            }}
          >
            <IconButton sx={{ p: 0, marginBottom: '-95px' }}>
              <Icon as={FaLightbulb} style={{ fontSize: '80px' }} />
              </IconButton>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '25px' }}>Skill</h1>
                <h2 style={{ fontSize: '12px', marginTop: '10px' }}>Skill Management and type of skill</h2>
                </div>
            <Link to="/Skill">
              <Button variant="contained" style={{ backgroundColor: '#25BD71', color: 'white', borderRadius: 90 }}>Manage</Button>
            </Link>
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 270,
              height: 350,
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '23px',
            }}
          >
            <IconButton sx={{ p: 0, marginBottom: '-90px' }}>
              <Icon as={BsFillCalendar2WeekFill} style={{ fontSize: '80px' }} />
              </IconButton>


              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '25px' }}>Project</h1>
                <h2 style={{ fontSize: '12px', marginTop: '10px' }}>Project management and Project details</h2>
                </div>
            <Link to="/Project">
              <Button variant="contained" style={{ backgroundColor: '#25BD71', color: 'white', borderRadius: 90 }}>Manage</Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;