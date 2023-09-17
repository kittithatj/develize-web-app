// SYSTEM
import { Avatar, Badge, Box, Typography, TextField, InputAdornment, Chip, Button, IconButton, MenuItem,Link, } from "@mui/material";
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import { skillTypeList } from '../config/skill-type-list';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';


// API
import { skillApi } from '../api/skill-api';
import { PersonnelAPI } from '../api/personnel-api'

// ICON MUI
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import StorageIcon from '@mui/icons-material/Storage';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HandymaIconn from '@mui/icons-material/Handyman';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TerminalIcon from '@mui/icons-material/Terminal';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';


function PersonnelEdit() {

    const { id } = useParams();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    // Skill Management
    const [skillList, setSkillList] = useState([])
    const [skillSelect, setSkillSelect] = useState([])
    const [searchValue, setSearchValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [loadingSkill, setLoadingSkill] = useState(false);


    const handleDeleteSkill = (item) => {
        setSkillSelect(skillSelect.filter((s) => s.skill_id !== item.skill_id))
    }

    const fetchSkillData = () => {
        setLoadingSkill(true)
        skillApi.getAllSKills().then(data => {
            setSkillList(data)
            setLoadingSkill(false)
        })
    }

    // PERSONNEL API / MANAGEMENT
    const [loadingPerson, setLoadingPerson] = useState(false);
    const [dataPersonnel, setDataPersonnel] = useState([]);
    const [skillPersonnel, setSkillPersonnel] = useState([]);

    const fetchPersonnelData = (id) => {
        setLoadingPerson(true);
        PersonnelAPI.getPersonnelById(id).then(data => {
            setDataPersonnel(data)
            console.log("Person", data);
            if (data && data.skills) {
                console.log("Skills:", data.skills);
                setSkillPersonnel(data.skills);
            }
        });
    }

    const getInitials = (firstName, lastName) => {
        if (!firstName && !lastName) return '';
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
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

    const getRandomColor = () => {
        const colors = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#2196f3', '#ff5722'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };


    useEffect(() => {
        fetchSkillData();
        fetchPersonnelData(id);
    }, []);

    return (
        <div className="main-content">
            <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            width: "100%",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "15px",
                        }}
                    >
                        <div className="header">
                            <Badge
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                style={{ marginLeft: "-4px" }}
                            >
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        backgroundColor: "#3f51b5",
                                    }}
                                >
                                    {getInitials(dataPersonnel.firstName, dataPersonnel.lastName)}
                                </Avatar>

                            </Badge>
                        </div>
                        <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
                            {dataPersonnel.firstName} {dataPersonnel.lastName}
                        </Typography>
                        <div className="header"></div>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            padding: "15px",
                            marginTop: '10px',
                        }}
                    >
                        <div className="header">
                            <Typography
                                sx={{ mt: 1, mb: 2, color: "black", textAlign: "left", }}
                                variant="h5"
                                color="textSecondary"
                            >
                                Project History
                            </Typography>
                        </div>
                        <Card sx={{ width: '100%', border: '1px solid #ccc', marginTop: '10px' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    SALTY-1
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Project to use your money exchange to Salt!
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={handleClickOpen}>
                                    Detail
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                </Grid>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Project Details</DialogTitle>
                    <DialogContent>
                        <Typography variant="h5" component="div">
                            SALTY-1
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Project to use your money exchange to Salt!
                        </Typography>
                    </DialogContent>
                </Dialog>




                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            width: "100%",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "15px",
                        }}
                    >
                        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                                sx={{ mt: 1, mb: 2, color: "black" }}
                                variant="h5"
                                color="textSecondary"
                            >
                                Personnel Infomation
                            </Typography>
                                <Button variant="contained" color="primary" sx={{ borderRadius: '30px', width: '80px' }} href={'/Personnel/edit/' + dataPersonnel.personnel_id}>
                                    Edit
                                </Button>
                        </div>
                        <div className="content">
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%", marginRight: 2 }}
                                    variant="outlined"
                                    label="Firstname"
                                    value={dataPersonnel.firstName}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}

                                />
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%" }}
                                    variant="outlined"
                                    label="Lastname"
                                    value={dataPersonnel.lastName}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                                    variant="outlined"
                                    label="Email"
                                    value={dataPersonnel.email}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%" }}
                                    variant="outlined"
                                    label="PhoneNumber"
                                    value={dataPersonnel.phoneNumber}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AddIcCallIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                                    variant="outlined"
                                    label="Division"
                                    value={dataPersonnel.division}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SupervisedUserCircleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%" }}
                                    variant="outlined"
                                    label="Position"
                                    value={dataPersonnel.position}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PermContactCalendarIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%" }}
                                    variant="outlined"
                                    label="EmploymentStatus"
                                    value={dataPersonnel.employmentStatus}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonPinCircleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                    </Box>
                    <Box
                        sx={{
                            width: "100%",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "15px",
                            mt: 2,
                        }}
                    >
                        <div className="header">
                            <Typography
                                sx={{ mt: 1, mb: 2, color: "black" }}
                                variant="h5"
                                color="textSecondary"
                            >
                                Personnel Skill Management
                            </Typography>
                        </div>
                        <div className="content">
                            <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '8px', minHeight: '100px', height: 'auto' }}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '16px',
                                }}>
                                    {skillPersonnel
                                        .sort((a, b) => a.skillName.localeCompare(b.skillName)) // เรียงลำดับตามตัวอักษร
                                        .map((item) => (
                                            <Chip
                                                key={item.skill_id}
                                                sx={{
                                                    backgroundColor: "transparent",
                                                    color: 'black',
                                                    borderRadius: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    borderColor: 'gray',
                                                    borderWidth: '1px',
                                                    borderStyle: 'solid',
                                                    margin: '3px',
                                                    padding: '10px'
                                                }}
                                                icon={getSkillTypeIcon(item.skillType)}
                                                label={item.skillName}
                                            />
                                        ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                            </div>
                        </div>
                    </Box>

                </Grid>
            </Grid>
        </div >
    )
}

export default PersonnelEdit