// SYSTEM
import {
  Avatar,
  CircularProgress,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  IconButton,
  MenuItem,
  InputBase,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { skillTypeList } from "../config/skill-type-list";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useOutletContext } from "react-router-dom";

// API
import { skillApi } from "../api/skill-api";
import { PersonnelAPI } from "../api/personnel-api";

// ICON MUI
import StorageIcon from "@mui/icons-material/Storage";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HandymaIconn from "@mui/icons-material/Handyman";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TerminalIcon from "@mui/icons-material/Terminal";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ConfirmDialog from "../components/ConfirmDialog";

function PersonnelEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser, openSnackbar] = useOutletContext({});

  //Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const [tabValue, setTabValue] = useState(0);

  // Skill Management
  const [skillList, setSkillList] = useState([]);
  const [skillSelect, setSkillSelect] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loadingSkill, setLoadingSkill] = useState(false);

  //edit
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  const [currentPageSkill, setCurrentPageSkill] = useState(1);
  const itemsPerPageSkill = 12;

  const handleDeleteSkill = (item) => {
    setSkillSelect(skillSelect.filter((s) => s.skill_id !== item.skill_id));
  };

  const fetchSkillData = () => {
    setLoadingSkill(true);
    skillApi.getAllSKills().then((data) => {
      setSkillList(data);
      setLoadingSkill(false);
    });
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

  const employmentStatus = [
    "Full-time",
    "Part-time",
    "Temporary",
    "Intern",
    "Outsource",
    "Probationary",
    "Resigned",
  ];

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const addSkill = (item) => {
    if (!skillSelect.some((s) => s.skill_id === item.skill_id)) {
      setSkillSelect((prevArray) => [...prevArray, item]);
    }
  };

  const isAddButtonDisabled = (item) => {
    return skillSelect.some((s) => s.skill_id === item.skill_id);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const personnelForm = {
      personnel_id: formData.personnel_id || "",
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phoneNumber: formData.phoneNumber || "",
      division: formData.division || "",
      position: formData.position || "",
      employmentStatus: formData.employmentStatus || "",
      skillsId: skillSelect?.map((skill) => skill.skill_id) || [],
    };

    try {
      const response = await PersonnelAPI.editPersonnel(personnelForm); // เรียกใช้ API ตัวนี้
      if (response.ok) {
        openSnackbar({
          status: "success",
          message: "Edit Personnel Successfully",
        });
        navigate("../personnel");
      } else {
        openSnackbar({
          status: "error",
          message: "Edit Personnel Failed",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating personnel:", error);
    }
  };

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSkillTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // PERSONNEL API / MANAGEMENT
  const [dataPersonnel, setDataPersonnel] = useState([]);
  const [editDataPersonnel, setEditDataPersonnel] = useState([]);
  const [skillPersonnel, setSkillPersonnel] = useState([]);

  const fetchPersonnelData = (id) => {
    setLoading(true);
    PersonnelAPI.getPersonnelById(id).then((data) => {
      setDataPersonnel(data);
      setFormData(data);
      console.log("Person", data);
      if (data && data.skills) {
        console.log("Skills:", data.skills);
        setSkillPersonnel(data.skills);
      }
      setLoading(false);
    });
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "";
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const status = (p) => {
    if (!p || !p.projectHistories || p.projectHistories.length === 0) {
      return { status: "Not Assigned", color: "success" };
    } else {
      let count = 0;
      p.projectHistories.forEach((project) => {
        if (project.projectStatus === "In Progress") count++;
      });
      if (count > 0) {
        return { status: count + " Project Working", color: "warning" };
      } else {
        return { status: "Not Assigned", color: "success" };
      }
    }
  };

  const getSkillTypeColor = (skillType) => {
    switch (skillType) {
      case "Database":
        return "error";
      case "Others":
        return "default";
      case "Tool":
        return "secondary";
      case "Library":
        return "success";
      case "Programming Language":
        return "primary";
      case "Framework":
        return "warning";
      default:
        return "default";
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = React.useState(0);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleDeletePersonnel = () => {
    setLoading(true);
    PersonnelAPI.deletePersonnel(id)
      .then((res) => {
        openSnackbar({
          status: "success",
          message: "Delete Personnel Successfully",
        });
        navigate("../personnel");
      })
      .catch(() => {
        openSnackbar({
          status: "error",
          message: "Delete Personnel Failed",
        });
        setLoading(false);
      });
  };

  function CustomTabPanel({ children, value, index, ...other }) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  useEffect(() => {
    fetchSkillData();
    fetchPersonnelData(id);
  }, []);

  useEffect(() => {
    if (skillPersonnel.length > 0) {
      setSkillSelect([...skillSelect, ...skillPersonnel]);
    }
  }, [skillPersonnel]);

  return (
    <div className="main-content">
      <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "15px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                >
                  <Tab label="Personnel Info" onClick={()=>setTabValue(0)} />
                  <Tab label="Skill" onClick={()=>setTabValue(1)} />
                </Tabs>
              </Box>
              {tabValue === 0 && (
                <div style={{padding:'24px'}}>
                <div
                  className="header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ mt: 1, mb: 2, color: "black" }}
                    variant="h5"
                    color="textSecondary"
                  >
                    Personnel Edit
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: "30px", width: "80px" }}
                    onClick={() => setOpenDeleteDialog(true)}
                  >
                    Delete
                  </Button>
                </div>
                {loading ? (
                  <Box
                    className="flex-center"
                    sx={{
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress sx={{ my: 5 }} size={100} />
                  </Box>
                ) : (
                  <div className="content">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        marginRight: "8px",
                      }}
                    >
                      <div style={{ fontSize: "15px", marginBottom: "-12px" }}>
                        Firstname
                      </div>
                      <TextField
                        name="firstName"
                        key="firstName"
                        value={formData?.firstName || ""}
                        fullWidth
                        margin="normal"
                        onChange={onInputChange}
                      />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "8px",
                      }}
                    >
                      <div style={{ fontSize: "15px", marginBottom: "-12px" }}>
                        Lastname
                      </div>
                      <TextField
                        name="lastName"
                        key="lastName"
                        value={formData?.lastName || ""}
                        fullWidth
                        margin="normal"
                        onChange={onInputChange}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        marginRight: "8px",
                      }}
                    >
                      <div style={{ fontSize: "15px", marginBottom: "-12px" }}>
                        Email
                      </div>
                      <TextField
                        name="email"
                        value={formData?.email || ""}
                        fullWidth
                        margin="normal"
                        onChange={onInputChange}
                      />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "8px",
                      }}
                    >
                      <div style={{ fontSize: "15px", marginBottom: "-12px" }}>
                        PhoneNumber
                      </div>
                      <TextField
                        type="number"
                        name="phoneNumber"
                        value={formData?.phoneNumber || ""}
                        fullWidth
                        margin="normal"
                        onChange={onInputChange}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        marginRight: "8px",
                      }}
                    >
                      <div style={{ fontSize: "15px", marginBottom: "-12px" }}>
                        Division
                      </div>
                      <TextField
                        name="division"
                        value={formData?.division || ""}
                        fullWidth
                        margin="normal"
                        onChange={onInputChange}
                      />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "8px",
                      }}
                    >
                      <div style={{ fontSize: "15px", marginBottom: "-12px" }}>
                        Position
                      </div>
                      <TextField
                        name="position"
                        value={formData?.position || ""}
                        fullWidth
                        margin="normal"
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        marginRight: "8px",
                      }}
                    >
                      <div style={{ fontSize: "15px" }}>EmploymentStatus</div>
                      <FormControl>
                        <Select
                          sx={{ mt: 1, mb: 2, width: "100%" }}
                          value={formData?.employmentStatus || ""}
                          name="employmentStatus"
                          onChange={onInputChange}
                          startAdornment={
                            <InputAdornment position="start"></InputAdornment>
                          }
                        >
                          {employmentStatus.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                )}
                
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{mt: 2 }}
                    onClick={() => navigate("../personnel")}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ alignSelf: "flex-end", mt: 2 }}
                    onClick={() => setOpenSaveDialog(true)}
                  >
                    Submit
                  </Button>
                </Box>
                </div>)}
            </Box>
            
            {tabValue === 1 && (
              <Box sx={{p:3}}>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div className="header">
                  <Typography
                    sx={{ mt: 1, mb: 2, color: "black" }}
                    variant="h5"
                    color="textSecondary"
                  >
                    Personnel Skills
                  </Typography>
                </div>
                {loading ? (
                  <Box
                    className="flex-center"
                    sx={{
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress sx={{ my: 5 }} size={100} />
                  </Box>
                ) : (
                <div className="content">
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
                      marginTop: "10px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          width: "70%",
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
                    <div style={{ marginLeft: "8px" }}>
                      <TextField
                        sx={{ width: 250, height: 40 }}
                        size="small"
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
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "8px",
                      maxWidth: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {skillList
                        .filter(
                          (s) =>
                            s.skillName
                              .toLowerCase()
                              .includes(searchValue.toLowerCase()) &&
                            (selectedType === "" ||
                              s.skillType === selectedType)
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
                                <Avatar>
                                  {getSkillTypeIcon(item.skillType)}
                                </Avatar>
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
                            skillList.filter(
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
                  </div>
                </div>
                )}
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                    variant="outlined"
                    color="error"
                    sx={{alignSelf: "flex-start",mt: 2 }}
                    onClick={() => navigate("../personnel")}
                  >
                    Back
                  </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ alignSelf: "flex-end", mt: 2 }}
                  onClick={() => setOpenSaveDialog(true)}
                >
                  Submit
                </Button>
              </Box>
              </Box>
              )}
              
            <ConfirmDialog
              trigger={openDeleteDialog}
              setTrigger={setOpenDeleteDialog}
              confirm={handleDeletePersonnel}
              id={id}
              title="Delete Personnel"
              description="Do you want to delete this personnel?"
              comfirmText="Delete"
            />
            <ConfirmDialog
              trigger={openSaveDialog}
              setTrigger={setOpenSaveDialog}
              confirm={handleSubmit}
              id={id}
              color="success"
              title="Save Personnel Data"
              description="Do you want to save the changes?"
              comfirmText="Save"
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default PersonnelEdit;
