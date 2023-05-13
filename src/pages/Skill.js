import React, { useEffect, useState } from 'react'
import { Api } from '../config/api-config'
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import CodeIcon from '@mui/icons-material/Code';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from '../components/ConfirmDialog'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
function Skill() {

    const [skill, setSkill] = useState([])
    const [confirmTrigger, setConfirmTrigger] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [selectedType, setSelectedType] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const fetchSkillData = () => {
        fetch(Api.url + Api.skill_get)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setSkill(data)
            })
    }


    useEffect(() => {
        fetchSkillData()
    }, [])

    const deleteSkill = (id) => {
        fetch(Api.url + Api.skill_delete + id, {
            method: 'DELETE'
        })
            .then(res => console.log(res.text()))
            .then(() => fetchSkillData())
            .catch(error => console.error(error));
    }

    const setTrigger = (t) => {
        setConfirmTrigger(t)
    }

    const handleSkillTypeChange = (event) => {
        // console.log(event.target.value);
        setSelectedType(event.target.value);
    }

    const handleSearchValueChange = (event) => {
        // console.log(event.target.value);
        setSearchValue(event.target.value);
    }

    const skillTypeList = [{
        value: '',
        label: 'All',
    },
    {
        value: 'Programming Language',
        label: 'Programming Language',
    },
    {
        value: 'Library',
        label: 'Library',
    },
    {
        value: 'Framework',
        label: 'Framework',
    },
    {
        value: 'Database',
        label: 'Database',
    },
    {
        value: 'Markup Language',
        label: 'Markup Language',
    },
    {
        value: 'Cloud',
        label: 'Cloud',
    },
    {
        value: 'Others',
        label: 'Others',
    }];

    return (
        <div className='main-content'>
            <div>
                <Typography sx={{ mt: 2, mb: 2 }} variant="h5" component="div">
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
                    <List sx={{ width: '100%', minWidth: 600, bgcolor: 'background.paper', zIndex: 200 }}>
                        {skill
                            .filter((skill) => {
                                return skill.skillType.includes(selectedType)
                            })
                            .filter((skill) => {
                                return skill.skillName.toLowerCase().includes(searchValue.toLowerCase())
                            })
                            .map((skill, i, array) => (
                                <ListItem key={skill.skill_id} divider={i + 1 === array.length ? false : true}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <CodeIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={skill.skillName} secondary={skill.skillType} />
                                    <IconButton edge="end" aria-label="delete" onClick={() => { setTrigger(true); setSelectedId(skill.skill_id) }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                    </List>
                )}
                <ConfirmDialog trigger={confirmTrigger} setTrigger={setTrigger} confirm={deleteSkill} id={selectedId} />
            </div>
        </div >
    )
}

export default Skill