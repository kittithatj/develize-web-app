import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, InputAdornment, Chip, Button, MenuItem, Select, IconButton, ListItemButton, AvatarGroup, Tooltip, } from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate, useOutletContext } from "react-router-dom";
import InputBase from "@mui/material/InputBase";
import { skillTypeList } from "../config/skill-type-list";
import Pagination from "@mui/material/Pagination";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import SkillFroupAvatar from "../components/SkillGroupAvatar";

// API
import { skillApi } from "../api/skill-api";
import { ProjectAPI } from "../api/project-api";
import { PersonnelAPI } from "../api/personnel-api";

// ICON
import StorageIcon from "@mui/icons-material/Storage";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HandymaIconn from "@mui/icons-material/Handyman";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TerminalIcon from "@mui/icons-material/Terminal";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import DnsIcon from "@mui/icons-material/Dns";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ProfileAvatar from "../components/ProfileAvatar";

function Createproject() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [user, setUser, openSnackbar] = useOutletContext({});
  const [skillList, setSkillList] = useState([]);
  const [skillSelect, setSkillSelect] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState(1);

  const [displayedSkills, setDisplayedSkills] = useState([]);
  const [currentType, setCurrentType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [currentPageSkill, setCurrentPageSkill] = useState(1);
  const itemsPerPageSkill = 12;


  const handleOpenDialog = (person) => {
    setSelectedPersonnel(person);
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

  const handleRemoveRow = (index) => {
    const updatedMembers = [...formData.memberIdList];
    const updatedRoles = [...formData.role];
    updatedMembers.splice(index, 1);
    updatedRoles.splice(index, 1);
    setFormData({ memberIdList: updatedMembers, role: updatedRoles });
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

  const [searchPositionValue, setSearchPositionValue] = useState("");
  const handleSearchPositionValueChange = (event) => {
    setSearchPositionValue(event.target.value);
  };


  const [loadingPerson, setLoadingPerson] = useState(false);
  const [dataPersonnel, setDataPersonnel] = useState("");

  const fetchPersonnelData = () => {
    setLoadingPerson(true);
    PersonnelAPI.getAllPersonnel().then((data) => {
      setDataPersonnel(data);
    });
  };

  const typeOptions = ["Digital Marketing", "AppService", "Security System"];
  const statusOptions = ["On Success", "On Holding", "On Going"];
  const memberOptions = ["Project Leader", "Developer", "Engineer", "Tester"];

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
  }, [currentType]);

  const createProjectData = () => {
    if (
      formData.projectName === "" ||
      formData.projectType === "" ||
      formData.projectDescription === "" ||
      formData.startDate === "" ||
      formData.endDate === "" ||
      formData.budget === "" ||
      skillSelect.length === 0 ||
      formData.memberIdList.length === 0
    ) {
      openSnackbar({
        status: "error",
        message: "Field is empty",
      });
      return;
    }
    console.log("formData:", formData);
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
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
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
  };

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

  const getSkillTypeIcon = (skillType) => {
    switch (skillType) {
      case "Database":
        return <StorageIcon />;
      case "Others":
        return <MoreHorizIcon />;
      case "Tool":
        return <HandymaIconn />;
      case "Library":
        return <MenuBookIcon />;
      case "Programming Language":
        return <TerminalIcon />;
      case "Framework":
        return <IntegrationInstructionsIcon />;
      default:
        return <MoreHorizIcon />;
    }
  };

  return (
    <div className="main-content"
      sx={{
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "15px",
      }}>
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
            <div>
              <span style={{ fontSize: "15px", fontWeight: '600', marginBottom: '-20px',marginRight:'375px' }}>
                ProjectName
              </span>
              <span style={{ fontSize: "15px", fontWeight: '600', marginBottom: '-20px' }}>
                ProjectType
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "-10px",
                width: "100%",
              }}
            >
              <TextField
                sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                variant="outlined"
                value={formData.projectName}
                onChange={(event) =>
                  setFormData({ ...formData, projectName: event.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DnsIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Select
                sx={{ mt: 1, mb: 2, width: "50%", marginLeft: "10px" }}
                value={formData.projectType}
                startAdornment={
                  <InputAdornment position="start">
                    <TypeSpecimenIcon />
                  </InputAdornment>
                }
                onChange={(event) =>
                  setFormData({ ...formData, projectType: event.target.value })
                }
              >
                {typeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <TextField
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
              <TextField
                type="date"
                sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                variant="outlined"
                value={formatDate(formData.startDate)}
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
              <TextField
                type="date"
                sx={{ mt: 1, mb: 2, width: "50%" }}
                variant="outlined"
                value={formatDate(formData.endDate)}
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
              <TextField
                sx={{ mt: 1, mb: 2, width: "100%", marginLeft: "10px" }}
                variant="outlined"
                value={formData.budget}
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "10px",
                width: "100%",
              }}
            >
              <Select
                startAdornment={
                  <InputAdornment position="start">
                    <AutorenewIcon />
                  </InputAdornment>
                }
                sx={{ mt: 1, mb: 2, width: "100%" }}
                value={formData.projectStatus}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    projectStatus: event.target.value,
                  })
                }
              >
                {statusOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: '600', marginBottom: '-20px' }}>
                Member List
              </span>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "2vw",
                }}
              >
                <div style={{ flex: 1 }}>
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
                      placeholder="Search Position"
                      inputProps={{ "aria-label": "search position" }}
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
                </div>
                <div style={{ marginLeft: "8px", flex: 1 }}>
                  <TextField
                    sx={{ mb: 2, mt: 2, ml: 2, width: 300, height: 50, }}
                    size="small"
                    id="select-skill-type"
                    select
                    label="Select Skill"
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
              </div>
              {dataPersonnel.length > 0 && (
                <div>
                  <List
                    sx={{
                      width: "47vw",
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
                          paddingLeft: "56px",
                          fontWeight: "600",
                        }}
                      >
                        <Typography component="div" sx={{ fontWeight: "600" }}>
                          Information
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: '7%' }}>
                        <Typography component="div" sx={{ fontWeight: "600" }}>
                          Status
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: '20%' }}>
                        <Typography component="div" sx={{ fontWeight: "600" }}>
                          Skills
                        </Typography>
                      </Box>
                      <ListItemText sx={{ width: "128px" }} />
                    </ListItem>

                    <div className="line"></div>
                    {dataPersonnel
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((dataPersonnel, i, array) => {
                        return (
                          <Box>
                            <ListItemButton
                              component="div"
                              key={dataPersonnel.personnel_id}
                              divider={i + 1 === array.length ? false : true}
                              onClick={() => handleOpenDialog(dataPersonnel)}
                            >
                              <ListItemAvatar>
                                <ProfileAvatar
                                  variant="circular"
                                  name={fullname(dataPersonnel)}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                sx={{ width: "30%" }}
                                primary={fullname(dataPersonnel)}
                                secondary={dataPersonnel.position}
                              />
                              <Box
                                component="div"
                                sx={{ display: "flex", width: "30%" }}
                              >
                                <Chip
                                  label={status(dataPersonnel).status}
                                  color={status(dataPersonnel).color}
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
                                {dataPersonnel.skills.length > 0 && (
                                  <AvatarGroup max={5}>
                                    {dataPersonnel.skills.map((skill) => {
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
                          </Box>
                        );
                      })}
                  </List>

                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Pagination
                      count={Math.ceil(dataPersonnel.length / itemsPerPage)}
                      page={currentPage}
                      onChange={(event, page) => setCurrentPage(page)}
                    />
                  </Box>
                </div>
              )}
            </div>

            <span style={{ fontSize: "15px", }}>
              Skill Required
            </span>
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
                    height: "35px",
                    backgroundColor: "#e6e6e6",
                    color: "black",
                    border: "1px solid black",
                  }}
                  variant="filled"
                  color="info"
                  size="medium"
                  label={item.skillName}
                  onDelete={() => handleDeleteSkill(item)}
                  avatar={getSkillTypeIcon(item.skillType)}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "15px",
                marginLeft: "2vw",
              }}
            >
              <div style={{ flex: 1 }}>
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
              </div>
              <div style={{ marginLeft: "8px", flex: 1 }}>
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
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center", // จัด pagination อยู่กลาง
                alignItems: "center",
                width: "100%",
              }}
            >
              {displayedSkills
                .filter(
                  (s) =>
                    s.skillName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) &&
                    (selectedType === '' || s.skillType === selectedType)
                )
                .slice(
                  (currentPageSkill - 1) * itemsPerPageSkill,
                  currentPageSkill * itemsPerPageSkill
                )
                .map((item, index) => (
                  <Box
                    sx={{ width: "33.33%", }}
                    padding="8px"
                  >
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
                    </ListItem>
                  </Box>
                ))}
              <box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={Math.ceil(
                    displayedSkills
                      .filter(
                        (s) =>
                          s.skillName
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) &&
                          (selectedType === '' || s.skillType === selectedType)
                      )
                      .length / itemsPerPageSkill
                  )}
                  page={currentPageSkill}
                  onChange={(event, page) => setCurrentPageSkill(page)}
                />
              </box>
            </div>
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
