import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Box, Typography, TextField, InputAdornment, Chip, Button, IconButton, MenuItem, Link, Select } from "@mui/material";
import Grid from '@mui/material/Grid';
import DatePicker from "@mui/lab/DatePicker";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useParams } from 'react-router-dom'

// API
import { skillApi } from '../api/skill-api';
import { PersonnelAPI } from '../api/personnel-api'
import { ProjectAPI } from "../api/project-api"

// ICON
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
import PersonIcon from '@mui/icons-material/Person';

function ProjectDetail() {
    const [skillList, setSkillList] = useState([])
    const [skillSelect, setSkillSelect] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [chipCount, setChipCount] = useState(0);
    const [displayedSkills, setDisplayedSkills] = useState([]);
    const [currentType, setCurrentType] = useState('');

    const [projectName, setProjectName] = useState('');
    const [projectDes, setProjectDes] = useState('');
    const [projectType, setProjectType] = useState('');
    const [projectStart, setProjectStart] = useState('');
    const [projectEnd, setProjectEnd] = useState('');
    const [projectBudget, setProjectBudget] = useState('');
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectData, setProjectData] = useState([]);
    const [memberFullName, setMemberFullName] = useState({});



    const status = (projectData) => {
        if (projectData.projectStatus === "On-Going") {
            return { status: 'On-Going', color: 'warning' };
        }
        else if (projectData.projectStatus === "On-Success") {
            return { status: 'On-Success', color: 'success' };
        }
        else if (projectData.projectStatus === "On-Holding") {
            return { status: 'On-Holding', color: 'error' };
        }
    };


    const { id } = useParams();

    const fetchSkillData = () => {
        setLoading(true)
        skillApi.getAllSKills().then(data => {
            setSkillList(data)
            setDisplayedSkills(data)
            setLoading(false)
            console.log('Skill SP', data)
        })
    }


    const [skillsRequired, setSkillsRequired] = useState([]);
    const fetchProjectData = () => {
        setProjectLoading(true);
        ProjectAPI.getProject(id).then(data => {
            console.log("All Project Data:", data);

            const matchingProjects = data.filter(project => project.project_id === 2);
            if (matchingProjects.length > 0) {
                const project = matchingProjects[0];
                setProjectData(project);
                setProjectName(project.projectName);
                setProjectDes(project.projectDescription);
                setProjectType(project.projectType);
                setProjectStart(project.startDate);
                setProjectEnd(project.endDate);
                setProjectBudget(project.budget);

                setSkillsRequired(project.skillsRequired.reduce((skillReq, skill) => {
                    skillReq[skill.skill_id] = skill;
                    return skillReq;
                }, {}));


                if (project.projectMember) {
                    const membersFullNames = {};
                    project.projectMember.forEach((member, index) => {
                        if (member.firstName && member.lastName) {
                            membersFullNames[index] = `${member.firstName} ${member.lastName}`;
                        } else {
                            membersFullNames[index] = 'null';
                        }
                    });
                    setMemberFullName(membersFullNames);
                    console.log(membersFullNames, 'fullname');
                }
            }
        });
    };

    useEffect(() => {
        fetchSkillData();
        fetchProjectData(id);
    }, [currentType, id]);

    useEffect(() => {
        console.log('required', skillsRequired);
    }, [skillsRequired]);


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
                            {projectType === 'Security System' && <img src="https://i.ibb.co/SwPWB9h/security.png" width="100%" height="100%" />}
                            {projectType === 'Digital Marketing' && <img src="https://i.ibb.co/mv0tX9b/buissines.jpg" width="100%" height="100%" />}
                            {projectType === 'AppService' && <img src="https://i.ibb.co/ygSHmW2/buissines-1.png" width="100%" height="100%" />}
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
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                            }}
                        >
                            <Typography variant="h5" component="div">
                                ProjectDetail
                            </Typography>
                        </Box>

                        <div style={{ display: "flex", flexDirection: "row", marginTop: '10px', width: '100%' }}>
                            <TextField
                                sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                                variant="outlined"
                                label="Project Name"
                                value={projectName}
                                onChange={(event) => setProjectName(event.target.value)}
                                disabled
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
                                value={projectType}
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
                                disabled
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
                                onChange={(event) => setProjectStart(event.target.value)}
                                disabled
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
                                disabled
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
                                disabled
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
                            {skillList.filter(skill => skillsRequired[skill.skill_id]).map((item) => (
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
                                    avatar={getSkillTypeIcon(item.skillType)}
                                />
                            ))}
                        </div>
                        <span style={{ fontSize: '15px', marginLeft: '10px', marginTop: '10px' }}>Project Member</span>
                        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '8px', minHeight: '100px', height: 'auto', width: '100%' }}>
                            {Object.values(memberFullName).map((fullName, index) => (
                                <Chip
                                    key={index}
                                    sx={{
                                        m: 1,
                                        height: '35px',
                                        backgroundColor: '#D1D1D1',
                                        color: 'black',
                                    }}
                                    variant="filled"
                                    color="info"
                                    size="medium"
                                    label={fullName}
                                    avatar={<Avatar><PersonIcon /></Avatar>}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', maxWidth: '100%' }}>
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default ProjectDetail;
