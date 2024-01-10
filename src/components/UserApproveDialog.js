/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useOutletContext } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Box, CircularProgress } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { userApi } from "../api/user-api";

//props:
//open: Boolean;
//userId: Number;
function UserApproveDialog(props) {
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState("Assessor");

  const [user, setUser, openSnackbar] = useOutletContext({});

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleConfirm = () => {
    const dataToSend = {
      userId: props.userId,
      role: role,
    };
    console.log(dataToSend);
    setLoading(true);
    userApi
      .approve(dataToSend)
      .then((res) => {
        setLoading(false);
        setRole("Assessor");
        props.setOpen(false);
        openSnackbar({
          status: "success",
          message: "User has been Approved",
        });
        props.output();
      })
      .catch(() => {
        openSnackbar({
          status: "error",
          message: "Something went wrong! Please try again later.",
        });
        props.setOpen(false);
        setLoading(false);
        setRole("Assessor");
      });
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <Dialog open={props.open} onClose={props.setOpen} maxWidth={"sm"}>
      <DialogTitle sx={{pt:'20px'}}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Approve User</div>
          <CloseIcon
            onClick={handleClose}
            color="#3d3d3d"
            sx={{ cursor: "pointer", mt: "3px" }}
          />
        </Box>
      </DialogTitle>
      {!loading ? (
        <DialogContent>
          <Box className="flex-center" sx={{m:2,width:'300px'}}>
            <Typography variant="h6" sx={{ mr:2 }}>
                Select Role
            </Typography>
            <Select value={role} onChange={handleRoleChange} displayEmpty>
              <MenuItem value={"Assessor"}>Assessor</MenuItem>
              <MenuItem value={"Personnel Manager"}>Personnel Manager</MenuItem>
              <MenuItem value={"Project Manager"}>Project Manager</MenuItem>
              <MenuItem value={"Resource Manager"}>Resource Manager</MenuItem>
              <MenuItem value={"Administrator"}>Administrator</MenuItem>
            </Select>
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
            Approve
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default UserApproveDialog;
