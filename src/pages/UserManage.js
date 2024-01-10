import * as React from "react";
import { useOutletContext } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridActionsCellItem, GridRowModes, GridRowEditStopReasons } from "@mui/x-data-grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userApi } from "../api/user-api";
import * as FaIcons from "react-icons/fa";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import UserApproveDialog from "../components/UserApproveDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

export default function UserManage() {
  const [user, setUser, openSnackbar] = useOutletContext({});
  const navigate = useNavigate();

  const [tab, setTab] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [userListRequest, setUserListRequest] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [selectedUserId, setSelectedUserId] = React.useState({});
  const [openApproveDialog, setOpenApproveDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const roleList = ["Assessor", "Personnel Manager", "Project Manager", "Resource Manager", "Administrator"];

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const fetchUserData = () => {
    setLoading(true);
    userApi
      .getAllUser()
      .then((res) => {
        console.log(res);
        setUserListRequest(res?.notApproved);
        setUserList(
          res?.approved.filter((user) => user.role !== "Administrator")
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleDeleteUser = (id) => {
    setLoading(true);
    userApi
      .deleteUser(id)
      .then((res) => {
        console.log(res);
        openSnackbar({
          status: "success",
          message: "User has been Deleted",
        });
        setOpenDeleteDialog(false);
        fetchUserData();
      })
      .catch((err) => {
        openSnackbar({
          status: "error",
          message: "Something went wrong! Please try again later.",
        });
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleDeleteClick = (id) => () => {
    setSelectedUserId(id);
    setOpenDeleteDialog(true);
  };

  const handleApproveClick = (id) => () => {
    setSelectedUserId(id);
    setOpenApproveDialog(true);
  };

  //edit*
  const [rowModesModel, setRowModesModel] = React.useState({});
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    console.log(rowModesModel);
  };
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const processRowUpdate = (newRow) => {
    // setLoading(true);
    userApi.edit(newRow)
    .then((res) => {
      console.log(res);
      openSnackbar({
        status: "success",
        message: "User has been Edited",
      });
      fetchUserData();
      setRowModesModel({});
    })
    .catch((err) => {
      openSnackbar({
        status: "error",
        message: "Something went wrong! Please try again later.",
      });
      console.log(err);
    });
  };
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    // const editedRow = rows.find((row) => row.id === id);
    // if (editedRow.isNew) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  //data for table
  const columnsRequest = [
    { field: "username", headerName: "username", width: 200 },
    {
      field: "fullName",
      headerName: "Full Name",
      description: "This column has a value getter and is not sortable.",
      width: 220,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },

    {
      field: "email",
      headerName: "email",
      width: 220,
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<CheckIcon />}
            label="Approve"
            sx={{
              color: "success.main",
            }}
            onClick={handleApproveClick(id)}
          />,
          <GridActionsCellItem
            icon={<ClearIcon />}
            label="Deny"
            className="textPrimary"
            sx={{
              color: "error.main",
            }}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const columnsUser = [
    { field: "username", headerName: "username", width: 150, editable: true },
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
      editable: true,
    },

    {
      field: "email",
      headerName: "email",
      width: 220,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: roleList,
    },
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            sx={{
              color: "primary.main",
            }}
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Cancel"
            className="textPrimary"
            sx={{
              color: "error.main",
            }}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="main-content">
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: "15px",
          }}
        >
          <FaIcons.FaUserFriends
            style={{ position: "relative", top: "8px", fontSize: "40px" }}
          />
          <Typography
            sx={{ textAlign: "center", m: 2 }}
            component="h1"
            variant="h5"
          >
            User Management
          </Typography>

          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab
              label="Registeration Request"
              sx={{ width: "350px", fontWeight: "bold" }}
            />
            <Tab
              label="User Manage"
              sx={{ width: "350px", fontWeight: "bold" }}
            />
          </Tabs>
          <Box sx={{ m: 5, borderColor: "divider" }}>
            {loading ? (
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
            ) : (
              <>
                {tab === 0 && userListRequest?.length > 0 ? (
                  <DataGrid
                    getRowId={(row) => row.user_id}
                    rows={userListRequest}
                    columns={columnsRequest}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 8 },
                      },
                    }}
                    pageSizeOptions={[5, 8, 10]}
                  ></DataGrid>
                ) : (
                  tab === 0 && (
                    <Typography
                      sx={{ textAlign: "center", m: 2 }}
                      color={"GrayText"}
                      variant="h6"
                    >
                      No request data available at the moment.
                    </Typography>
                  )
                )}
                {tab === 1 && userList?.length > 0 ? (
                  <DataGrid
                    getRowId={(row) => row.user_id}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    rows={userList}
                    columns={columnsUser}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 8 },
                      },
                    }}
                    pageSizeOptions={[5, 8, 10]}
                  ></DataGrid>
                ) : (
                  tab === 1 && (
                    <Typography
                      sx={{ textAlign: "center", m: 2 }}
                      color={"GrayText"}
                      variant="h6"
                    >
                      No user data available at the moment.
                    </Typography>
                  )
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
      <UserApproveDialog
        userId={selectedUserId}
        open={openApproveDialog}
        setOpen={setOpenApproveDialog}
        output={fetchUserData}
      />
      <ConfirmDialog
        trigger={openDeleteDialog}
        setTrigger={setOpenDeleteDialog}
        confirm={handleDeleteUser}
        id={selectedUserId}
        title="Delete User"
        description="Do you want to delete this user?"
        comfirmText="Delete"
      />
    </div>
  );
}
