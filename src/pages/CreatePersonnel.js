import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Button, TextField, Step, StepLabel, Stepper, Select, MenuItem, InputAdornment, IconButton, Chip, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { PersonnelAPI } from '../api/personnel-api';
import { useNavigate, useOutletContext } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { skillApi } from '../api/skill-api';
import SkillFroupAvatar from '../components/SkillGroupAvatar';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { skillTypeList } from '../config/skill-type-list';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import StorageIcon from '@mui/icons-material/Storage';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HandymaIconn from '@mui/icons-material/Handyman';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TerminalIcon from '@mui/icons-material/Terminal';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

export default function CreatePersonnel() {
    const navigate = useNavigate();
    const [user, setUser, openSnackbar] = useOutletContext({});

    const [skillList, setSkillList] = useState([])
    const [skillSelect, setSkillSelect] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [chipCount, setChipCount] = useState(0);

    const fetchSkillData = () => {
        setLoading(true)
        skillApi.getAllSKills().then(data => {
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
        setSkillSelect(skillSelect.filter((s) => s.skill_id !== item.skill_id))
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
        const dataToSend = {
            ...formData,
            skillsId: skillSelect.map((skill) => skill.skill_id),
        };

        PersonnelAPI.createPersonnel(dataToSend)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error(res.status);
                }
            })
            .then(() => {
                openSnackbar({
                    status: 'success',
                    message: 'Create Personnel Successfully'
                });
                navigate('../personnel');
            })
            .catch(() => {
                openSnackbar({
                    status: 'error',
                    message: 'Create Personnel Failed'
                });
            });
    }

    const addSkill = (item) => {
        setSkillSelect(prevArray => [...prevArray, item])
        setTimeout(() => console.log(skillSelect), 200)
    }

    const handleSearchValueChange = (event) => {
        setSearchValue(event.target.value);
    }

    const handleSkillTypeChange = (event) => {
        setSelectedType(event.target.value);
    }

    const countSkill = (item) => {
        setSkillSelect((prevArray) => [...prevArray, item]);
        setChipCount((prevCount) => prevCount + 1);
    };

    const getSkillTypeIcon = (skillType) => {
        switch (skillType) {
            case 'Database':
                return <StorageIcon />;
            case 'Others':
                return <MoreHorizIcon />;
            case 'Tool':
                return <HandymaIconn />;
            case 'Library':
                return <MenuBookIcon />;
            case 'Programming Language':
                return <TerminalIcon />;
            case 'Framework':
                return <IntegrationInstructionsIcon />;
            default:
                return <MoreHorizIcon />;
        }
    };

    const steps = ['Personnel Information', 'Skills', 'Assessment'];

    const stepContents = [
        'Personnel Information',
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
                                Personnel Details
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
                                            label="First Name"
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
                                            label="Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            style={{ marginLeft: '8px' }}
                                        />
                                    </div>

                                    <TextField
                                        name="position"
                                        label="Position"
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
                                        label="Division"
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
                                        label="Phone Number"
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
                                        label="Email"
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
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mt: 2,
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: 300,
                                                backgroundColor: '#E6E6E6',
                                            }}
                                        >
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '300px' }}>
                                                <InputBase
                                                    sx={{ ml: 1, width: '300px' }}
                                                    placeholder="Search Skill"
                                                    inputProps={{ 'aria-label': 'search skill' }}
                                                    value={searchValue}
                                                    onChange={handleSearchValueChange}
                                                />
                                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" disabled>
                                                    <SearchIcon />
                                                </IconButton>
                                            </div>
                                        </Paper>
                                        <TextField
                                            sx={{ mb: 2, mt: 2, ml: 2, width: 200, height: 40 }}
                                            size='small'
                                            id="select-skill-type"
                                            select
                                            label="Select Skill Type"
                                            variant="filled"
                                            value={selectedType}
                                            onChange={handleSkillTypeChange}
                                        >
                                            {skillTypeList.map((type) => (
                                                <MenuItem key={type.label} value={type.value}>
                                                    {type.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>

                                    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '8px', minHeight: '100px', height: 'auto' }}>
                                        {skillSelect.map((item) => (
                                            <Chip
                                                sx={{
                                                    m: 1,
                                                    height: '35px',
                                                    backgroundColor: '#D1D1D1',
                                                    color: 'black',
                                                }}
                                                variant="filled"
                                                color="info"
                                                size="medium"
                                                label={item.skillName}
                                                onDelete={() => (handleDeleteSkill(item))}
                                                avatar={getSkillTypeIcon(item.skillType)}
                                            />
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', maxWidth: '100%' }}>
                                        {skillList
                                            .filter((s) => s.skillName.toLowerCase().includes(searchValue.toLowerCase()))
                                            .filter((s) => selectedType === '' || s.skillType === selectedType)
                                            .map((item, index) => (
                                                <Card
                                                    sx={{
                                                        backgroundColor: '#EEEEEE',
                                                        flexBasis: 'calc(25% - 8px)',
                                                        border: 'none',
                                                        height: '145px'
                                                    }}
                                                >
                                                    <CardContent>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '24px', marginRight: '8px' }}>{getSkillTypeIcon(item.skillType)}</span>
                                                            <Typography variant="h6" gutterBottom>
                                                                {item.skillName}
                                                            </Typography>
                                                        </div>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.skillType}
                                                        </Typography>
                                                    </CardContent>
                                                    <Button
                                                        variant="contained"
                                                        disableElevation
                                                        endIcon={<AddIcon />}
                                                        sx={{
                                                            backgroundColor: '#E2E2E2',
                                                            color: 'black',
                                                            border: 'none',
                                                            width: '100%',
                                                            '&:hover': {
                                                                backgroundColor: '#7F7F7F',
                                                                color: 'white',
                                                            },
                                                        }}
                                                        onClick={() => addSkill(item)}
                                                        disabled={skillSelect.some((selectedSkill) => selectedSkill.skill_id === item.skill_id)}
                                                    >
                                                        Add
                                                    </Button>
                                                </Card>
                                            ))}
                                        {skillList
                                            .filter((s) => !skillSelect.includes(s))
                                            .filter((s) => s.skillName.toLowerCase().includes(searchValue.toLowerCase()))
                                            .filter((s) => selectedType === '' || s.skillType === selectedType)
                                            .length === 0 && (
                                                <Typography variant="body2" sx={{ fontSize: 12, color: 'red' }}>
                                                    Not Found
                                                </Typography>
                                            )}
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
                                    Back
                                </Button>

                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={activeStep === 0 && (formData.firstName === '' || formData.lastName === '' || formData.position === '' || formData.division === '' || formData.phoneNumber === '' || formData.email === '')}
                                    onClick={handleCreate}
                                >
                                    Create Personnel
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNextStep}
                                >
                                    {activeStep === steps.length - 1 ? 'Save' : 'Next'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}