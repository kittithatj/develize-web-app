/* eslint-disable no-restricted-globals */
import React from "react";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import IconButton from "@mui/material/IconButton";
import ProfileAvatar from "../components/ProfileAvatar";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputBase from "@mui/material/InputBase";
import { Tabs, Tab } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { PersonnelAPI } from "../api/personnel-api";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ReactApexChart from "react-apexcharts";

// Props:
//     open: Boolean;
//     setOpen: Function;
//     personnelId: Number;
function ComparativeViewDialog(props) {
  const [personnelList, setPersonnelList] = React.useState([]);
  const [selectedIdList, setSelectedIdList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState("");
  const [tab, setTab] = React.useState(0);
  const [chartLoading, setChartLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;
  const [overviewSeries, setOverviewSeries] = React.useState([]);
  const [userSeries, setUserSeries] = React.useState([]);

  const chartOptions = {
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
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const fetchPersonnelList = () => {
    setLoading(true);
    PersonnelAPI.getAllPersonnel()
      .then((data) => {
        setPersonnelList(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const fetchPersonnelScore = (id) => {
    setChartLoading(true);
    PersonnelAPI.getOverviewAccessScore(id)
      .then((data) => {
        addSeries(data);
        setChartLoading(false);
      })
      .catch(() => {
        setChartLoading(false);
      });
  };

  const findName = (id) => {
    for (let i = 0; i < personnelList.length; i++) {
      if (personnelList[i].personnel_id === id) {
        return personnelList[i].firstName + " " + personnelList[i].lastName;
      }
    }
  };

  const addPersonnel = (id) => () => {
    fetchPersonnelScore(id);
    setSelectedIdList([...selectedIdList, id]);
  };

  const removePersonnel = (id) => () => {
    setOverviewSeries(overviewSeries.filter((p) => p.id !== id));
    setUserSeries(userSeries.filter((p) => p.id !== id));
    setSelectedIdList(selectedIdList.filter((p) => p !== id));
  };

  const isSelected = (id) => {
    if (selectedIdList.includes(id)) {
      return true;
    }
    return false;
  };

  const addable = (id) => {
    if (selectedIdList.length < 5) {
      return true;
    }
    return false;
  };

  const addSelectedButton = (id) => {
    return (
      <IconButton
        sx={{ margin: 2 }}
        edge="end"
        aria-label="edit"
        size="large"
        onClick={addPersonnel(id)}
        color="primary"
        disabled={!addable(id) || chartLoading}
      >
        <AddIcon />
      </IconButton>
    );
  };

  const addSeries = (data) => {
    let overviewScore = [];
    if (data?.overviewScore) {
      overviewScore = [
        data?.overviewScore?.jobKnowledge.toFixed(2),
        data?.overviewScore?.innovation.toFixed(2),
        data?.overviewScore?.teamwork.toFixed(2),
        data?.overviewScore?.deliverableQuality.toFixed(2),
        data?.overviewScore?.attitude.toFixed(2),
        data?.overviewScore?.attendance.toFixed(2),
      ];
    }
    let userScore = [];
    if (data?.userScore) {
      userScore = [
        data?.userScore?.jobKnowledge.toFixed(2),
        data?.userScore?.innovation.toFixed(2),
        data?.userScore?.teamwork.toFixed(2),
        data?.userScore?.deliverableQuality.toFixed(2),
        data?.userScore?.attitude.toFixed(2),
        data?.userScore?.attendance.toFixed(2),
      ];
    }
    let oSeries = [
      ...overviewSeries,
      {
        id: data?.personnel_id,
        name: data?.overviewScore
          ? data?.fullName
          : data?.fullName + " (No Data)",
        data: overviewScore,
      },
    ];
    let uSeries = [
      ...userSeries,
      {
        id: data?.personnel_id,
        name: data?.userScore ? data?.fullName : data?.fullName + " (No Data)",
        data: userScore,
      },
    ];

    setOverviewSeries(oSeries);
    setUserSeries(uSeries);
    console.log(overviewSeries);
  };

  const fullname = (p) => {
    return p.firstName + " " + p.lastName;
  };

  useEffect(() => {
    setOverviewSeries([]);
    setUserSeries([]);
    selectedIdList.push(props.personnelId);
    fetchPersonnelList();
    fetchPersonnelScore(props.personnelId);
  }, [props.personnelId]);

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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontWeight: "bold", marginRight: "1rem" }}>
                Comparative View{" "}
              </div>
              <QueryStatsIcon></QueryStatsIcon>
            </Box>

            <CloseIcon
              onClick={handleClose}
              color="#3d3d3d"
              sx={{ cursor: "pointer", mt: "3px" }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                m: 5,
                px: "200px",
              }}
            >
              <CircularProgress sx={{ my: 5 }} size={100} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  minWidth: "200px",
                }}
              >
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab
                    label="Average Score"
                    sx={{ width: "250px", fontWeight: "bold" }}
                  />
                  <Tab
                    label="Your Score"
                    sx={{ width: "250px", fontWeight: "bold" }}
                  />
                </Tabs>
                {chartLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <CircularProgress sx={{ my: 5 }} size={100} />
                  </Box>
                ) : (
                  <>
                    {(tab === 0 &&
                      overviewSeries?.every((s) => s?.data?.length == 0)) ||
                    (tab === 1 &&
                      userSeries?.every((s) => s?.data?.length == 0)) ? (
                      <Box
                      sx={{width: "400px", height: "500px", display: "flex", justifyContent: "center", alignItems: "center"}}
                      >
                        <Typography variant="h6" sx={{ color:"gray"}}>No Assessment Data Available</Typography>
                      </Box>
                    ) : (
                      <ReactApexChart
                        options={chartOptions}
                        series={tab === 0 ? overviewSeries : userSeries}
                        type="radar"
                        width="400px"
                        height="500px"
                      />
                    )}
                  </>
                )}
              </Box>
              <Box sx={{ borderLeft: "2px solid #dedede", mx: "1rem" }}></Box>
              {/* this is divider */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "330px",
                  minHeight: "550px",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    borderStyle: "solid",
                    borderRadius: "5px",
                    borderColor: "#F0f0f0",
                    borderWidth: "2px",
                    height: "58px",
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Personnel"
                    inputProps={{ "aria-label": "search skill" }}
                    value={searchValue}
                    name="name"
                    onChange={() => setSearchValue(event?.target?.value)}
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    disabled
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
                <Box
                  className="header"
                  sx={{
                    marginBottom: "3rem",
                  }}
                >
                  {personnelList
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .filter((p) => {
                      if (searchValue === "") {
                        return true;
                      } else if (
                        fullname(p)
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                        p.position
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      ) {
                        return true;
                      }
                      return false;
                    })
                    .map((p) => (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItemButton
                            component="div"
                            key={p.personnel_id}
                            // onClick={() => handleOpenPersonnelInfoDialog(p)}
                          >
                            <ListItemAvatar>
                              <ProfileAvatar
                                variant="circular"
                                name={fullname(p)}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{ width: "30%" }}
                              primary={fullname(p)}
                              secondary={p.position}
                            />
                          </ListItemButton>
                          {!isSelected(p.personnel_id) ? (
                            addSelectedButton(p.personnel_id)
                          ) : (
                            <IconButton
                              sx={{ margin: 2 }}
                              edge="end"
                              aria-label="edit"
                              size="large"
                              onClick={removePersonnel(p.personnel_id)}
                              disabled={chartLoading}
                            >
                              <RemoveCircleOutlineIcon color="error" />
                            </IconButton>
                          )}
                        </Box>
                        <div className="line"></div>
                      </>
                    ))}
                </Box>
                <Box
                  className="flex-center"
                  sx={{
                    marginTop: "20px",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                  }}
                >
                  <Pagination
                    count={Math.ceil(personnelList.length / itemsPerPage)}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        {/* <DialogActions>Actions</DialogActions> */}
      </Dialog>
    </div>
  );
}

export default ComparativeViewDialog;
