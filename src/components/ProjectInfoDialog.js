/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Box, Link } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

// เวลาเรียกใช้ conponent
//<PersonnelInfoDialog
//  personnel={selectedProjectId}
//  open={openProjectInfoDialog}
//  setOpen={setOpenProjectlInfoDialog}
///>;

// ตัวอย่างการใส่ props
// Props:{
//     open: Boolean;
//     setOpen: Function;
//     projectId: Number;
//}

function ProjectInfoDialog(props) {
  //เอา projectId ไปดึงข้อมูลจาก api แล้วเก็บไว้ใน project
  const [project, setProject] = React.useState({});
  //ทำ loading ด้วยระหว่างดึงข้อมูลจาก api
  const [loading, setLoading] = React.useState(true);

  const handleClose = () => {
    props.setOpen(false);
  };

  //เมื่อเริ่ม ทำการดึงข้อมูลจาก api โดยใช้ projectId
  useEffect(() => {
    setLoading(true);
    fetchProjectData(project.project_id);
  }, [props.projectId]);

  const fetchProjectData = (projectId) => {
    //ดึงข้อมูลจาก api โดยใช้ projectId
    //เก็บข้อมูลไว้ใน project โดยใช้ setProject
    //เมื่อดึงข้อมูลเสร็จแล้ว ให้ setLoading(false)
    setProject({
        project_id: props.projectId
    });
    setTimeout(() => {
        setLoading(false);
    }, 1000);
    
  };

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
            <div style={{ fontWeight: "bold" }}>Project Information</div>
            <CloseIcon
              onClick={handleClose}
              color="#3d3d3d"
              sx={{ cursor: "pointer", mt: "3px" }}
            />
          </Box>
        </DialogTitle>
        {!loading ? (
            <DialogContent>
              ### เนื้อหาคือส่วนนี้ ### 
              อย่าลืมทำ Loading
              ด้วยกรุณาทำก่อนเริ่มวาง data 
              แล้วก็เลิกใช้ Grid
              ได้แล้วถ้าใช้แล้วปรับยากอ่ะ ใช้ Box display flex แทน
              แล้วก็เวลาทำงานก็ตั้งใจทำ อย่ามัวทำไปฟังเดอะโกสต์ไป
              หรือคอลกับคนอื่นไป พอไม่โฟกัสงานมันก็ช้า ตั้งใจทำไม่นานเกินไปหรอก
              แล้วก็คิดก่อนเขียน ลองเขียนตามดูในตัวอย่างหน้าอื่นแล้วค่อยๆรัน
              ไม่ใช่ก๊อปมาหมดเปลี่ยนแค่ชื่อตัวแปร แล้วก็มางงทำไมมันบัค
              <br/>
              <br/>
              selected Id = {project.project_id}
            </DialogContent>
            
        ) : (
          <div>กำลังโหลด... เปลี่ยนเป็นหมุนๆด้วย</div>
        )}
        {!loading && (
            <DialogActions>
            <Link to={"edit/" + project?.project_id}>
              <Button color="warning" sx={{ mr: 1 }} onClick={handleClose}>
                Edit
              </Button>
            </Link>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}

export default ProjectInfoDialog;
