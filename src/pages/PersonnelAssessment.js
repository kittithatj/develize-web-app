import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { PersonnelAPI } from "../api/personnel-api";
import { stringToColor } from "../components/SkillGroupAvatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonnelInfoDialog from "../components/PersonnelInfoDialog";

function PersonnelAssessment() {
  const { id } = useParams();
  const [user, setUser, openSnackbar] = useOutletContext({});
  const [assessForm, setAssessForm] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [personnelInfo, setPersonnelInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    initialData();
    PersonnelAPI.getPersonnelById(id)
      .then((data) => {
        console.log(data);
        setPersonnelInfo(data);
      })
      .catch((err) => {
        console.log(err);
        openSnackbar({
          status: "error",
          message: "Cannot get personnel information!",
        });
      });
  }, []);

  const setAssessValue = (title, newValue) => {
    const newAssessForm = assessForm.map((item) => {
      if (item.title === title) {
        return {
          ...item,
          score: newValue,
        };
      }
      return item;
    });
    setAssessForm(newAssessForm);
    console.log(assessForm);
  };

  const initialData = async () => {
    const initForm = [
      {
        title: "Quality of deliverables",
        tooltip:
          "Accuracy, consistency, follow-through, meets deadlines, keeps trying to work smarter, not harder.",
        keyName: "deliverableQuality",
        score: 0,
      },
      {
        title: "Teamwork",
        tooltip:
          "Collaborates with internal and external teams across positions, proactively helps others, puts team targets higher than personal achievements, contributes and takes initiative to social activities.",
        keyName: "teamwork",
        score: 0,
      },
      {
        title: "Innovation",
        tooltip:
          "Propose/use digital technologies to change internal processes,  generates ideas and gives input that makes our product more efficient.",
        keyName: "innovation",
        score: 0,
      },
      {
        title: "Professional working attitude",
        tooltip:
          "Help create a good atmosphere and working environment, accepts constructive criticism, follows standards.",
        keyName: "attitude",
        score: 0,
      },
      {
        title: "Job knowledge",
        tooltip:
          "Create, maintain, audit, and improve systems to meet particular needs. Continuously update new coding knowledge.",
        keyName: "jobKnowledge",
        score: 0,
      },
      {
        title: "Attention",
        tooltip:
          "Always participate in projects and meetings, Low leave rate, Has attention on time on schedule.",
        keyName: "attendance",
        score: 0,
      },
    ];
    await PersonnelAPI.getAccessScore(id)
      .catch(() => {
        setAssessForm(initForm);
        setLoading(false);
      })
      .then((data) => {
        const newForm = [];
        Object.keys(data).forEach((key) => {
          initForm.forEach((item) => {
            if (item.keyName === key) {
              newForm.push({
                ...item,
                score: data[key],
              });
            }
          });
        });
        setAssessForm(newForm);
        setLoading(false);
      });
  };

  const onBack = () => {
    window.history.back();
  };

  const handleOpenConfirm = () => {
    let valid = assessForm.every((item) => item.score !== 0);
    if (!valid) {
      openSnackbar({
        status: "warning",
        message: "Please assess all criteria before submit!",
      });
      return;
    }
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const getScoreColor = (score) => {
    if (score === 0) return "#7a7a7a";
    if (score <= 3) return "#b52a2a";
    if (score <= 6) return "#d6651e";
    if (score <= 8) return "#a1d921";
    if (score >= 9) return "#2ab52e";
    return "#7a7a7a"
  };

  const submitAssessment = () => {
    let formData = {
      personnel_id: parseInt(id),
    };
    assessForm.forEach((item) => {
      formData = {
        ...formData,
        [item.keyName]: item.score,
      };
    });
    let valid = assessForm.every((item) => item.score !== 0);
    if (!valid) {
      openSnackbar({
        status: "warning",
        message: "Please assess all criteria before submit!",
      });
      return;
    }
    // console.log(formData);
    saveAssessment(formData);
  };

  const saveAssessment = (formData) => {
    setLoading(true);
    setOpenConfirm(false);
    PersonnelAPI.assessPersonnel(formData).then((res) => {
      console.log(res);
      openSnackbar({
        status: "success",
        message: "Assessed successfully!",
      });
      setLoading(false);
      window.history.back();
    });
  };

  const getAvatarText = (firstName, lastName) => {
    if (!firstName && !lastName) return "";
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="main-content">
      <div className="top-content">
        <Paper sx={{ padding: "50px" }}>
          <Typography
            sx={{
              mt: 1,
              mb: 1,
              fontWeight: "bold",
            }}
            variant="h5"
            component="div"
          >
            Personnel Assessment
          </Typography>

          {/* -----Personnel Information----- */}
          <Box className="flex-center" sx={{ my: 3 }}>
            {!loading && (
              <Button
                className="flex-center"
                sx={{
                  borderRadius: "10px",
                  flexDirection: "column",
                  p: 2,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  },
                }}
                onClick={handleOpenDialog}
              >
                <Box className="header" sx={{ marginBottom: "0.5rem" }}>
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
                          personnelInfo.firstName + " " + personnelInfo.lastName
                        ),
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "2rem",
                        }}
                      >
                        {getAvatarText(
                          personnelInfo.firstName,
                          personnelInfo.lastName
                        )}
                      </Typography>
                    </Avatar>
                  </Badge>
                </Box>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    color: "black",
                  }}
                >
                  {personnelInfo.firstName + " " + personnelInfo.lastName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "gray",
                  }}
                >
                  {personnelInfo.position}
                </Typography>
              </Button>
            )}
          </Box>

          {/* -----Personnel Information----- */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                m: 5,
                px: "250px",
              }}
            >
              <CircularProgress sx={{ my: 5 }} size={100} />
            </Box>
          )}
          <Box
            sx={{
              minWidth: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!loading && (
              <table>
                {assessForm.map((item, index) => (
                  <tr>
                    <td>
                      <Accordion
                        variant="outlined"
                        key={index}
                        sx={{ width: "330px" }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Typography
                            style={{ fontWeight: "bold", marginRight: "2%" }}
                          >
                            {item.title}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ color: "GrayText" }}>
                            {item.tooltip}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </td>
                    <td
                      style={{
                        verticalAlign: "top",
                        padding: "0rem 2rem 0rem 2rem",
                      }}
                    >
                      <Rating
                        sx={{ paddingBottom: "1rem" }}
                        name={item.keyName}
                        max={10}
                        defaultValue={item.score}
                        onChange={(event, newValue) => {
                          setAssessValue(item.title, newValue);
                        }}
                      />
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <Box className="circle-container" sx={{ mt:2 , backgroundColor:getScoreColor(item.score)}}>
                        <Typography sx={{fontWeight:'bold'}}>
                          {item.score === 0 || !item?.score ? "-" : item.score}
                        </Typography>
                      </Box>
                    </td>
                  </tr>
                ))}
              </table>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button color="error" variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={handleOpenConfirm}
            >
              Submit
            </Button>
          </Box>
        </Paper>
        <Dialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Comfirm Assessment"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to submit this assessment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleCloseConfirm}>
              Cancel
            </Button>
            <Button color="success" onClick={submitAssessment} autoFocus>
              Comfirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <PersonnelInfoDialog
        personnel={personnelInfo}
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </div>
  );
}

export default PersonnelAssessment;
