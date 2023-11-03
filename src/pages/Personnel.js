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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  ListItem,
  Card,
  Paper,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import React, { useEffect, useState } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import { Api } from "../config/api-config";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import SkillFroupAvatar from "../components/SkillGroupAvatar";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

import PersonIcon from "@mui/icons-material/Person";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import StorageIcon from "@mui/icons-material/Storage";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HandymaIconn from "@mui/icons-material/Handyman";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TerminalIcon from "@mui/icons-material/Terminal";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

function Personnel() {
  const [personnel, setPersonnel] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchPersonnelData = () => {
    fetch(Api.url + Api.personnel_get)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPersonnel(data);
      });
  };

  useEffect(() => {
    fetchPersonnelData();
  }, []);

  const fullname = (p) => {
    return p.firstName + " " + p.lastName;
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

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);

  const handleOpenDialog = (person) => {
    setSelectedPersonnel(person);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedPersonnel(null);
    setOpenDialog(false);
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
    <div className="main-content">
      <div className="top-content">
        <ThemeProvider theme={theme}>
          <Paper sx={{ padding: "30px" }}>
            <Box
              className="flex-center"
              sx={{
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
              <Link to={"create/"}>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Create Personnel
                </Button>
              </Link>
            </Box>

            <div>
              {personnel.length > 0 && (
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
                          paddingLeft: "56px",
                          fontWeight: "600",
                        }}
                      >
                        <Typography component="div" sx={{ fontWeight: "600" }}>
                          Information
                        </Typography>
                      </Box>
                      <Box sx={{ width: "24%" }}>
                        <Typography component="div" sx={{ fontWeight: "600" }}>
                          Status
                        </Typography>
                      </Box>
                      <Box sx={{ width: "32%" }}>
                        <Typography component="div" sx={{ fontWeight: "600" }}>
                          Skills
                        </Typography>
                      </Box>
                      <ListItemText sx={{ width: "128px" }} />
                    </ListItem>

                    <div className="line"></div>

                    {personnel
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
                              divider={i + 1 === array.length ? false : true}
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
                                  <AvatarGroup max={5}>
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
                              <Link to={"assess/" + person.personnel_id}>
                                <IconButton
                                  sx={{ margin: 1, bgcolor: "white" }}
                                  edge="end"
                                  aria-label="edit"
                                  size="large"
                                >
                                  <AssignmentIcon />
                                </IconButton>
                              </Link>
                            </ListItemButton>
                          </Box>
                        );
                      })}
                  </List>

                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Pagination
                      count={Math.ceil(personnel.length / itemsPerPage)}
                      page={currentPage}
                      onChange={(event, page) => setCurrentPage(page)}
                    />
                  </Box>

                  {/* เพิ่มบุคคล */}
                </div>
              )}
            </div>
          </Paper>
        </ThemeProvider>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Personnel Information</DialogTitle>
        <DialogContent>
          {selectedPersonnel && (
            <div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  sx={{ mt: 1, mb: 2, width: "100%", marginRight: 2 }}
                  variant="outlined"
                  label="Name"
                  value={fullname(selectedPersonnel)}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                }}
              >
                <TextField
                  sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                  variant="outlined"
                  label="Position"
                  value={selectedPersonnel.position}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PermContactCalendarIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  sx={{ mt: 1, mb: 2, width: "50%", marginRight: 2 }}
                  variant="outlined"
                  label="Division"
                  value={selectedPersonnel.division}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SupervisedUserCircleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                }}
              >
                <TextField
                  sx={{ mt: 1, mb: 2, width: "100%", marginRight: 2 }}
                  variant="outlined"
                  label="Email"
                  value={selectedPersonnel.email}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <span>Personnel Skill</span>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "8px",
                  minHeight: "100px",
                  height: "auto",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {selectedPersonnel.skills
                    .sort((a, b) => a.skillName.localeCompare(b.skillName))
                    .map((item) => (
                      <Chip
                        key={item.skill_id}
                        sx={{
                          backgroundColor: "transparent",
                          color: "black",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          borderColor: "gray",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          margin: "3px",
                          padding: "10px",
                        }}
                        icon={getSkillTypeIcon(item.skillType)}
                        label={item.skillName}
                      />
                    ))}
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <span>Assignment Status : </span>
                <Chip
                  label={status(selectedPersonnel)?.status || "Not Assigned"}
                  color={status(selectedPersonnel)?.color || "success"}
                  sx={{
                    "& .MuiChip-label": {
                      margin: 0,
                    },
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {selectedPersonnel && (
            <Button
              component={Link}
              to={`/Personnel/${selectedPersonnel.personnel_id}`}
            >
              View
            </Button>
          )}
          {selectedPersonnel && (
            <Button
              component={Link}
              to={`/Personnel/edit/${selectedPersonnel.personnel_id}`}
            >
              Edit
            </Button>
          )}
          {selectedPersonnel && (
            <Button
              component={Link}
              to={`/Personnel/assess/${selectedPersonnel.personnel_id}`}
            >
              Rating
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Personnel;
