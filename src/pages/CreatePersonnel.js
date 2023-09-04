import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Button, TextField, Step, StepLabel, Stepper, Select, MenuItem, InputAdornment, IconButton, Chip, Avatar, } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { PersonnelAPI } from '../api/personnel-api';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import { skillApi } from '../api/skill-api';



export default function CreatePersonnel() {
    const navigate = useNavigate();
    const [user, setUser, openSnackbar] = useOutletContext({});

    const [skill, setSkill] = useState([])
    const [skillList, setSkillList] = useState([])
    const [skillSelect, setSkillSelect] = useState([])
    const [loading, setLoading] = useState(false);

    const fetchSkillData = () => {
        setLoading(true)
        skillApi.getAllSKills().then(data => {
            setSkill(data)
            setSkillList(data)
            setLoading(false)
            console.log('Skill SP', data)
        })
    }

    useEffect(() => {
        fetchSkillData()
    }, [])

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        position: '',
        division: '',
        phoneNumber: '',
        email: '',
        employmentStatus: '',
        skillsId: []
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteSkill = (item) => {
        setSkillSelect(skillSelect.filter((s)=>s.skill_id !== item.skill_id))
        setSkillList(prevArray => [...prevArray, item])
    }

    const handleNextStep = () => {
        if (activeStep === 0) {
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

    const addSkill = (item) => {
        setSkillSelect(prevArray => [...prevArray, item])
        setSkillList(skillList.filter((s)=>s.skill_id !== item.skill_id))

        setTimeout(()=>console.log(skillSelect),200)
    }

    //ยิง API
    const createPersonnelData = () => {
        PersonnelAPI.createPersonnel(formData)
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    throw new Error(res.status)
                }
            })
            .then(() => {
                openSnackbar({
                    status: 'success',
                    message: 'Create Personnel Successfully'
                })
                navigate('../personnel') //Link ไปหน้าอื่นๆ
            })
            .catch(() => {
                openSnackbar({
                    status: 'error',
                    message: 'Create Personnel Failed'
                })
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

                            {activeStep === 1 && (
                                <form style={{ marginBottom: '16px' }}>
                                    {
                                    skillSelect.map((item)=>(
                                        <Chip sx={{m : 1}} 
                                        variant="filled" 
                                        color="info" 
                                        size="medium" 
                                        label={item.skillName}
                                        onDelete={()=>(handleDeleteSkill(item))} 
                                        avatar={<Avatar>S</Avatar>} />
                                    ))
                                    }
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                        {skillList
                                        .map((item, index) => (
                                            <Button
                                                key={index}
                                                variant="contained"
                                                disableElevation
                                                endIcon={<AddIcon />}
                                                style={{ backgroundColor: '#90caf9', color: 'black' }}
                                                onClick={() => (addSkill(item))}
                                            >
                                                {item.skillName}
                                            </Button>


                                        ))}
                                    </div>
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
                                    disabled={activeStep === 0 && (formData.firstName === '' || formData.lastName === '' || formData.position === '' || formData.division === '' || formData.phoneNumber === '' || formData.email === '')}
                                    onClick={handleCreate}
                                >
                                    สร้างพนักงาน
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    // disabled={activeStep === 0 && (formData.firstName === '' || formData.lastName === '' || formData.position === '' || formData.division === '' || formData.phoneNumber === '' || formData.email === '')}
                                    onClick={handleNextStep}
                                >
                                    {activeStep === steps.length - 1 ? 'บันทึก' : 'ถัดไป'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </div>

    );
}
