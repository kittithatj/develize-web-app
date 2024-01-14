import {
  AvatarGroup,
  Box,
  Chip,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Pagination,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
  Button,
  ListItem,
  Paper,
  CircularProgress,
  TextField,
  InputBase,
  Autocomplete,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import React, { useEffect, useState } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import { Api } from "../config/api-config";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import SkillFroupAvatar from "../components/SkillGroupAvatar";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import PersonnelInfoDialog from "../components/PersonnelInfoDialog";
import { PersonnelAPI } from "../api/personnel-api";
import { skillApi } from "../api/skill-api";

function Personnel() {
  const [personnel, setPersonnel] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [searchSkillList, setSearchSkillList] = useState([]);
  const [searchForm, setSearchForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [personnelPermission, setPersonnelPermission] = useState(false);
  const itemsPerPage = 8;

  const fetchPersonnelData = () => {
    setLoading(true);
    fetch(Api.url + Api.personnel_get)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPersonnel(data);
        setLoading(false);
      });
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

  useEffect(() => {
    fetchPersonnelData();
    fetchLookUpData();
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      user.role === "Administrator" ||
      user.role === "Personnel Manager" ||
      user.role === "Resource Manager"
    ) {
      setPersonnelPermission(true);
    }
  }, []);

  const fullname = (p) => {
    return p.firstName + " " + p.lastName;
  };

  const handleSearchValueChange = (e) => {
    setCurrentPage(1);
    const { name, value, outerText } = e.target;
    const key = name;
    setSearchForm({ ...searchForm, [key]: value || outerText });
  };

  const handleAutocompleteChange = (key, value) => {
    setCurrentPage(1);
    setSearchForm({ ...searchForm, [key]: value });
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
      secondary: {
        main: "#C4C4C4",
        contrastText: "#fff",
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

  const status = (p) => {
    if (p?.employmentStatus === "Resigned")
      return { status: "Resigned", color: "secondary" };
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

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);

  const handleOpenDialog = (person) => {
    setSelectedPersonnel(person);
    setOpenDialog(true);
  };

  const filteredPersonnel = () => {
    return personnel.filter((person) => {
      return searchFilter(person);
    });
  };

  return (
    <div className="main-content">
      <div className="top-content">
        <ThemeProvider theme={theme}>
          <Paper sx={{ padding: "30px" }}>
            <Box
              className="flex-center"
              sx={{
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  mt: 1,
                  mb: 1,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
                variant="h5"
                component="div"
              >
                Personnel Management
              </Typography>
              {personnelPermission && (
                <Link to={"create/"}>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Create Personnel
                  </Button>
                </Link>
              )}
            </Box>

            <div>
              <Box className="flex-center" sx={{ minWidth: "50vw" }}>
                {loading && <CircularProgress sx={{ my: 5 }} size={100} />}
              </Box>
              {personnel.length > 0 ? (
                <div>
                  <Box
                    className="flex-center"
                    sx={{
                      justifyContent: "space-between",
                      mb: 2,
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
                          onChange={handleSearchValueChange}
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
                          onChange={handleSearchValueChange}
                        />
                      )}
                    />
                  </Box>
                  {filteredPersonnel()?.length > 0 ? (
                    <div>
                      <List
                        sx={{
                          width: "60vw",
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
                          <ListItemText sx={{ width: "165px" }} />
                        </ListItem>

                        <div className="line"></div>

                        {filteredPersonnel()
                          .slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                          )
                          .map((person, i, array) => {
                            return (
                              <Box>
                                <ListItemButton
                                  component="div"
                                  key={person.personnel_id}
                                  divider={
                                    i + 1 === array.length ? false : true
                                  }
                                  onClick={() => handleOpenDialog(person)}
                                >
                                  <ListItemAvatar>
                                    <ProfileAvatar
                                      variant="circular"
                                      name={fullname(person)}
                                    />
                                  </ListItemAvatar>
                                  <ListItemText
                                    sx={{ width: "30%" }}
                                    primary={fullname(person)}
                                    secondary={person.position}
                                  />
                                  <Box
                                    component="div"
                                    sx={{ display: "flex", width: "30%" }}
                                  >
                                    <Chip
                                      label={status(person).status}
                                      color={status(person).color}
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
                                    {person.skills.length > 0 && (
                                      <AvatarGroup max={7}>
                                        {person.skills.map((skill) => {
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
                                  {personnelPermission ? (
                                    <Link to={"edit/" + person.personnel_id}>
                                    <IconButton
                                      sx={{ margin: 1, bgcolor: "white" }}
                                      edge="end"
                                      aria-label="edit"
                                      size="large"
                                    >
                                      <DriveFileRenameOutlineIcon />
                                    </IconButton>
                                  </Link>
                                  ) : (
                                    <div style={{ width: "75px" }} />
                                  )}
                                  <Link to={"assess/" + person.personnel_id}>
                                    <IconButton
                                      sx={{ margin: 1, bgcolor: "white" }}
                                      edge="end"
                                      aria-label="edit"
                                      size="large"
                                    >
                                      {!person.hasAssessed && (
                                        <div className="notification-dot" />
                                      )}
                                      <AssignmentIcon />
                                    </IconButton>
                                  </Link>
                                </ListItemButton>
                              </Box>
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
                          count={Math.ceil(personnel.length / itemsPerPage)}
                          page={currentPage}
                          onChange={(event, page) => setCurrentPage(page)}
                        />
                      </Box>
                    </div>
                  ) : (
                    <Box
                      sx={{
                        my: 5,
                        width: "60vw",
                      }}
                    >
                      <Typography
                        className="flex-center"
                        color="gray"
                        variant="h6"
                      >
                        Personnel Data Not Found
                      </Typography>
                    </Box>
                  )}

                  {/* เพิ่มบุคคล */}
                </div>
              ) : (
                !loading && (
                  <Box>
                    <Typography
                      className="flex-center"
                      color="gray"
                      variant="h6"
                    >
                      Personnel Data Not Found
                    </Typography>
                  </Box>
                )
              )}
            </div>
          </Paper>
        </ThemeProvider>
      </div>

      <PersonnelInfoDialog
        personnel={selectedPersonnel}
        open={openDialog}
        setOpen={setOpenDialog}
        hideEdit={!personnelPermission}
      />
    </div>
  );
}

export default Personnel;
