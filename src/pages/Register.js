import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Api } from '../config/api-config';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import SnackbarComponent from '../components/SnackbarComponent';
import { useOutletContext } from 'react-router-dom';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import MenuItem from '@mui/material/MenuItem';
import {InputLabel} from '@mui/material';

export default function Register() {

    const { register, handleSubmit } = useForm();
    const [user, setUser] = useOutletContext({});
    const [role, setRole] = React.useState('');

    //snackbar state
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
      };

    const registerSubmit = (form) => {
        console.log(form)
        // const data = new FormData(event.currentTarget);
        // const userForm = {
        //     username: data.get('username'),
        //     password: data.get('password'),
        // };

        // fetch(Api.url + Api.user_login, {
        //     method: 'POST',
        //     body: JSON.stringify(userForm),
        //     headers: { 'Content-Type': 'application/json' }
        // }).then(res => {
        //     if (res.status === 200) {
        //         setSnackbarStatus('success');
        //         setSnackbarMessage('Login Success');
        //         setOpenSnackbar(true);
        //     } else {
        //         throw new Error(res.statusText);
        //     }
        //     return res.json()
        // })
        //     .then(data => {
        //         setUser(data);
        //         console.log(user);
        //     })
        //     .catch(err => {
        //         console.error(err);
        //         setSnackbarStatus('error');
        //         setSnackbarMessage('Login Failed, Please Try Again');
        //         setOpenSnackbar(true);
        //     })
    };

    return (
        <div className='main-content'>
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        width:'600px',
                        marginTop: 5,
                        padding: "50px",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        borderRadius: "15px",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <VpnKeyIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(registerSubmit)} sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoFocus
                                    {...register('username')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="firstname"
                                    label="Firstname"
                                    type="firstname"
                                    id="firstname"
                                    {...register('firstName')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="lastname"
                                    label="Lastname"
                                    type="lastname"
                                    id="lastname"
                                    {...register('lastname')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    {...register('password')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    {...register('confirmPassword')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select
                                    fullWidth
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Role"
                                    value={role}
                                    onChange={handleRoleChange}
                                    
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
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
                    </Box>
                </Box>
            </Container>
            {/* <SnackbarComponent open={openSnackbar} handleClose={handleCloseSnackbar} severity={snackbarStatus} message={snackbarMessage} /> */}
        </div>
    );
}