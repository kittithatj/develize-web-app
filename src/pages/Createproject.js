import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Chip, Button, MenuItem, Select, IconButton } from "@mui/material";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate, useOutletContext } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';
import { skillTypeList } from '../config/skill-type-list';
import Pagination from '@mui/material/Pagination';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

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
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';

function Createproject() {
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const [user, setUser, openSnackbar] = useOutletContext({});
    const [skillList, setSkillList] = useState([]);
    const [skillSelect, setSkillSelect] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const [displayedSkills, setDisplayedSkills] = useState([]);
    const [currentType, setCurrentType] = useState('');

    const handleMemberChange = (event, index) => {
        const updatedMembers = [...formData.memberIdList];
        updatedMembers[index] = event.target.value;
        setFormData({ ...formData, memberIdList: updatedMembers });
    };

    const handleRoleChange = (event, index) => {
        const updatedRoles = [...formData.role];
        updatedRoles[index] = event.target.value;
        setFormData({ ...formData, role: updatedRoles });
    };

    const handleAddRow = () => {
        setFormData({
            memberIdList: [...formData.memberIdList, ''],
            role: [...formData.role, ''],
        });
    };

    const handleRemoveRow = (index) => {
        const updatedMembers = [...formData.memberIdList];
        const updatedRoles = [...formData.role];
        updatedMembers.splice(index, 1);
        updatedRoles.splice(index, 1);
        setFormData({ memberIdList: updatedMembers, role: updatedRoles });
    };

    const fetchSkillData = () => {
        setLoading(true)
        skillApi.getAllSKills().then(data => {
            setSkillList(data);
            setDisplayedSkills(data);
            setLoading(false);
            console.log('Skill SP', data);
        });
    }

    const handleSkillTypeChange = (event) => {
        setSelectedType(event.target.value);
    }
    const handleSearchValueChange = (event) => {
        setSearchValue(event.target.value);
    }

    const [loadingPerson, setLoadingPerson] = useState(false);
    const [dataPersonnel, setDataPersonnel] = useState('');

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
    const memberOptions = ["Project Leader", "Developer", "Engineer", "Tester"];
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
        role: '',
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
                const skillIds = Array.isArray(prevData.skillRequireIdList)
                    ? [...prevData.skillRequireIdList, item.skill_id]
                    : [item.skill_id];
                return { ...prevData, skillRequireIdList: skillIds };
            });
        }
    };

    const handleDeleteSkill = (item) => {
        const updatedSkills = skillSelect.filter((selectedSkill) => selectedSkill.skill_id !== item.skill_id);
        setSkillSelect(updatedSkills);
        setFormData(prevData => {
            const skillIds = Array.isArray(prevData.skillRequireIdList)
                ? prevData.skillRequireIdList.filter((id) => id !== item.skill_id)
                : [];
            return { ...prevData, skillRequireIdList: skillIds };
        });
    }


    const formatDate = (inputDate) => {
        if (inputDate) {
            const parts = inputDate.split('-');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }
        return inputDate;
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
                                type='date'
                                sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                                variant="outlined"
                                value={formatDate(formData.startDate)}
                                onChange={(event) => setFormData({ ...formData, startDate: formatDate(event.target.value) })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                type='date'
                                sx={{ mt: 1, mb: 2, width: "50%", }}
                                variant="outlined"
                                value={formatDate(formData.endDate)}
                                onChange={(event) => setFormData({ ...formData, endDate: formatDate(event.target.value) })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ mt: 1, mb: 2, width: "100%", marginLeft: '10px' }}
                                variant="outlined"
                                value={formData.budget}
                                onChange={(event) => setFormData({ ...formData, budget: parseFloat(event.target.value) })}
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
                            <Select
                                startAdornment={(
                                    <InputAdornment position="start">
                                        <AutorenewIcon />
                                    </InputAdornment>
                                )}
                                sx={{ mt: 1, mb: 2, width: "100%", }}
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

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ fontSize: '15px', marginLeft: '10px' }}>Member List</span>
                            <IconButton
                                onClick={handleAddRow}
                                sx={{ p: '5px', alignSelf: 'center' }}
                            >
                                <AddIcon />
                            </IconButton>
                        </div>
                        <div style={{ width: "100%", marginBottom: '15px' }}>
                            {formData.memberIdList.map((member, index) => (
                                <div key={index} style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                    <Select
                                        sx={{
                                            mt: 1,
                                            mb: 2,
                                            width: "100%",
                                            height: "100%",
                                            marginRight: 2,
                                        }}
                                        value={formData.memberIdList[index]}
                                        onChange={(event) => handleMemberChange(event, index)}
                                    >
                                        <MenuItem value="">Select Member</MenuItem>
                                        {dataPersonnel.map((person) => (
                                            <MenuItem key={person.personnel_id} value={person.personnel_id}>
                                                {person.firstName} {person.lastName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Select
                                        sx={{
                                            mt: 1,
                                            mb: 2,
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        value={formData.role[index]}
                                        onChange={(event) => handleRoleChange(event, index)}
                                    >
                                        <MenuItem value="">Select Role</MenuItem>
                                        {memberOptions.map((role) => (
                                            <MenuItem key={role} value={role}>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            onClick={() => handleRemoveRow(index)}
                                            sx={{ p: '5px', alignSelf: 'center', marginLeft: '8px' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <span style={{ fontSize: '15px', marginLeft: '10px' }}>Skill Required</span>
                        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '8px', minHeight: '100px', height: 'auto', width: '100%' }}>
                            {skillSelect.map((item) => (
                                <Chip
                                    key={item.skill_id}
                                    sx={{
                                        m: 1,
                                        height: '35px',
                                        backgroundColor: '#e6e6e6',
                                        color: 'black',
                                        border: '1px solid black',
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

                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <TextField
                                    id="standard-basic"
                                    label="Search Skill"
                                    variant="standard"
                                    sx={{ width: '110%' }}
                                    value={searchValue}
                                    onChange={handleSearchValueChange}
                                    inputProps={{ 'aria-label': 'search skill' }}
                                />
                            </div>
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" disabled>
                                <SearchIcon />
                            </IconButton>
                            <div style={{ marginLeft: '8px', flex: 1 }}>
                                <TextField
                                    sx={{ width: '100%', height: 40, }}
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
                            {displayedSkills
                                .filter((s) => s.skillName.toLowerCase().includes(searchValue.toLowerCase()) &&
                                    (selectedType === '' || s.skillType === selectedType))
                                .map((item, index) => (
                                    <Card
                                        sx={{
                                            backgroundColor: '#EEEEEE',
                                            flexBasis: 'calc(50% - 8px)',
                                            border: 'none',
                                            height: '100px',
                                            minWidth: '200px',
                                        }}
                                        key={item.skill_id}
                                    >
                                        <CardContent>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ fontSize: '24px', marginRight: '8px' }}>{getSkillTypeIcon(item.skillType)}</span>
                                                <Typography variant="h6" gutterBottom>
                                                    {item.skillName}
                                                </Typography>
                                                <Button
                                                    variant="text"
                                                    disableElevation
                                                    sx={{
                                                        backgroundColor: 'transparent',
                                                        color: 'black',
                                                        border: 'none',
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '1000%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        '&:hover': {
                                                            backgroundColor: 'transparent',
                                                            color: 'white',
                                                        },
                                                    }}
                                                    onClick={() => addSkill(item)}
                                                    disabled={skillSelect.some((selectedSkill) => selectedSkill.skill_id === item.skill_id)}
                                                >
                                                    <AddIcon />
                                                </Button>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.skillType}
                                                </Typography>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                        <Button
                            variant="contained"
                            color="success"
                            style={{ marginTop: '10px', marginLeft: 'auto' }}
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
                            Create Project
                        </Button>

                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default Createproject;
