import React from "react";
import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  CircularProgress,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import { stringToColor } from "../components/SkillGroupAvatar";
import { PersonnelAPI } from "../api/personnel-api";
import { Link } from "react-router-dom";
import { getSkillTypeColor, getSkillTypeIcon } from "./util";

//icon
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PauseIcon from "@mui/icons-material/Pause";
import CheckIcon from "@mui/icons-material/Check";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ReactApexChart from "react-apexcharts";
import ComparativeViewDialog from "./ComparativeViewDialog";
import QueryStatsIcon from '@mui/icons-material/QueryStats';

// Props:
//     open: Boolean;
//     SetOpen: Function;
//     personnel: Object;
//     hideEdit: Boolean;
function PersonnelInfoDialog(props) {
  const [personnel, setPersonnel] = React.useState({});
  const [assessmentScore, setAssessmentScore] = React.useState({});
  const [chartData, setChartData] = React.useState();
  const [viewChart, setViewChart] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [openComparativeView, setOpenComparativeView] = React.useState(false);
  const [isChartEmpty, setIsChartEmpty] = React.useState(false);

  const handleClose = () => {
    props.setOpen(false);
  };

  const getAvatarText = (firstName, lastName) => {
    if (!firstName && !lastName) return "";
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const getIconProjectStatus = (status) => {
    if (status === "On-going")
      return {
        color: "#fbc02d",
        icon: <FastForwardIcon />,
      };
    if (status === "Completed")
      return {
        color: "#64dd17",
        icon: <CheckIcon />,
      };
    if (status === "Holding")
      return {
        color: "#c4c4c4",
        icon: <PauseIcon />,
      };
    if (status === "Canceled")
      return {
        color: "#e53e3e",
        icon: <CloseIcon />,
      };
    else
      return {
        color: "#c4c4c4",
        icon: <QuestionMarkIcon />,
      };
  };

  const getDateFormatted = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString("default", { month: "short" });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return day + " " + month + " " + year;
  };

  const boxChart = () => {
    return !loading ? (
      <Box
        className="flex-center"
        sx={{ flexDirection: "column", justifyContent: "flex-start" }}
      >
        <ComparativeViewDialog open={openComparativeView} setOpen={setOpenComparativeView} personnelId={personnel?.personnel_id} />
        <Typography fontSize={"1.3rem"}>Assessments Overview</Typography>
        {chartData && !isChartEmpty && (
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="radar"
            width="400px"
            height="80%"
          />
        )}
        {chartData && !isChartEmpty && (
          <Box>
            Average Score :{" "}
            {assessmentScore?.overviewScore?.jobPerformance.toFixed(2)}
          </Box>
        )}
        {isChartEmpty && (
          <Box
            className="flex-center"
            sx={{
              flexDirection: "column",
              justifyContent: "center",
              height: "300px",
            }}
          >
            <Typography
              sx={{
                color: "#c4c4c4",
                fontSize: "1rem",
                textAlign: "center",
                mt: "1rem",
                width: "320px",
              }}
            >
              No assessment data
            </Typography>
          </Box>
        )}
        <Button sx={{m:2}} startIcon={<QueryStatsIcon></QueryStatsIcon>} onClick={() => {setOpenComparativeView(true);}}>Comparative View</Button>
      </Box>
    ) : (
        <Box
          className="flex-center"
          sx={{
            justifyContent: "center",
            width: "400px",
            height: "500px",
          }}
        >
          <CircularProgress sx={{ my: 5 }} size={100} />
        </Box>
    );
  };

  const boxProjectHistory = () => {
    return (
      <Box
        className="flex-center"
        sx={{
          flexDirection: "column",
          justifyContent: "flex-start",
          minWidth: "400px",
          maxHeight: "500px",
        }}
      >
        <Typography fontSize={"1.3rem"}>Project Histories</Typography>
        {personnel?.projectHistories?.length > 0 && (
          <List
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
            overflow: "auto",
          }}
        >
          {personnel?.projectHistories?.map((project, index) => {
            return (
              <Box>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: getIconProjectStatus(
                          project?.projectStatus
                        ).color,
                      }}
                    >
                      {getIconProjectStatus(project?.projectStatus).icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography>{project?.projectName}</Typography>
                    <Typography fontSize="small" color="gray">
                      {project?.projectType}
                    </Typography>
                    <Typography fontSize="small" color="skyblue">
                      {getDateFormatted(project?.startDate)} -{" "}
                      {getDateFormatted(project?.endDate)}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
                {index !== personnel?.projectHistories.length - 1 && (
                  <div className="line" />
                )}
              </Box>
            );
          })}
        </List>
        )}
        

        {!personnel?.projectHistories?.length && (
          <Box
            className="flex-center"
            sx={{
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              width: "400px",
            }}
          >
            <Typography
              sx={{
                color: "#c4c4c4",
                fontSize: "1rem",
                textAlign: "center",
                mt: "1rem",
                width: "280px",
              }}
            >
              This Personnel has not been assigned to any project
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const status = (p) => {
    if (p?.employmentStatus === "Resigned")
      return { status: "Resigned", color: "secondary" };
    if (p?.projectHistories?.length === 0) {
      return { status: "Not Assigned", color: "success" };
    } else {
      let count = 0;
      p?.projectHistories?.length &&
        p.projectHistories.forEach((project) => {
          if (project?.projectStatus === "On-going") count++;
        });
      if (count > 0) {
        return { status: count + " Project Working", color: "warning" };
      } else {
        return { status: "Not Assigned", color: "success" };
      }
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

  const infoTableList = [
    {
      icon: <AccountBoxIcon />,
      info: personnel?.position || "-",
      tooltip: "Position",
    },
    {
      icon: <SupervisedUserCircleIcon />,
      info: personnel?.division || "-",
      tooltip: "Division",
    },
    {
      icon: <EmailIcon />,
      info: personnel?.email || "-",
      tooltip: "Email",
    },
    {
      icon: <CallIcon />,
      info: personnel?.phoneNumber || "-",
      tooltip: "Phone Number",
    },
    {
      icon: <WorkIcon />,
      info: personnel?.employmentStatus || "-",
      tooltip: "Employment Status",
    },
    {
      icon: <AssignmentTurnedInIcon />,
      info: (
        <ThemeProvider theme={theme}>
          <Chip
            label={status(personnel).status}
            color={status(personnel).color}
            sx={{
              justifyContent: "center",
              "& .MuiChip-label": {
                margin: 0,
              },
            }}
          ></Chip>
        </ThemeProvider>
      ),
      tooltip: "Assignment Status",
    },
  ];

  useEffect(() => {
    setViewChart(true);
    setLoading(true);
    setPersonnel(props.personnel);
    PersonnelAPI.getOverviewAccessScore(props.personnel?.personnel_id)
      .then((res) => {
        setAssessmentScore(res);
        let overviewScore = res?.overviewScore ? [
          res?.overviewScore?.jobKnowledge.toFixed(2),
          res?.overviewScore?.innovation.toFixed(2),
          res?.overviewScore?.teamwork.toFixed(2),
          res?.overviewScore?.deliverableQuality.toFixed(2),
          res?.overviewScore?.attitude.toFixed(2),
          res?.overviewScore?.attendance.toFixed(2),
        ] : [];
        let userScore = res?.userScore ? [
          res?.userScore?.jobKnowledge.toFixed(2),
          res?.userScore?.innovation.toFixed(2),
          res?.userScore?.teamwork.toFixed(2),
          res?.userScore?.deliverableQuality.toFixed(2),
          res?.userScore?.attitude.toFixed(2),
          res?.userScore?.attendance.toFixed(2),
        ] : [];
        let scoreSeries = [];
          scoreSeries.push({
            name: res?.overviewScore?"Average Score":"Average Score (No Data)",
            data: overviewScore,
          });
          scoreSeries.push({
            name: res?.userScore?"User Score":"User Score (No Data)",
            data: userScore,
          });
        if (overviewScore.length === 0 && userScore.length === 0) {
          setIsChartEmpty(true);
        }else{
          setIsChartEmpty(false);
        }
        setChartData({
          series: scoreSeries,
          options: {
            plotOptions: {
              radar: {
                polygons: {
                  strokeColor: "#e8e8e8",
                  fill: {
                    colors: ["#f8f8f8", "#fff"],
                  },
                },
              },
            },
            xaxis: {
              categories: [
                "Job Knowledge",
                "Innovation",
                "Teamwork",
                "Deliverable Quality",
                "Attitude",
                "Attendance",
              ],
            },
            yaxis: {
              show: false,
              max: 10,
              min: 0,
            },
          },
        });
        setLoading(false)
              })
      .catch(() => {
        setLoading(false);
        setChartData(null);
        setAssessmentScore(null);
      });
  }, [props.personnel]);

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} maxWidth={"lg"}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Personnel Information</div>
            <CloseIcon
              onClick={handleClose}
              color="#3d3d3d"
              sx={{ cursor: "pointer", mt: "3px" }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              className="flex-center"
              sx={{ flexDirection: "column", minWidth: "200px" }}
            >
              <Box
                className="header"
                sx={{
                  marginBottom: "0.5rem",
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  style={{ marginLeft: "-4px" }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      backgroundColor: stringToColor(
                        personnel?.firstName + " " + personnel?.lastName
                      ),
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "2rem",
                      }}
                    >
                      {getAvatarText(personnel?.firstName, personnel?.lastName)}
                    </Typography>
                  </Avatar>
                </Badge>
              </Box>
              <Typography fontSize={"1.3rem"}>
                {personnel?.firstName + " " + personnel?.lastName}
              </Typography>
              <table>
                <tbody>
                  {infoTableList.map((item, index) => (
                    <Tooltip placement="bottom-end" title={item.tooltip}>
                      <tr key={index}>
                        <td style={{ padding: "5px" }}>{item.icon}</td>
                        <td
                          style={{
                            wordWrap: "break-word",
                            width: "280px",
                            whiteSpace: "normal",
                          }}
                        >
                          {item.info}
                        </td>
                      </tr>
                    </Tooltip>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "8px",
                  minHeight: "50px",
                  maxHeight: "180px",
                  height: "auto",
                  width: "300px",
                  marginTop: "1rem",
                  overflowY: "auto",
                }}
              >
                {personnel?.skills?.map((item) => (
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
            </Box>
            <Box sx={{ borderLeft: "2px solid #dedede", mx: "1rem" }}></Box>

            {(viewChart) ? boxChart() : boxProjectHistory()}
            
          </Box>
        </DialogContent>
        <DialogActions>
          {
            !props.hideEdit &&
            <Link to={"edit/" + personnel?.personnel_id}>
            <Button color="warning" sx={{ m: 1 }} onClick={handleClose}>
              Edit
            </Button>
          </Link>
          }
          
          {viewChart ? (
            <Button
              onClick={() => {
                setViewChart(false);
              }}
            >
              Project History
            </Button>
          ) : (
            <Button
              onClick={() => {
                setViewChart(true);
              }}
            >
              Assessment Score
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PersonnelInfoDialog;
