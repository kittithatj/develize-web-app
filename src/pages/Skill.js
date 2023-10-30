import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from '../components/ConfirmDialog';
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
import StorageIcon from '@mui/icons-material/Storage';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HandymaIconn from '@mui/icons-material/Handyman';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TerminalIcon from '@mui/icons-material/Terminal';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { skillApi } from '../api/skill-api';
import { Box, CircularProgress } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

function Skill() {
    const [user, setUser, openSnackbar] = useOutletContext({});
    const [skill, setSkill] = useState([]);
    const [confirmTrigger, setConfirmTrigger] = useState(false);
    const [createSkillTrigger, setCreateSkillTrigger] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [selectedType, setSelectedType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 8; // เปลี่ยนจำนวนรายการต่อหน้าเป็น 8

    const fetchSkillData = () => {
        setLoading(true);
        skillApi.getAllSKills().then(data => {
            setSkill(data);
            setLoading(false);
        });
    }

    useEffect(() => {
        fetchSkillData();
    }, []);

    const createSkillData = (skillForm) => {
        setLoading(true);
        skillApi.createSkill(skillForm)
            .then(res => {
                if (res.status === 201) {
                    return res.json();
                } else {
                    throw new Error('Add Skill Failed');
                }
            })
            .then(() => {
                setTimeout(() => {
                    fetchSkillData();
                    setSearchValue('');
                    setSelectedType('');
                    openSnackbar({
                        status: 'success',
                        message: 'Add Skill Successfully'
                    });
                    setLoading(false);
                }, 1000);
            })
            .catch(error => {
                console.error(error);
                openSnackbar({
                    status: 'error',
                    message: 'Add Skill Failed'
                });
                setLoading(false);
            });
    }

    const deleteSkill = (id) => {
        skillApi.deleteSkill(id)
            .then(() => {
                openSnackbar({
                    status: 'success',
                    message: 'Delete Skill Successfully'
                });
                fetchSkillData();
                setSearchValue('');
                setSelectedType('');
            })
            .catch(error => {
                console.error(error);
                openSnackbar({
                    status: 'error',
                    message: 'Delete Skill Failed'
                });
            });
    }

    const handleSkillTypeChange = (event) => {
        setSelectedType(event.target.value);
    }

    const handleSearchValueChange = (event) => {
        setSearchValue(event.target.value);
        setPage(1);
    }

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
        );
    }

    const skillTypeIcon = (skill) => {
        if (skill.skillType === 'Database') {
            return <StorageIcon />;
        } else if (skill.skillType === 'Others') {
            return <MoreHorizIcon />;
        } else if (skill.skillType === 'Tool') {
            return <HandymaIconn />;
        } else if (skill.skillType === 'Library') {
            return <MenuBookIcon />;
        } else if (skill.skillType === 'Programming Language') {
            return <TerminalIcon />;
        } else if (skill.skillType === 'Framework') {
            return <IntegrationInstructionsIcon />;
        } else return <MoreHorizIcon />;
    }

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = skill
        .filter((skill) => skill.skillType.includes(selectedType))
        .filter((skill) => skill.skillName.toLowerCase().includes(searchValue.toLowerCase()));

    const displayedItems = currentItems.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className='main-content'>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ mt: 1, mb: 1, fontWeight: 'bold' }} variant="h5" component="div">
                    Skill Management
                </Typography>
                {loading && <CircularProgress sx={{ my: 5 }} size={100} />}
                {!loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Paper
                                elevation={0}
                                sx={{ mt: 2, mb: 2, display: 'inline-flex', alignItems: 'center', width: 400 }}
                            >
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
                        </Box>
                    </Box>
                )}

                {skill.length > 0 && !loading && (
                    <List sx={{ width: '90vw', maxWidth: 615, minWidth: 300, bgcolor: 'background.paper', zIndex: 200 }}>
                        {displayedItems.map((skill, i, array) => {
                            return (
                                <ListItem key={skill.skill_id} divider={i + 1 === array.length ? false : true}>
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
                            );
                        })}
                        {currentItems.length === 0 && <SkillNotFound />}
                    </List>
                )}
                {skill.length === 0 && (
                    <List sx={{ width: '100%', minWidth: 600, bgcolor: 'background.paper', zIndex: 200 }}>
                        <SkillNotFound />
                    </List>
                )}
                <ConfirmDialog
                    trigger={confirmTrigger}
                    setTrigger={setConfirmTrigger}
                    confirm={deleteSkill}
                    id={selectedId}
                    title="Delete Skill"
                    description="Do you want to delete this skill?"
                    comfirmText="Delete"
                />
                <SkillFormDialog
                    trigger={createSkillTrigger}
                    setTrigger={setCreateSkillTrigger}
                    create={createSkillData}
                />
                <Pagination
                    count={Math.ceil(currentItems.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    sx={{ mt: 2 }}
                />
            </Box>
            <Button onClick={() => (setCreateSkillTrigger(true))} sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 2300 }} variant="contained" startIcon={<AddIcon />}>
                Add skill
            </Button>

        </div>
    );
}

export default Skill;
