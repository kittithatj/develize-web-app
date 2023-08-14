import { AvatarGroup, Box, Chip, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, ThemeProvider, Tooltip, Typography, createTheme } from '@mui/material'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Api } from '../config/api-config';
import ProfileAvatar from '../components/ProfileAvatar'
import Grid from '@mui/material/Grid';
import { Icon } from '@mui/material';
import Button from '@mui/material/Button';
import { Margin } from '@mui/icons-material';

function Personnelinfo() {

    const [personnel, setPersonnel] = useState([])

    const fetchPersonnelData = () => {
        fetch(Api.url + Api.personnel_get)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setPersonnel(data)
            })
    }
    

    useEffect(() => {
        fetchPersonnelData()
    }, [])

    const fullname = (p) => {
        return p.firstName + ' ' + p.lastName;
    }

    const theme = createTheme({
        status: {
            danger: '#e53e3e',
        },
        palette: {
            primary: {
                main: '#0971f1',
                darker: '#053e85',
            },
            success: {
                main: '#64dd17',
                contrastText: '#fff',
            },
            warning: {
                main: '#fbc02d',
                contrastText: '#fff',
            }
        },
    });


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
              width: 1600,
              height: 800,
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
            }}
          >
            <div className='header'>
                <Typography sx={{ mt: 1, mb: 1, fontWeight: 'bold' }} variant="h5" component="div">
                        Personnel Management
                    <ProfileAvatar variant='rounded' name={fullname(personnel)}/>
                        firstName - lastName
                </Typography>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Personnelinfo;
