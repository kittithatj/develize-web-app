import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    Step,
    StepLabel,
    Stepper,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

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
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import Pagination from "@mui/material/Pagination";
import StorageIcon from '@mui/icons-material/Storage';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HandymaIconn from '@mui/icons-material/Handyman';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TerminalIcon from '@mui/icons-material/Terminal';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function CreatePersonnel() {
    const navigate = useNavigate();
    const [user, setUser, openSnackbar] = useOutletContext({});

    const [skillList, setSkillList] = useState([]);
    const [skillSelect, setSkillSelect] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [chipCount, setChipCount] = useState(0);

    const employmentStatus = ["Full-time", "Part-time", "Temporary", "Intern", "Outsource", "Probationary", "Resigned"];

    const [currentPageSkill, setCurrentPageSkill] = useState(1);
    const itemsPerPageSkill = 12;

    const [openDialog, setOpenDialog] = useState(false);

    const fetchSkillData = () => {
        setLoading(true);
        skillApi.getAllSKills().then(data => {
            setSkillList(data);
            setLoading(false);
            console.log('Skill SP', data);
        });
    };

    useEffect(() => {
        fetchSkillData();
    }, []);

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
        setSkillSelect(skillSelect.filter((s) => s.skill_id !== item.skill_id));
    };

    const handleNextStep = () => {
        if (activeStep === steps.length - 1) {
            setOpenDialog(true);
        } else {
            handleNext();
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCreate = () => {
        setOpenDialog(false);

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
    };

    const addSkill = (item) => {
        setSkillSelect(prevArray => [...prevArray, item]);
        setTimeout(() => console.log(skillSelect), 200);
    };

    const handleSearchValueChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSkillTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const countSkill = (item) => {
        setSkillSelect((prevArray) => [...prevArray, item]);
        setChipCount((prevCount) => prevCount + 1);
    };

    const getSkillTypeColor = (skillType) => {
        switch (skillType) {
            case "Database":
                return "error";
            case "Others":
                return "default";
            case "Tool":
                return "secondary";
            case "Library":
                return "success";
            case "Programming Language":
                return "primary";
            case "Framework":
                return "warning";
            default:
                return "default";
        }
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

    const steps = ['Personnel Information', 'Skills'];

    const stepContents = [
        'Personnel Information',
        'Skills',
    ];

    return (
        <div className="main-content">
            <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper
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
                                Create Personnel
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
                            {activeStep === 0 && (
                                <form>
                                    <div style={{ display: "flex", flexDirection: "row", width: "100%", marginTop: '20px', marginBottom: '20px' }}>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginRight: '8px' }}>
                                            <div style={{ fontSize: "15px", marginBottom: '-12px' }}>
                                                Firstname
                                            </div>
                                            <TextField
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </div>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: '8px' }}>
                                            <div style={{ fontSize: "15px", marginBottom: '-12px' }}>
                                                Lastname
                                            </div>
                                            <TextField
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "row", width: "100%", marginBottom: '20px' }}>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginRight: '8px' }}>
                                            <div style={{ fontSize: "15px", marginBottom: '-12px' }}>
                                                Position
                                            </div>
                                            <TextField
                                                name="position"
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
                                        </div>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: '8px' }}>
                                            <div style={{ fontSize: "15px", marginBottom: '-12px' }}>
                                                Division
                                            </div>
                                            <TextField
                                                name="division"
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
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "row", width: "100%", marginBottom: '20px' }}>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginRight: '8px' }}>
                                            <div style={{ fontSize: "15px", marginBottom: '-12px' }}>
                                                Phone Number
                                            </div>
                                            <TextField
                                                name="phoneNumber"
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
                                        </div>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: '8px' }}>
                                            <div style={{ fontSize: "15px", marginBottom: '-12px' }}>
                                                Email
                                            </div>
                                            <TextField
                                                name="email"
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
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "row", width: "100%", }}>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginBottom: '20px' }}>
                                            <div style={{ fontSize: "15px", marginBottom: '0' }}>
                                                Employment Status
                                            </div>
                                            <Select
                                                sx={{ mt: 1, mb: 2, width: "100%" }}
                                                value={formData.employmentStatus}
                                                name="employmentStatus"
                                                onChange={handleChange}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <AutorenewIcon />
                                                    </InputAdornment>
                                                }
                                            >
                                                {employmentStatus.map((type) => (
                                                    <MenuItem key={type} value={type}>
                                                        {type}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
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
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    width: "100%",
                                                    borderStyle: "solid",
                                                    borderRadius: "5px",
                                                    borderColor: "#F0f0f0",
                                                    borderWidth: "2px",
                                                }}
                                            >
                                                <InputBase
                                                    sx={{ ml: 1, flex: 1 }}
                                                    placeholder="Search Skill"
                                                    inputProps={{ "aria-label": "search skill" }}
                                                    value={searchValue}
                                                    onChange={handleSearchValueChange}
                                                />
                                                <IconButton
                                                    type="button"
                                                    sx={{ p: "10px" }}
                                                    aria-label="search"
                                                    disabled
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                        <TextField
                                            sx={{ mb: 2, mt: 2, ml: 2, width: 250, height: 50 }}
                                            size="small"
                                            id="select-skill-type"
                                            select
                                            label="Select Skill Type"
                                            variant="standard"
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

                                    <div
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                            padding: "8px",
                                            minHeight: "100px",
                                            height: "auto",
                                            width: "100%",
                                        }}
                                    >
                                        {skillSelect.map((item) => (
                                            <Chip
                                                key={item.skill_id}
                                                sx={{
                                                    m: 1,
                                                    height: "40px",
                                                }}
                                                variant="outlined"
                                                color={getSkillTypeColor(item.skillType)}
                                                size="medium"
                                                label={item.skillName}
                                                onDelete={() => handleDeleteSkill(item)}
                                                icon={getSkillTypeIcon(item.skillType)}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', maxWidth: '100%' }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                width: "100%",
                                            }}
                                        >
                                            {skillList
                                                .filter(
                                                    (s) =>
                                                        s.skillName
                                                            .toLowerCase()
                                                            .includes(searchValue.toLowerCase()) &&
                                                        (selectedType === '' || s.skillType === selectedType)
                                                )
                                                .slice(
                                                    (currentPageSkill - 1) * itemsPerPageSkill,
                                                    currentPageSkill * itemsPerPageSkill
                                                )
                                                .map((item) => (
                                                    <Box sx={{ width: "33.33%" }} padding="8px">
                                                        <ListItem
                                                            key={item.skill_id}
                                                            sx={{
                                                                border: "1px solid #ccc",
                                                                borderRadius: "5px",
                                                            }}
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar>{getSkillTypeIcon(item.skillType)}</Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={item.skillName}
                                                                secondary={item.skillType}
                                                            ></ListItemText>
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="delete"
                                                                onClick={() => {
                                                                    addSkill(item)
                                                                }}
                                                                disabled={skillSelect.some((selectedSkill) => selectedSkill.skill_id === item.skill_id)}
                                                            >
                                                                {
                                                                    skillSelect.some((selectedSkill) => selectedSkill.skill_id === item.skill_id)
                                                                        ? <CheckIcon />
                                                                        : <AddIcon />
                                                                }
                                                            </IconButton>
                                                        </ListItem>
                                                    </Box>
                                                ))}
                                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
                                                <Pagination
                                                    count={Math.ceil(
                                                        skillList
                                                            .filter(
                                                                (s) =>
                                                                    s.skillName
                                                                        .toLowerCase()
                                                                        .includes(searchValue.toLowerCase()) &&
                                                                    (selectedType === '' || s.skillType === selectedType)
                                                            )
                                                            .length / itemsPerPageSkill
                                                    )}
                                                    page={currentPageSkill}
                                                    onChange={(event, page) => setCurrentPageSkill(page)}
                                                />
                                            </Box>
                                        </div>
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
                                    onClick={handleNextStep}
                                    disabled={activeStep === 0 && (formData.firstName === '' || formData.lastName === '' || formData.position === '' || formData.division === '' || formData.phoneNumber === '' || formData.email === '' || formData.employmentStatus === '')}
                                >
                                    {activeStep === steps.length - 1 ? 'Create' : 'Next'}
                                </Button>
                                <Dialog
                                    open={openDialog}
                                    onClose={() => setOpenDialog(false)}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                                    <DialogContent>
                                        <Typography variant="body1">
                                            Do you want to create personnel Information?
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenDialog(false)} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleCreate} color="success" autoFocus>
                                            Create
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}