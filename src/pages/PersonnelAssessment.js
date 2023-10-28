import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { PersonnelAPI } from "../api/personnel-api";
import HelpIcon from "@mui/icons-material/Help";
import { set } from "react-hook-form";

function PersonnelAssessment() {
  const { id } = useParams();
  const [user, setUser, openSnackbar] = useOutletContext({});
  const [assessForm, setAssessForm] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialData();
    PersonnelAPI.getPersonnelById(id)
      .then((data) => {
        console.log(data);
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
          "Collaborates with internal and external teams across positions, proactively helps others, puts team targets higher than personal achievements, contributes and takes initiative to social activities",
        keyName: "teamwork",
        score: 0,
      },
      {
        title: "Innovation",
        tooltip:
          "Propose/use digital technologies to change internal processes,  generates ideas and gives input that makes our product more efficient ",
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
      const newForm = []
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
    PersonnelAPI.assessPersonnel(formData)
    .then((res) => {
      console.log(res);
    })
  };

  return (
    <div className="main-content">
      <Paper elevation={0} sx={{ padding: "50px" }}>
        <Container sx={{}}>
          <Typography variant="h4">Personnel Assessment</Typography>
        </Container>
        <Container sx={{display:'flex', justifyContent:'center'}}>
          <table>
            <tbody>
              {loading && (
                <Box sx={{margin:'2rem'}}>
                  <CircularProgress size={100}/>
                </Box>
              )}
              {!loading &&
                assessForm.map((item, index) => {
                  return (
                    <tr>
                      <td key={index + 1}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: 0,
                            marginY: 2,
                            marginRight: 1,
                          }}
                        >
                          <Box sx={{ fontSize: "1.2rem", marginRight: "10px" }}>
                            {item.title}
                          </Box>
                          <Tooltip
                            title={item.tooltip}
                            placement="bottom-start"
                          >
                            <HelpIcon
                              fontSize="medium"
                              color="disabled"
                            ></HelpIcon>
                          </Tooltip>
                        </Box>
                      </td>
                      <td>
                        <Box
                          key={index + 1}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: 0,
                            marginY: 2,
                            marginRight: 1,
                          }}
                        >
                          <Rating
                            name={item.keyName}
                            max={10}
                            defaultValue={item.score}
                            onChange={(event, newValue) => {
                              setAssessValue(item.title, newValue);
                            }}
                          />
                        </Box>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Container>
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
            onClick={submitAssessment}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

export default PersonnelAssessment;
