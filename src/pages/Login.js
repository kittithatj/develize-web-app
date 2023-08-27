import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SnackbarComponent from '../components/SnackbarComponent';
import { useOutletContext } from 'react-router-dom';
import { userApi } from '../api/user-api';

export default function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useOutletContext({});

    //snackbar state
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarStatus, setSnackbarStatus] = useState('error');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const userForm = {
            username: data.get('username'),
            password: data.get('password'),
        };

        userApi.login(userForm)
            .then(data => {
                localStorage.setItem('token', data.token);
                setSnackbarStatus('success');
                setSnackbarMessage('Login Success');
                setOpenSnackbar(true);
                setUser(data)
                navigate('/Home');
            })
            .catch(err => {
                console.error(err);
                setSnackbarStatus('error');
                setSnackbarMessage('Login Failed, Please Try Again');
                setOpenSnackbar(true);
            })
    };

    return (
        <div className='main-content'>
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
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
                        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <p style={{ color: 'gray', textDecoration: 'underline', cursor: 'pointer', fontSize: '16px', margin: '0' }}>
                                <a href="/register">Register account</a>
                            </p>
                        </Box>
                </Box>
            </Container>
            <SnackbarComponent open={openSnackbar} handleClose={handleCloseSnackbar} severity={snackbarStatus} message={snackbarMessage} />
        </div>
    );
}