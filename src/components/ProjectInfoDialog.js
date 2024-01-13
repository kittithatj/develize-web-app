import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemButton,
  InputAdornment,
  TextField,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { getSkillTypeColor, getSkillTypeIcon } from "../components/util";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

//API
import { skillApi } from "../api/skill-api";
import { ProjectAPI } from "../api/project-api";
import { PersonnelAPI } from "../api/personnel-api";

//picture
import WebDevelopment from "../components/image/WebDevelopment.png";
import MobileAppDevelopment from "../components/image//MobileAppDevelopment.png";
import DesktopApplicationDevelopment from "../components/image/DesktopApplicationDevelopment.png";
import GameDevelopment from "../components/image/GameDevelopment.png";
import EmbeddedSystemDevelopment from "../components/image/EmbeddedSystemDevelopment.png";
import AIandMachineLearningDevelopment from "../components/image/AIandMachineLearningDevelopment.png";
import DatabaseManagementandSystem from "../components/image/DatabaseManagementandSystem.png";
import DevOpsandCICD from "../components/image/DevOpsandCICD.png";
import CloudBasedDevelopment from "../components/image/CloudBasedDevelopment.png";
import SecurityandCybersecuritySystem from "../components/image/SecurityandCybersecuritySystem.png";
import ArtificialRealityandVirtualRealityDevelopment from "../components/image/ArtificialRealityandVirtualRealityDevelopment.png";

//icon
import ProfileAvatar from "../components/ProfileAvatar";
import PersonnelInfoDialog from "../components/PersonnelInfoDialog";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PaidIcon from "@mui/icons-material/Paid";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import DnsIcon from "@mui/icons-material/Dns";

function ProjectInfoDialog(props) {
  const [project, setProject] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [projectLoading, setProjectLoading] = useState(false);
  const [skillList, setSkillList] = useState([]);
  const [displayedSkills, setDisplayedSkills] = useState([]);
  const [loadingPerson, setLoadingPersonel] = useState(true);
  const [dataPersonnel, setDataPersonnel] = useState([]);
  const [skillSelect, setSkillSelect] = useState([]);
  const [personnel, setPersonnel] = React.useState({});
  const [projectSkills, setProjectSkills] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [openPersonnelInfoDialog, setOpenPersonnelInfoDialog] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fullname = (p) => {
    return p.firstName + " " + p.lastName;
  };

  const handleOpenPersonnelInfoDialog = (person) => {
    setSelectedPersonnel(person);
    setOpenPersonnelInfoDialog(true);
  };

  const imageMap = {
    "Web Development": WebDevelopment,
    "Mobile App Development": MobileAppDevelopment,
    "Desktop Application Development": DesktopApplicationDevelopment,
    "Game Development": GameDevelopment,
    "Embedded System Development": EmbeddedSystemDevelopment,
    "AI and Machine Learning Development": AIandMachineLearningDevelopment,
    "Database Management and System": DatabaseManagementandSystem,
    "DevOps and CI/CD": DevOpsandCICD,
    "Cloud-Based Development": CloudBasedDevelopment,
    "Security and Cybersecurity System": SecurityandCybersecuritySystem,
    "Artificial Reality (AR) and Virtual Reality (VR) Development":
      ArtificialRealityandVirtualRealityDevelopment,
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const getStatus = (project) => {
    if (project.projectStatus === "On-Going") {
      return { status: "On-Going", color: "warning" };
    } else if (project.projectStatus === "Completed") {
      return { status: "Completed", color: "success" };
    } else if (project.projectStatus === "Holding") {
      return { status: "Holding", color: "secondary" };
    }
  };

  useEffect(() => {
    setProjectLoading(true);
    fetchProjectData(props.projectId);
    fetchSkillData();
    fetchPersonnelData();
  }, [props.projectId]);

  useEffect(() => {
    if (project.skills && skillList.length > 0) {
      const projectSkillIds = project.skills.map((skill) => skill.skill_id);
      const commonSkills = skillList.filter((skill) =>
        projectSkillIds.includes(skill.skill_id)
      );
      setSkillSelect(commonSkills);
    }
  }, [project.skills, skillList]);

  useEffect(() => {
    if (project.skills && skillList.length > 0) {
      const projectSkillIds = project.skills.map((skill) => skill.skill_id);
      const commonSkills = skillList.filter((skill) =>
        projectSkillIds.includes(skill.skill_id)
      );
      setSkillSelect(commonSkills);
    }
  }, [project.skills, skillList]);

  useEffect(() => {
    if (projectSkills.length > 0) {
      setSkillSelect(projectSkills);
    }
  }, [projectSkills]);

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

  //--------------------DATA API----------------------------------------

  const fetchProjectData = (projectId) => {
    setProjectLoading(true);
    setLoading(true);
    ProjectAPI.getProjectById(projectId)
      .then((data) => {
        setProject(data);
        setProjectSkills(data.skillsRequired);
        setMemberList(data.projectMember);
      })
      .finally(() => {
        setProjectLoading(false);
        setLoading(false);
      });
  };

  const fetchSkillData = () => {
    setLoading(true);
    skillApi.getAllSKills().then((data) => {
      setSkillList(data);
      setDisplayedSkills(data);
    }).finally(() => {
      setLoading(false);
    });
  };

  const fetchPersonnelData = () => {
    setLoadingPersonel(true);
    PersonnelAPI.getAllPersonnel()
      .then((data) => {
        setDataPersonnel(data);
      })
      .finally(() => {
        setLoadingPersonel(false);
      });
  };

  const fetchData = async () => {
    setProjectLoading(true);

    const projectData = await fetchProjectData(props.projectId);
    const skillData = await fetchSkillData();
    const personnelData = await fetchPersonnelData();

    setProject(projectData);
    setProjectSkills(projectData.skillsRequired);
    setMemberList(projectData.projectMember);
    setLoading(false);
    setDataLoaded(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={props.open} onClose={handleClose} maxWidth={"lg"}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Project Information</div>
            <CloseIcon
              onClick={handleClose}
              color="#3d3d3d"
              sx={{ cursor: "pointer", mt: "3px" }}
            />
          </Box>
        </DialogTitle>
        {!projectLoading ? (
          <DialogContent>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                className="flex-center"
                sx={{ flexDirection: "column", minWidth: "200px" }}
              >
                <div>
                  {project.projectType && (
                    <img
                      src={imageMap[project.projectType]}
                      style={{ width: "100%", height: "auto" }}
                      alt={project.projectType}
                    />
                  )}
                </div>
                <Box
                  className="header"
                  sx={{
                    marginBottom: "0.5rem",
                    marginTop: "0.5rem",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px",
                    minHeight: "100px",
                    height: "auto",
                    marginBottom: "1vw",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: "3%" }}>
                      <TextField
                        id="outlined-read-only-input"
                        label="Name"
                        fullWidth
                        defaultValue={project.projectName}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <DnsIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "3%" }}>
                      <TextField
                        id="outlined-read-only-input"
                        label="Type"
                        fullWidth
                        defaultValue={project.projectType}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SettingsSuggestIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "3%" }}>
                    <TextField
                      id="outlined-read-only-input"
                      label="Descrption"
                      fullWidth
                      defaultValue={project.projectDescription}
                      multiline
                      rows={2}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ marginBottom: "3%", width: "48%" }}>
                      <TextField
                        id="outlined-read-only-input"
                        label="Project Start"
                        fullWidth
                        defaultValue={new Date(
                          project.startDate
                        ).toLocaleDateString()}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeFilledIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div style={{ width: "48%" }}>
                      <TextField
                        id="outlined-read-only-input"
                        label="Project End"
                        fullWidth
                        defaultValue={new Date(
                          project.endDate
                        ).toLocaleDateString()}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeFilledIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ marginBottom: "3%", width: "48%" }}>
                      <TextField
                        id="outlined-read-only-input"
                        label="Budget"
                        fullWidth
                        defaultValue={project.budget}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <PaidIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <Chip
                        label={getStatus(project)?.status || "On-going"}
                        color={getStatus(project)?.color || "warning"}
                        sx={{
                          "& .MuiChip-label": {
                            margin: 0,
                          },
                          width: "80%",
                          height: "35px",
                          marginBottom: "5%",
                        }}
                      />
                    </div>
                  </div>
                </Box>
              </Box>
              <Box sx={{ borderLeft: "2px solid #dedede", mx: "1rem" }}></Box>
              <div>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                  }}
                >Skill Required
                </Typography>
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px",
                    minHeight: "100px",
                    height: "auto",
                    width: "100%",
                    marginBottom: "1vw",
                    minWidth: "30vw",
                  }}
                >
                  {skillSelect.map((item) => (
                    <Chip
                      key={item.skill_id}
                      sx={{
                        m: 1,
                        height: "40px",
                      }}
                      variant="outlined"
                      color={getSkillTypeColor(item.skillType)}
                      size="medium"
                      label={item.skillName}
                      icon={getSkillTypeIcon(item.skillType)}
                    />
                  ))}
                </div>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                  }}
                >Team Member</Typography>
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px",
                    minHeight: "100px",
                    height: "auto",
                    width: "100%",
                  }}
                >
                  {memberList.map((p, i, array) => (
                    <Box
                      key={p.personnel_id}
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        borderBottom: i < array.length - 1 ? "1px solid #ccc" : "none",
                      }}
                    >
                      <ListItemButton
                        component="div"
                        onClick={() => handleOpenPersonnelInfoDialog(p)}
                      >
                        <ListItemAvatar>
                          <ProfileAvatar
                            variant="circular"
                            name={fullname(p)}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          sx={{
                            width: "30%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          primary={fullname(p)}
                          secondary={<span>{p.role}</span>}
                        />
                      </ListItemButton>

                      <PersonnelInfoDialog
                        hideEdit
                        personnel={selectedPersonnel}
                        open={openPersonnelInfoDialog}
                        setOpen={setOpenPersonnelInfoDialog}
                      />
                    </Box>
                  ))}
                </div>
                ทำให้แสดง text ที่ไม่มีข้อมูลด้วย ถ้ามีข้อมูลเยอะ ให้ scroll ลงมาได้
              </div>
            </Box>
          </DialogContent>
        ) : (
          <div>
            {projectLoading && (
              <Box
                className="flex-center"
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress sx={{ my: 5 }} size={100} />
              </Box>
            )}
          </div>
        )}
        {!loading && !props?.hideEdit && (
          <DialogActions>
            <Link to={"edit/" + project?.project_id}>
              <Button color="warning" sx={{ mr: 1 }} onClick={handleClose}>
                Edit
              </Button>
            </Link>
          </DialogActions>
        )}
      </Dialog>
    </ThemeProvider>
  );
}

export default ProjectInfoDialog;
