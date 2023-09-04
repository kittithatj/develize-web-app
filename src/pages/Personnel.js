import { AvatarGroup, Box, Chip, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, ThemeProvider, Tooltip, Typography, createTheme } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment';
import React, { useEffect, useState } from 'react'
import ProfileAvatar from '../components/ProfileAvatar'
import { Api } from '../config/api-config';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SkillFroupAvatar from '../components/SkillGroupAvatar';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

function Personnel() {


    const [personnel, setPersonnel] = useState([])

    const fetchPersonnelData = () => {
        fetch(Api.url + Api.personnel_get)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setPersonnel(data)
            })
    }
    

    useEffect(() => {
        fetchPersonnelData()
    }, [])

    const fullname = (p) => {
        return p.firstName + ' ' + p.lastName;
    }

    const theme = createTheme({
        status: {
            danger: '#e53e3e',
        },
        palette: {
            primary: {
                main: '#0971f1',
                darker: '#053e85',
            },
            success: {
                main: '#64dd17',
                contrastText: '#fff',
            },
            warning: {
                main: '#fbc02d',
                contrastText: '#fff',
            }
        },
    });

    const status = (p) => {
        if (p.projectHistories.length === 0) {
            return { status: 'Not Assigned', color: 'success' }
        } else {
            let count = 0;
            p.projectHistories.forEach(project => {
                if (project.project.projectStatus === 'In Progress') count++;

            })
            if (count > 0) {
                return ({ status: count + ' Project Working', color: 'warning' })
            } else {
                return ({ status: 'Not Assigned', color: 'success' })
            }
        }
    }

    return (
        <div className='main-content'>
            <div className='top-content'>
                <ThemeProvider theme={theme}>
                    <Typography sx={{ mt: 1, mb: 1, fontWeight: 'bold' }} variant="h5" component="div">
                        Personnel Management
                    </Typography>
                    <div>
                        {personnel.length > 0 && (
                            <List sx={{ width: '60vw', minWidth: 500, bgcolor: 'background.paper', zIndex: 200, padding: 0 }}>
                                {personnel.map((personnel, i, array) => {
                                    return <ListItemButton component="div" key={personnel.personnel_id} divider={i + 1 === array.length ? false : true} href={'personnel/view'}>
                                        <ListItemAvatar>
                                            <ProfileAvatar variant='circular' name={fullname(personnel)} />
                                        </ListItemAvatar>
                                        <ListItemText sx={{ width: '30%' }} primary={fullname(personnel)} secondary={personnel.position} />
                                        <Box component="div" sx={{ display: 'flex', width: '30%' }}>
                                            <Chip label={status(personnel).status} color={status(personnel).color} sx={{
                                                justifyContent: 'center',
                                                "& .MuiChip-label": {
                                                    margin: 0,
                                                }
                                            }} />
                                        </Box>
                                        <Box component="div" sx={{ display: 'flex', width: '40%' }}>
                                            {personnel.skills.length > 0 && (
                                                <AvatarGroup max={5}>
                                                    {personnel.skills
                                                        .map((skill) => {
                                                            return <Tooltip key={skill?.skill_id} title={skill.skillName}>
                                                                <div >
                                                                    <SkillFroupAvatar variant='circular' name={skill.skillName} />
                                                                </div>
                                                            </Tooltip>
                                                        })
                                                    }
                                                </AvatarGroup>
                                            )}
                                        </Box>
                                        <Link to={'edit/' + personnel.personnel_id}>
                                            <IconButton sx={{ margin: 1, bgcolor: 'white' }} edge="end" aria-label="edit" size="large">
                                                <DriveFileRenameOutlineIcon />
                                            </IconButton>
                                        </Link>
                                        
                                        <IconButton sx={{ bgcolor: 'white' }} edge="end" aria-label="assess" size="large" href={'personnel/assess/' + personnel.personnel_id}>
                                            <AssignmentIcon />
                                        </IconButton>
                                    </ListItemButton>
                                })
                                }
                            </List>)}
                            <IconButton sx={{ bgcolor: 'white' }} edge="end" aria-label="assess" size="large" href={'personnel/create/'}>
                                    <AddIcon />
                            </IconButton>
                    </div>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default Personnel