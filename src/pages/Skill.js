import React, { useEffect, useState } from 'react'
import { Api } from '../config/api-config'
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from '../components/ConfirmDialog'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { red } from '@mui/material/colors';
import SkillFormDialog from '../components/SkillFormDialog';
import { skillTypeList } from '../config/skill-type-list';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import SnackbarComponent from '../components/SnackbarComponent';
import StorageIcon from '@mui/icons-material/Storage';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HandymaIconn from '@mui/icons-material/Handyman';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TerminalIcon from '@mui/icons-material/Terminal';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { skillApi } from '../api/skill-api';
function Skill() {

    const [skill, setSkill] = useState([])
    const [confirmTrigger, setConfirmTrigger] = useState(false);
    const [createSkillTrigger, setCreateSkillTrigger] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [selectedType, setSelectedType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarStatus, setSnackbarStatus] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchSkillData = () => {
        skillApi.getAllSKills().then(data => {
            setSkill(data)
        })
    }

    useEffect(() => {
        fetchSkillData()
    }, [])

    const createSkillData = (skillForm) => {
        skillApi.createSkill(skillForm)
            .then(res => console.log(res.json()))
            .then(() => {
                fetchSkillData();
                setSnackbarStatus('success');
                setSnackbarMessage('Skill created successfully');
                setOpenSnackbar(true);
            })
            .catch(error => {
                console.error(error);
                setSnackbarStatus('error');
                setSnackbarMessage('Error creating skill');
                setOpenSnackbar(true);
            });
    }

    const deleteSkill = (id) => {
        skillApi.deleteSkill(id)
            .then(() => {
                setSnackbarStatus('success');
                setSnackbarMessage('Skill deleted successfully');
                setOpenSnackbar(true);
                fetchSkillData();
            })
            .catch(error => {
                console.error(error);
                setSnackbarStatus('error');
                setSnackbarMessage('Error deleting skill');
                setOpenSnackbar(true);
            });
    }

    const handleSkillTypeChange = (event) => {
        // console.log(event.target.value);
        setSelectedType(event.target.value);
    }

    const handleSearchValueChange = (event) => {
        // console.log(event.target.value);
        setSearchValue(event.target.value);
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };


    const SkillNotFound = () => {
        return (

            <ListItem key={0}>
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: red[400] }}>
                        <HighlightOffIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText>
                    No Skill Found
                </ListItemText>
            </ListItem>
        )
    }

    const skillTypeIcon = (skill) => {
        if (skill.skillType === 'Database') {
            return <StorageIcon />
        }
        else if (skill.skillType === 'Others') {
            return <MoreHorizIcon />
        }
        else if (skill.skillType === 'Tool') {
            return <HandymaIconn />
        }
        else if (skill.skillType === 'Library') {
            return <MenuBookIcon />
        }
        else if (skill.skillType === 'Programming Language') {
            return <TerminalIcon />
        }
        else if (skill.skillType === 'Framework') {
            return <IntegrationInstructionsIcon />
        } else return <MoreHorizIcon />
    }
    return (
        <div className='main-content'>
            <div>
                <Typography sx={{ mt: 1, mb: 1, fontWeight: 'bold' }} variant="h5" component="div">
                    Skill Management
                </Typography>
                <div>
                    <Paper
                        elevation={0}
                        sx={{ mt: 2, mb: 2, display: 'inline-flex', alignItems: 'center', width: 400 }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Skill"
                            inputProps={{ 'aria-label': 'search skill' }}
                            value={searchValue}
                            onChange={handleSearchValueChange}>
                        </InputBase>
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" disabled>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <TextField
                        sx={{ mb: 2, mt: 2, ml: 2, width: 200, height: 40 }}
                        size='small'
                        id="select-skill-type"
                        select
                        label="Select Skill Type"
                        variant="filled"
                        value={selectedType}
                        onChange={handleSkillTypeChange}>
                        {skillTypeList.map((type) => (
                            <MenuItem key={type.label} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                {skill.length > 0 && (
                    <List sx={{ width: '90vw', maxWidth: 615, minWidth: 300, bgcolor: 'background.paper', zIndex: 200 }}>
                        {skill
                            .filter((skill) => {
                                return skill.skillType.includes(selectedType)
                            })
                            .filter((skill) => {
                                return skill.skillName.toLowerCase().includes(searchValue.toLowerCase())
                            })
                            .map((skill, i, array) => {
                                return <ListItem key={skill.skill_id} divider={i + 1 === array.length ? false : true}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            {skillTypeIcon(skill)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={skill.skillName} secondary={skill.skillType} />
                                    <IconButton edge="end" aria-label="delete" onClick={() => { setConfirmTrigger(true); setSelectedId(skill.skill_id) }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            })
                        }
                        {skill.filter((skill) => {
                            return skill.skillType.includes(selectedType)
                        })
                            .filter((skill) => {
                                return skill.skillName.toLowerCase().includes(searchValue.toLowerCase())
                            }).length === 0 && (<SkillNotFound></SkillNotFound>)}
                    </List>
                )}
                {skill.length === 0 && (
                    <List sx={{ width: '100%', minWidth: 600, bgcolor: 'background.paper', zIndex: 200 }}>
                        <SkillNotFound></SkillNotFound>
                    </List>
                )}
                <ConfirmDialog
                    trigger={confirmTrigger}
                    setTrigger={setConfirmTrigger}
                    confirm={deleteSkill}
                    id={selectedId}
                    title="Delete Skill"
                    description="Do you want to delete this skill?"
                    comfirmText="Delete" />
                <SkillFormDialog
                    trigger={createSkillTrigger}
                    setTrigger={setCreateSkillTrigger}
                    create={createSkillData}
                />
            </div>
            <Button onClick={() => (setCreateSkillTrigger(true))} sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 2300 }} variant="contained" startIcon={<AddIcon />}>
                Create skill
            </Button>

            <SnackbarComponent open={openSnackbar} handleClose={handleCloseSnackbar} severity={snackbarStatus} message={snackbarMessage} />
        </div >
    )
}

export default Skill