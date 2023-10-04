//SYSTEM
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Box, Typography, TextField, InputAdornment, Chip, Button, IconButton, MenuItem, Link, Select } from "@mui/material";
import Grid from '@mui/material/Grid';
import DatePicker from "@mui/lab/DatePicker";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// API
import { skillApi } from '../api/skill-api';
import { PersonnelAPI } from '../api/personnel-api'

//ICON
import StorageIcon from '@mui/icons-material/Storage';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HandymaIconn from '@mui/icons-material/Handyman';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TerminalIcon from '@mui/icons-material/Terminal';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import DnsIcon from '@mui/icons-material/Dns';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

function Createproject() {

    const [skillList, setSkillList] = useState([])
    const [skillSelect, setSkillSelect] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [chipCount, setChipCount] = useState(0);
    const [displayedSkills, setDisplayedSkills] = useState([]);
    const [currentType, setCurrentType] = useState('');


    const fetchSkillData = () => {
        setLoading(true)
        skillApi.getAllSKills().then(data => {
            setSkillList(data)
            setDisplayedSkills(data)
            setLoading(false)
            console.log('Skill SP', data)
        })
    }

    const [projectName, setProjectName] = useState('');
    const [projectDes, setProjectDes] = useState('');
    const [projectType, setProjectType] = useState('');
    const [projectStart, setProjectStart] = useState('');
    const [projectEnd, setProjectEnd] = useState('');
    const [projectBudget, setProjectBudget] = useState('');


    useEffect(() => {
        fetchSkillData()
    }, [currentType]);



    const handleDeleteSkill = (item) => {
        setSkillSelect(skillSelect.filter((s) => s.skill_id !== item.skill_id))
    }

    const addSkill = (item) => {
        setSkillSelect(prevArray => [...prevArray, item])
        setTimeout(() => console.log(skillSelect), 200)
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

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPictureType, setSelectedPictureType] = useState('');
    const [imageURL, setImageURL] = useState('https://i.ibb.co/rxmfKsL/buissines-3.png');

    return (
        <div className="main-content">
            <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
                <Grid item xs={12} md={4} className="sticky-grid-item">
                    <Box
                        sx={{
                            width: "100%",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: '10px'
                        }}
                    >
                        <div style={{ borderRadius: '10px', height: '320px', alignItems: 'center', backgroundColor: 'white' }}>
                            <img src={imageURL} width="100%" height="100%" />
                        </div>
                        <div>
                            <div style={{ display: "flex", flexDirection: "row", marginTop: '10px' }}>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%" }}
                                    variant="outlined"
                                    label="Project Name"
                                    value={projectName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DnsIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    disabled
                                />

                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "50%", marginLeft: '10px' }}
                                    variant="outlined"
                                    label="Type"
                                    value={projectType}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TypeSpecimenIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%", }}
                                    variant="outlined"
                                    label="Description"
                                    value={projectDes}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DescriptionIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", marginTop: '10px', width: '100%' }}>
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%", marginRight: 2 }}
                                    variant="outlined"
                                    label="Start"
                                    value={projectStart}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccessTimeIcon />
                                            </InputAdornment>
                                        ),
                                    }}

                                />
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%", marginRight: 2 }}
                                    variant="outlined"
                                    label="End"
                                    value={projectEnd}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccessTimeIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    sx={{ mt: 1, mb: 2, width: "100%" }}
                                    variant="outlined"
                                    label="Budget"
                                    value={projectBudget}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            width: "100%",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            padding: "15px",
                        }}
                    >
                        <Typography variant="h5" component="div" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
                            Create New Project
                        </Typography>
                        <div style={{ display: "flex", flexDirection: "row", marginTop: '10px', width: '100%' }}>
                            <TextField
                                sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                                variant="outlined"
                                label="Project Name"
                                value={projectName}
                                onChange={(event) => setProjectName(event.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DnsIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Select
                                sx={{ mt: 1, mb: 2, width: "50%", marginLeft: '10px' }}
                                value={selectedPictureType}
                                onChange={(event) => {
                                    setSelectedType(event.target.value);
                                    setCurrentType(event.target.value);
                                    if (event.target.value === 'Security System') {
                                        setImageURL('https://i.ibb.co/SwPWB9h/security.png');
                                    } else if (event.target.value === 'Digital Marketing') {
                                        setImageURL('https://i.ibb.co/mv0tX9b/buissines.jpg');
                                    } else if (event.target.value === 'AppService') {
                                        setImageURL('https://i.ibb.co/ygSHmW2/buissines-1.png');
                                    }
                                    setDisplayedSkills(
                                        skillList.filter((s) => currentType === '' || s.skillType === currentType)
                                    );
                                    setProjectType(event.target.value);
                                }}
                                startAdornment={(
                                    <InputAdornment position="start">
                                        <TypeSpecimenIcon />
                                    </InputAdornment>
                                )}
                            >
                                <MenuItem value="Security System">Security System</MenuItem>
                                <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
                                <MenuItem value="AppService">Application Service</MenuItem>
                            </Select>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", width: '100%' }}>
                            <TextField
                                sx={{ mt: 1, mb: 2, width: "100%", }}
                                variant="outlined"
                                label="Description"
                                value={projectDes}
                                onChange={(event) => setProjectDes(event.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", marginTop: '10px', width: '100%' }}>
                            <TextField
                                sx={{ mt: 1, mb: 2, width: "100%", marginRight: 2 }}
                                variant="outlined"
                                label="Start"
                                value={projectStart}
                                onChange={(event) => setProjectStart(event.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeIcon />
                                        </InputAdornment>
                                    ),
                                }}

                            />
                            <TextField
                                sx={{ mt: 1, mb: 2, width: "100%", marginRight: 2 }}
                                variant="outlined"
                                label="End"
                                value={projectEnd}
                                onChange={(event) => setProjectEnd(event.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ mt: 1, mb: 2, width: "100%" }}
                                variant="outlined"
                                label="Budget"
                                value={projectBudget}
                                onChange={(event) => setProjectBudget(event.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>


                        <span style={{ fontSize: '15px', marginLeft: '10px' }}>Skill Required</span>
                        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '8px', minHeight: '100px', height: 'auto', width: '100%' }}>
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
                            {displayedSkills
                                .filter((s) => s.skillName.toLowerCase().includes(searchValue.toLowerCase()))
                                .map((item, index) => (
                                    <Card
                                        sx={{
                                            backgroundColor: '#EEEEEE',
                                            flexBasis: 'calc(25% - 8px)',
                                            border: 'none',
                                            height: '145px'
                                        }}
                                        key={item.skill_id}
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
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </div >
    );
}

export default Createproject