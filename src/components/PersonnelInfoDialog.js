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
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import { stringToColor } from "../components/SkillGroupAvatar";

//icon
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

// Props:
//     open: Boolean;
//     SetOpen: Function;
//     personnel: Object;
function PersonnelInfoDialog(props) {
  const [personnel, setPersonnel] = React.useState({});

  const handleClose = () => {
    props.setOpen(false);
  };

  const getAvatarText = (firstName, lastName) => {
    if (!firstName && !lastName) return "";
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
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
    setPersonnel(props.personnel);
    console.log(props.personnel);
  }, [props.personnel]);

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose}>
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
            <Box className="flex-center" sx={{ flexDirection: "column" }}>
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
                            maxWidth: "250px",
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
            </Box>
            <Box sx={{ borderLeft: "2px solid #dedede", mx: "1rem" }}></Box>
            <Box></Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PersonnelInfoDialog;
