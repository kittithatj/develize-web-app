import React from "react";
import { useEffect } from "react";
import { Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

// Props:
//     open: Boolean;
//     SetOpen: Function;
//     personnelId: Number;
function ComparativeViewDialog(props) {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} maxWidth="lg">
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Comparative View</div>
            <CloseIcon
              onClick={handleClose}
              color="#3d3d3d"
              sx={{ cursor: "pointer", mt: "3px" }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
            Test
        </DialogContent>
        <DialogActions>
            Actions
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ComparativeViewDialog;
