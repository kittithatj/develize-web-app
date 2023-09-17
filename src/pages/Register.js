import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import SnackbarComponent from '../components/SnackbarComponent';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel } from '@mui/material';
import { userApi } from '../api/user-api';

export default function Register() {
  const [user, setUser] = useState({});
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

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

    const userToRegister = {
      ...formData,
      role: role,
    };

    userApi
      .register(userToRegister)
      .then((response) => {
        setLoading(false);
        setOpenSnackbar(true);

      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <div className='main-content'>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            width: '600px',
            marginTop: 5,
            padding: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: '15px',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
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
                <TextField
                  fullWidth
                  required
                  id='username'
                  label='Username'
                  name='username'
                  autoFocus
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  name='firstName'
                  label='Firstname'
                  type='text'
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  name='lastName'
                  label='Lastname'
                  type='text'
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name='password'
                  label='Password'
                  type='password'
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id='demo-simple-select-label'>Role</InputLabel>
                <Select
                  fullWidth
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={role}
                  onChange={handleRoleChange}
                >
                  <MenuItem value={'ADMIN'}>ADMIN</MenuItem>
                  <MenuItem value={'PM'}>PM</MenuItem>
                  <MenuItem value={'CEO'}>CEO</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
}
