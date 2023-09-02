import React, { useState } from 'react';
import { Box, Typography, Grid, Button, TextField } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { PersonnelAPI } from '../api/personnel-api';
import SnackbarComponent from '../components/SnackbarComponent';
import { useNavigate } from 'react-router-dom';

// นำเข้าไอคอนอื่นๆ ตามความต้องการ


export default function AddPersonnel() {
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        position: '',
        division: '',
        phoneNumber: '',
        email: '',
        employmentStatus:'',
        skillsId:[112]
    });


    //--------SnackBar---------
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarStatus, setSnackbarStatus] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const htmlSnackBar = <SnackbarComponent open={openSnackbar} handleClose={handleCloseSnackbar} severity={snackbarStatus} message={snackbarMessage} />

    //--------SnackBar---------

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNextStep = () => {
        if (activeStep === 0) {
            // บันทึกข้อมูลที่ป้อนใน TextField ใน formData
            console.log('ข้อมูลที่บันทึก:', formData);
        }
        handleNext();
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCreate = () => {
        createPersonnelData(formData);
    }

    //ยิง API
    const createPersonnelData = () => {
        PersonnelAPI.createPersonnel(formData)
        .then(res => {return res.json()})
        .catch(error => {
            console.error(error);
            setSnackbarStatus('error');
            setSnackbarMessage('Error creating Personnel');
            setOpenSnackbar(true);
        })
        .then((res) => {
            console.log(res); //ข้อมูลที่ได้จาก API
            setSnackbarStatus('success');
            setSnackbarMessage('Personnel created successfully');
            setOpenSnackbar(true);
            navigate('../personnel') //Link ไปหน้าอื่นๆ
        });
        
    }

    const steps = ['Personnel Infomation', 'Skills', 'Assessment'];

    const stepContents = [
        'Personnel Infomation',
        'Skills',
        'Assessment',
    ];

    return (
        <div className="main-content">
            <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            width: '100%',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            padding: '15px',
                        }}
                    >
                        <div className="header">
                            <Typography
                                sx={{ mt: 1, mb: 6, color: 'black' }}
                                variant="h5"
                                color="textSecondary"
                            >
                                รายละเอียดพนักงาน
                            </Typography>
                        </div>
                        <Box sx={{ width: '100%' }}>
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Typography sx={{ mt: 2 }}>
                                {stepContents[activeStep]}
                            </Typography>
                            {activeStep === 0 && (
                                <form>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <TextField
                                            name="firstName"
                                            label="ชื่อ"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            style={{ marginRight: '8px' }}
                                            required={true}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            name="lastName"
                                            label="นามสกุล"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            style={{ marginLeft: '8px' }}
                                        />
                                    </div>

                                    <TextField
                                        name="position"
                                        label="ตำแหน่ง"
                                        value={formData.position}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PermContactCalendarIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        name="division"
                                        label="แผนก"
                                        value={formData.division}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SupervisedUserCircleIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        name="phoneNumber"
                                        label="เบอร์โทร"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        type='number'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AddIcCallIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        name="email"
                                        label="อีเมล"
                                        value={formData.email}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MailOutlineIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </form>

                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                >
                                    ย้อนกลับ
                                </Button>

                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={
                                        activeStep === 0 && (
                                            formData.firstName === '' ||
                                            formData.lastName === '' ||
                                            formData.position === '' ||
                                            formData.division === '' ||
                                            formData.phoneNumber === '' ||
                                            formData.email === ''
                                        )
                                    }
                                    onClick={handleCreate}
                                >
                                    TEST ยิงงงงงง API
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={
                                        activeStep === 0 && (
                                            formData.firstName === '' ||
                                            formData.lastName === '' ||
                                            formData.position === '' ||
                                            formData.division === '' ||
                                            formData.phoneNumber === '' ||
                                            formData.email === ''
                                        )
                                    }
                                    onClick={handleNextStep}
                                >
                                    {activeStep === steps.length - 1 ? 'บันทึก' : 'ถัดไป'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

           {htmlSnackBar}

        </div>
    );
}
