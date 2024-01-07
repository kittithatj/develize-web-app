/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useOutletContext } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  Box,
  CircularProgress,
  Slider,
  Typography,
  Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import { ProjectAPI } from "../api/project-api";

//props:
//outputPersonelList: Function;
//projectId: Number;
//skillIdList: Array[Number];
function MatchProjectSkillDialogButton(props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [memberCount, setMemberCount] = React.useState(5);
  const [checked, setChecked] = React.useState(true);

  const [user, setUser, openSnackbar] = useOutletContext({});

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    const dataToSend = {
      skillIdList: props.skillIdList,
      memberCount: memberCount,
      ignorePS: !checked,
    };
    setLoading(true);
    ProjectAPI.matchSkillProject(dataToSend)
      .then((res) => {
        props.outputPersonelList(res);
        setChecked(true);
        setLoading(false);
        setOpen(false);
        openSnackbar({
          status: "success",
          message: "Auto-Assigned Successfully",
        });
      })
      .catch(() => {
        openSnackbar({
          status: "error",
          message: "Auto-Assigned Failed",
        });
        setOpen(false);
      });
  };

  const handleSliderChange = (event, newValue) => {
    setMemberCount(newValue);
  };

  const handleChecked = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Auto-Assign
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Project Member Auto-Assign</div>
            <CloseIcon
              onClick={handleClose}
              color="#3d3d3d"
              sx={{ cursor: "pointer", mt: "3px" }}
            />
          </Box>
        </DialogTitle>
        {!loading ? (
          <DialogContent>
            <Box sx={{ width: 400, px: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Typography
                  color={"#1769aa"}
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                >
                  Number of Member : {memberCount}
                </Typography>
              </Box>
              <Slider
                aria-label="memberCount"
                value={memberCount}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={20}
                size="medium"
                onChange={handleSliderChange}
              />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <FormControlLabel
                  label="Assign to available personnel first."
                  sx={{ marginRight: 0 }}
                  control={
                    <Checkbox
                      defaultChecked
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
                      onChange={handleChecked}
                    ></Checkbox>
                  }
                />
              </Box>
            </Box>
          </DialogContent>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              m: 5,
              px: "140px",
            }}
          >
            <CircularProgress sx={{ my: 5 }} size={100} />
          </Box>
        )}
        {!loading && (
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              sx={{ m: 2 }}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}

export default MatchProjectSkillDialogButton;
