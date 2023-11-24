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
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Paper from "@mui/material/Paper";
import StepLabel from "@mui/material/StepLabel";
import { getSkillTypeColor, getSkillTypeIcon } from "../components/util";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

// API
import { skillApi } from "../api/skill-api";
import { ProjectAPI } from "../api/project-api";
import { PersonnelAPI } from "../api/personnel-api";

// ICON
import DnsIcon from "@mui/icons-material/Dns";
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

function CreateProject() {
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleConfirm = () => {
    //console.log("formData:", formData);
    const skillReq = skillSelect.map((skill) => skill.skill_id);

    const dataToSend = {
      projectName: formData.projectName,
      projectType: formData.projectType,
      projectDescription: formData.projectDescription,
      startDate: formData.startDate,
      endDate: formData.endDate,
      skillRequireIdList: skillReq,
      memberAssignment: formData.memberIdList.map((member) => ({
        personnel_id: member.personnel_id,
        role: member.role,
      })),
      budget: formData.budget,
      projectStatus: formData.projectStatus,
    };

    ProjectAPI.createProject(dataToSend)
      .then(() => {
        openSnackbar({
          status: "success",
          message: "Create Project Successfully",
        });
        navigate("../Project");
      })
      .catch(() => {
        openSnackbar({
          status: "error",
          message: "Create Project Failed",
        });
      });

    handleCloseDialog();
  };
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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
  //const memberOptions = ["Project Leader", "Developer", "Engineer", "Tester"];

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

  useEffect(() => {
    fetchSkillData();
    fetchPersonnelData();
    fetchLookUpData();
  }, [currentType]);

  const addSkill = (item) => {
    if (
      !skillSelect.some(
        (selectedSkill) => selectedSkill.skill_id === item.skill_id
      )
    ) {
      setSkillSelect((prevSkills) => [...prevSkills, item]);
      setFormData((prevData) => {
        const skillIds = Array.isArray(prevData.skillRequireIdList)
          ? [...prevData.skillRequireIdList, item.skill_id]
          : [item.skill_id];
        return { ...prevData, skillRequireIdList: skillIds };
      });
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

  const handleDeleteSkill = (item) => {
    const updatedSkills = skillSelect.filter(
      (selectedSkill) => selectedSkill.skill_id !== item.skill_id
    );
    setSkillSelect(updatedSkills);
    setFormData((prevData) => {
      const skillIds = Array.isArray(prevData.skillRequireIdList)
        ? prevData.skillRequireIdList.filter((id) => id !== item.skill_id)
        : [];
      return { ...prevData, skillRequireIdList: skillIds };
    });
  };

  const formatDate = (inputDate) => {
    if (inputDate) {
      const parts = inputDate.split("-");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return inputDate;
  };

  const steps = ["Project Details", "Skill Requirement", "Assign Member"];


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
    return true;
  };

  const filteredPersonnel = () => {
    return dataPersonnel.filter((person) => {
      return searchFilter(person);
    });
  };

  //end----block search personnel----

  //----block personnel assignment----

  //end----block personnel assignment----

  const assignPersonnel = (person) => () => {


  }

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
            {activeStep === 0 && (
              <div style={{ width: "100%" }}>
                <Typography
                  variant="h5"
                  component="div"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Create New Project
                </Typography>

                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  sx={{ my: "3rem" }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
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
                    <TextField
                      sx={{ mt: 1, mb: 2 }}
                      variant="outlined"
                      value={formData.projectName}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          projectName: event.target.value,
                        })
                      }
                      error={!formValidation.projectName}
                      helperText={!formValidation.projectName && "Project Name is required"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DnsIcon />
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
                      <FormHelperText sx={{ mt: -1 }}>{!formValidation.projectType && "Project Type is required"}</FormHelperText>
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
                      helperText={!formValidation.startDate && "Start Date Project is required"}
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
                      helperText={!formValidation.endDate && "End Date Project is required"}
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
                      helperText={!formValidation.budget && "Budget is required"}
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
                      <FormHelperText sx={{ mt: -1 }}>{!formValidation.projectStatus && "Project Status is required"}</FormHelperText>
                    </FormControl>


                    {/* <FormControl error={!formValidation.projectStatus}>
                      <Select
                        error={true}
                        sx={{ mt: 1, mb: 2, width: "100%" }}
                        value={formatDate(formData.projectStatus)}
                        helperText={!formValidation.projectStatus && "Start Date Project is required"}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            projectStatus: formatDate(event.target.value),
                          })
                        }
                        name="employmentStatus"
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
                      <FormHelperText>{!formValidation.projectStatus && "Project Status is required"}</FormHelperText>
                    </FormControl> */}
                  </div>
                </div>
                <Button
                  variant="contained"
                  color="success"
                  style={{
                    marginTop: "10px",
                    marginLeft: "auto",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  onClick={activeStep < 2 ? handleNext : handleOpenDialog}
                >
                  {activeStep < 2 ? "Next" : "Create Project"}
                </Button>
              </div>
            )}

            {activeStep === 1 && (
              <div>
                <span
                  style={{
                    fontSize: "25px",
                    fontWeight: "600",
                    marginBottom: "50px",
                  }}
                >
                  Skill Requirement
                </span>
                <div>
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    style={{
                      fontSize: "25px",
                      fontWeight: "600",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>
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
                >
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={activeStep === 0}
                    style={{ height: "40px" }}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginTop: "10px" }}
                    onClick={activeStep < 2 ? handleNext : handleOpenDialog}
                  >
                    {activeStep < 2 ? "Next" : "Create Project"}
                  </Button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div
                style={{
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "50px",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "25px",
                      fontWeight: "600",
                      marginBottom: "-20px",
                    }}
                  >
                    Member Assignment
                  </span>
                </div>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
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
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      style={{ marginTop: "10px", marginLeft: "auto" }}
                      disabled={
                        activeStep === 0 &&
                        (formData.projectName === "" ||
                          formData.projectType === "" ||
                          formData.projectDescription === "" ||
                          formData.startDate === "" ||
                          formData.endDate === "" ||
                          formData.budget === "" ||
                          skillSelect.length === 0)
                      }
                      onClick={handleOpenDialog}
                    >
                      Create Project
                    </Button>
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                      <DialogTitle>Confirm Project Creation</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to create this project?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleConfirm} color="success">
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <PersonnelInfoDialog
                      hideEdit
                      personnel={selectedPersonnel}
                      open={openPersonnelInfoDialog}
                      setOpen={setOpenPersonnelInfoDialog}
                    />
                  </div>
                </div>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateProject;
