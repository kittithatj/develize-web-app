import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { Avatar, Badge, Box, Typography, TextField, InputAdornment, Chip, Button, IconButton, MenuItem, Select, Paper, createTheme, ThemeProvider } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { ProjectAPI } from "../api/project-api";
import { PersonnelAPI } from '../api/personnel-api';
import AddIcon from '@mui/icons-material/Add';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WebDevelopment from '../components/image/WebDevelopment.png';
import MobileAppDevelopment from '../components/image//MobileAppDevelopment.png';
import DesktopApplicationDevelopment from '../components/image/DesktopApplicationDevelopment.png';
import GameDevelopment from '../components/image/GameDevelopment.png';
import EmbeddedSystemDevelopment from '../components/image/EmbeddedSystemDevelopment.png';
import AIandMachineLearningDevelopment from '../components/image/AIandMachineLearningDevelopment.png';
import DatabaseManagementandSystem from '../components/image/DatabaseManagementandSystem.png';
import DevOpsandCICD from '../components/image/DevOpsandCICD.png';
import CloudBasedDevelopment from '../components/image/CloudBasedDevelopment.png';
import SecurityandCybersecuritySystem from '../components/image/SecurityandCybersecuritySystem.png';
import ArtificialRealityandVirtualRealityDevelopment from '../components/image/ArtificialRealityandVirtualRealityDevelopment.png';

function Project() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [projectData, setProjectData] = useState([]);
    const [projectLoading, setProjectLoading] = useState(false);

    const fetchProjectData = () => {
        setProjectLoading(true);
        ProjectAPI.getProject().then(data => {
            setProjectData(data);
            setProjectLoading(false);
            console.log('Project SP', data);
        });
    }

    const [dataPersonnel, setDataPersonnel] = useState([]);
    const [DataPersonnelLoading, setDataPersonnelLoading] = useState(false);

    const fetchPersonnelData = () => {
        setDataPersonnelLoading(true);
        PersonnelAPI.getAllPersonnel().then(data => {
            setDataPersonnel(data);
            console.log("Person", data);
        });
    }

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

    const theme = createTheme({
        status: {
            danger: "#e53e3e",
        },
        palette: {
            primary: {
                main: "#0971f1",
                darker: "#053e85",
            },
            success: {
                main: "#64dd17",
                contrastText: "#fff",
            },
            warning: {
                main: "#fbc02d",
                contrastText: "#fff",
            },
        },
    });

    useEffect(() => {
        fetchProjectData();
        fetchPersonnelData();
    }, []);

    return (
        <div className="main-content">
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-center",
                    justifyContent: "flex-center",
                    padding: "15px",
                    margin: "10px",
                }}
            >
                <Paper sx={{ padding: "30px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: '12px' }}>
                        <Typography
                            sx={{
                                mt: 1,
                                mb: 1,
                                fontWeight: "bold",
                            }}
                            variant="h5"
                            component="div"
                        >
                            Project Management
                        </Typography>
                        <Link to={"/project/createproject"}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                            >
                                Create Project
                            </Button>
                        </Link>
                    </div>
                    <Grid
                        container
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        sx={{ display: 'flex', flexDirection: 'row' }}
                    >
                        {projectData
                            .sort((a, b) => a.projectName.localeCompare(b.projectName))
                            .map((item) => (
                                <Grid key={item.project_id}>
                                    <ThemeProvider theme={theme} sx={{ with: '100%' }}>
                                        <Card style={{ flex: '1', width: '400px', height: '450px', marginRight: '16px', marginTop: '15px' }}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                                <div>
                                                    {item.projectType === 'Web Development' && <img src={WebDevelopment} width="100%" height="60%" />}
                                                    {item.projectType === 'Mobile App Development' && <img src={MobileAppDevelopment} width="100%" height="60%" />}
                                                    {item.projectType === 'Desktop Application Development' && <img src={DesktopApplicationDevelopment} width="100%" height="60%" />}
                                                    {item.projectType === 'Game Development' && <img src={GameDevelopment} width="100%" height="60%" />}
                                                    {item.projectType === 'Embedded System Development' && <img src={EmbeddedSystemDevelopment} width="100%" height="60%" />}
                                                    {item.projectType === 'AI and Machine Learning Development' && <img src={AIandMachineLearningDevelopment} width="100%" height="60%" />}
                                                    {item.projectType === 'Database Management and System' && <img src={DatabaseManagementandSystem} width="100%" height="60%" />}
                                                    {item.projectType === 'DevOps and CI/CD' && <img src={DevOpsandCICD} width="100%" height="60%" />}
                                                    {item.projectType === 'Cloud-Based Development' && <img src={CloudBasedDevelopment} width="100%" height="60%" />}
                                                    {item.projectType === 'Security and Cybersecurity System' && <img src={SecurityandCybersecuritySystem} width="100%" height="60%" />}
                                                    {item.projectType === 'Artificial Reality (AR) and Virtual Reality (VR) Development' && <img src={ArtificialRealityandVirtualRealityDevelopment} width="100%" height="60%" />}
                                                    <Typography variant="h5" component="div" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', color: '#3f51b5', marginBottom: '10px' }}>
                                                        <div>
                                                            {item.projectName}
                                                            <p style={{ fontSize: "small", color: 'green' }}>
                                                                {new Date(item.startDate).getDate()} {months[new Date(item.startDate).getMonth()]} {new Date(item.startDate).getFullYear()} - {new Date(item.endDate).getDate()} {months[new Date(item.endDate).getMonth()]} {new Date(item.endDate).getFullYear()}
                                                            </p>
                                                        </div>
                                                        <Chip
                                                            label={status(item)?.status || 'On-going'}
                                                            color={status(item)?.color || 'warning'}
                                                            sx={{
                                                                "& .MuiChip-label": {
                                                                    margin: 0,
                                                                }
                                                            }}
                                                        />
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <p style={{ fontSize: "small", color: 'black', fontWeight: "bold", display: 'inline-flex', alignItems: 'center' }}>
                                                            {item.projectType === 'Web Development' && <SettingsSuggestIcon style={{ fontSize: '25px', marginRight: '4px' }} />}
                                                            {item.projectType === 'Mobile App Development' && <AttachMoneyIcon style={{ fontSize: '25px', marginRight: '4px' }} />}
                                                            {item.projectType === 'Desktop Application Development' && <SupportAgentIcon style={{ fontSize: '25px', marginRight: '4px' }} />}
                                                            {item.projectType}
                                                        </p>
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {item.projectDescription}
                                                    </Typography>
                                                </div>
                                                <Link to={`/project/projectdetail/${item.project_id}`}>
                                                    <Button color="primary" style={{ alignSelf: 'flex-end', margin: '8px 0', borderRadius: 0 }}>
                                                        View Detail
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </ThemeProvider>
                                </Grid>
                            ))}
                    </Grid>
                </Paper>
            </Box>
        </div>
    );
}

export default Project;
