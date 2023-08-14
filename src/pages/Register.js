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
import { useState } from 'react';
import SnackbarComponent from '../components/SnackbarComponent';
import { useOutletContext } from 'react-router-dom';

export default function Register() {

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

        fetch(Api.url + Api.user_login, {
            method: 'POST',
            body: JSON.stringify(userForm),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            if (res.status === 200) {
                setSnackbarStatus('success');
                setSnackbarMessage('Login Success');
                setOpenSnackbar(true);
            } else {
                throw new Error(res.statusText);
            }
            return res.json()
        })
            .then(data => {
                setUser(data);
                console.log(user);
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
                        Register
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
                            name="firstname"
                            label="Firstname"
                            type="firstname"
                            id="firstname"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="lastname"
                            label="Lastname"
                            type="lastname"
                            id="lastname"
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
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
            <SnackbarComponent open={openSnackbar} handleClose={handleCloseSnackbar} severity={snackbarStatus} message={snackbarMessage} />
        </div>
    );
}