// SYSTEM
import { Avatar, Badge, Box, Typography, TextField, InputAdornment, Chip, Button, IconButton, MenuItem, } from "@mui/material";
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
import { color } from "framer-motion";


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

    const [firstNameEdit, setFirstNameEdit] = useState('');
    const [lastNameEdit, setLastNameEdit] = useState('');
    const [emailEdit, setEmailEdit] = useState('');
    const [phoneNumberEdit, setPhoneNumberEdit] = useState('');
    const [divisionEdit, setDivisionEdit] = useState('');
    const [positionEdit, setPositionEdit] = useState('');
    const [employmentStatusEdit, setEmploymentStatusEdit] = useState('');


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

    const addSkill = (item) => {
        if (!skillSelect.some((s) => s.skill_id === item.skill_id)) {
            setSkillSelect((prevArray) => [...prevArray, item]);
        }
    };

    const isAddButtonDisabled = (item) => {
        return skillSelect.some((s) => s.skill_id === item.skill_id);
    };

    const handleSubmit = async () => {
        setLoadingEditPerson(true);

        const personnelForm = {
            personnel_id: dataPersonnel.personnel_id,
            firstName: firstNameEdit || dataPersonnel.firstName,
            lastName: lastNameEdit || dataPersonnel.lastName,
            email: emailEdit || dataPersonnel.email,
            phoneNumber: phoneNumberEdit || dataPersonnel.phoneNumber,
            division: divisionEdit || dataPersonnel.division,
            position: positionEdit || dataPersonnel.position,
            employmentStatus: employmentStatusEdit || dataPersonnel.employmentStatus,
            skillsId: skillSelect.map(skill => skill.skill_id),
        };

        try {
            const response = await PersonnelAPI.editPersonnel(personnelForm); // เรียกใช้ API ตัวนี้
            if (response.ok) {
                const data = await response.json();
                setLoadingEditPerson(false);
                console.log("Updated Personnel Data:", data);
                if (data && data.skills) {
                    console.log("Updated Skills:", data.skills);
                    setSkillPersonnel(data.skills);
                }
                window.location.href = "/Personnel/" + dataPersonnel.personnel_id;
            } else {
                throw new Error("Failed to update personnel");
            }
        } catch (error) {
            setLoadingEditPerson(false);
            console.error("Error updating personnel:", error);
        }
    };




    const handleSearchValueChange = (event) => {
        setSearchValue(event.target.value);
    }

    const handleSkillTypeChange = (event) => {
        setSelectedType(event.target.value);
    }

    // PERSONNEL API / MANAGEMENT
    const [loadingPerson, setLoadingPerson] = useState(false);
    const [loadingEditPerson, setLoadingEditPerson] = useState(false);
    const [dataPersonnel, setDataPersonnel] = useState([]);
    const [editDataPersonnel, setEditDataPersonnel] = useState([]);
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

    const status = (p) => {
        if (!p || !p.projectHistories || p.projectHistories.length === 0) {
            return { status: 'Not Assigned', color: 'success' };
        } else {
            let count = 0;
            p.projectHistories.forEach((project) => {
                if (project.project.projectStatus === 'In Progress') count++;
            });
            if (count > 0) {
                return { status: count + ' Project Working', color: 'warning' };
            } else {
                return { status: 'Not Assigned', color: 'success' };
            }
        }
    };

    useEffect(() => {
        fetchSkillData();
        fetchPersonnelData(id);
    }, []);

    useEffect(() => {
        if (skillPersonnel.length > 0) {
            setSkillSelect([...skillSelect, ...skillPersonnel]);
        }
    }, [skillPersonnel]);


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
                        <Card sx={{ width: '100%', height: '100% ', border: '1px solid #ccc', marginTop: '10px' }}>
                            <CardContent>
                                <Typography variant="h5" component="div" sx={{ display: "flex", justifyContent: "space-between", marginBottom: '20px' }}>
                                    <div>
                                        <span>Develize-Appication</span>
                                        <p style={{ fontSize: "small", color: 'green' }}>12/9/2023 - 24/12/2023</p>
                                    </div>
                                    <Box>
                                        <Chip
                                            label={status(dataPersonnel)?.status || 'Not Assigned'}
                                            color={status(dataPersonnel)?.color || 'success'}
                                            sx={{
                                                justifyContent: 'center',
                                                "& .MuiChip-label": {
                                                    margin: 0,
                                                }
                                            }}
                                        />

                                    </Box>
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
                    <DialogContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', color: '#3f51b5', marginBottom: '10px' }}>
                                    Develize-Appication
                                </Typography>
                            </div>
                            <div>
                                <Chip
                                    label={status(dataPersonnel)?.status || 'Not Assigned'}
                                    color={status(dataPersonnel)?.color || 'success'}
                                    sx={{
                                        "& .MuiChip-label": {
                                            margin: 0,
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px', fontWeight: 'bold', }}>
                            Project Type :
                            <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>E-Commerce Webservice</span>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: '20px' }}>
                            <span style={{ fontWeight: 'bold' }}>Description : </span>Websites used for marketing are used to buy, sell, and send products that can help buyers and sellers be more convenient. This will ensure safety and prevent fraud through online shopping.
                        </Typography>
                        <Typography>
                            Skill Requirement
                            <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '8px', minHeight: '100px', height: 'auto' }}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '16px',
                                }}>
                                    {skillPersonnel
                                        .sort((a, b) => a.skillName.localeCompare(b.skillName))
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
                        </Typography>
                        <TextField
                            sx={{ mt: 1, mb: 2, width: "30%", marginTop: '20px' }}
                            variant="outlined"
                            label="Budget"
                            value='5,000,000'
                            disabled
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PermContactCalendarIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Typography variant="body2" color="textSecondary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                            <span>Duration: 12/9/2023 - 24/12/2023</span>
                            <Button size="small" color="primary" sx={{ borderRadius: '30px', width: '80px' }}>
                                Edit
                            </Button>
                        </Typography>
                    </DialogContent>

                </Dialog>




                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                                Personnel Editing
                            </Typography>
                            <Button variant="outlined" color="error" sx={{ borderRadius: '30px', width: '80px' }} href={'/Personnel/' + dataPersonnel.personnel_id}>
                                Back
                            </Button>
                        </div>
                        <div className="content">
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%", marginRight: 2 }}
                                    variant="outlined"
                                    label="Firstname"
                                    value={firstNameEdit || dataPersonnel.firstName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setFirstNameEdit(e.target.value)}
                                />
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%" }}
                                    variant="outlined"
                                    label="Lastname"
                                    value={lastNameEdit || dataPersonnel.lastName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setLastNameEdit(e.target.value)}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                                    variant="outlined"
                                    label="Email"
                                    value={emailEdit || dataPersonnel.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setEmailEdit(e.target.value)}
                                />
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%" }}
                                    variant="outlined"
                                    label="PhoneNumber"
                                    value={phoneNumberEdit || dataPersonnel.phoneNumber}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AddIcCallIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setPhoneNumberEdit(e.target.value)}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                                    variant="outlined"
                                    label="Division"
                                    value={divisionEdit || dataPersonnel.division}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SupervisedUserCircleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setDivisionEdit(e.target.value)}
                                />
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%" }}
                                    variant="outlined"
                                    label="Position"
                                    value={positionEdit || dataPersonnel.position}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PermContactCalendarIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setPositionEdit(e.target.value)}
                                />
                            </div>
                            <div>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%" }}
                                    variant="outlined"
                                    label="EmploymentStatus"
                                    value={employmentStatusEdit || dataPersonnel.employmentStatus}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonPinCircleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setEmploymentStatusEdit(e.target.value)}
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
                                {skillSelect
                                    .sort((a, b) => a.skillName.localeCompare(b.skillName))
                                    .map((item) => (
                                        <Chip
                                            sx={{
                                                m: 1,
                                                height: '35px',
                                                color: 'black',
                                            }}
                                            variant="outlined"
                                            color="default"
                                            size="medium"
                                            label={item.skillName}
                                            onDelete={() => (handleDeleteSkill(item))}
                                            avatar={getSkillTypeIcon(item.skillType)}
                                        />
                                    ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F7F7F7', width: '60%' }}>
                                        <InputBase
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="Search Skill"
                                            inputProps={{ 'aria-label': 'search skill' }}
                                            value={searchValue}
                                            onChange={handleSearchValueChange}
                                        />
                                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" disabled>
                                            <SearchIcon />
                                        </IconButton>
                                    </div>
                                </div>
                                <div style={{ marginLeft: '8px' }}>
                                    <TextField
                                        sx={{ width: 250, height: 40 }}
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
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', maxWidth: '100%' }}>
                                {skillList
                                    .filter((s) => s.skillName.toLowerCase().includes(searchValue.toLowerCase()))
                                    .filter((s) => selectedType === '' || s.skillType === selectedType)
                                    .sort((a, b) => a.skillName.localeCompare(b.skillName))
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
                                                disabled={isAddButtonDisabled(item)}
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
                                        <Typography variant="body2" sx={{ fontSize: 17, color: 'red', display: 'flex', alignItems: 'center' }}>
                                            <CancelIcon sx={{ fontSize: 20, color: 'red', marginRight: '10px' }} /> Not Found Skill
                                        </Typography>
                                    )}
                            </div>
                        </div>
                    </Box>
                    <Button variant="contained" color="success" sx={{ alignSelf: 'flex-end', mt: 2 }} onClick={handleSubmit}>
                        Submit
                    </Button>

                </Grid>
            </Grid>
        </div >
    )
}

export default PersonnelEdit