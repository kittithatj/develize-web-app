import React, { useEffect, useState } from 'react';
import {
    Avatar, Badge, Box, Typography, TextField, InputAdornment, Chip,
    Button, IconButton, MenuItem, Select
} from "@mui/material";
import Grid from '@mui/material/Grid';
import DatePicker from "@mui/lab/DatePicker";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate, useOutletContext } from 'react-router-dom';

// API
import { skillApi } from '../api/skill-api';
import { ProjectAPI } from "../api/project-api";
import { PersonnelAPI } from '../api/personnel-api'

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

function Createproject() {
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const [user, setUser, openSnackbar] = useOutletContext({});
    const [skillList, setSkillList] = useState([]);
    const [skillSelect, setSkillSelect] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [chipCount, setChipCount] = useState(0);
    const [displayedSkills, setDisplayedSkills] = useState([]);
    const [currentType, setCurrentType] = useState('');
    const [selectedSkillIds, setSelectedSkillIds] = useState([]);

    const fetchSkillData = () => {
        setLoading(true)
        skillApi.getAllSKills().then(data => {
            setSkillList(data);
            setDisplayedSkills(data);
            setLoading(false);
            console.log('Skill SP', data);
        });
    }

    const [loadingPerson, setLoadingPerson] = useState(false);
    const [dataPersonnel, setDataPersonnel] = useState('');
    const [skillPersonnel, setSkillPersonnel] = useState('');

    const fetchPersonnelData = () => {
        setLoadingPerson(true);
        PersonnelAPI.getAllPersonnel().then(data => {
            setDataPersonnel(data);
        });
    }

    const [projectName, setProjectName] = useState('');
    const [projectDes, setProjectDes] = useState('');
    const typeOptions = ["Digital Marketing", "AppService", "Security System"];
    const statusOptions = ["On Success", "On Holding", "On Going"];
    const [projectStart, setProjectStart] = useState('');
    const [projectEnd, setProjectEnd] = useState('');
    const [projectBudget, setProjectBudget] = useState('');

    const [formData, setFormData] = useState({
        projectName: '',
        projectType: '',
        projectDescription: '',
        startDate: '',
        endDate: '',
        skillRequireIdList: [],
        budget: '',
        projectStatus: '',
        memberIdList: [],
    });

    useEffect(() => {
        fetchSkillData();
        fetchPersonnelData();
    }, [currentType]);

    const createProjectData = () => {
        if (
            formData.projectName === '' ||
            formData.projectType === '' ||
            formData.projectDescription === '' ||
            formData.startDate === '' ||
            formData.endDate === '' ||
            formData.budget === '' ||
            skillSelect.length === 0 ||
            formData.memberIdList.length === 0
        ) {
            openSnackbar({
                status: 'error',
                message: 'Field is empty',
            });
            return;
        }
        console.log('formData:', formData);
        const skillIds = skillSelect.map((skill) => skill.skill_id);

        const dataToSend = {
            projectName: formData.projectName,
            projectType: formData.projectType,
            projectDescription: formData.projectDescription,
            startDate: formData.startDate,
            endDate: formData.endDate,
            skillRequireIdList: skillSelect.map((skill) => skill.skill_id),
            budget: formData.budget,
            projectStatus: formData.projectStatus,
            memberIdList: formData.memberIdList,
        };

        ProjectAPI.createProject(dataToSend)
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
                    message: 'Create Project Successfully',
                });
                navigate('../Project');
            })
            .catch(() => {
                openSnackbar({
                    status: 'error',
                    message: 'Create Project Failed',
                });
            });
    }

    const addSkill = (item) => {
        if (!skillSelect.some((selectedSkill) => selectedSkill.skill_id === item.skill_id)) {
            setSkillSelect(prevSkills => [...prevSkills, item]);
            setFormData(prevData => {
                const skillIds = [...prevData.skillRequireIdList, item.skill_id];
                return { ...prevData, skillRequireIdList: skillIds };
            });
        }
    };

    const handleDeleteSkill = (item) => {
        const updatedSkills = skillSelect.filter((selectedSkill) => selectedSkill.skill_id !== item.skill_id);
        setSkillSelect(updatedSkills);
        setFormData(prevData => {
            const skillIds = updatedSkills.map((skill) => skill.skill_id);
            return { ...prevData, skillRequireIdList: skillIds };
        });
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

    return (
        <div className="main-content">
            <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
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
                                value={formData.projectName}
                                onChange={(event) => setFormData({ ...formData, projectName: event.target.value })}
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
                                value={formData.projectType}
                                startAdornment={(
                                    <InputAdornment position="start">
                                        <TypeSpecimenIcon />
                                    </InputAdornment>
                                )}
                                onChange={(event) => setFormData({ ...formData, projectType: event.target.value })}
                            >
                                {typeOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", width: '100%' }}>
                            <TextField
                                sx={{ mt: 1, mb: 2, width: "100%", }}
                                variant="outlined"
                                label="Description"
                                value={formData.projectDescription}
                                onChange={(event) => setFormData({ ...formData, projectDescription: event.target.value })}
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
                                value={formData.startDate}
                                onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
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
                                value={formData.endDate}
                                onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
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
                                value={formData.budget}
                                onChange={(event) => setFormData({ ...formData, budget: event.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", marginTop: '10px', width: '100%' }}>
                            {dataPersonnel.length > 0 ? (
                                <Select
                                    sx={{ mt: 1, mb: 2, width: "50%" }}
                                    multiple
                                    value={formData.memberIdList}
                                    onChange={(event) => setFormData({ ...formData, memberIdList: event.target.value })}
                                >
                                    <MenuItem value="">Select Member</MenuItem>
                                    {dataPersonnel.map((person) => (
                                        <MenuItem key={person.personnel_id} value={person.personnel_id}>
                                            {person.firstName} {person.lastName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            ) : (
                                <p>Loading data...</p>
                            )}
                            <Select
                                sx={{ mt: 1, mb: 2, width: "50%", marginLeft: '15px' }}
                                value={formData.projectStatus}
                                onChange={(event) => setFormData({ ...formData, projectStatus: event.target.value })}
                            >
                                {statusOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <span style={{ fontSize: '15px', marginLeft: '10px' }}>Skill Required</span>
                        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '8px', minHeight: '100px', height: 'auto', width: '100%' }}>
                            {skillSelect.map((item) => (
                                <Chip
                                    key={item.skill_id}
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
                        <Button
                            variant="contained"
                            color="success"
                            style={{ marginTop: '10px' }}
                            disabled={
                                activeStep === 0 &&
                                (formData.projectName === '' ||
                                    formData.projectType === '' ||
                                    formData.projectDescription === '' ||
                                    formData.startDate === '' ||
                                    formData.endDate === '' ||
                                    formData.budget === '' ||
                                    skillSelect.length === 0)
                            }
                            onClick={createProjectData}
                        >
                            Create Personnel
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default Createproject;
