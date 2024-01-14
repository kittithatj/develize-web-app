import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  MenuItem,
  Select,
  IconButton,
  ListItemButton,
  AvatarGroup,
  Tooltip,
  InputBase,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  Tab,
  Tabs,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate, useOutletContext } from "react-router-dom";
import { skillTypeList } from "../config/skill-type-list";
import Pagination from "@mui/material/Pagination";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import SkillFroupAvatar from "../components/SkillGroupAvatar";
import Paper from "@mui/material/Paper";
import { getSkillTypeColor, getSkillTypeIcon } from "../components/util";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { useParams } from "react-router-dom";

// API
import { skillApi } from "../api/skill-api";
import { ProjectAPI } from "../api/project-api";
import { PersonnelAPI } from "../api/personnel-api";

// ICON
import CheckIcon from "@mui/icons-material/Check";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ProfileAvatar from "../components/ProfileAvatar";
import PersonnelInfoDialog from "../components/PersonnelInfoDialog";
import CloseIcon from "@mui/icons-material/Close";
import MatchProjectSkillDialogButton from "../components/MatchProjectSkillDialog";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function EditProject() {
  const { id } = useParams();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialogPro = () => {
    setOpenDialogPro(false);
  };
  const handleOpenDialogPro = () => {
    setOpenDialogPro(true);
  };
  const handleConfirm = () => {
    setLoading(true);
    // console.log("formData:", formData);
    const skillReq = skillSelect.map((skill) => skill.skill_id);

    const projectId = parseInt(id, 10);

    const dataToSend = {
      project_id: projectId,
      projectName: formData.projectName,
      projectType: formData.projectType,
      projectDescription: formData.projectDescription,
      startDate: formData.startDate,
      endDate: formData.endDate,
      skillRequireIdList: skillReq,
      memberAssignment: memberList.map((member) => {
        return {
          personnel_id: member.personnel_id,
          role: member.role,
        };
      }),
      budget: formData.budget,
      projectStatus: formData.projectStatus,
    };

    console.log(dataToSend);

    ProjectAPI.editProject(dataToSend)
      .then(() => {
        openSnackbar({
          status: "success",
          message: "Edit Project Successfully",
        });
        setLoading(false);
        navigate("../Project");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        openSnackbar({
          status: "error",
          message: "Edit Project Failed",
        });
      });

    handleCloseDialog();
  };

  const handleDeleteProject = () => {
    setLoading(true);
    ProjectAPI.deleteProject(id)
      .then((res) => {
        openSnackbar({
          status: "success",
          message: "Delete Project Successfully",
        });
        navigate("../project");
      })
      .catch(() => {
        openSnackbar({
          status: "error",
          message: "Delete Project Failed",
        });
        setLoading(false);
      });
  };

  const [projectName, setProjectName] = useState("");
  const [projectDes, setProjectDes] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectStart, setProjectStart] = useState("");
  const [projectEnd, setProjectEnd] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [memberFullName, setMemberFullName] = useState({});
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [projectSkills, setProjectSkills] = useState([]);

  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [user, setUser, openSnackbar] = useOutletContext({});
  const [skillList, setSkillList] = useState([]);
  const [skillSelect, setSkillSelect] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [openPersonnelInfoDialog, setOpenPersonnelInfoDialog] = useState(false);

  const [displayedSkills, setDisplayedSkills] = useState([]);
  const [currentType, setCurrentType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [currentPageSkill, setCurrentPageSkill] = useState(1);
  const itemsPerPageSkill = 12;
  const [tabValue, setTabValue] = useState(0);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogPro, setOpenDialogPro] = useState(false);

  const handleback = () => {
    navigate("../project");
  };

  const fullname = (p) => {
    return p.firstName + " " + p.lastName;
  };

  const status = (p) => {
    if (p.projectHistories.length === 0) {
      return { status: "Not Assigned", color: "success" };
    } else {
      let count = 0;
      p.projectHistories.forEach((project) => {
        if (project.projectStatus === "On-going") count++;
      });
      if (count > 0) {
        return { status: count + " Project Working", color: "warning" };
      } else {
        return { status: "Not Assigned", color: "success" };
      }
    }
  };

  const handleOpenPersonnelInfoDialog = (person) => {
    setSelectedPersonnel(person);
    setOpenPersonnelInfoDialog(true);
  };

  const fetchSkillData = () => {
    setLoading(true);
    skillApi.getAllSKills().then((data) => {
      setSkillList(data);
      setDisplayedSkills(data);
      setLoading(false);
      console.log("Skill SP", data);
    });
  };

  const handleSkillTypeChange = (event) => {
    setSelectedType(event.target.value);
    setCurrentPageSkill(1);
  };
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
    setCurrentPageSkill(1);
  };

  const [loadingPerson, setLoadingPersonel] = useState(true);
  const [dataPersonnel, setDataPersonnel] = useState([]);

  const fetchPersonnelData = () => {
    setLoadingPersonel(true);
    PersonnelAPI.getAllPersonnel().then((data) => {
      setDataPersonnel(data);
      setLoadingPersonel(false);
    });
  };

  const typeOptions = [
    "Web Development",
    "Mobile App Development",
    "Desktop Application Development",
    "Game Development",
    "Embedded System Development",
    "AI and Machine Learning Development",
    "Database Management and System",
    "DevOps and CI/CD",
    "Cloud-Based Development",
    "Security and Cybersecurity System",
    "Artificial Reality (AR) and Virtual Reality (VR) Development",
  ];
  const statusOptions = ["Completed", "Holding", "On-going", "Canceled"];

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
    skillRequireIdList: [],
    budget: "",
    projectStatus: "",
    memberIdList: [],
    role: "",
  });

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

  const formatDate = (inputDate) => {
    if (inputDate) {
      const parts = inputDate.split("-");
      if (parts.length === 3) {
        return `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
    }
    return inputDate;
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //----block search personnel----
  const [positionList, setPositionList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [searchSkillList, setSearchSkillList] = useState([]);
  const [searchForm, setSearchForm] = useState({});

  const fetchLookUpData = () => {
    PersonnelAPI.getPositionList().then((data) => {
      setPositionList(data);
    });
    PersonnelAPI.getDivisionList().then((data) => {
      setDivisionList(data);
    });
    skillApi.getAllSKills().then((data) => {
      const list = data.map((s) => {
        return s.skillName;
      });
      setSearchSkillList(list);
    });
  };

  const handlePersonnelSearchValueChange = (e) => {
    setCurrentPage(1);
    const { name, value, outerText } = e.target;
    const key = name;
    setSearchForm({ ...searchForm, [key]: value || outerText });
  };

  const handleAutocompleteChange = (key, value) => {
    setCurrentPage(1);
    setSearchForm({ ...searchForm, [key]: value });
  };

  const searchFilter = (person) => {
    if (searchForm?.name) {
      if (
        !fullname(person).toLowerCase().includes(searchForm?.name.toLowerCase())
      ) {
        return false;
      }
    }
    if (searchForm?.skills?.length > 0) {
      if (
        !searchForm?.skills.every((skill) => {
          const sList =
            person?.skills?.map((s) => {
              return s.skillName;
            }) || [];
          return sList.includes(skill);
        })
      ) {
        return false;
      }
    }
    if (searchForm?.position) {
      if (
        !person.position
          .toLowerCase()
          .includes(searchForm?.position.toLowerCase())
      ) {
        return false;
      }
    }
    if (searchForm?.division) {
      if (
        !person.division
          .toLowerCase()
          .includes(searchForm?.division.toLowerCase())
      ) {
        return false;
      }
    }
    const ifContain = memberList.some(
      (obj) => obj.personnel_id === person.personnel_id
    );
    if (ifContain) {
      return false;
    }
    return true;
  };

  const filteredPersonnel = () => {
    return dataPersonnel.filter((person) => {
      return searchFilter(person);
    });
  };

  //end----block search personnel----

  //----block personnel assignment----

  const [memberList, setMemberList] = useState([]);
  const roleOptions = [
    "Project Owner",
    "Project Manager",
    "System Analysis",
    "Bussiness Analysis",
    "Full Stack Developer",
    "Backend Developer",
    "Frontend Developer",
    "Tester",
    "UI/UX Designer",
    "Database Administrator",
    "Supporter",
  ];
  const assignPersonnel = (person) => () => {
    setMemberList((prevList) => [...prevList, person]);
  };

  const removePersonnel = (person) => () => {
    setMemberList((prevList) =>
      prevList.filter((p) => p.personnel_id !== person.personnel_id)
    );
  };

  const handleRoleChange = (role, i) => {
    const newMemberList = [...memberList];
    newMemberList[i].role = role;
    setMemberList(newMemberList);
    console.log(memberList);
  };

  //end----block personnel assignment----

  //---------Validate Field-------------

  const [formValidation, setFormValidation] = useState({
    projectName: true,
    projectType: true,
    projectDescription: true,
    startDate: true,
    endDate: true,
    budget: true,
    projectStatus: true,
  });

  const handleNext = () => {
    const isFormValid =
      formData.projectName &&
      formData.projectType &&
      formData.projectDescription &&
      formData.startDate &&
      formData.endDate &&
      formData.budget &&
      formData.projectStatus;

    if (isFormValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setFormValidation({
        projectName: true,
        projectType: true,
        projectDescription: true,
        startDate: true,
        endDate: true,
        budget: true,
        projectStatus: true,
      });
    } else {
      setFormValidation({
        projectName: !!formData.projectName,
        projectType: !!formData.projectType,
        projectDescription: !!formData.projectDescription,
        startDate: !!formData.startDate,
        endDate: !!formData.endDate,
        budget: !!formData.budget,
        projectStatus: !!formData.projectStatus,
      });
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = React.useState(0);

  const fetchProjectData = (id) => {
    setLoading(true);
    ProjectAPI.getProjectById(id).then((data) => {
      setProjectData(data);
      setFormData(data);
      console.log("Project", data);
      console.log("Skills:", data.skillsRequired);
      setProjectName(data.projectName);
      setProjectType(data.projectType);
      setProjectDes(data.projectDescription);
      setProjectStart(data.startDate);
      setProjectEnd(data.endDate);
      setProjectBudget(data.budget);
      setProjectStatus(data.projectStatus);
      setProjectSkills(data.skillsRequired);
      setMemberList(data.projectMember);
      setLoading(false);
    });
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const addSkill = (item) => {
    if (!skillSelect.some((s) => s.skill_id === item.skill_id)) {
      setSkillSelect((prevArray) => [...prevArray, item]);
    }
  };

  const handleDeleteSkill = (item) => {
    setSkillSelect(skillSelect.filter((s) => s.skill_id !== item.skill_id));
  };

  useEffect(() => {
    fetchProjectData(id);
    fetchSkillData();
    fetchPersonnelData();
    fetchLookUpData();
  }, [currentType]);

  useEffect(() => {
    if (projectSkills.length > 0) {
      setSkillSelect([...skillSelect, ...projectSkills]);
    }
  }, [projectSkills]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      projectName: projectData.projectName || "",
      projectType: projectData.projectType || "",
      projectDescription: projectData.projectDescription || "",
      startDate: projectData.startDate || "",
      endDate: projectData.endDate || "",
      skillRequireIdList: projectData.skillRequireIdList || [],
      budget: projectData.budget || "",
      projectStatus: projectData.projectStatus || "",
      memberIdList: projectData.memberAssignment || [],
    }));
  }, [projectData]);

  const handleAutoAssign = (personnelList) => {
    console.log("Hello from create project : ", personnelList);
    setMemberList(personnelList);
  };

  return (
    <div
      className="main-content"
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
      <Grid container justifyContent="center" alignItems="stretch" spacing={1}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              width: "100%",
              margin: "0 auto",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "30px",
            }}
          >
            <Typography
              variant="h5"
              style={{
                fontWeight: "bold",
              }}
            >
              Edit Project
            </Typography>
            <Button
              variant="contained"
              color="error"
              style={{ marginTop: "10px", marginLeft: "auto" }}
              onClick={handleOpenDialogPro}
            >
              Delete
            </Button>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Project Info" onClick={() => setTabValue(0)} />
              <Tab label="Skill" onClick={() => setTabValue(1)} />
              <Tab label="Member Management" onClick={() => setTabValue(2)} />
            </Tabs>

            {tabValue === 0 && (
              <div style={{ width: "100%" }}>
                <Box sx={{ my: 2 }}>
                  <Typography
                    variant="h5"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Information
                  </Typography>
                </Box>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      marginRight: "10px",
                    }}
                  >
                    <div style={{ fontSize: "15px" }}>Project Name</div>
                    {/* <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    error={!formValidation.projectName}
                                    helperText={!formValidation.projectName && "Project Name is required"}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DnsIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                /> */}
                    <TextField
                      sx={{ mt: 1 }}
                      fullWidth
                      variant="outlined"
                      value={formData?.projectName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <div style={{ fontSize: "15px" }}>Project Type</div>
                    <FormControl error={!formValidation.projectType}>
                      <Select
                        sx={{ mt: 1, mb: 2, width: "100%" }}
                        value={formatDate(formData.projectType)}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            projectType: formatDate(event.target.value),
                          })
                        }
                        name="ProjectType"
                        startAdornment={
                          <InputAdornment position="start">
                            <TypeSpecimenIcon />
                          </InputAdornment>
                        }
                      >
                        {typeOptions.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ mt: -1 }}>
                        {!formValidation.projectType &&
                          "Project Type is required"}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <div style={{ fontSize: "15px" }}>Project Description</div>
                  <TextField
                    multiline
                    minRows={3}
                    sx={{ mt: 1, mb: 2, width: "100%" }}
                    variant="outlined"
                    value={formData.projectDescription}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        projectDescription: event.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "10px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      marginRight: "10px",
                    }}
                  >
                    <div style={{ fontSize: "15px" }}>Start Date</div>
                    <TextField
                      type="date"
                      sx={{ mt: 1, mb: 2, width: "100%" }}
                      variant="outlined"
                      value={formatDate(formData.startDate)}
                      error={!formValidation.startDate}
                      helperText={
                        !formValidation.startDate &&
                        "Start Date Project is required"
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          startDate: formatDate(event.target.value),
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                    }}
                  >
                    <div style={{ fontSize: "15px" }}>End Date</div>
                    <TextField
                      type="date"
                      sx={{ mt: 1, mb: 2, width: "100%" }}
                      variant="outlined"
                      value={formatDate(formData.endDate)}
                      error={!formValidation.endDate}
                      helperText={
                        !formValidation.endDate &&
                        "End Date Project is required"
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          endDate: formatDate(event.target.value),
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      marginLeft: "10px",
                    }}
                  >
                    <div style={{ fontSize: "15px" }}>Budget</div>
                    <TextField
                      type="number"
                      sx={{ mt: 1, mb: 2, width: "100%" }}
                      variant="outlined"
                      value={formData.budget}
                      error={!formValidation.budget}
                      helperText={
                        !formValidation.budget && "Budget is required"
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          budget: parseFloat(event.target.value),
                        })
                      }
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "10px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <div style={{ fontSize: "15px" }}>Project Status</div>
                    <FormControl error={!formValidation.projectStatus}>
                      <Select
                        sx={{ mt: 1, mb: 2, width: "100%" }}
                        value={formatDate(formData.projectStatus)}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            projectStatus: formatDate(event.target.value),
                          })
                        }
                        name="ProjectStatus"
                        startAdornment={
                          <InputAdornment position="start">
                            <AutorenewIcon />
                          </InputAdornment>
                        }
                      >
                        {statusOptions.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ mt: -1 }}>
                        {!formValidation.projectStatus &&
                          "Project Status is required"}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="warning"
                    style={{ marginTop: "10px" }}
                    onClick={handleback}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginTop: "10px", marginLeft: "auto" }}
                    onClick={handleOpenDialog}
                  >
                    Save Change
                  </Button>
                </div>
              </div>
            )}

            {tabValue === 1 && (
              <div>
                <Box sx={{ my: 2 }}>
                  <Typography
                    variant="h5"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Skill Requirement
                  </Typography>
                </Box>

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
                      onDelete={() => handleDeleteSkill(item)}
                      icon={getSkillTypeIcon(item.skillType)}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      borderStyle: "solid",
                      borderRadius: "5px",
                      borderColor: "#F0f0f0",
                      borderWidth: "2px",
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search Skill"
                      inputProps={{ "aria-label": "search skill" }}
                      value={searchValue}
                      onChange={handleSearchValueChange}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                      disabled
                    >
                      <SearchIcon />
                    </IconButton>
                  </Box>
                  <TextField
                    sx={{ mb: 2, mt: 2, ml: 2, width: 300, height: 50 }}
                    size="small"
                    id="select-skill-type"
                    select
                    label="Select Skill Type"
                    variant="standard"
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

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    minWidth: "60vw",
                  }}
                >
                  {displayedSkills
                    .filter(
                      (s) =>
                        s.skillName
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) &&
                        (selectedType === "" || s.skillType === selectedType)
                    )
                    .slice(
                      (currentPageSkill - 1) * itemsPerPageSkill,
                      currentPageSkill * itemsPerPageSkill
                    )
                    .map((item) => (
                      <Box sx={{ width: "33.33%" }} padding="8px">
                        <ListItem
                          key={item.skill_id}
                          sx={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>{getSkillTypeIcon(item.skillType)}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.skillName}
                            secondary={item.skillType}
                          ></ListItemText>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              addSkill(item);
                            }}
                            disabled={skillSelect.some(
                              (selectedSkill) =>
                                selectedSkill.skill_id === item.skill_id
                            )}
                          >
                            {skillSelect.some(
                              (selectedSkill) =>
                                selectedSkill.skill_id === item.skill_id
                            ) ? (
                              <CheckIcon />
                            ) : (
                              <AddIcon />
                            )}
                          </IconButton>
                        </ListItem>
                      </Box>
                    ))}
                  {displayedSkills.filter(
                    (s) =>
                      s.skillName
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) &&
                      (selectedType === "" || s.skillType === selectedType)
                  ).length === 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "60vw",
                          mt: 2,
                        }}
                      >
                        <Typography component="div" sx={{ fontWeight: "600" }}>
                          Skill Not found
                        </Typography>
                      </Box>
                    )}
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Pagination
                      count={Math.ceil(
                        displayedSkills.filter(
                          (s) =>
                            s.skillName
                              .toLowerCase()
                              .includes(searchValue.toLowerCase()) &&
                            (selectedType === "" ||
                              s.skillType === selectedType)
                        ).length / itemsPerPageSkill
                      )}
                      page={currentPageSkill}
                      onChange={(event, page) => setCurrentPageSkill(page)}
                    />
                  </Box>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="warning"
                    style={{ marginTop: "10px" }}
                    onClick={handleback}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginTop: "10px", marginLeft: "auto" }}
                    onClick={handleOpenDialog}
                  >
                    Save Change
                  </Button>
                </div>
              </div>
            )}
            {tabValue === 2 && (
              <div style={{ width: "100%" }}>
                <Box sx={{ my: 2 }}>
                  <Typography
                    variant="h5"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Project Member
                  </Typography>
                </Box>
                <List
                  sx={{
                    width: "100%",
                  }}
                >
                  {memberList.map((p, i, array) => {
                    return (
                      <div>
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItemButton
                            component="div"
                            key={p.personnel_id}
                            onClick={() => handleOpenPersonnelInfoDialog(p)}
                          >
                            <ListItemAvatar>
                              <ProfileAvatar
                                variant="circular"
                                name={fullname(p)}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{ width: "30%" }}
                              primary={fullname(p)}
                              secondary={p.position}
                            />
                          </ListItemButton>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Autocomplete
                              freeSolo
                              options={roleOptions}
                              sx={{ width: 300 }}
                              value={p.role}
                              onChange={(event, newValue) => {
                                handleRoleChange(newValue, i);
                              }}
                              renderInput={(params) => (
                                // eslint-disable-next-line no-restricted-globals
                                <TextField
                                  {...params}
                                  label="Role"
                                  onChange={(event) =>
                                    handleRoleChange(event.target.value, i)
                                  }
                                />
                              )}
                            />
                          </Box>

                          <IconButton
                            sx={{ margin: 2 }}
                            edge="end"
                            aria-label="edit"
                            size="large"
                            onClick={removePersonnel(p)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                        <div className="line"></div>
                      </div>
                    );
                  })}
                </List>

                <div>
                  {/* TODO: SearchPersonnel */}

                  <Box
                    className="flex-center"
                    sx={{
                      justifyContent: "space-between",
                      my: 4,
                      gap: "15px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "30%",
                        borderStyle: "solid",
                        borderRadius: "5px",
                        borderColor: "#F0f0f0",
                        borderWidth: "2px",
                        height: "58px",
                      }}
                    >
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Personnel Name"
                        inputProps={{ "aria-label": "search skill" }}
                        value={searchForm?.name}
                        name="name"
                        onChange={handlePersonnelSearchValueChange}
                      />
                      <IconButton
                        type="button"
                        sx={{ p: "10px" }}
                        aria-label="search"
                        disabled
                      >
                        <SearchIcon />
                      </IconButton>
                    </Box>
                    <Autocomplete
                      multiple
                      limitTags={2}
                      disablePortal
                      id="combo-box-demo"
                      options={searchSkillList}
                      sx={{ width: "30%" }}
                      onChange={(event, newValue) => {
                        handleAutocompleteChange("skills", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Search Skills" />
                      )}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={positionList}
                      sx={{ width: "20%" }}
                      name="position"
                      onChange={(event, newValue) => {
                        handleAutocompleteChange("position", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search Position"
                          name="position"
                          onChange={handlePersonnelSearchValueChange}
                        />
                      )}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={divisionList}
                      sx={{ width: "20%" }}
                      name="division"
                      onChange={(event, newValue) => {
                        handleAutocompleteChange("division", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search Division"
                          name="division"
                          onChange={handlePersonnelSearchValueChange}
                        />
                      )}
                    />
                  </Box>

                  {filteredPersonnel().length > 0 && (
                    <ThemeProvider theme={theme}>
                      <List
                        sx={{
                          width: "100%",
                          minWidth: 500,
                          bgcolor: "background.paper",
                          zIndex: 200,
                          padding: 0,
                        }}
                      >
                        <ListItem>
                          <Box
                            sx={{
                              width: "30%",
                              marginLeft: "56px",
                              fontWeight: "600",
                            }}
                          >
                            <Typography
                              component="div"
                              sx={{ fontWeight: "600" }}
                            >
                              Information
                            </Typography>
                          </Box>
                          <Box sx={{ width: "30%" }}>
                            <Typography
                              component="div"
                              sx={{ fontWeight: "600" }}
                            >
                              Status
                            </Typography>
                          </Box>
                          <Box sx={{ width: "40%" }}>
                            <Typography
                              component="div"
                              sx={{ fontWeight: "600" }}
                            >
                              Skills
                            </Typography>
                          </Box>
                          <ListItemText sx={{ width: "100px" }} />
                        </ListItem>

                        {/* Personnel List Block */}
                        <div className="line"></div>
                        {filteredPersonnel()
                          .slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                          )
                          .map((p, i, array) => {
                            return (
                              <div>
                                <Box
                                  sx={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <ListItemButton
                                    component="div"
                                    key={p.personnel_id}
                                    onClick={() =>
                                      handleOpenPersonnelInfoDialog(p)
                                    }
                                  >
                                    <ListItemAvatar>
                                      <ProfileAvatar
                                        variant="circular"
                                        name={fullname(p)}
                                      />
                                    </ListItemAvatar>
                                    <ListItemText
                                      sx={{ width: "30%" }}
                                      primary={fullname(p)}
                                      secondary={p.position}
                                    />
                                    <Box
                                      component="div"
                                      sx={{ display: "flex", width: "30%" }}
                                    >
                                      <Chip
                                        label={status(p).status}
                                        color={status(p).color}
                                        sx={{
                                          justifyContent: "center",
                                          "& .MuiChip-label": {
                                            margin: 0,
                                          },
                                        }}
                                      />
                                    </Box>
                                    <Box
                                      component="div"
                                      sx={{ display: "flex", width: "40%" }}
                                    >
                                      {p.skills.length > 0 && (
                                        <AvatarGroup max={5}>
                                          {p.skills.map((skill) => {
                                            return (
                                              <Tooltip
                                                key={skill?.skill_id}
                                                title={skill.skillName}
                                              >
                                                <div>
                                                  <SkillFroupAvatar
                                                    variant="circular"
                                                    name={skill.skillName}
                                                  />
                                                </div>
                                              </Tooltip>
                                            );
                                          })}
                                        </AvatarGroup>
                                      )}
                                    </Box>
                                  </ListItemButton>
                                  <IconButton
                                    sx={{ margin: 2 }}
                                    edge="end"
                                    aria-label="edit"
                                    size="large"
                                    onClick={assignPersonnel(p)}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </Box>
                                <div className="line"></div>
                              </div>
                            );
                          })}
                      </List>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                        }}
                      >
                        <Pagination
                          count={Math.ceil(
                            filteredPersonnel().length / itemsPerPage
                          )}
                          page={currentPage}
                          onChange={(event, page) => setCurrentPage(page)}
                        />
                      </Box>
                    </ThemeProvider>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <Box>
                      <MatchProjectSkillDialogButton
                        sx={{ mt: 2, mb: 2 }}
                        skillIdList={skillSelect.map((s) => s.skill_id)}
                        outputPersonelList={handleAutoAssign}
                      />
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginTop: "10px", marginLeft: "auto" }}
                        onClick={handleOpenDialog}
                      >
                        Save Change
                      </Button>
                    </Box>
                  </div>
                  <PersonnelInfoDialog
                    hideEdit
                    personnel={selectedPersonnel}
                    open={openPersonnelInfoDialog}
                    setOpen={setOpenPersonnelInfoDialog}
                  />
                </div>
              </div>
            )}
          </Paper>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Project Edit</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to save change ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleConfirm} color="success">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDialogPro} onClose={handleCloseDialogPro}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete project ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialogPro}>Cancel</Button>
              <Button onClick={handleDeleteProject} color="success">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" size={100} />
        </Backdrop>
      </Grid>
    </div>
  );
}

export default EditProject;
